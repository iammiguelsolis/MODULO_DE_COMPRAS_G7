import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import ConfirmationModal from '../molecules/ConfirmationModal';
import Alert from '../atoms/Alert';
import Textarea from '../atoms/Textarea';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import LicitacionInfoCard from '../molecules/LicitacionInfoCard';
import './CancellationModal.css';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    licitacionId: string;
    buyer: string;
    estimatedAmount: number;
    maxBudget: number;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    licitacionId,
    buyer,
    estimatedAmount,
    maxBudget
}) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!rejectionReason.trim()) {
            setError('El motivo de la cancelación es obligatorio');
            return;
        }
        onConfirm();
        setRejectionReason('');
        setError('');
    };

    const handleClose = () => {
        setRejectionReason('');
        setError('');
        onClose();
    };

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Cancelar solicitud"
            icon={<XCircle size={24} className="rejection-icon" />}
            customFooter={
                <>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="secondary" onClick={handleConfirm}>
                        <XCircle size={16} />
                        Confirmar Cancelación
                    </Button>
                </>
            }
        >
            <div className="rejection-modal-content">
                <LicitacionInfoCard
                    id={licitacionId}
                    buyer={buyer}
                    estimatedAmount={estimatedAmount}
                    maxBudget={maxBudget}
                />

                <Alert variant="warning">
                    <p className="alert-title">La cancelación anulará la licitación completamente</p>
                </Alert>

                <div className="rejection-reason-field">
                    <Label htmlFor="rejection-reason">
                        Motivo de la cancelación <span className="required-mark">*</span>
                    </Label>
                    <Textarea
                        id="rejection-reason"
                        value={rejectionReason}
                        onChange={(e) => {
                            setRejectionReason(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Describa detalladamente el motivo de la cancelación..."
                        rows={4}
                    />
                    {error && <span className="error-text">{error}</span>}
                </div>
            </div>
        </ConfirmationModal>
    );
};

export default CancellationModal;
