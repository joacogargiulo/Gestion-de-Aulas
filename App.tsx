
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, ClassroomRequest, RequestStatus, Role, Booking } from './types';
import { MOCK_REQUESTS, MOCK_BOOKINGS, MOCK_USERS } from './data';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import Layout from './components/Layout';
import ClassroomAvailabilityPage from './pages/ClassroomAvailabilityPage';
import SchedulePage from './pages/SchedulePage';
import MyClassesPage from './pages/MyClassesPage';
import RegistrationPage from './pages/RegistrationPage';

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id'>) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return MOCK_USERS;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);


  const login = useCallback((email: string, password: string): User | null => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser && foundUser.password === password) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);
  
  const registerUser = useCallback((userData: Omit<User, 'id'>) => {
    const userExists = users.some(u => u.email === userData.email);
    if (userExists) {
      return { success: false, message: 'El correo electrónico ya está en uso.' };
    }
    const newUser: User = {
      id: Date.now(),
      ...userData,
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: '¡Registro exitoso!' };
  }, [users]);


  const value = useMemo(() => ({ user, login, logout, registerUser }), [user, users, login, logout, registerUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- DATA CONTEXT ---
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

const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ClassroomRequest[]>(() => {
      try {
        const storedRequests = localStorage.getItem('requests');
        if (storedRequests) {
          const parsed = JSON.parse(storedRequests) as ClassroomRequest[];
          // Dates are stored as strings in JSON, so we need to convert them back to Date objects
          return parsed.map(req => ({
            ...req,
            startTime: new Date(req.startTime),
            endTime: new Date(req.endTime),
          }));
        }
      } catch (error) {
        console.error("Failed to parse requests from localStorage", error);
      }
      return MOCK_REQUESTS;
    });

    const [bookings, setBookings] = useState<Booking[]>(() => {
      try {
        const storedBookings = localStorage.getItem('bookings');
        if (storedBookings) {
          const parsed = JSON.parse(storedBookings) as Booking[];
          // Dates are stored as strings in JSON, so we need to convert them back to Date objects
          return parsed.map(book => ({
            ...book,
            startTime: new Date(book.startTime),
            endTime: new Date(book.endTime),
          }));
        }
      } catch (error) {
        console.error("Failed to parse bookings from localStorage", error);
      }
      return MOCK_BOOKINGS;
    });

    useEffect(() => {
      localStorage.setItem('requests', JSON.stringify(requests));
    }, [requests]);

    useEffect(() => {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }, [bookings]);

    const addRequest = useCallback((requestData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string; requestedClassroomId: number; }) => {
        if (!user) return;
        const newRequest: ClassroomRequest = {
            id: Date.now(),
            userId: user.id,
            ...requestData,
            status: RequestStatus.PENDIENTE,
        };
        setRequests(prev => [newRequest, ...prev]);
    }, [user]);
    
    const approveRequest = useCallback((requestToApprove: ClassroomRequest, classroomId: number) => {
        // 1. Update the request status
        const updatedRequest: ClassroomRequest = {
            ...requestToApprove,
            status: RequestStatus.APROBADA,
            assignedClassroomId: classroomId,
        };
        setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));

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
        setBookings(prev => [...prev, newBooking]);
    }, []);

    const rejectRequest = useCallback((requestId: number) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: RequestStatus.RECHAZADA } : r));
    }, []);

    const addBooking = useCallback((bookingData: Omit<Booking, 'id'>) => {
        const newBooking: Booking = {
            id: Date.now(),
            ...bookingData,
        };
        setBookings(prev => [...prev, newBooking]);
    }, []);

    const value = useMemo(() => ({ requests, bookings, addRequest, approveRequest, rejectRequest, addBooking }), [requests, bookings, addRequest, approveRequest, rejectRequest, addBooking]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}


// --- APP SETUP ---
const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requests" 
              element={
                <ProtectedRoute>
                  <Layout><RequestsPage /></Layout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/availability/:faculty/:dateString/:timeSlotIndex" 
              element={
                <ProtectedRoute>
                  <Layout><ClassroomAvailabilityPage /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute roles={[Role.SECRETARIA]}>
                  <Layout><SchedulePage /></Layout>
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/my-classes" 
              element={
                <ProtectedRoute roles={[Role.DOCENTE]}>
                  <Layout><MyClassesPage /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
