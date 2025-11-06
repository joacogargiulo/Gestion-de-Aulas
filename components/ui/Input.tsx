import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  const baseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return <input ref={ref} className={combinedClasses} {...props} />;
});

export default Input;