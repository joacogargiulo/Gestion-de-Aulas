import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/login`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 border-8 border-indigo-800">
      <div className="text-center text-indigo-800">
        <div className="flex justify-center mb-6">
          <Logo className="w-56" />
        </div>
        <h2 className="text-4xl font-light mt-2">Gestión de Aulas</h2>
        <h3 className="text-4xl font-light">Sede Yerba Buena</h3>
      </div>

      <div className="mt-12 space-y-5 w-full max-w-sm">
        <Button
          onClick={handleNavigation}
          className="w-full font-bold py-4 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;