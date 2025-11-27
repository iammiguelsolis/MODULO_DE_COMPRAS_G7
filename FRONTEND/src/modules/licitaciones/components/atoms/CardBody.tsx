import React from 'react';
import './CardBody.css';

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
    const bodyClassName = `card-body ${className || ''}`.trim();

    return (
        <div className={bodyClassName}>
            {children}
        </div>
    );
};

export default CardBody;
