import React from 'react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!message) return null;

  const baseClasses = 'px-4 py-3 rounded-md mb-6 border';
  const typeClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <p>{message}</p>
    </div>
  );
};

export default Alert;