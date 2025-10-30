


import React, { useState, useMemo } from 'react';
import { useAuth, useData } from '../App';
import { Role, ClassroomRequest, RequestStatus } from '../types';
import { MOCK_USERS, MOCK_CLASSROOMS, getFacultyByCareer } from '../data';
import { format } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import { es } from 'date-fns/locale';

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  const statusClasses = {
    [RequestStatus.PENDIENTE]: 'bg-yellow-200 text-yellow-800',
    [RequestStatus.APROBADA]: 'bg-green-200 text-green-800',
    [RequestStatus.RECHAZADA]: 'bg-red-200 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const RequestCard: React.FC<{ 
    request: ClassroomRequest, 
    isSecretariaView: boolean,
    onApprove?: (request: ClassroomRequest) => void,
    onReject?: (requestId: number) => void
}> = ({ request, isSecretariaView, onApprove, onReject }) => {
  const user = MOCK_USERS.find(u => u.id === request.userId);
  const classroom = MOCK_CLASSROOMS.find(c => c.id === request.assignedClassroomId);
  const requestedClassroom = MOCK_CLASSROOMS.find(c => c.id === request.requestedClassroomId);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{request.subject}</h3>
          <p className="text-sm text-gray-500">{request.career}</p>
          {isSecretariaView && <p className="text-sm text-gray-600 mt-1">Solicitado por: {user?.name}</p>}
          <p className="text-sm text-gray-500 mt-1">
            {format(request.startTime, 'eeee d MMMM, yyyy', { locale: es })}
          </p>
          <p className="text-sm text-gray-500">
            {format(request.startTime, 'HH:mm')} - {format(request.endTime, 'HH:mm')}hs
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700"><span className="font-semibold">Motivo:</span> {request.reason}</p>
        {isSecretariaView && requestedClassroom && (
          <p className="text-sm text-indigo-700 font-semibold mt-1">Aula Solicitada: {requestedClassroom.name}</p>
        )}
        {request.status === RequestStatus.APROBADA && (
          <p className="text-sm text-green-700 font-semibold mt-1">Aula Asignada: {classroom?.name}</p>
        )}
      </div>
      {isSecretariaView && request.status === RequestStatus.PENDIENTE && (
        <div className="mt-4 flex justify-end space-x-3">
          <button 
            onClick={() => onReject && onReject(request.id)}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
            Rechazar
          </button>
          <button 
            onClick={() => onApprove && onApprove(request)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
            Aprobar
          </button>
        </div>
      )}
    </div>
  );
};


const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, approveRequest, rejectRequest } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<ClassroomRequest | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  
  const availableClassroomsForApproval = useMemo(() => {
    if (!requestToApprove) return [];
    const faculty = getFacultyByCareer(requestToApprove.career);
    return MOCK_CLASSROOMS.filter(c => c.faculty === faculty);
  }, [requestToApprove]);

  const selectedClassroomDetails = useMemo(() => {
    if (!selectedClassroomId) return null;
    return MOCK_CLASSROOMS.find(c => c.id === selectedClassroomId);
  }, [selectedClassroomId]);

  if (!user) return null;

  const handleOpenApproveModal = (request: ClassroomRequest) => {
    setRequestToApprove(request);
    if (request.requestedClassroomId) {
        setSelectedClassroomId(request.requestedClassroomId);
    } else {
        const faculty = getFacultyByCareer(request.career);
        const firstClassroomOfFaculty = MOCK_CLASSROOMS.find(c => c.faculty === faculty);
        setSelectedClassroomId(firstClassroomOfFaculty?.id || null);
    }
    setIsModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!requestToApprove || selectedClassroomId === null) return;

    approveRequest(requestToApprove, selectedClassroomId);
    
    setIsModalOpen(false);
    setRequestToApprove(null);
    setSelectedClassroomId(null);
  };

  if (user.role === Role.SECRETARIA) {
    const pendingRequests = requests.filter(r => r.status === RequestStatus.PENDIENTE);
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestionar Solicitudes Pendientes</h1>
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <RequestCard 
                key={req.id} 
                request={req} 
                isSecretariaView={true} 
                onApprove={handleOpenApproveModal}
                onReject={rejectRequest}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay solicitudes pendientes en este momento.</p>
        )}

        {isModalOpen && requestToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Aprobar Solicitud</h2>
              <div className="mb-4 p-4 bg-gray-100 rounded-md text-sm text-gray-700 space-y-1">
                 <p><span className="font-semibold text-gray-800">Carrera:</span> {requestToApprove.career}</p>
                 <p><span className="font-semibold text-gray-800">Materia:</span> {requestToApprove.subject}</p>
                 <p><span className="font-semibold text-gray-800">Solicitante:</span> {MOCK_USERS.find(u => u.id === requestToApprove.userId)?.name}</p>
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
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={handleConfirmApproval} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Confirmar Aprobación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user.role === Role.DOCENTE) {
    const myRequests = requests.filter(r => r.userId === user.id);
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Solicitudes de Aula</h1>
        {myRequests.length > 0 ? (
          <div className="space-y-4">
            {myRequests.map(req => (
              <RequestCard key={req.id} request={req} isSecretariaView={false} />
            ))}
          </div>
        ) : (
           <p className="text-gray-600">No has realizado ninguna solicitud todavía.</p>
        )}
      </div>
    );
  }

  return null;
};

export default RequestsPage;