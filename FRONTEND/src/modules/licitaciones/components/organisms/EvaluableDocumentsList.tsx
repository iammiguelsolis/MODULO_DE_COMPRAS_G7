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
    // Hardcoded documents - flat list without categories
    const documents = [
        { id: 'doc-legal-1', name: 'RUC_y_Ficha_RUC.pdf', size: '1.2 MB' },
        { id: 'doc-legal-2', name: 'DNI_Representante_Legal.pdf', size: '850 KB' },
        { id: 'doc-legal-3', name: 'Acta_Constitucion.pdf', size: '2.1 MB' },
        { id: 'doc-tech-1', name: 'Ficha_Tecnica_Laptops_HP.pdf', size: '2.5 MB' },
        { id: 'doc-tech-2', name: 'Certificacion_ISO_9001.pdf', size: '1.8 MB' },
        { id: 'doc-tech-3', name: 'Catalogo_Productos_2025.pdf', size: '5.2 MB' },
        { id: 'doc-fin-1', name: 'Propuesta_Economica.xlsx', size: '850 KB' },
        { id: 'doc-fin-2', name: 'Estados_Financieros.pdf', size: '3.1 MB' },
        { id: 'doc-fin-3', name: 'Carta_Fianza.pdf', size: '1.2 MB' }
    ];

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
                    {documents.map(doc => {
                        const evaluation = evaluations.get(doc.id);
                        return (
                            <EvaluableDocumentItem
                                key={doc.id}
                                documentName={doc.name}
                                fileSize={doc.size}
                                status={evaluation?.status || null}
                                onStatusChange={(status) => onEvaluationChange(doc.id, status)}
                                disabled={disabled}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EvaluableDocumentsList;
