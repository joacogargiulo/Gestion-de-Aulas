import React from 'react';
import { ClassroomRequest, RequestStatus } from '../types';
import { MOCK_CLASSROOMS } from '../data';
// FIX: Changed date-fns import to resolve "not callable" error.
import { format } from 'date-fns';
// FIX: Corrected locale import path for date-fns v2 compatibility.
import es from 'date-fns/locale/es';
import StatusBadge from './StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const RequestCard: React.FC<{ 
    request: ClassroomRequest, 
    isSecretariaView: boolean,
    onApprove?: (request: ClassroomRequest) => void,
    onReject?: (requestId: number) => void
}> = ({ request, isSecretariaView, onApprove, onReject }) => {
  const { users } = useAuth();
  const user = users.find(u => u.id === request.userId);
  const classroom = MOCK_CLASSROOMS.find(c => c.id === request.assignedClassroomId);
  const requestedClassroom = MOCK_CLASSROOMS.find(c => c.id === request.requestedClassroomId);

  const now = new Date();
  const isRequestInThePast = request.startTime < now;

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
          <Button 
            variant="danger"
            onClick={() => onReject && onReject(request.id)}
          >
            Rechazar
          </Button>
          <Button 
            variant="success"
            onClick={() => onApprove && onApprove(request)}
            disabled={isRequestInThePast}
            title={isRequestInThePast ? "No se puede aprobar una solicitud para una fecha pasada." : ''}
          >
            Aprobar
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;