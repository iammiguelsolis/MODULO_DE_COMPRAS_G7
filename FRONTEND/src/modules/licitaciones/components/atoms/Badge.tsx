import React from 'react';
import './Badge.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
    const classNames = `badge badge-${variant} ${className}`.trim();

    return (
        <span className={classNames}>
            {children}
        </span>
    );
};

export default Badge;
