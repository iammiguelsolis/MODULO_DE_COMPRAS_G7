import React, { useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import WideModal from '../atoms/WideModal';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import EvaluationModalHeader from '../molecules/EvaluationModalHeader';
import ProviderSelectorCard from '../molecules/ProviderSelectorCard';
import RejectionJustification from '../molecules/RejectionJustification';
import DocumentsChecklist from '../molecules/DocumentsChecklist';
import EvaluableDocumentsList from './EvaluableDocumentsList';
import EvaluatedProvidersList from './EvaluatedProvidersList';
import type { DocumentEvaluation, ProviderEvaluation } from '../../lib/types';
import type { EvaluationStatus } from '../atoms/EvaluationStatusButtons';
import './TechnicalEvaluationModal.css';

interface Supplier {
    id: number;
    name: string;
    ruc: string;
    email: string;
}

interface EvaluatedProvider {
    id: number;
    name: string;
    status: 'approved' | 'rejected';
}

interface TechnicalEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    presupuesto?: string;
    solicitudOrigen?: string;
    fechaLimite?: string;
    comprador?: string;
    suppliers: Supplier[];
    onSaveEvaluation?: (evaluation: ProviderEvaluation) => void;
    onFinishEvaluation?: () => void;
}

const TechnicalEvaluationModal: React.FC<TechnicalEvaluationModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    suppliers,
    onSaveEvaluation,
    onFinishEvaluation
}) => {
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [documentEvaluations, setDocumentEvaluations] = useState<Map<string, DocumentEvaluation>>(new Map());
    const [missingDocuments, setMissingDocuments] = useState<Set<string>>(new Set());
    const [rejectionJustification, setRejectionJustification] = useState('');

    // Track evaluated providers
    const [evaluatedProvidersList, setEvaluatedProvidersList] = useState<EvaluatedProvider[]>([]);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    // Total documents count (hardcoded: 3 legal + 3 technical + 3 financial = 9)
    const totalDocuments = 9;

    // Calculate document stats for current provider
    const currentDocStats = useMemo(() => {
        const evaluations = Array.from(documentEvaluations.values());
        const evaluated = evaluations.filter(e => e.status !== null).length;
        return { evaluated };
    }, [documentEvaluations]);

    // Calculate evaluation status
    const hasIncorrectDocs = useMemo(() => {
        return Array.from(documentEvaluations.values())
            .some(doc => doc.status === 'incorrect');
    }, [documentEvaluations]);

    const allDocsCorrect = useMemo(() => {
        const evals = Array.from(documentEvaluations.values());
        return evals.length === totalDocuments &&
            evals.every(doc => doc.status === 'correct');
    }, [documentEvaluations]);

    const hasMissingDocs = useMemo(() => {
        return missingDocuments.size > 0;
    }, [missingDocuments]);

    const shouldReject = useMemo(() => {
        return hasIncorrectDocs || hasMissingDocs;
    }, [hasIncorrectDocs, hasMissingDocs]);

    const canSave = useMemo(() => {
        if (!selectedSupplierId) return false;

        // All documents must be evaluated
        if (currentDocStats.evaluated !== totalDocuments) return false;

        // If rejecting (incorrect docs or missing docs), need justification
        if (shouldReject) {
            return rejectionJustification.trim().length > 0;
        }

        return allDocsCorrect;
    }, [selectedSupplierId, shouldReject, allDocsCorrect, rejectionJustification, currentDocStats.evaluated, totalDocuments]);

    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

    const handleEvaluationChange = (documentId: string, status: EvaluationStatus) => {
        setDocumentEvaluations(prev => {
            const newMap = new Map(prev);
            const existingEval = prev.get(documentId);

            if (existingEval) {
                newMap.set(documentId, { ...existingEval, status });
            } else {
                newMap.set(documentId, {
                    documentId,
                    documentName: documentId,
                    fileSize: '0 KB',
                    status
                });
            }

            return newMap;
        });
    };

    const handleToggleMissingDocument = (documentId: string) => {
        setMissingDocuments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(documentId)) {
                newSet.delete(documentId);
            } else {
                newSet.add(documentId);
            }
            return newSet;
        });
    };

    const handleSelectSupplier = (supplierId: number) => {
        setSelectedSupplierId(supplierId);
        // Reset evaluations when changing supplier
        setDocumentEvaluations(new Map());
        setMissingDocuments(new Set());
        setRejectionJustification('');
    };

    const handleSave = () => {
        if (!selectedSupplier) return;

        const evaluationStatus: 'approved' | 'rejected' =
            (allDocsCorrect && !hasMissingDocs) ? 'approved' : 'rejected';

        const evaluation: ProviderEvaluation = {
            providerId: selectedSupplier.id,
            providerName: selectedSupplier.name,
            providerRuc: selectedSupplier.ruc,
            documentsEvaluation: Array.from(documentEvaluations.values()),
            status: evaluationStatus,
            rejectionReason: shouldReject ? rejectionJustification : undefined,
            evaluatedCount: currentDocStats.evaluated,
            approvedCount: 0,
            rejectedCount: 0
        };

        if (onSaveEvaluation) {
            onSaveEvaluation(evaluation);
        } else {
            console.log('[Mock] Guardar evaluación:', evaluation);
        }

        // Add to evaluated providers list
        setEvaluatedProvidersList(prev => [
            ...prev,
            {
                id: selectedSupplier.id,
                name: selectedSupplier.name,
                status: evaluationStatus
            }
        ]);

        // Update counters
        if (evaluationStatus === 'approved') {
            setApprovedCount(prev => prev + 1);
        } else {
            setRejectedCount(prev => prev + 1);
        }

        // Reset form for next provider
        setSelectedSupplierId(null);
        setDocumentEvaluations(new Map());
        setMissingDocuments(new Set());
        setRejectionJustification('');
    };

    const handleFinish = () => {
        if (onFinishEvaluation) {
            onFinishEvaluation();
        }
        handleClose();
    };

    const handleClose = () => {
        setSelectedSupplierId(null);
        setDocumentEvaluations(new Map());
        setMissingDocuments(new Set());
        setRejectionJustification('');
        setEvaluatedProvidersList([]);
        setApprovedCount(0);
        setRejectedCount(0);
        onClose();
    };

    return (
        <WideModal isOpen={isOpen} onClose={handleClose} width="wide" showCloseButton={false}>
            <div className="technical-evaluation-modal">
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
                />

                <div className="evaluation-modal-body">
                    <div className="evaluation-left-column">
                        <DocumentsChecklist
                            checkedDocuments={missingDocuments}
                            onToggleDocument={handleToggleMissingDocument}
                            disabled={!selectedSupplierId}
                            showCounter={true}
                        />

                        <EvaluatedProvidersList evaluatedProviders={evaluatedProvidersList} />
                    </div>

                    <div className="evaluation-right-column">
                        <ProviderSelectorCard
                            suppliers={suppliers}
                            selectedSupplierId={selectedSupplierId}
                            onSelectSupplier={handleSelectSupplier}
                            totalFiles={totalDocuments}
                            evaluatedFiles={currentDocStats.evaluated}
                        />

                        <EvaluableDocumentsList
                            evaluations={documentEvaluations}
                            onEvaluationChange={handleEvaluationChange}
                            disabled={!selectedSupplierId}
                        />

                        {allDocsCorrect && !hasMissingDocs && (
                            <Alert variant="success">
                                <strong>Resultado: PROVEEDOR APROBADO</strong>
                                <br />
                                Este proveedor pasará a la evaluación económica.
                            </Alert>
                        )}

                        {hasMissingDocs && (
                            <Alert variant="error">
                                <strong>Proveedor será RECHAZADO</strong>
                                <br />
                                • Faltan {missingDocuments.size} documento(s) requerido(s)
                            </Alert>
                        )}

                        {hasIncorrectDocs && (
                            <Alert variant="error">
                                <strong>Proveedor será RECHAZADO</strong>
                                <br />
                                • Tiene documentos marcados como incorrectos
                            </Alert>
                        )}

                        {shouldReject && currentDocStats.evaluated === totalDocuments && (
                            <>
                                <RejectionJustification
                                    value={rejectionJustification}
                                    onChange={setRejectionJustification}
                                />

                                <Alert variant="warning">
                                    <strong>Resultado: PROVEEDOR RECHAZADO</strong>
                                    <br />
                                    Este proveedor no pasará a la evaluación económica.
                                </Alert>
                            </>
                        )}

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
                    </div>
                </div>
            </div>
        </WideModal>
    );
};

export default TechnicalEvaluationModal;
