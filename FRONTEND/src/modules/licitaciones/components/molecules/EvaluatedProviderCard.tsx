import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './EvaluatedProviderCard.css';

interface EvaluatedProviderCardProps {
    providerName: string;
    status: 'approved' | 'rejected';
    score?: number;
}

const EvaluatedProviderCard: React.FC<EvaluatedProviderCardProps> = ({ providerName, status, score }) => {
    return (
        <div className={`evaluated-provider-card ${status}`}>
            <div className="provider-icon">
                {status === 'approved' ? (
                    <CheckCircle size={20} />
                ) : (
                    <XCircle size={20} />
                )}
            </div>
            <div className="provider-info">
                <span className="provider-name">{providerName}</span>
                <span className="provider-status">
                    {status === 'approved' ? 'APROBADO' : 'RECHAZADO'}
                    {status === 'approved' && score !== undefined && (
                        <span className="provider-score">Puntuación: {score} / 100</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default EvaluatedProviderCard;
