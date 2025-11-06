
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Role, User } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import Layout from './components/Layout';
import ClassroomAvailabilityPage from './pages/ClassroomAvailabilityPage';
import SchedulePage from './pages/SchedulePage';
import MyClassesPage from './pages/MyClassesPage';
import RegistrationPage from './pages/RegistrationPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';


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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key === '6') {
        const isConfirmed = window.confirm(
          '¿Está seguro de que desea borrar TODOS los datos locales (usuarios, solicitudes, reservas)? La aplicación se recargará con los datos de prueba iniciales.'
        );
        if (isConfirmed) {
          localStorage.clear();
          alert('Los datos han sido restaurados. La página se recargará.');
          window.location.reload();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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