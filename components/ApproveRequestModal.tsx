import React, { useState, useMemo, useEffect } from 'react';
import { ClassroomRequest } from '../types';
import { MOCK_CLASSROOMS, getFacultyByCareer } from '../data';
// FIX: Changed date-fns import to resolve "not callable" error.
import { format } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import { useAuth } from '../contexts/AuthContext';

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedClassroomId: number) => void;
  requestToApprove: ClassroomRequest | null;
}

const ApproveRequestModal: React.FC<ApproveRequestModalProps> = ({ isOpen, onClose, onConfirm, requestToApprove }) => {
  const { users } = useAuth();
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);

  useEffect(() => {
    if (requestToApprove) {
      if (requestToApprove.requestedClassroomId) {
        setSelectedClassroomId(requestToApprove.requestedClassroomId);
      } else {
        const faculty = getFacultyByCareer(requestToApprove.career);
        const firstClassroomOfFaculty = MOCK_CLASSROOMS.find(c => c.faculty === faculty);
        setSelectedClassroomId(firstClassroomOfFaculty?.id || null);
      }
    } else {
      setSelectedClassroomId(null);
    }
  }, [requestToApprove]);

  const availableClassroomsForApproval = useMemo(() => {
    if (!requestToApprove) return [];
    const faculty = getFacultyByCareer(requestToApprove.career);
    return MOCK_CLASSROOMS.filter(c => c.faculty === faculty);
  }, [requestToApprove]);

  const selectedClassroomDetails = useMemo(() => {
    if (!selectedClassroomId) return null;
    return MOCK_CLASSROOMS.find(c => c.id === selectedClassroomId);
  }, [selectedClassroomId]);

  const handleConfirm = () => {
    if (selectedClassroomId !== null) {
      onConfirm(selectedClassroomId);
    }
  };
  
  if (!isOpen || !requestToApprove) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Aprobar Solicitud</h2>
        <div className="mb-4 p-4 bg-gray-100 rounded-md text-sm text-gray-700 space-y-1">
          <p><span className="font-semibold text-gray-800">Carrera:</span> {requestToApprove.career}</p>
          <p><span className="font-semibold text-gray-800">Materia:</span> {requestToApprove.subject}</p>
          <p><span className="font-semibold text-gray-800">Solicitante:</span> {users.find(u => u.id === requestToApprove.userId)?.name}</p>
          <p><span className="font-semibold text-gray-800">Fecha:</span> {format(requestToApprove.startTime, 'PPP', { locale: es })}</p>
          <p><span className="font-semibold text-gray-800">Horario:</span> {format(requestToApprove.startTime, 'p', { locale: es })} - {format(requestToApprove.endTime, 'p', { locale: es })}</p>
        </div>
        <div className="mb-6">
          <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 mb-2">
            Asignar Aula
          </label>
          <select
            id="classroom"
            value={selectedClassroomId || ''}
            onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
          >
            {availableClassroomsForApproval.map(classroom => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
          {selectedClassroomDetails && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm border border-gray-200 text-gray-700">
              <h4 className="font-semibold text-gray-800 mb-2">Detalles del Aula Seleccionada</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-800">Sillas:</span> {selectedClassroomDetails.capacity}</p>
                <p><span className="font-semibold text-gray-800">Proyector:</span> {selectedClassroomDetails.hasProjector ? 'Sí' : 'No'}</p>
                <p><span className="font-semibold text-gray-800">PCs Alumno:</span> {selectedClassroomDetails.studentComputers}</p>
                <p><span className="font-semibold text-gray-800">Aire A/C:</span> {selectedClassroomDetails.hasAirConditioning ? 'Sí' : 'No'}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Confirmar Aprobación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestModal;