import React from 'react';
import { Scale, Wrench, PiggyBank } from 'lucide-react';
import './DocumentsChecklist.css';

interface DocumentsChecklistProps {
    disabled?: boolean;
    checkedDocuments: Set<string>;
    onToggleDocument: (documentId: string) => void;
    showCounter?: boolean;
}

const DocumentsChecklist: React.FC<DocumentsChecklistProps> = ({
    disabled = false,
    checkedDocuments,
    onToggleDocument,
    showCounter = false
}) => {
    // Hardcoded documents matching the evaluation list
    const documentCategories = [
        {
            icon: <Scale size={18} />,
            title: 'Documentos Legales',
            documents: [
                { id: 'doc-legal-1', name: 'RUC y Ficha RUC' },
                { id: 'doc-legal-2', name: 'DNI del Representante Legal' },
                { id: 'doc-legal-3', name: 'Acta de Constitución' }
            ]
        },
        {
            icon: <Wrench size={18} />,
            title: 'Documentos Técnicos',
            documents: [
                { id: 'doc-tech-1', name: 'Ficha Técnica del Producto' },
                { id: 'doc-tech-2', name: 'Certificaciones de Calidad (ISO)' },
                { id: 'doc-tech-3', name: 'Catálogos y Brochures' }
            ]
        },
        {
            icon: <PiggyBank size={18} />,
            title: 'Documentos Financieros',
            documents: [
                { id: 'doc-fin-1', name: 'Propuesta Económica' },
                { id: 'doc-fin-2', name: 'Estados Financieros Auditados' },
                { id: 'doc-fin-3', name: 'Carta de Fianza' }
            ]
        }
    ];

    return (
        <div className={`documents-checklist ${disabled ? 'disabled' : ''}`}>
            <h3 className="checklist-title">Documentos Requeridos</h3>

            <div className="checklist-content">
                {documentCategories.map((category, index) => (
                    <div key={index} className="checklist-category">
                        <div className="category-header">
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-title">{category.title}</span>
                        </div>
                        <div className="category-items">
                            {category.documents.map(doc => (
                                <label key={doc.id} className="checklist-item">
                                    <input
                                        type="checkbox"
                                        checked={checkedDocuments.has(doc.id)}
                                        onChange={() => onToggleDocument(doc.id)}
                                        disabled={disabled}
                                    />
                                    <span className="item-name">{doc.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showCounter && checkedDocuments.size > 0 && (
                <div className="missing-docs-counter">
                    {checkedDocuments.size} documento(s) faltante(s) marcado(s)
                </div>
            )}

            {disabled && (
                <div className="checklist-footer-message">
                    Seleccione un proveedor para marcar documentos faltantes
                </div>
            )}
        </div>
    );
};

export default DocumentsChecklist;
