import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  const baseClasses = 'text-sm font-medium text-gray-700 block mb-2';
  const combinedClasses = `${baseClasses} ${className}`;
  
  return <label className={combinedClasses} {...props}>{children}</label>;
};

export default Label;