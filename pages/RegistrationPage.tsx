import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import Logo from '../components/Logo';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { registerUser } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<Role>(Role.DOCENTE);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const result = registerUser({ name, email, password, role });
            if (result.success) {
                setSuccess('¡Registro exitoso! Serás redirigido para iniciar sesión.');
                setTimeout(() => {
                    navigate(`/login?role=${role}`);
                }, 2000);
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center text-indigo-800 mb-8">
                    <div className="flex justify-center mb-4">
                        <Logo className="w-40" />
                    </div>
                    <h1 className="text-2xl font-bold">Crear Nueva Cuenta</h1>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">Nombre Completo</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" />
                    </div>
                     <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">Contraseña</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">Confirmar Contraseña</label>
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" />
                    </div>
                    <div>
                        <label htmlFor="role" className="text-sm font-medium text-gray-700 block mb-2">Rol</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as Role)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900">
                            <option value={Role.DOCENTE}>Docente</option>
                            <option value={Role.SECRETARIA}>Secretaría</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading || !!success} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;