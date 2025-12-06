import React, { useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import WideModal from '../atoms/WideModal';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import EvaluationModalHeader from '../molecules/EvaluationModalHeader';
import ProviderSelectorCard from '../molecules/ProviderSelectorCard';
import RejectionJustification from '../molecules/RejectionJustification';
import EvaluableDocumentsList from './EvaluableDocumentsList';
import EvaluatedProvidersList from './EvaluatedProvidersList';
import type { DocumentEvaluation, PropuestaResponseDTO, DocumentoRequeridoDTO } from '../../lib/types';
import type { EvaluationStatus } from '../atoms/EvaluationStatusButtons';
import './TechnicalEvaluationModal.css';

interface TechnicalEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    suppliers: PropuestaResponseDTO[];
    requiredDocuments?: DocumentoRequeridoDTO[];
    onSaveEvaluation?: (evaluation: any) => void;
    onFinishEvaluation?: () => void;
}

const TechnicalEvaluationModal: React.FC<TechnicalEvaluationModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    suppliers,
    requiredDocuments = [],
    onSaveEvaluation,
    onFinishEvaluation
}) => {
    const [selectedPropuestaId, setSelectedPropuestaId] = useState<number | null>(null);
    const [documentEvaluations, setDocumentEvaluations] = useState<Map<number, { validado: boolean; observaciones: string }>>(new Map());
    const [rejectionJustification, setRejectionJustification] = useState('');

    // Track evaluated providers (local state for UI feedback)
    const [evaluatedProvidersList, setEvaluatedProvidersList] = useState<{ id: number; name: string; status: 'approved' | 'rejected' }[]>([]);

    // Derived state
    const selectedPropuesta = useMemo(() =>
        suppliers.find(p => p.id_propuesta === selectedPropuestaId),
        [suppliers, selectedPropuestaId]);

    const totalDocuments = selectedPropuesta?.documentos.length || 0;

    // Calculate document stats for current provider
    const currentDocStats = useMemo(() => {
        const evaluated = documentEvaluations.size;
        return { evaluated };
    }, [documentEvaluations]);

    // Calculate evaluation status
    const hasIncorrectDocs = useMemo(() => {
        return Array.from(documentEvaluations.values())
            .some(doc => !doc.validado);
    }, [documentEvaluations]);

    const allDocsCorrect = useMemo(() => {
        const evals = Array.from(documentEvaluations.values());
        return evals.length === totalDocuments && totalDocuments > 0 &&
            evals.every(doc => doc.validado);
    }, [documentEvaluations, totalDocuments]);

    const shouldReject = useMemo(() => {
        return hasIncorrectDocs;
    }, [hasIncorrectDocs]);

    const canSave = useMemo(() => {
        if (!selectedPropuestaId) return false;

        // All documents must be evaluated
        if (currentDocStats.evaluated !== totalDocuments) return false;

        // If rejecting, need justification (either technical rejection or document rejection)
        if (shouldReject) {
            return rejectionJustification.trim().length > 0;
        }

        return allDocsCorrect;
    }, [selectedPropuestaId, shouldReject, allDocsCorrect, rejectionJustification, currentDocStats.evaluated, totalDocuments]);

    const handleEvaluationChange = (documentId: string, status: EvaluationStatus) => {
        // documentId comes as string from EvaluableDocumentsList, convert to number
        const id = Number(documentId);
        setDocumentEvaluations(prev => {
            const newMap = new Map(prev);
            newMap.set(id, {
                validado: status === 'correct',
                observaciones: status === 'incorrect' ? 'Documento rechazado' : ''
            });
            return newMap;
        });
    };

    const handleSelectSupplier = (propuestaId: number) => {
        // Note: ProviderSelectorCard sends the ID. Here we assume it sends propuestaId because we map it below.
        setSelectedPropuestaId(propuestaId);
        setDocumentEvaluations(new Map());
        setRejectionJustification('');
    };

    const handleSave = () => {
        if (!selectedPropuesta) return;

        const evaluationStatus = allDocsCorrect ? 'approved' : 'rejected';

        // Prepare payload for backend
        const payload = {
            providerId: selectedPropuesta.proveedor.id, // For UI tracking
            propuestaId: selectedPropuesta.id_propuesta,
            aprobada_tecnicamente: evaluationStatus === 'approved',
            motivo_rechazo_tecnico: evaluationStatus === 'rejected' ? rejectionJustification : undefined,
            documentos: Array.from(documentEvaluations.entries()).map(([id, evalData]) => ({
                id_documento: id,
                validado: evalData.validado,
                observaciones: evalData.observaciones
            }))
        };

        if (onSaveEvaluation) {
            onSaveEvaluation(payload);
        }

        // Add to evaluated providers list for UI
        setEvaluatedProvidersList(prev => [
            ...prev,
            {
                id: selectedPropuesta.id_propuesta, // Use propuesta ID for tracking
                name: selectedPropuesta.proveedor.razon_social,
                status: evaluationStatus
            }
        ]);

        // Reset form
        setSelectedPropuestaId(null);
        setDocumentEvaluations(new Map());
        setRejectionJustification('');
    };

    const handleFinish = () => {
        if (onFinishEvaluation) {
            onFinishEvaluation();
        }
        onClose();
    };

    // Map proposals to format expected by ProviderSelectorCard
    const providerSelectorData = suppliers.map(p => ({
        id: p.id_propuesta, // We use propuesta ID as the key selector
        name: p.proveedor.razon_social,
        ruc: p.proveedor.ruc,
        email: p.proveedor.email
    }));

    // Map documents to format expected by EvaluableDocumentsList
    const evaluableDocuments = useMemo(() => {
        if (!selectedPropuesta) return new Map<string, DocumentEvaluation>();

        const map = new Map<string, DocumentEvaluation>();
        selectedPropuesta.documentos.forEach(doc => {
            const evalState = documentEvaluations.get(doc.id_documento);
            map.set(String(doc.id_documento), {
                documentId: String(doc.id_documento),
                documentName: doc.nombre,
                fileSize: 'Unknown', // DTO doesn't have size
                status: evalState ? (evalState.validado ? 'correct' : 'incorrect') : null,
                url: doc.url_archivo // Pass URL if component supports it
            });
        });
        return map;
    }, [selectedPropuesta, documentEvaluations]);

    return (
        <WideModal isOpen={isOpen} onClose={onClose} width="wide" showCloseButton={false}>
            <div className="technical-evaluation-modal">
                <EvaluationModalHeader
                    licitacionId={licitacionId}
                    licitacionTitle={licitacionTitle}
                    totalProviders={suppliers.length}
                    evaluatedProviders={evaluatedProvidersList.length}
                    approvedProviders={evaluatedProvidersList.filter(p => p.status === 'approved').length}
                    rejectedProviders={evaluatedProvidersList.filter(p => p.status === 'rejected').length}
                    onClose={onClose}
                    onFinish={handleFinish}
                    canFinish={evaluatedProvidersList.length === suppliers.length}
                />

                <div className="evaluation-modal-body">
                    <div className="evaluation-left-column">
                        <div className="required-docs-reference">
                            <h4>Documentos Requeridos</h4>
                            {Object.entries(
                                requiredDocuments.reduce((acc, doc) => {
                                    if (!acc[doc.tipo]) acc[doc.tipo] = [];
                                    acc[doc.tipo].push(doc);
                                    return acc;
                                }, {} as Record<string, DocumentoRequeridoDTO[]>)
                            ).map(([type, docs]) => (
                                <div key={type} className="mb-3">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-1">
                                        {type === 'LEGAL' ? 'Legales' :
                                            type === 'TECNICO' ? 'Técnicos' :
                                                type === 'ECONOMICO' ? 'Financieros' : type}
                                    </h5>
                                    <ul className="pl-2">
                                        {docs.map((doc) => (
                                            <li key={doc.id_requerido} className="text-xs text-gray-600 mb-1">
                                                • {doc.nombre} {doc.obligatorio && <span className="text-red-500" title="Obligatorio">*</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <EvaluatedProvidersList evaluatedProviders={evaluatedProvidersList} />
                    </div>

                    <div className="evaluation-right-column">
                        <ProviderSelectorCard
                            suppliers={providerSelectorData}
                            selectedSupplierId={selectedPropuestaId}
                            onSelectSupplier={handleSelectSupplier}
                            totalFiles={totalDocuments}
                            evaluatedFiles={currentDocStats.evaluated}
                        />

                        <EvaluableDocumentsList
                            evaluations={evaluableDocuments}
                            onEvaluationChange={handleEvaluationChange}
                            disabled={!selectedPropuestaId}
                        />

                        {allDocsCorrect && (
                            <Alert variant="success">
                                <strong>Resultado: PROVEEDOR APROBADO</strong>
                                <br />
                                Este proveedor pasará a la evaluación económica.
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
