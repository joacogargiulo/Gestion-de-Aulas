





import React, { useState, useMemo } from 'react';
// FIX: Consolidate date-fns imports to resolve "not callable" error.
import { addDays, areIntervalsOverlapping, eachDayOfInterval, endOfWeek, format, set, startOfDay } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import { MOCK_CLASSROOMS, TIME_SLOTS } from '../data';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Role, Faculty } from '../types';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { bookings } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty>(Faculty.ENGINEERING);

    const facultyClassrooms = useMemo(() => {
        return MOCK_CLASSROOMS.filter(c => c.faculty === selectedFaculty);
    }, [selectedFaculty]);

    const weekDays = useMemo(() => {
        // FIX: Replaced startOfWeek with a calculation based on endOfWeek to resolve import error.
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        const start = startOfDay(addDays(end, -6));
        // Return only Monday to Friday
        return eachDayOfInterval({ start, end }).slice(0, 5);
    }, [currentDate]);

    const calculateAvailability = (day: Date, timeSlot: typeof TIME_SLOTS[0]) => {
        const totalClassrooms = facultyClassrooms.length;
        // FIX: Replaced setHours and setMinutes with set to resolve import errors.
        const slotStart = set(day, { hours: timeSlot.start.h, minutes: timeSlot.start.m });
        const slotEnd = set(day, { hours: timeSlot.end.h, minutes: timeSlot.end.m });

        const overlappingBookings = bookings.filter(booking =>
            areIntervalsOverlapping(
                { start: booking.startTime, end: booking.endTime },
                { start: slotStart, end: slotEnd }
            )
        );
        
        const bookedFacultyClassroomIds = new Set(
            overlappingBookings
                .map(b => facultyClassrooms.find(fc => fc.id === b.classroomId))
                .filter(Boolean)
                .map(c => c!.id)
        );

        const availableCount = totalClassrooms - bookedFacultyClassroomIds.size;
        return availableCount < 0 ? 0 : availableCount;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-indigo-800">Disponibilidad de Aulas</h1>
            </div>
             <div className="flex justify-center items-center mb-4">
                <div className="flex items-center space-x-4">
                    {/* FIX: Replaced subDays with addDays to resolve import error. */}
                    <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">&lt; Anterior</button>
                    <h2 className="text-lg font-semibold text-gray-700 text-center w-64">
                        {format(weekDays[0], 'd MMM', { locale: es })} - {format(weekDays[weekDays.length - 1], 'd MMM yyyy', { locale: es })}
                    </h2>
                    <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Siguiente &gt;</button>
                </div>
            </div>
            
             <div className="mb-4 border-b border-gray-200 flex justify-center">
                <nav className="-mb-px flex space-x-6" aria-label="Faculties">
                    {(Object.values(Faculty) as Faculty[]).map(faculty => (
                         <button
                            key={faculty}
                            onClick={() => setSelectedFaculty(faculty)}
                            className={`whitespace-nowrap py-4 px-3 border-b-2 font-medium text-md capitalize ${
                                selectedFaculty === faculty
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {faculty}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-4 rounded-lg">
                <div className="grid grid-cols-6 gap-2">
                    {/* Header Row */}
                    <div>
                        {user?.role === Role.SECRETARIA ? (
                             <Link to="/requests" className="w-full text-center block bg-red-600 text-white font-bold p-3 rounded-lg shadow-md hover:bg-red-700">
                                Solicitudes
                             </Link>
                        ) : (
                             <Link to="/requests" className="w-full text-center block bg-indigo-700 text-white font-bold p-3 rounded-lg shadow-md hover:bg-indigo-800">
                                Mis Solicitudes
                             </Link>
                        )}
                    </div>
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="bg-gray-200 text-gray-700 font-bold p-3 text-center rounded-lg">
                            {format(day, 'iiii', { locale: es })}
                        </div>
                    ))}

                    {/* Data Rows */}
                    {TIME_SLOTS.map((slot, slotIndex) => (
                        <React.Fragment key={slot.label}>
                            <div className="bg-gray-200 text-gray-700 font-bold p-3 text-center rounded-lg flex items-center justify-center">
                                {slot.label}
                            </div>
                            {weekDays.map(day => {
                                const available = calculateAvailability(day, slot);
                                return (
                                    <Link 
                                        key={day.toISOString()}
                                        to={`/availability/${selectedFaculty}/${day.toISOString()}/${slotIndex}`}
                                        className="block bg-gray-100 p-3 text-center rounded-lg hover:bg-indigo-100 hover:shadow-md transition-all duration-200"
                                    >
                                        <span className={`font-semibold ${available > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {available} Disponible{available !== 1 && 's'}
                                        </span>
                                    </Link>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;