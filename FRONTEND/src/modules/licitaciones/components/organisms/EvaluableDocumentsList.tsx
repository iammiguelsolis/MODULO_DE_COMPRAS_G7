import React from 'react';
import type { DocumentEvaluation } from '../../lib/types';
import EvaluableDocumentItem from '../molecules/EvaluableDocumentItem';
import type { EvaluationStatus } from '../atoms/EvaluationStatusButtons';
import './EvaluableDocumentsList.css';

interface EvaluableDocumentsListProps {
    evaluations: Map<string, DocumentEvaluation>;
    onEvaluationChange: (documentId: string, status: EvaluationStatus) => void;
    disabled?: boolean;
}

const EvaluableDocumentsList: React.FC<EvaluableDocumentsListProps> = ({
    evaluations,
    onEvaluationChange,
    disabled = false
}) => {
    const documents = Array.from(evaluations.values());

    return (
        <div className={`evaluable-documents-list ${disabled ? 'disabled' : ''}`}>
            <h3 className="documents-title">Documentos Presentados</h3>

            {disabled && (
                <div className="documents-empty-state">
                    <p>Seleccione un proveedor para iniciar la evaluación</p>
                    <p className="empty-subtext">Podrá evaluar los documentos presentados y marcar los faltantes</p>
                </div>
            )}

            {!disabled && (
                <div className="documents-items-container">
                    {documents.length > 0 ? (
                        documents.map(doc => (
                            <EvaluableDocumentItem
                                key={doc.documentId}
                                documentName={doc.documentName}
                                fileSize={doc.fileSize}
                                status={doc.status}
                                onStatusChange={(status) => onEvaluationChange(doc.documentId, status)}
                                disabled={disabled}
                            // TODO: Pass URL to item if supported
                            />
                        ))
                    ) : (
                        <div className="documents-empty-state">
                            <p>No hay documentos registrados para este proveedor.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EvaluableDocumentsList;
