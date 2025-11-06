







import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { MOCK_CLASSROOMS, TIME_SLOTS } from '../data';
// FIX: Import 'set' and 'startOfDay' from their submodules to resolve module export errors.
import { addDays, areIntervalsOverlapping, eachDayOfInterval, endOfWeek, format, isSameDay } from 'date-fns';
import set from 'date-fns/set';
import startOfDay from 'date-fns/startOfDay';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import { Faculty } from '../types';

const SchedulePage: React.FC = () => {
    const { bookings } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty>(Faculty.ENGINEERING);

    const facultyClassrooms = useMemo(() => {
        return MOCK_CLASSROOMS.filter(c => c.faculty === selectedFaculty);
    }, [selectedFaculty]);

    const weekDays = useMemo(() => {
        // FIX: Replaced startOfWeek with a calculation based on endOfWeek to resolve import error.
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        const start = startOfDay(addDays(end, -6));
        return eachDayOfInterval({ start, end }).slice(0, 5); // Monday to Friday
    }, [currentDate]);
    
    // Set selectedDay to Monday of the current week on week change
    React.useEffect(() => {
        setSelectedDay(weekDays[0]);
    }, [weekDays[0].toISOString()]);


    const getBookingForSlot = (day: Date, timeSlot: typeof TIME_SLOTS[0], classroomId: number) => {
        // FIX: Replaced setHours and setMinutes with set to resolve import errors.
        const slotStart = set(day, { hours: timeSlot.start.h, minutes: timeSlot.start.m });
        const slotEnd = set(day, { hours: timeSlot.end.h, minutes: timeSlot.end.m });

        return bookings.find(booking =>
            booking.classroomId === classroomId &&
            isSameDay(booking.startTime, day) &&
            areIntervalsOverlapping(
                { start: booking.startTime, end: booking.endTime },
                { start: slotStart, end: slotEnd },
                { inclusive: true }
            )
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-indigo-800">Cronograma de Aulas</h1>
            </div>

            <div className="flex justify-center items-center mb-2">
                <div className="flex items-center space-x-4">
                    {/* FIX: Replaced subDays with addDays to resolve import error. */}
                    <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">&lt; Semana Anterior</button>
                    <h2 className="text-lg font-semibold text-gray-700 text-center w-64">
                        {format(weekDays[0], 'd MMM', { locale: es })} - {format(weekDays[weekDays.length - 1], 'd MMM yyyy', { locale: es })}
                    </h2>
                    <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Siguiente Semana &gt;</button>
                </div>
            </div>
            
             <div className="mb-4 border-b border-gray-200 flex justify-center">
                <nav className="-mb-px flex space-x-6" aria-label="Faculties">
                    {(Object.values(Faculty) as Faculty[]).map(faculty => (
                         <button
                            key={faculty}
                            onClick={() => setSelectedFaculty(faculty)}
                            className={`whitespace-nowrap py-3 px-2 border-b-2 font-medium text-md capitalize ${
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

            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {weekDays.map(day => (
                         <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                isSameDay(day, selectedDay)
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {format(day, 'iiii', { locale: es })}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-100 z-10 w-32">Horario</th>
                            {facultyClassrooms.map(classroom => (
                                <th key={classroom.id} className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                                    {classroom.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {TIME_SLOTS.map(slot => (
                            <tr key={slot.label}>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-800 sticky left-0 bg-white z-10 w-32">{slot.label}</td>
                                {facultyClassrooms.map(classroom => {
                                    const booking = getBookingForSlot(selectedDay, slot, classroom.id);
                                    return (
                                        <td key={classroom.id} className={`px-3 py-4 whitespace-normal text-center text-sm w-28 h-20 ${booking ? 'bg-indigo-50' : 'bg-green-50'}`}>
                                           {booking && (
                                                <div>
                                                    <div className="text-xs text-indigo-600 truncate">{booking.career}</div>
                                                    <div className="font-semibold text-indigo-800">{booking.subject}</div>
                                                </div>
                                           )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulePage;