import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const loggedInUser = login(email, password);

      if (loggedInUser) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Credenciales inválidas. Por favor, intente de nuevo.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center text-indigo-800 mb-8">
            <div className="flex justify-center mb-4">
                <Logo className="w-40" />
            </div>
            <h1 className="text-2xl font-bold">Inicio de Sesión</h1>
        </div>
        
        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@facultad.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password123"
            />
          </div>
          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
         <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Regístrate aquí
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;