import React from 'react';
import { CheckCircle } from 'lucide-react';
import ConfirmationModal from '../molecules/ConfirmationModal';
import NoteBox from '../atoms/NoteBox';
import LicitacionInfoCard from '../molecules/LicitacionInfoCard';
import './ApprovalModal.css';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    licitacionId: string;
    buyer: string;
    estimatedAmount: number;
    maxBudget: number;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    licitacionId,
    buyer,
    estimatedAmount,
    maxBudget
}) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Aprobar Solicitud"
            confirmText="Confirmar"
            cancelText="Cancelar"
            confirmVariant="primary"
            icon={<CheckCircle size={24} className="approval-icon" />}
        >
            <div className="approval-modal-content">
                <LicitacionInfoCard
                    id={licitacionId}
                    buyer={buyer}
                    estimatedAmount={estimatedAmount}
                    maxBudget={maxBudget}
                />

                <NoteBox>
                    <p>¿Está seguro que desea aprobar la solicitud? Una vez aprobada, se enviará al siguiente nivel del flujo de licitación.</p>
                </NoteBox>
            </div>
        </ConfirmationModal>
    );
};

export default ApprovalModal;
