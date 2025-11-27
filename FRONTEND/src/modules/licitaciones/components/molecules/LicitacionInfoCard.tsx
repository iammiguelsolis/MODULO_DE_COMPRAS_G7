import React from 'react';
import './LicitacionInfoCard.css';

interface LicitacionInfoCardProps {
    id: string;
    buyer: string;
    supervisor?: string;
    estimatedAmount: number;
    maxBudget: number;
}

const LicitacionInfoCard: React.FC<LicitacionInfoCardProps> = ({
    id,
    buyer,
    supervisor,
    estimatedAmount,
    maxBudget
}) => {
    return (
        <div className="licitacion-info-card">
            <div className="info-item">
                <span className="info-label">ID:</span>
                <span className="info-value">{id}</span>
            </div>
            <div className="info-item">
                <span className="info-label">Comprador:</span>
                <span className="info-value">{buyer}</span>
            </div>
            {supervisor && (
                <div className="info-item">
                    <span className="info-label">Supervisor:</span>
                    <span className="info-value">{supervisor}</span>
                </div>
            )}
            <div className="info-item">
                <span className="info-label">Monto estimado:</span>
                <span className="info-value">
                    S/ {estimatedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="info-item">
                <span className="info-label">Presupuesto máximo:</span>
                <span className="info-value">
                    S/ {maxBudget.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
};

export default LicitacionInfoCard;
