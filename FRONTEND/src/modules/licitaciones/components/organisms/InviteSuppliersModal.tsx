import React, { useState } from 'react';
import { Mail, Download } from 'lucide-react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Textarea from '../atoms/Textarea';
import Checkbox from '../atoms/Checkbox';
import './InviteSuppliersModal.css';

interface Supplier {
    id: number;
    name: string;
    ruc: string;
    email: string;
    category: string;
}

interface InviteSuppliersModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    licitacionTitle: string;
    estimatedAmount: number;
    maxBudget: number;
    availableSuppliers: Supplier[];
    requiredDocuments: string[];
    onSuppliersInvited?: (suppliers: string[]) => void;
}

const InviteSuppliersModal: React.FC<InviteSuppliersModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    licitacionTitle,
    maxBudget,
    availableSuppliers,
    requiredDocuments,
    onSuppliersInvited
}) => {
    const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

    const handleToggleSupplier = (supplierId: number) => {
        setSelectedSuppliers(prev => {
            if (prev.includes(supplierId)) {
                return prev.filter(id => id !== supplierId);
            } else {
                return [...prev, supplierId];
            }
        });
    };

    const getSelectedEmails = () => {
        return availableSuppliers
            .filter(s => selectedSuppliers.includes(s.id))
            .map(s => s.email)
            .join(', ');
    };

    const getSelectedSupplierNames = () => {
        return availableSuppliers
            .filter(s => selectedSuppliers.includes(s.id))
            .map(s => s.name);
    };

    const emailSubject = `Invitación a Licitación - ${licitacionTitle}`;

    const emailBody = `Estimado Proveedor,

Le invitamos a participar en el proceso de licitación para la ${licitacionTitle}

Detalles de la licitación:
• Licitación N°: ${licitacionId}
• Descripción: Laptop G10, Cantidad: 15
• Presupuesto Máximo: S/ ${maxBudget.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
• Fecha límite para recibir propuestas: 10 Nov 2025

Adjunto encontrará las plantillas de la documentación requerida para su propuesta.

Por favor, envíe su propuesta completa antes de la fecha límite indicada.

Atentamente,
Juan Pérez - Módulo de Compras`;


    const handleOpenGmail = () => {
        const emails = getSelectedEmails();
        const mailto = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emails)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailto, '_blank');

        // Guardar proveedores invitados
        if (onSuppliersInvited) {
            onSuppliersInvited(getSelectedSupplierNames());
        }
    };

    const handleClose = () => {
        setSelectedSuppliers([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="invite-suppliers-modal">
                <div className="invite-suppliers-header">
                    <div className="invite-header-icon">
                        <Mail size={24} />
                    </div>
                    <div className="invite-header-text">
                        <h2>Invitar Proveedores</h2>
                        <p className="invite-subtitle">ID: {licitacionId} - {licitacionTitle}</p>
                    </div>
                </div>

                <div className="invite-suppliers-body">
                    {/* Sección de selección de proveedores */}
                    <div className="suppliers-section">
                        <div className="section-header">
                            <h3>Seleccionar Proveedores</h3>
                            <span className="selection-count">{selectedSuppliers.length} seleccionados</span>
                        </div>

                        <div className="suppliers-list">
                            {availableSuppliers.map(supplier => (
                                <div
                                    key={supplier.id}
                                    className={`supplier-item ${selectedSuppliers.includes(supplier.id) ? 'selected' : ''}`}
                                    onClick={() => handleToggleSupplier(supplier.id)}
                                >
                                    <Checkbox
                                        checked={selectedSuppliers.includes(supplier.id)}
                                        onChange={() => handleToggleSupplier(supplier.id)}
                                        className="supplier-checkbox"
                                    />
                                    <div className="supplier-info">
                                        <div className="supplier-name">{supplier.name}</div>
                                        <div className="supplier-details">
                                            RUC: {supplier.ruc} | {supplier.email}
                                        </div>
                                    </div>
                                    <Badge variant="info">{supplier.category}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección de email - solo visible cuando hay seleccionados */}
                    {selectedSuppliers.length > 0 && (
                        <>
                            <div className="email-section">
                                <div className="form-field">
                                    <Label>Correos Electrónicos</Label>
                                    <Input
                                        type="text"
                                        value={getSelectedEmails()}
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <Label>Asunto</Label>
                                    <Input
                                        type="text"
                                        value={emailSubject}
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <Label>Descripción del correo</Label>
                                    <Textarea
                                        value={emailBody}
                                        readOnly
                                        className="readonly-textarea"
                                        rows={10}
                                    />
                                </div>

                                <div className="documents-section">
                                    <div className="section-header">
                                        <h4>Documentos Requeridos (Plantillas)</h4>
                                    </div>
                                    <ul className="documents-list">
                                        {requiredDocuments.map((doc, index) => (
                                            <li key={index}>{doc}</li>
                                        ))}
                                    </ul>
                                    <Button variant="primary" size="sm" className="download-button">
                                        <Download size={16} />
                                        Descargar Plantillas (ZIP)
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Mensaje cuando no hay seleccionados */}
                    {selectedSuppliers.length === 0 && (
                        <div className="empty-selection">
                            <p>Seleccione al menos un proveedor para continuar</p>
                        </div>
                    )}
                </div>

                <div className="invite-suppliers-footer">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    {selectedSuppliers.length > 0 && (
                        <Button variant="primary" onClick={handleOpenGmail}>
                            <Mail size={16} />
                            Abrir Gmail
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default InviteSuppliersModal;
