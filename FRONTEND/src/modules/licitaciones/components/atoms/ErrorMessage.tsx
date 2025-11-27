import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    children: React.ReactNode;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className }) => {
    if (!children) return null;

    const errorClassName = `error-message ${className || ''}`.trim();

    return (
        <p className={errorClassName}>
            {children}
        </p>
    );
};

export default ErrorMessage;
