import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  users: User[];
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', MOCK_USERS);
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const login = useCallback((email: string, password: string): User | null => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      return foundUser;
    }
    return null;
  }, [users, setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);
  
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
  }, [users, setUsers]);

  const value = useMemo(() => ({ user, users, login, logout, registerUser }), [user, users, login, logout, registerUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};