import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, Download, Trophy } from 'lucide-react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { getContractTemplatePath, downloadFile } from '../../lib/documentTemplateUtils';
import './GenerateContractModal.css';

interface WinnerProvider {
    id: number;
    name: string;
    ruc: string;
    email: string;
}

interface GenerateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    winnerProvider?: WinnerProvider;
    onSaveContract?: (file: File) => void;
}

const GenerateContractModal: React.FC<GenerateContractModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    winnerProvider,
    onSaveContract
}) => {
    const [contractFile, setContractFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setContractFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setContractFile(e.dataTransfer.files[0]);
        }
    };

    const handleSave = () => {
        if (contractFile && onSaveContract) {
            onSaveContract(contractFile);
        }
    };



    const handleDownloadTemplate = () => {
        const contractPath = getContractTemplatePath();
        downloadFile(contractPath, 'Plantilla - Contrato Adjudicacion.docx');
    };

    if (!winnerProvider) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="generate-contract-modal">
                <div className="generate-contract-header">
                    <div className="contract-header-icon">
                        <FileText size={24} />
                    </div>
                    <div className="contract-header-text">
                        <h2>Generar Contrato de Adjudicación</h2>
                        <p className="contract-subtitle">ID: {licitacionId} - {licitacionTitle}</p>
                    </div>
                    <div style={{ flex: 1 }}></div>
                </div>

                <div className="generate-contract-body">
                    {/* Winner Provider Card */}
                    <div className="winner-card">
                        <div className="winner-card-header">
                            <Trophy size={18} />
                            Proveedor Ganador
                        </div>
                        <div className="winner-info-row">
                            <span className="winner-label">Proveedor:</span>
                            <span className="winner-value">{winnerProvider.name}</span>
                        </div>
                        <div className="winner-info-row">
                            <span className="winner-label">RUC:</span>
                            <span className="winner-value">{winnerProvider.ruc}</span>
                        </div>
                        <div className="winner-info-row">
                            <span className="winner-label">Email:</span>
                            <span className="winner-value">{winnerProvider.email}</span>
                        </div>
                    </div>

                    {/* Annex Documents */}
                    <div className="annex-docs-section">
                        <h4 className="annex-docs-title">Documentos Anexos al Contrato</h4>
                        <div className="annex-docs-grid">
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                RUC y Ficha RUC
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                DNI del Representante Legal
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Acta de Constitución
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Ficha Técnica del Producto
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Certificaciones de Calidad (ISO)
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Catálogos y Brochures
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Propuesta Económica
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Estados Financieros Auditados
                            </div>
                            <div className="annex-doc-item">
                                <CheckCircle size={16} className="annex-check" />
                                Carta de Fianza
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Download Template */}
                    <div className="contract-step">
                        <div className="step-header">
                            <div className="step-number">1</div>
                            <span className="step-title">Descargar Plantilla de Contrato</span>
                        </div>
                        <p className="step-description">
                            Descargue la plantilla de contrato pre-llenada con toda la información de la licitación,
                            proveedor ganador y detalles de adjudicación. Solo faltará agregar las firmas correspondientes.
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleDownloadTemplate}
                            className="download-template-btn"
                        >
                            <Download size={18} />
                            Descargar Plantilla de Contrato
                        </Button>
                    </div>

                    {/* Step 2: Upload Signed Contract */}
                    <div className="contract-step">
                        <div className="step-header">
                            <div className="step-number">2</div>
                            <span className="step-title">Subir Contrato Firmado</span>
                        </div>
                        <p className="step-description">
                            Una vez firmado el contrato por ambas partes, suba el documento final en formato Word (.docx) o PDF.
                        </p>

                        {!contractFile ? (
                            <div
                                className={`contract-upload-area ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('contract-file-input')?.click()}
                            >
                                <Upload size={32} className="upload-icon" />
                                <p className="upload-text">Haga clic para seleccionar el contrato firmado</p>
                                <p className="upload-hint">Formato aceptado: .doc, .docx, .pdf</p>
                                <input
                                    id="contract-file-input"
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept=".pdf,.doc,.docx"
                                />
                            </div>
                        ) : (
                            <div className="uploaded-file-preview">
                                <FileText size={16} />
                                <span className="file-name">{contractFile.name}</span>
                                <span className="file-size">{(contractFile.size / 1024).toFixed(2)} KB</span>
                            </div>
                        )}
                    </div>

                    {/* Alert */}
                    <Alert variant="warning">
                        Al grabar el contrato, se completará el proceso de adjudicación de la licitación.
                        Asegúrese de que el documento contenga todas las firmas necesarias antes de continuar.
                    </Alert>
                </div>

                <div className="generate-contract-footer">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!contractFile}
                    >
                        <CheckCircle size={18} />
                        Grabar contrato
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GenerateContractModal;
