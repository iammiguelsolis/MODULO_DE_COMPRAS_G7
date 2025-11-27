import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import IconButton from '../atoms/IconButton';
import EvaluationStatusButtons, { EvaluationStatus } from '../atoms/EvaluationStatusButtons';
import './EvaluableDocumentItem.css';

interface EvaluableDocumentItemProps {
    documentName: string;
    fileSize: string;
    status: EvaluationStatus;
    onStatusChange: (status: EvaluationStatus) => void;
    onView?: () => void;
    onDownload?: () => void;
    disabled?: boolean;
    showEvaluationButtons?: boolean;
}

const EvaluableDocumentItem: React.FC<EvaluableDocumentItemProps> = ({
    documentName,
    fileSize,
    status,
    onStatusChange,
    onView,
    onDownload,
    disabled = false,
    showEvaluationButtons = true
}) => {
    const handleView = () => {
        if (onView) {
            onView();
        } else {
            console.log(`[Mock] Ver documento: ${documentName}`);
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            console.log(`[Mock] Descargar documento: ${documentName}`);
        }
    };

    return (
        <div className={`evaluable-document-item ${disabled ? 'disabled' : ''}`}>
            <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <div className="doc-details">
                    <span className="doc-name">{documentName}</span>
                    <span className="doc-size">{fileSize}</span>
                </div>
            </div>

            <div className="doc-actions">
                <div className="doc-action-buttons">
                    <IconButton
                        icon={<Eye size={16} />}
                        ariaLabel="Ver documento"
                        onClick={handleView}
                        disabled={disabled}
                        className="action-btn-view"
                    />
                    <IconButton
                        icon={<Download size={16} />}
                        ariaLabel="Descargar documento"
                        onClick={handleDownload}
                        disabled={disabled}
                        className="action-btn-download"
                    />
                </div>

                {showEvaluationButtons && (
                    <EvaluationStatusButtons
                        value={status}
                        onChange={onStatusChange}
                        disabled={disabled}
                    />
                )}
            </div>
        </div>
    );
};

export default EvaluableDocumentItem;
