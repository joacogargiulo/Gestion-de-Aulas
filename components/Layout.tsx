
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import { Role } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-indigo-700 hover:text-white";
  const activeNavLinkClasses = "bg-indigo-900 text-white";

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo className="h-10 w-auto" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                    Disponibilidad
                  </NavLink>
                  {user?.role === Role.DOCENTE && (
                    <>
                      <NavLink to="/my-classes" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                        Mis Clases
                      </NavLink>
                      <NavLink to="/requests" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                        Mis Solicitudes
                      </NavLink>
                    </>
                  )}
                  {user?.role === Role.SECRETARIA && (
                    <>
                       <NavLink to="/schedule" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                        Cronograma
                      </NavLink>
                      <NavLink to="/requests" className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}>
                        Gestionar Solicitudes
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
               <span className="text-gray-300 text-sm mr-4 hidden sm:block">
                Bienvenido, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;