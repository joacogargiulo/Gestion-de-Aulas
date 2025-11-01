import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, ClassroomRequest, RequestStatus, Role, Booking, Classroom } from './types'; 
import { MOCK_USERS } from './data'; 
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
// (Esta sección no cambia)
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; message: string }>;
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
  // (Esta sección no cambia)
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

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) return null;
        const { user: loggedInUser, token } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return loggedInUser;
    } catch (error) {
        console.error("Error conectando a la API de login:", error);
        return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); 
    setUser(null);
  }, []);
  
  const registerUser = useCallback(async (userData: Omit<User, 'id'>): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, message: '¡Registro exitoso! Serás redirigido para iniciar sesión.' };
        } else {
            return { success: false, message: data.message || 'Error desconocido al registrar.' };
        }
    } catch (error) {
        console.error("Error conectando a la API de registro:", error);
        return { success: false, message: 'Error de conexión con el servidor.' };
    }
  }, []);

  const value = useMemo(() => ({ user, login, logout, registerUser }), [user, users, login, logout, registerUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- DATA CONTEXT ---
interface DataContextType {
  requests: ClassroomRequest[];
  bookings: Booking[];
  classrooms: Classroom[]; 
  addRequest: (requestData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string; requestedClassroomId: number; }) => Promise<void>; 
  approveRequest: (requestToApprove: ClassroomRequest, classroomId: number) => Promise<void>;
  rejectRequest: (requestId: number) => Promise<void>;
  addBooking: (bookingData: Omit<Booking, 'id'>) => Promise<void>;

}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// (Funciones de Mapeo mapRequestToFrontend, mapBookingToFrontend, mapClassroomToFrontend no cambian)
const mapRequestToFrontend = (dbReq: any): ClassroomRequest => {
    return {
        id: dbReq.id,
        userId: dbReq.userid, 
        subject: dbReq.subject,
        career: dbReq.career,
        startTime: new Date(dbReq.starttime), 
        endTime: new Date(dbReq.endtime), 
        reason: dbReq.reason,
        status: dbReq.status,
        requestedClassroomId: dbReq.requestedclassroomid, 
        assignedClassroomId: dbReq.assignedclassroomid 
    };
};
const mapBookingToFrontend = (dbBooking: any): Booking => {
    return {
        id: dbBooking.id,
        classroomId: dbBooking.classroomid, 
        userId: dbBooking.userid, 
        subject: dbBooking.subject,
        career: dbBooking.career,
        startTime: new Date(dbBooking.starttime), 
        endTime: new Date(dbBooking.endtime), 
    };
};
const mapClassroomToFrontend = (dbClassroom: any): Classroom => {
    return {
        id: dbClassroom.id,
        name: dbClassroom.name,
        capacity: dbClassroom.capacity,
        hasProjector: dbClassroom.hasprojector, 
        studentComputers: dbClassroom.studentcomputers, 
        hasAirConditioning: dbClassroom.hasairconditioning, 
        faculty: dbClassroom.faculty,
    };
};

const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ClassroomRequest[]>([]); 
    const [bookings, setBookings] = useState<Booking[]>([]); 
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    // Función auxiliar para fetch (actualizada para manejar body y JSON)
    const fetchData = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('token'); 
        if (!token) throw new Error("Token de autenticación faltante.");
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` })); // Intenta parsear JSON, si falla, usa status
            throw new Error(errorData.message || `Error ${response.status} al procesar ${endpoint}`);
        }
        
        // Manejar respuestas 204 (No Content) o 200 (OK) que pueden no tener cuerpo
        if (response.status === 204) {
            return { success: true };
        }
        
        try {
            return await response.json();
        } catch (e) {
            // Si la respuesta es OK pero no hay JSON (ej. un PUT simple)
            return { success: true }; 
        }
    }, []);

    // --- LECTURA DE DATOS (GET) ---
    // (fetchClassrooms, fetchBookings, fetchRequests no cambian)
    const fetchClassrooms = useCallback(async () => {
        try {
            const data = await fetchData('/api/classrooms') as any[];
            setClassrooms(data.map(mapClassroomToFrontend)); 
        } catch (error) {
            console.error("Error al cargar aulas:", error);
        }
    }, [fetchData]);

    const fetchBookings = useCallback(async () => {
        try {
            const data = await fetchData('/api/bookings') as any[];
            setBookings(data.map(mapBookingToFrontend));
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        }
    }, [fetchData]);

    const fetchRequests = useCallback(async () => {
        if (!user) return;
        const endpoint = user.role === Role.SECRETARIA ? '/api/requests' : '/api/requests/my';
        try {
            const data = await fetchData(endpoint) as any[];
            setRequests(data.map(mapRequestToFrontend));
        } catch (error) {
            console.error("Error al cargar solicitudes:", error);
        }
    }, [fetchData, user]);


    // --- DISPARADORES DE CARGA ---
    useEffect(() => {
        if (user) {
            fetchClassrooms();
            fetchBookings();
            fetchRequests(); 
        } else {
            setBookings([]); 
            setRequests([]);
            setClassrooms([]);
        }
    }, [user, fetchClassrooms, fetchBookings, fetchRequests]); 
    
    // --- ESCRITURA DE DATOS (POST/PUT) ---

    // (addRequest no cambia)
    const addRequest = useCallback(async (requestData: { career: string; subject: string; startTime: Date; endTime: Date; reason: string; requestedClassroomId: number; }) => {
        const token = localStorage.getItem('token');
        if (!user || !token) {
            console.error("Usuario no autenticado o token faltante.");
            return;
        }
        try {
            const payload = {
                ...requestData,
                startTime: requestData.startTime.toISOString(), 
                endTime: requestData.endTime.toISOString(),
            };
            
            await fetchData('/api/requests', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            alert('¡Solicitud enviada con éxito!'); 
            await fetchRequests(); // Recargar la lista
        } catch (error: any) {
            console.error("Error de red al enviar solicitud:", error);
            alert(`Error al enviar solicitud: ${error.message}`);
        }
    }, [user, fetchRequests, fetchData]);
    
    // **** CAMBIO: Implementación de approveRequest con API ****
    const approveRequest = useCallback(async (requestToApprove: ClassroomRequest, classroomId: number) => {
        try {
            // Llama al nuevo endpoint PUT
            await fetchData(`/api/requests/${requestToApprove.id}/approve`, {
                method: 'PUT',
                body: JSON.stringify({ classroomId: classroomId }) // Envía el ID del aula seleccionada
            });
            
            // Refresca ambas listas (solicitudes Y reservas)
            // porque aprobar crea una nueva reserva
            await fetchRequests();
            await fetchBookings();
            
        } catch (error: any) {
            console.error("Error al aprobar solicitud:", error);
            alert(`Error al aprobar solicitud: ${error.message}`);
        }
    }, [fetchData, fetchRequests, fetchBookings]);

    // **** CAMBIO: Implementación de rejectRequest con API ****
    const rejectRequest = useCallback(async (requestId: number) => {
        try {
            // Llama al nuevo endpoint PUT
            await fetchData(`/api/requests/${requestId}/reject`, {
                method: 'PUT'
                // No necesita body, solo el ID en la URL
            });
            
            // Refresca solo la lista de solicitudes
            await fetchRequests();
            
        } catch (error: any) {
            console.error("Error al rechazar solicitud:", error);
            alert(`Error al rechazar solicitud: ${error.message}`);
        }
    }, [fetchData, fetchRequests]);

    const addBooking = useCallback(async (bookingData: Omit<Booking, 'id'>) => {
        // La simulación anterior fue eliminada.
        try {
            // Convertimos las fechas a ISO string para el JSON
            const payload = {
                ...bookingData,
                startTime: bookingData.startTime.toISOString(),
                endTime: bookingData.endTime.toISOString(),
            };

            await fetchData('/api/bookings', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Refrescar la lista de reservas
            await fetchBookings();
            alert(`Reserva creada con éxito.`);

        } catch (error: any) {
            console.error("Error al crear reserva directa:", error);
            alert(`Error al crear reserva: ${error.message}`);
        }
    }, [fetchData, fetchBookings]);

    const value = useMemo(() => ({ requests, bookings, classrooms, addRequest, approveRequest, rejectRequest, addBooking }), [requests, bookings, classrooms, addRequest, approveRequest, rejectRequest, addBooking]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}


// --- APP SETUP ---
// (Esta sección no cambia)
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

