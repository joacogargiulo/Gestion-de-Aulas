import React, { useState, useEffect, useMemo } from 'react';
import { Classroom, Role, Faculty } from '../types';
import { MOCK_FACULTIES_CAREERS, MOCK_CAREER_SUBJECTS } from '../data';
// FIX: Changed date-fns import to resolve "not callable" error.
import { format } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Alert from './ui/Alert';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { career: string; subject: string; userId: number; }) => void;
  classroom: Classroom | null;
  startTime: Date;
  endTime: Date;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ isOpen, onClose, onSubmit, classroom, startTime, endTime }) => {
    const { users } = useAuth();
    const teachers = useMemo(() => users.filter(u => u.role === Role.DOCENTE), [users]);

    const [faculty, setFaculty] = useState<Faculty>(Faculty.HEALTH_SCIENCES);
    const [career, setCareer] = useState(MOCK_FACULTIES_CAREERS[Faculty.HEALTH_SCIENCES][0]);
    const [subjectsForCareer, setSubjectsForCareer] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [userId, setUserId] = useState<number | ''>(teachers[0]?.id || '');
    const [error, setError] = useState('');

    useEffect(() => {
        // When faculty changes, update the career to the first one in the new list.
        setCareer(MOCK_FACULTIES_CAREERS[faculty][0] || '');
    }, [faculty]);
    
    useEffect(() => {
        // When career changes, update the subjects list and reset the selected subject.
        const newSubjects = MOCK_CAREER_SUBJECTS[career] || [];
        setSubjectsForCareer(newSubjects);
        setSubject(newSubjects[0] || '');
    }, [career]);


    const resetForm = () => {
        setFaculty(Faculty.HEALTH_SCIENCES); // This triggers the effect chain
        setUserId(teachers[0]?.id || '');
        setError('');
    };
    
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, teachers]);


    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!subject || !userId || !career) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        onSubmit({ career, subject, userId: Number(userId) });
        handleClose();
    };

    if (!isOpen || !classroom) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Reserva Directa</h2>
                <div className="mb-4 p-4 bg-gray-100 rounded-md text-sm space-y-1 text-gray-800">
                    <p><span className="font-semibold">Aula:</span> {classroom.name}</p>
                    <p><span className="font-semibold">Fecha:</span> {format(startTime, 'eeee d, MMMM', { locale: es })}</p>
                    <p><span className="font-semibold">Horario:</span> {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}hs</p>
                    <div className="pt-2 mt-2 border-t border-gray-200 grid grid-cols-2 gap-x-4 gap-y-1">
                        <p><span className="font-semibold">Sillas:</span> {classroom.capacity}</p>
                        <p><span className="font-semibold">Proyector:</span> {classroom.hasProjector ? 'Sí' : 'No'}</p>
                        <p><span className="font-semibold">PCs Alumno:</span> {classroom.studentComputers > 0 ? classroom.studentComputers : 'No'}</p>
                        <p><span className="font-semibold">Aire A/C:</span> {classroom.hasAirConditioning ? 'Sí' : 'No'}</p>
                    </div>
                </div>
                <Alert type="error" message={error} />
                 <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="booking-faculty" className="block text-sm font-medium text-gray-700">Facultad</label>
                            <select id="booking-faculty" value={faculty} onChange={e => setFaculty(e.target.value as Faculty)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {Object.values(Faculty).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="booking-career" className="block text-sm font-medium text-gray-700">Carrera</label>
                            <select id="booking-career" value={career} onChange={e => setCareer(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {MOCK_FACULTIES_CAREERS[faculty].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="booking-subject" className="block text-sm font-medium text-gray-700">Materia</label>
                            <select id="booking-subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {subjectsForCareer.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="booking-teacher" className="block text-sm font-medium text-gray-700">Docente a Cargo</label>
                             <select id="booking-teacher" value={userId} onChange={e => setUserId(Number(e.target.value))} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                     <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                            Cancelar
                        </button>
                        <Button type="submit">
                            Crear Reserva
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingModal;