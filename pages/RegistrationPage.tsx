import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

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
                
                <Alert type="error" message={error} />
                <Alert type="success" message={success} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="role">Rol</Label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as Role)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900">
                            <option value={Role.DOCENTE}>Docente</option>
                            <option value={Role.SECRETARIA}>Secretaría</option>
                        </select>
                    </div>
                    <div>
                        <Button type="submit" isLoading={isLoading} disabled={!!success} className="w-full">
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </Button>
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