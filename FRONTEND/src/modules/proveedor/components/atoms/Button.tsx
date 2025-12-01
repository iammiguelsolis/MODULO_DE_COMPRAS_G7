import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  type?: 'button' | 'submit';
  icon?: React.ElementType;   // icono izquierdo
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  icon: Icon,
  fullWidth = false
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;