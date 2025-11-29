import React from 'react';
import { CheckCircle } from 'lucide-react';
import ConfirmationModal from '../molecules/ConfirmationModal';
import NoteBox from '../atoms/NoteBox';
import Alert from '../atoms/Alert';
import LicitacionInfoCard from '../molecules/LicitacionInfoCard';
import './FinalizeProposalsModal.css';

interface FinalizeProposalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacionId: string;
    buyerName: string;
    supervisorName: string;
    estimatedAmount: number;
    maxBudget: number;
    suppliersWithProposals: string[];
    suppliersWithoutDocs: number;
    onConfirm?: () => void;
}

const FinalizeProposalsModal: React.FC<FinalizeProposalsModalProps> = ({
    isOpen,
    onClose,
    licitacionId,
    buyerName,
    supervisorName,
    estimatedAmount,
    maxBudget,
    suppliersWithProposals,
    suppliersWithoutDocs,
    onConfirm
}) => {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Finalizar Registro"
            confirmText="Confirmar"
            cancelText="Cancelar"
            confirmVariant="primary"
            icon={<CheckCircle size={24} className="finalize-icon" />}
        >
            <div className="finalize-proposals-body">
                <LicitacionInfoCard
                    id={licitacionId}
                    buyer={buyerName}
                    supervisor={supervisorName}
                    estimatedAmount={estimatedAmount}
                    maxBudget={maxBudget}
                />

                {suppliersWithProposals.length > 0 && (
                    <div className="suppliers-proposals-section">
                        <h4>Proveedores con propuestas:</h4>
                        <ul className="suppliers-proposals-list">
                            {suppliersWithProposals.map((supplier, index) => (
                                <li key={index}>{supplier}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {suppliersWithoutDocs > 0 && (
                    <Alert variant="warning">
                        <span>Hay {suppliersWithoutDocs} proveedores sin documentos registrados</span>
                    </Alert>
                )}

                <NoteBox>
                    <p>¿Confirme que se han registrado todas las propuestas? La licitación pasará al siguiente estado y ya no podrá modificar las propuestas</p>
                </NoteBox>
            </div>
        </ConfirmationModal>
    );
};

export default FinalizeProposalsModal;
