import React, { useState, useEffect } from 'react';
import { MOCK_FACULTIES_CAREERS, MOCK_CAREER_SUBJECTS } from '../data';
import { Classroom, Faculty } from '../types';
import { format } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import { es } from 'date-fns/locale';

interface RequestAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { career: string, subject: string; startTime: Date; endTime: Date; reason: string }) => void;
  initialData?: {
    date: string; // "YYYY-MM-DD"
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
  };
  classroom: Classroom | null;
}

const RequestAulaModal: React.FC<RequestAulaModalProps> = ({ isOpen, onClose, onSubmit, initialData, classroom }) => {
    const [faculty, setFaculty] = useState<Faculty>(Faculty.HEALTH_SCIENCES);
    const [career, setCareer] = useState(MOCK_FACULTIES_CAREERS[Faculty.HEALTH_SCIENCES][0]);
    const [subjectsForCareer, setSubjectsForCareer] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [reason, setReason] = useState('');
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
        setFaculty(Faculty.HEALTH_SCIENCES); // This will trigger the effect chain
        setDate('');
        setStartTime('');
        setEndTime('');
        setReason('');
        setError('');
    };

    useEffect(() => {
        if (isOpen) {
             if (initialData) {
                setDate(initialData.date);
                setStartTime(initialData.startTime);
                setEndTime(initialData.endTime);
                // Also reset non-initial data fields
                setFaculty(Faculty.HEALTH_SCIENCES); // This triggers the chain
                setReason('');
                setError('');
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);
    
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!subject || !career || !date || !startTime || !endTime) {
            setError('Todos los campos, excepto el motivo, son obligatorios.');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        
        if (startDateTime >= endDateTime) {
            setError('La hora de fin debe ser posterior a la hora de inicio.');
            return;
        }
        
        onSubmit({
            career,
            subject,
            startTime: startDateTime,
            endTime: endDateTime,
            reason
        });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {classroom ? `Solicitar Aula: ${classroom.name}` : 'Solicitar un Aula'}
                </h2>
                {initialData && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm border border-gray-200 text-gray-800 space-y-1">
                        <p><span className="font-semibold text-gray-900">Fecha:</span> {format(new Date(`${initialData.date}T00:00:00`), "eeee d 'de' MMMM", { locale: es })}</p>
                        <p><span className="font-semibold text-gray-900">Horario:</span> {initialData.startTime} - {initialData.endTime} hs</p>
                        {classroom && (
                            <div className="pt-2 mt-2 border-t border-gray-200 grid grid-cols-2 gap-x-4 gap-y-1">
                                <p><span className="font-semibold text-gray-900">Sillas:</span> {classroom.capacity}</p>
                                <p><span className="font-semibold text-gray-900">Proyector:</span> {classroom.hasProjector ? 'Sí' : 'No'}</p>
                                <p><span className="font-semibold text-gray-900">PCs Alumno:</span> {classroom.studentComputers > 0 ? classroom.studentComputers : 'No'}</p>
                                <p><span className="font-semibold text-gray-900">Aire A/C:</span> {classroom.hasAirConditioning ? 'Sí' : 'No'}</p>
                            </div>
                        )}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">Facultad</label>
                            <select id="faculty" value={faculty} onChange={e => setFaculty(e.target.value as Faculty)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {Object.values(Faculty).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="career" className="block text-sm font-medium text-gray-700">Carrera</label>
                            <select id="career" value={career} onChange={e => setCareer(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {MOCK_FACULTIES_CAREERS[faculty].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Materia</label>
                             <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900" required>
                                {subjectsForCareer.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo de la Solicitud (Opcional)</label>
                             <textarea id="reason" rows={3} value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestAulaModal;