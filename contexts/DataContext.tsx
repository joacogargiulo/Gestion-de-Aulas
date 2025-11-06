import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { ClassroomRequest, RequestStatus, Booking } from '../types';
import { MOCK_REQUESTS, MOCK_BOOKINGS } from '../data';
import { useAuth } from './AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';

interface DataContextType {
  requests: ClassroomRequest[];
  bookings: Booking[];
  addRequest: (requestData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string; requestedClassroomId: number; }) => void;
  approveRequest: (requestToApprove: ClassroomRequest, classroomId: number) => void;
  rejectRequest: (requestId: number) => void;
  addBooking: (bookingData: Omit<Booking, 'id'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

const parseDates = <T extends { startTime: string | Date; endTime: string | Date }>(items: T[]): T[] => {
  return items.map(item => ({
    ...item,
    startTime: new Date(item.startTime),
    endTime: new Date(item.endTime),
  }));
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [rawRequests, setRawRequests] = useLocalStorage<ClassroomRequest[]>('requests', MOCK_REQUESTS);
    const [rawBookings, setRawBookings] = useLocalStorage<Booking[]>('bookings', MOCK_BOOKINGS);

    // Dates from localStorage are strings, so we memoize the parsed versions.
    const requests = useMemo(() => parseDates(rawRequests), [rawRequests]);
    const bookings = useMemo(() => parseDates(rawBookings), [rawBookings]);

    const addRequest = useCallback((requestData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string; requestedClassroomId: number; }) => {
        if (!user) return;
        const newRequest: ClassroomRequest = {
            id: Date.now(),
            userId: user.id,
            ...requestData,
            status: RequestStatus.PENDIENTE,
        };
        setRawRequests(prev => [newRequest, ...prev]);
    }, [user, setRawRequests]);
    
    const approveRequest = useCallback((requestToApprove: ClassroomRequest, classroomId: number) => {
        // 1. Update the request status
        const updatedRequest: ClassroomRequest = {
            ...requestToApprove,
            status: RequestStatus.APROBADA,
            assignedClassroomId: classroomId,
        };
        setRawRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));

        // 2. Create a new booking from the approved request
        const newBooking: Booking = {
            id: Date.now() + 1, // Ensure unique ID
            classroomId: classroomId,
            userId: requestToApprove.userId,
            subject: requestToApprove.subject,
            career: requestToApprove.career,
            startTime: requestToApprove.startTime,
            endTime: requestToApprove.endTime,
        };
        setRawBookings(prev => [...prev, newBooking]);
    }, [setRawRequests, setRawBookings]);

    const rejectRequest = useCallback((requestId: number) => {
        setRawRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: RequestStatus.RECHAZADA } : r));
    }, [setRawRequests]);

    const addBooking = useCallback((bookingData: Omit<Booking, 'id'>) => {
        const newBooking: Booking = {
            id: Date.now(),
            ...bookingData,
        };
        setRawBookings(prev => [...prev, newBooking]);
    }, [setRawBookings]);

    const value = useMemo(() => ({ requests, bookings, addRequest, approveRequest, rejectRequest, addBooking }), [requests, bookings, addRequest, approveRequest, rejectRequest, addBooking]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
