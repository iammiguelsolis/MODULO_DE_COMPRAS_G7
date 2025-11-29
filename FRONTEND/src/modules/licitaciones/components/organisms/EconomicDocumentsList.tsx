import React from 'react';
import EvaluableDocumentItem from '../molecules/EvaluableDocumentItem';
import './EconomicDocumentsList.css';

interface EconomicDocumentsListProps {
    disabled?: boolean;
}

const EconomicDocumentsList: React.FC<EconomicDocumentsListProps> = ({ disabled = false }) => {
    // Hardcoded economic documents (only 3)
    const documents = [
        { id: 'doc-econ-1', name: 'Propuesta_Economica.xlsx', size: '850 KB' },
        { id: 'doc-econ-2', name: 'Estados_Financieros_Auditados.pdf', size: '3.1 MB' },
        { id: 'doc-econ-3', name: 'Carta_Fianza.pdf', size: '1.2 MB' }
    ];

    const handleView = (docName: string) => {
        console.log(`[Mock] Ver documento: ${docName}`);
    };

    const handleDownload = (docName: string) => {
        console.log(`[Mock] Descargar documento: ${docName}`);
    };

    return (
        <div className={`economic-documents-list ${disabled ? 'disabled' : ''}`}>
            <h3 className="econ-docs-title">Documentos Económicos Presentados</h3>

            {disabled && (
                <div className="econ-docs-empty-state">
                    <p>Seleccione un proveedor para iniciar la evaluación económica</p>
                    <p className="empty-subtext">Evalúe la propuesta económica y asigne una puntuación</p>
                </div>
            )}

            {!disabled && (
                <div className="econ-docs-items-container">
                    {documents.map(doc => (
                        <EvaluableDocumentItem
                            key={doc.id}
                            documentName={doc.name}
                            fileSize={doc.size}
                            status={null}
                            onStatusChange={() => { }} // No-op, economic docs don't have status evaluation
                            onView={() => handleView(doc.name)}
                            onDownload={() => handleDownload(doc.name)}
                            disabled={disabled}
                            showEvaluationButtons={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EconomicDocumentsList;
