import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  icon?: React.ElementType;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  type = 'button',
  icon: Icon,
  fullWidth = false,
  disabled = false,
  loading = false
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50',
    outline: 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm border border-blue-600 disabled:border-blue-300',
    ghost: 'text-gray-600 hover:bg-gray-100 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:bg-red-300'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;