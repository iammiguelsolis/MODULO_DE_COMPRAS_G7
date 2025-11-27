import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'summary' | 'licitacion';
    className?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    className
}) => {
    const cardClassName = `card card-${variant} ${className || ''}`.trim();

    return (
        <div className={cardClassName}>
            {children}
        </div>
    );
};

export default Card;
