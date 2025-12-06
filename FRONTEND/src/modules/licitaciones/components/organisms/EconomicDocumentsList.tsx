import React from 'react';
import EvaluableDocumentItem from '../molecules/EvaluableDocumentItem';
import type { DocumentoDTO } from '../../lib/types';
import './EconomicDocumentsList.css';

interface EconomicDocumentsListProps {
    disabled?: boolean;
    documents?: DocumentoDTO[];
}

const EconomicDocumentsList: React.FC<EconomicDocumentsListProps> = ({
    disabled = false,
    documents = []
}) => {
    // Mostrar todos los documentos presentados
    const economicDocs = documents;

    const handleView = (url: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleDownload = (url: string, fileName: string) => {
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
        }
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

            {!disabled && economicDocs.length === 0 && (
                <div className="econ-docs-empty-state">
                    <p>No se encontraron documentos económicos</p>
                    <p className="empty-subtext">El proveedor no ha presentado documentos de tipo económico/financiero</p>
                </div>
            )}

            {!disabled && economicDocs.length > 0 && (
                <div className="econ-docs-items-container">
                    {economicDocs.map(doc => (
                        <EvaluableDocumentItem
                            key={doc.id_documento}
                            documentName={doc.nombre}
                            fileSize="Ver archivo"
                            status={null}
                            onStatusChange={() => { }}
                            onView={() => handleView(doc.url_archivo)}
                            onDownload={() => handleDownload(doc.url_archivo, doc.nombre)}
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
