import React from 'react';
import { ClipboardCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../atoms/Button';
import './EvaluationModalHeader.css';

interface EvaluationModalHeaderProps {
    licitacionId: string;
    licitacionTitle: string;
    totalProviders: number;
    evaluatedProviders: number;
    approvedProviders: number;
    rejectedProviders: number;
    onClose: () => void;
    onFinish: () => void;
    canFinish?: boolean;
    evaluationType?: 'técnica' | 'económica';
}

const EvaluationModalHeader: React.FC<EvaluationModalHeaderProps> = ({
    licitacionId,
    licitacionTitle,
    totalProviders,
    evaluatedProviders,
    approvedProviders,
    rejectedProviders,
    onClose,
    onFinish,
    canFinish = false,
    evaluationType = 'técnica'
}) => {
    const evaluationTypeTitle = evaluationType === 'técnica' ? 'Evaluación Técnica' : 'Evaluación Económica';

    return (
        <div className="evaluation-modal-header">
            <div className="header-top-row">
                <div className="eval-header-main">
                    <div className="eval-header-icon">
                        <ClipboardCheck size={24} />
                    </div>
                    <div className="eval-header-text">
                        <h2>{evaluationTypeTitle} - {licitacionTitle}</h2>
                        <p className="eval-subtitle">ID: {licitacionId} | Comprador: Juan Pérez</p>
                    </div>
                </div>

                <div className="header-actions">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        className="header-back-btn"
                    >
                        <ArrowLeft size={16} />
                        Volver
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onFinish}
                        disabled={!canFinish}
                        className="header-finish-btn"
                    >
                        <CheckCircle size={16} />
                        Finalizar Evaluación
                    </Button>
                </div>
            </div>

            <div className="eval-header-stats">
                <div className="stat-item">
                    <span className="stat-label">TOTAL PROVEEDORES</span>
                    <span className="stat-value">{totalProviders}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">EVALUADOS</span>
                    <span className="stat-value">{evaluatedProviders}</span>
                </div>
                <div className="stat-item stat-approved">
                    <span className="stat-label">APROBADOS</span>
                    <span className="stat-value">{approvedProviders}</span>
                </div>
                <div className="stat-item stat-rejected">
                    <span className="stat-label">RECHAZADOS</span>
                    <span className="stat-value">{rejectedProviders}</span>
                </div>
            </div>
        </div>
    );
};

export default EvaluationModalHeader;
