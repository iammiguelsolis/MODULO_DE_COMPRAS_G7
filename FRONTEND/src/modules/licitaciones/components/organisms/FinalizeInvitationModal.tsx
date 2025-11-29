import React from 'react';
import { CheckCircle } from 'lucide-react';
import ConfirmationModal from '../molecules/ConfirmationModal';
import NoteBox from '../atoms/NoteBox';
import LicitacionInfoCard from '../molecules/LicitacionInfoCard';
import './FinalizeInvitationModal.css';

interface FinalizeInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    licitacionId: string;
    buyer: string;
    supervisor: string;
    estimatedAmount: number;
    maxBudget: number;
    invitedSuppliers: string[];
}

const FinalizeInvitationModal: React.FC<FinalizeInvitationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    licitacionId,
    buyer,
    supervisor,
    estimatedAmount,
    maxBudget,
    invitedSuppliers
}) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Finalizar Invitación"
            confirmText="Confirmar"
            cancelText="Cancelar"
            confirmVariant="primary"
            icon={<CheckCircle size={24} className="finalize-icon" />}
        >
            <div className="finalize-invitation-content">
                <LicitacionInfoCard
                    id={licitacionId}
                    buyer={buyer}
                    supervisor={supervisor}
                    estimatedAmount={estimatedAmount}
                    maxBudget={maxBudget}
                />

                {invitedSuppliers.length > 0 && (
                    <div className="invited-suppliers-section">
                        <h4>Proveedores invitados:</h4>
                        <ul className="suppliers-invited-list">
                            {invitedSuppliers.map((supplier, index) => (
                                <li key={index}>{supplier}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <NoteBox>
                    <p>¿Confirma que ha enviado todas las invitaciones a los proveedores seleccionados? La licitación pasará al siguiente estado y ya no podrá modificar las invitaciones</p>
                </NoteBox>
            </div>
        </ConfirmationModal>
    );
};

export default FinalizeInvitationModal;
