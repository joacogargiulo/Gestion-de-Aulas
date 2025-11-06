import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading = false, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  const variantClasses = {
    primary: 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};

export default Button;