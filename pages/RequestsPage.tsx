
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Role, ClassroomRequest, RequestStatus } from '../types';
import RequestCard from '../components/RequestCard';
import ApproveRequestModal from '../components/ApproveRequestModal';

const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests, approveRequest, rejectRequest } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<ClassroomRequest | null>(null);
  
  if (!user) return null;

  const handleOpenApproveModal = (request: ClassroomRequest) => {
    setRequestToApprove(request);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setRequestToApprove(null);
  };

  const handleConfirmApproval = (classroomId: number) => {
    if (!requestToApprove) return;
    approveRequest(requestToApprove, classroomId);
    handleCloseModal();
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

        <ApproveRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmApproval}
          requestToApprove={requestToApprove}
        />
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