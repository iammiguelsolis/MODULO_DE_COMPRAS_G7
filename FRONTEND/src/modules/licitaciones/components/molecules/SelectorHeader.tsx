import React from 'react';
import './SelectorHeader.css';

interface SelectorHeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const SelectorHeader: React.FC<SelectorHeaderProps> = ({ icon, title, description }) => {
    return (
        <div className="selector-header">
            <div className="selector-icon">{icon}</div>
            <div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default SelectorHeader;
