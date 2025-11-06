

import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
// FIX: Import 'set' from submodule to resolve module export error.
import { areIntervalsOverlapping, format, isSameDay, startOfDay } from 'date-fns';
import set from 'date-fns/set';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import { MOCK_CLASSROOMS, MOCK_USERS, TIME_SLOTS } from '../data';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Classroom, Role, Faculty } from '../types';
import RequestAulaModal from '../components/RequestAulaModal';
import CreateBookingModal from '../components/CreateBookingModal';
import Alert from '../components/ui/Alert';

const ClassroomAvailabilityPage: React.FC = () => {
    const { faculty = Faculty.ENGINEERING, dateString = new Date().toISOString(), timeSlotIndex = '0' } = useParams<{ faculty: Faculty; dateString: string; timeSlotIndex: string; }>();
    const { user } = useAuth();
    const { bookings, addRequest, addBooking } = useData();
    
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    const selectedDate = new Date(dateString);
    const timeSlot = TIME_SLOTS[parseInt(timeSlotIndex, 10)];
    const now = new Date();

    // FIX: Replaced setHours and setMinutes with set to resolve import errors.
    const slotStart = set(selectedDate, { hours: timeSlot.start.h, minutes: timeSlot.start.m });
    const slotEnd = set(selectedDate, { hours: timeSlot.end.h, minutes: timeSlot.end.m });
    
    const isSlotInThePast = selectedDate < startOfDay(now) || (isSameDay(selectedDate, now) && slotEnd < now);


    const overlappingBookings = bookings.filter(booking =>
        areIntervalsOverlapping(
            { start: booking.startTime, end: booking.endTime },
            { start: slotStart, end: slotEnd }
        )
    );
    const bookedClassroomIds = new Set(overlappingBookings.map(b => b.classroomId));
    
    const classroomsForFaculty = useMemo(() => {
        return MOCK_CLASSROOMS.filter(c => c.faculty === faculty);
    }, [faculty]);

    const getClassroomStatus = (classroomId: number) => {
        return bookedClassroomIds.has(classroomId) ? 'Ocupada' : 'Disponible';
    };

    const handleClassroomClick = (classroom: Classroom) => {
        const isAvailable = getClassroomStatus(classroom.id) === 'Disponible';
        if (!isAvailable || isSlotInThePast) return;

        setSelectedClassroom(classroom);

        if (user?.role === Role.SECRETARIA) {
            setIsBookingModalOpen(true);
        } else if (user?.role === Role.DOCENTE) {
            setIsRequestModalOpen(true);
        }
     };

    const handleRequestSubmit = (formData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string }) => {
        if (!selectedClassroom) return;
        addRequest({
            ...formData,
            requestedClassroomId: selectedClassroom.id,
        });
        setIsRequestModalOpen(false);
        setSelectedClassroom(null);
        setSuccessMessage('¡Solicitud enviada con éxito! Podrá ver su estado en la sección "Mis Solicitudes".');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleBookingSubmit = (formData: { career: string; subject: string; userId: number }) => {
        if (!selectedClassroom) return;
        addBooking({
            ...formData,
            classroomId: selectedClassroom.id,
            startTime: slotStart,
            endTime: slotEnd,
        });
        setIsBookingModalOpen(false);
        setSelectedClassroom(null);
        setSuccessMessage(`Clase "${formData.subject}" creada con éxito en el aula ${selectedClassroom.name}.`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const initialRequestData = useMemo(() => {
        if (!selectedClassroom) return undefined;
        return {
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: format(slotStart, 'HH:mm'),
            endTime: format(slotEnd, 'HH:mm'),
        };
    }, [selectedClassroom, selectedDate, slotStart, slotEnd]);
    
    const classroomRows = useMemo(() => {
        const rows = [];
        const classroomsPerRow = 6;
        for (let i = 0; i < classroomsForFaculty.length; i += classroomsPerRow) {
            rows.push(classroomsForFaculty.slice(i, i + classroomsPerRow));
        }
        return rows;
    }, [classroomsForFaculty]);


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-800 uppercase tracking-wider">
                    {format(selectedDate, 'EEEE', { locale: es })}
                </h1>
                <p className="text-2xl text-gray-600 mt-2">
                    {timeSlot.label.replace(' - ', ' A ')}
                </p>
                 <p className="text-xl font-semibold text-gray-500 mt-2">
                    Facultad de {faculty}
                </p>
            </div>
            
            {isSlotInThePast && (
                <Alert type="error" message="No se pueden realizar reservas ni solicitudes para fechas u horas pasadas." />
            )}
            <Alert type="success" message={successMessage} />

            <div className="space-y-4">
                {classroomRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-6 gap-3 md:gap-4">
                        {row.map(classroom => {
                            const isAvailable = getClassroomStatus(classroom.id) === 'Disponible';
                            let buttonClasses = 'p-4 rounded-lg text-white font-bold text-lg shadow-md transition-transform transform';
                            if (isSlotInThePast) {
                                buttonClasses += ' bg-gray-400 cursor-not-allowed';
                            } else if (isAvailable) {
                                buttonClasses += ' bg-green-500 hover:bg-green-600 hover:scale-110 cursor-pointer';
                            } else {
                                buttonClasses += ' bg-red-500 cursor-not-allowed opacity-70';
                            }

                            return (
                                <button
                                    key={classroom.id}
                                    onClick={() => handleClassroomClick(classroom)}
                                    disabled={!isAvailable || isSlotInThePast}
                                    className={buttonClasses}
                                >
                                    {classroom.name}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            <RequestAulaModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleRequestSubmit}
                initialData={initialRequestData}
                classroom={selectedClassroom}
            />

            <CreateBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onSubmit={handleBookingSubmit}
                classroom={selectedClassroom}
                startTime={slotStart}
                endTime={slotEnd}
            />
        </div>
    );
};

export default ClassroomAvailabilityPage;