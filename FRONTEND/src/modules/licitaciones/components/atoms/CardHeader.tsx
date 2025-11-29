import React from 'react';
import './CardHeader.css';

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    const headerClassName = `card-header ${className || ''}`.trim();

    return (
        <div className={headerClassName}>
            {children}
        </div>
    );
};

export default CardHeader;
