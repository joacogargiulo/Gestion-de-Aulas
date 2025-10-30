


import React, { useState, useMemo } from 'react';
import { useAuth, useData } from '../App';
import { Booking } from '../types';
import { MOCK_CLASSROOMS } from '../data';
// FIX: Replaced startOfWeek, subDays and updated imports.
// FIX: Using top-level imports for date-fns to fix module resolution errors.
import { format, endOfWeek, isWithinInterval, addDays, startOfDay } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import { es } from 'date-fns/locale';

interface GroupedBookings {
  [key: string]: Booking[];
}

const MyClassesPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  // FIX: Replaced startOfWeek with a calculation based on endOfWeek to resolve import error.
  const weekStart = startOfDay(addDays(endOfWeek(currentDate, { weekStartsOn: 1 }), -6));
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const myBookingsThisWeek = useMemo(() => {
    if (!user) return [];
    return bookings.filter(
      (booking) =>
        booking.userId === user.id &&
        isWithinInterval(booking.startTime, { start: weekStart, end: weekEnd })
    );
  }, [user, bookings, weekStart, weekEnd]);

  const groupedBookings = useMemo(() => {
    return myBookingsThisWeek.reduce((acc, booking) => {
      const dayKey = format(booking.startTime, 'eeee', { locale: es });
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(booking);
      // Sort bookings by start time
      acc[dayKey].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      return acc;
    }, {} as GroupedBookings);
  }, [myBookingsThisWeek]);

  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Clases</h1>
      <p className="text-lg text-gray-600 mb-6">Este es el cronograma de tus clases confirmadas para la semana.</p>

        <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-4">
                {/* FIX: Replaced subDays with addDays to resolve import error. */}
                <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">&lt; Semana Anterior</button>
                <h2 className="text-lg font-semibold text-gray-700 text-center w-64">
                    {format(weekStart, 'd MMM', { locale: es })} - {format(weekEnd, 'd MMM yyyy', { locale: es })}
                </h2>
                <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Siguiente Semana &gt;</button>
            </div>
        </div>

      {myBookingsThisWeek.length > 0 ? (
        <div className="space-y-6">
          {daysOfWeek.map(day => (
            groupedBookings[day] && (
              <div key={day}>
                <h2 className="text-xl font-bold text-indigo-700 capitalize border-b-2 border-indigo-200 pb-2 mb-4">{day}</h2>
                <div className="space-y-4">
                  {groupedBookings[day].map(booking => {
                    const classroom = MOCK_CLASSROOMS.find(c => c.id === booking.classroomId);
                    return (
                      <div key={booking.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-lg font-semibold text-gray-800">{booking.subject}</p>
                            <p className="text-sm font-medium text-gray-600">{booking.career}</p>
                            <p className="text-sm text-gray-500">
                                {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}hs
                            </p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-indigo-600 text-lg">{classroom?.name}</p>
                           <p className="text-sm text-gray-500">Aula</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No tienes clases programadas para esta semana.</p>
      )}
    </div>
  );
};

export default MyClassesPage;