import React, { useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import WideModal from '../atoms/WideModal';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import EvaluationModalHeader from '../molecules/EvaluationModalHeader';
import ProviderSelectorCard from '../molecules/ProviderSelectorCard';
import EconomicCriteriaInfo from '../molecules/EconomicCriteriaInfo';
import ScoreInput from '../molecules/ScoreInput';
import EconomicDocumentsList from './EconomicDocumentsList';
import EconomicEvaluationResults from './EconomicEvaluationResults';
import type { EconomicEvaluation } from '../../lib/types';
import './EconomicEvaluationModal.css';

interface Supplier {
    id: number;
    name: string;
    ruc: string;
    email: string;
}

interface EconomicEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    presupuesto?: string;
    solicitudOrigen?: string;
    proveedoresTecnicamenteAprobados?: number;
    suppliers: Supplier[]; // Only technically approved suppliers
    onSaveEvaluation?: (evaluation: EconomicEvaluation) => void;
    onFinishEvaluation?: (results: { evaluations: EconomicEvaluation[]; winnerId?: number }) => void;
}

const EconomicEvaluationModal: React.FC<EconomicEvaluationModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    presupuesto,
    solicitudOrigen,
    proveedoresTecnicamenteAprobados,
    suppliers,
    onSaveEvaluation,
    onFinishEvaluation
}) => {
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [score, setScore] = useState<number | ''>('');
    const [justification, setJustification] = useState('');
    const [isRejected, setIsRejected] = useState(false);

    // Track evaluated providers
    const [evaluatedProvidersList, setEvaluatedProvidersList] = useState<EconomicEvaluation[]>([]);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

    // Validation
    const canSave = useMemo(() => {
        if (!selectedSupplierId) return false;

        // Justification is always required
        if (justification.trim().length === 0) return false;

        // If not rejected, score is required and must be valid
        if (!isRejected) {
            if (score === '' || score < 0 || score > 100) return false;
        }

        return true;
    }, [selectedSupplierId, score, justification, isRejected]);

    const handleSelectSupplier = (supplierId: number) => {
        setSelectedSupplierId(supplierId || null);
        // Reset form when changing supplier
        setScore('');
        setJustification('');
        setIsRejected(false);
    };

    const handleRejectedChange = (checked: boolean) => {
        setIsRejected(checked);
        // Clear score when marking as rejected
        if (checked) {
            setScore('');
        }
    };

    const handleSave = () => {
        if (!selectedSupplier) return;

        const evaluationStatus: 'approved' | 'rejected' = isRejected ? 'rejected' : 'approved';

        const evaluation: EconomicEvaluation = {
            providerId: selectedSupplier.id,
            providerName: selectedSupplier.name,
            providerRuc: selectedSupplier.ruc,
            score: !isRejected && score !== '' ? score : undefined,
            justification: justification,
            status: evaluationStatus,
            isRejected: isRejected
        };

        if (onSaveEvaluation) {
            onSaveEvaluation(evaluation);
        } else {
            console.log('[Mock] Guardar evaluación económica:', evaluation);
        }

        // Add to evaluated providers list
        setEvaluatedProvidersList(prev => [...prev, evaluation]);

        // Update counters
        if (evaluationStatus === 'approved') {
            setApprovedCount(prev => prev + 1);
        } else {
            setRejectedCount(prev => prev + 1);
        }

        // Reset form for next provider
        setSelectedSupplierId(null);
        setScore('');
        setJustification('');
        setIsRejected(false);
    };

    const handleFinish = () => {
        // Determine winner (highest score among approved)
        const approvedProviders = evaluatedProvidersList.filter(p => p.status === 'approved');

        let winnerId: number | undefined = undefined;
        if (approvedProviders.length > 0) {
            // Sort by score (descending) and take first (highest score)
            // In case of tie, first evaluated wins (as per user requirement)
            const sortedApproved = [...approvedProviders].sort((a, b) => {
                const scoreA = a.score || 0;
                const scoreB = b.score || 0;
                return scoreB - scoreA;
            });
            winnerId = sortedApproved[0].providerId;
        }

        const results = {
            evaluations: evaluatedProvidersList,
            winnerId
        };

        if (onFinishEvaluation) {
            onFinishEvaluation(results);
        }
        handleClose();
    };

    const handleClose = () => {
        setSelectedSupplierId(null);
        setScore('');
        setJustification('');
        setIsRejected(false);
        setEvaluatedProvidersList([]);
        setApprovedCount(0);
        setRejectedCount(0);
        onClose();
    };

    return (
        <WideModal isOpen={isOpen} onClose={handleClose} width="wide" showCloseButton={false}>
            <div className="economic-evaluation-modal">
                <EvaluationModalHeader
                    licitacionId={licitacionId}
                    licitacionTitle={licitacionTitle}
                    totalProviders={suppliers.length}
                    evaluatedProviders={evaluatedProvidersList.length}
                    approvedProviders={approvedCount}
                    rejectedProviders={rejectedCount}
                    onClose={handleClose}
                    onFinish={handleFinish}
                    canFinish={evaluatedProvidersList.length === suppliers.length}
                    evaluationType="económica"
                />

                <div className="evaluation-modal-body">
                    <div className="evaluation-left-column">
                        <div className="general-info-card">
                            <h3 className="info-title">Información General</h3>
                            {solicitudOrigen && (
                                <div className="info-row">
                                    <span className="info-label">Solicitud de Origen</span>
                                    <span className="info-value">{solicitudOrigen}</span>
                                </div>
                            )}
                            {presupuesto && (
                                <div className="info-row">
                                    <span className="info-label">Presupuesto Máximo</span>
                                    <span className="info-value">{presupuesto}</span>
                                </div>
                            )}
                            {proveedoresTecnicamenteAprobados !== undefined && (
                                <div className="info-row">
                                    <span className="info-label">Proveedores técnicamente aprobados</span>
                                    <span className="info-value">{proveedoresTecnicamenteAprobados}</span>
                                </div>
                            )}
                        </div>

                        <EconomicCriteriaInfo />

                        {evaluatedProvidersList.length > 0 && (
                            <EconomicEvaluationResults evaluatedProviders={evaluatedProvidersList} />
                        )}
                    </div>

                    <div className="evaluation-right-column">
                        <ProviderSelectorCard
                            suppliers={suppliers}
                            selectedSupplierId={selectedSupplierId}
                            onSelectSupplier={handleSelectSupplier}
                        />

                        <EconomicDocumentsList disabled={!selectedSupplierId} />

                        {selectedSupplierId && (
                            <>
                                <div className="rejection-checkbox-container">
                                    <label className="rejection-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={isRejected}
                                            onChange={(e) => handleRejectedChange(e.target.checked)}
                                            className="rejection-checkbox"
                                        />
                                        <span className="rejection-checkbox-text">
                                            Marcar como Propuesta Rechazada
                                        </span>
                                    </label>
                                    <p className="rejection-checkbox-hint">
                                        Active esta opción si la propuesta no cumple los requisitos mínimos
                                    </p>
                                </div>

                                {isRejected && (
                                    <Alert variant="error">
                                        <strong>Propuesta Rechazada</strong>
                                        <br />
                                        Este proveedor será excluido del proceso. Proporcione una justificación detallada.
                                    </Alert>
                                )}

                                {!isRejected && (
                                    <ScoreInput
                                        value={score}
                                        onChange={setScore}
                                    />
                                )}

                                <div className="justification-container">
                                    <label className="justification-label">
                                        Justificación de la Evaluación <span className="required">*</span>
                                    </label>
                                    <textarea
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        placeholder="Explique la evaluación y puntuación asignada (ej: mejor precio, condiciones favorables, garantías adecuadas)..."
                                        rows={4}
                                        className="justification-textarea"
                                    />
                                    <p className="justification-hint">
                                        * La justificación es obligatoria para todas las evaluaciones
                                    </p>
                                </div>

                                <div className="evaluation-save-container">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={!canSave}
                                        className="save-evaluation-btn"
                                    >
                                        <Save size={18} />
                                        Guardar Evaluación
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </WideModal>
    );
};

export default EconomicEvaluationModal;
