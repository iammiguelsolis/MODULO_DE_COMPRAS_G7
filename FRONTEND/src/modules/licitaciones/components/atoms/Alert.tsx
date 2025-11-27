import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import './Alert.css';

interface AlertProps {
    variant?: 'info' | 'warning' | 'error' | 'success';
    children: React.ReactNode;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({ variant = 'info', children, className = '' }) => {
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'info':
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className={`alert alert-${variant} ${className}`.trim()}>
            <div className="alert-icon">
                {getIcon()}
            </div>
            <div className="alert-content">
                {children}
            </div>
        </div>
    );
};

export default Alert;
