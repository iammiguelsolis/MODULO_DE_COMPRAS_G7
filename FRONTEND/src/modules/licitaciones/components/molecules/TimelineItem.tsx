import React from 'react';
import './TimelineItem.css';
import { Check, Hourglass, X } from 'lucide-react';

interface TimelineItemProps {
    stepNumber: number;
    title: string;
    description?: string;
    status: 'active' | 'completed' | 'pending';
    timestamp?: string; // Hora en que se completó este paso
    statusText?: string; // Texto de estado ("---" o "Pendiente")
    children?: React.ReactNode;
    isRejected?: boolean; // Para mostrar icono de X
    isFinalState?: boolean; // Para mostrar check en lugar de reloj cuando está activo
}

const TimelineItem: React.FC<TimelineItemProps> = ({
    stepNumber,
    title,
    description,
    status,
    timestamp,
    statusText,
    children,
    isRejected = false,
    isFinalState = false
}) => {
    // Determinar qué mostrar en el marker
    const renderMarkerContent = () => {
        if (isRejected) {
            return <X size={16} />;
        }
        if (status === 'completed') {
            return <Check size={16} />;
        }
        // Si es el estado final y está activo, mostrar check en lugar de reloj
        if (status === 'active' && isFinalState) {
            return <Check size={16} />;
        }
        if (status === 'active') {
            return <Hourglass size={16} />;
        }
        return stepNumber;
    };

    return (
        <div className={`timeline-item ${status}`}>
            <div className="timeline-marker-container">
                <div className={`timeline-marker ${status} ${isRejected ? 'rejected' : ''}`.trim()}>
                    {renderMarkerContent()}
                </div>
                <div className="timeline-line" />
            </div>
            <div className="timeline-content">
                <div className="timeline-header">
                    <h4 className="timeline-title">{title}</h4>
                    {status === 'active' && <span className="status-badge">Estado actual</span>}
                </div>
                {description && <p className="timeline-description">{description}</p>}
                {timestamp && <p className="timeline-timestamp">{timestamp}</p>}
                {statusText && <p className="timeline-status-text">{statusText}</p>}
                {children && <div className="timeline-actions">{children}</div>}
            </div>
        </div>
    );
};

export default TimelineItem;
