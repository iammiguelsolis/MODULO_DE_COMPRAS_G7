import React from 'react';
import './Separator.css';

interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', className = '' }) => {
    return <div className={`separator separator-${orientation} ${className}`} />;
};

export default Separator;
