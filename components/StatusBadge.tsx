import React from 'react';
import { RequestStatus } from '../types';

const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  const statusClasses = {
    [RequestStatus.PENDIENTE]: 'bg-yellow-200 text-yellow-800',
    [RequestStatus.APROBADA]: 'bg-green-200 text-green-800',
    [RequestStatus.RECHAZADA]: 'bg-red-200 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default StatusBadge;
