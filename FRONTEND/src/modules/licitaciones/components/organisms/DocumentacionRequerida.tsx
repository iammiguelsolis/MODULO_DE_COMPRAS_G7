import React from 'react';
import { Scale, Wrench, PiggyBank } from 'lucide-react';
import DocumentSelector from '../molecules/DocumentSelector';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import './DocumentacionRequerida.css';
import {
    doc_legales,
    doc_tec,
    doc_finan,
    doc_finan_req
} from '../../lib/constants';

interface DocumentacionRequeridaProps {
    selectedDocs: Record<string, string[]>;
    onSelectedDocsChange: (newSelectedDocs: Record<string, string[]>) => void;
}

const DocumentacionRequerida: React.FC<DocumentacionRequeridaProps> = ({ selectedDocs, onSelectedDocsChange }) => {

    const handleSelectionChange = (category: string, selectedIds: string[]) => {
        onSelectedDocsChange({
            ...selectedDocs,
            [category]: selectedIds
        });
    };

    return (
        <Card>
            <CardHeader>
                <h2>Documentación Requerida</h2>
                <p>Seleccione los documentos que los proveedores deberán presentar obligatoriamente</p>
            </CardHeader>
            <CardBody className="documentation-body">
                <DocumentSelector
                    icon={<Scale size={24} />}
                    title="Documentos Legales"
                    description="Documentación jurídica y constitutiva de la empresa"
                    options={doc_legales}
                    selected={selectedDocs.legal || []}
                    onChange={(selected) => handleSelectionChange('legal', selected)}
                    emptyStateVariant="error"
                />
                <DocumentSelector
                    icon={<Wrench size={24} />}
                    title="Documentos Técnicos"
                    description="Especificaciones técnicas y certificaciones"
                    options={doc_tec}
                    selected={selectedDocs.technical || []}
                    onChange={(selected) => handleSelectionChange('technical', selected)}
                    emptyStateVariant="error"
                />
                <DocumentSelector
                    icon={<PiggyBank size={24} />}
                    title="Documentos Financieros"
                    description="Información económica y propuesta comercial"
                    options={doc_finan}
                    selected={selectedDocs.financial || []}
                    onChange={(selected) => handleSelectionChange('financial', selected)}
                    requiredIds={doc_finan_req}
                    emptyStateVariant="error"
                    dropUp={true}
                />
            </CardBody>
        </Card>
    );
};

export default DocumentacionRequerida;
