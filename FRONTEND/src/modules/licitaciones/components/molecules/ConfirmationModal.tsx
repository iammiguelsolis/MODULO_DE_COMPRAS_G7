import React from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    children: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'danger';
    icon?: React.ReactNode;
    customFooter?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmVariant = 'primary',
    icon,
    customFooter
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="confirmation-modal">
                <div className="confirmation-modal-header">
                    {icon && <div className="confirmation-modal-icon">{icon}</div>}
                    <h2 className="confirmation-modal-title">{title}</h2>
                </div>

                <div className="confirmation-modal-body">
                    {children}
                </div>

                <div className="confirmation-modal-footer">
                    {customFooter || (
                        <>
                            <Button variant="secondary" onClick={onClose}>
                                {cancelText}
                            </Button>
                            {onConfirm && (
                                <Button variant={confirmVariant} onClick={onConfirm}>
                                    {confirmText}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
