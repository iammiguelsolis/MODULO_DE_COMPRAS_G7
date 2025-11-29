
import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'licitacion' | 'danger' | 'danger-outline';
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const buttonClassName = `btn btn-${variant} btn-${size} ${className || ''}`.trim();

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
