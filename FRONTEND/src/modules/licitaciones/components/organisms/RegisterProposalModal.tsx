import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import NoteBox from '../atoms/NoteBox';
import Select from '../atoms/Select';
import Label from '../atoms/Label';
import './RegisterProposalModal.css';

interface Supplier {
    id: number;
    name: string;
    ruc: string;
    email: string;
}

interface RegisterProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    suppliers: Supplier[];
    onRegisterProposal?: (supplierId: number, files: File[]) => void;
}

const RegisterProposalModal: React.FC<RegisterProposalModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    suppliers,
    onRegisterProposal
}) => {
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
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
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleRegister = () => {
        if (selectedSupplierId && onRegisterProposal) {
            onRegisterProposal(selectedSupplierId, files);
            // Reset form instead of closing to allow registering another proposal
            setSelectedSupplierId(null);
            setFiles([]);
        }
    };

    const handleClose = () => {
        setSelectedSupplierId(null);
        setFiles([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="register-proposal-modal">
                <div className="register-proposal-header">
                    <div className="register-header-icon">
                        <FileText size={24} />
                    </div>
                    <div className="register-header-text">
                        <h2>Registrar Propuestas</h2>
                        <p className="register-subtitle">ID: {licitacionId} - {licitacionTitle}</p>
                    </div>
                </div>

                <div className="register-proposal-body">
                    <div className="form-field">
                        <Label>
                            Seleccionar Proveedor <span className="required">*</span>
                        </Label>
                        <Select
                            value={selectedSupplierId || ''}
                            onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                        >
                            <option value="">-- Seleccione un proveedor --</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name} - RUC: {supplier.ruc}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {!selectedSupplier && (
                        <div className="empty-state">
                            <FileText size={48} className="empty-icon" />
                            <p>Seleccione un proveedor para comenzar</p>
                        </div>
                    )}

                    {selectedSupplier && (
                        <>
                            <div className="supplier-info-card">
                                <div className="supplier-info-row">
                                    <span className="info-label">Proveedor:</span>
                                    <span className="info-value">{selectedSupplier.name}</span>
                                </div>
                                <div className="supplier-info-row">
                                    <span className="info-label">RUC:</span>
                                    <span className="info-value">{selectedSupplier.ruc}</span>
                                </div>
                                <div className="supplier-info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{selectedSupplier.email}</span>
                                </div>
                            </div>

                            <div className="documents-section">
                                <div className="documents-header">
                                    <Label>Documentos de la Propuesta</Label>
                                    <span className="file-count">{files.length} archivo(s)</span>
                                </div>

                                <div
                                    className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-input')?.click()}
                                >
                                    <Upload size={32} className="upload-icon" />
                                    <p className="upload-text">Haga clic para cargar archivos</p>
                                    <p className="upload-subtext">O arrastre y suelte los archivos aquí</p>
                                    <p className="upload-hint">PDF, Word, Excel, ZIP, imágenes; máx. 5MB por archivo</p>
                                    <input
                                        id="file-input"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="files-list">
                                        {files.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <FileText size={16} />
                                                <span>{file.name}</span>
                                                <span className="file-size">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                            <NoteBox>
                                <p>
                                    El comité Técnico evaluará la completitud y validez de todos los documentos cargados.
                                    Asegúrese de incluir la documentación enviada por el proveedor.
                                </p>
                            </NoteBox>
                        </>
                    )}
                </div>

                <div className="register-proposal-footer">
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleRegister}
                        disabled={!selectedSupplierId || files.length === 0}
                    >
                        Registrar Propuesta
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RegisterProposalModal;
