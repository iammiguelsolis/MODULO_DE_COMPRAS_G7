import React from 'react';
import { Send, FileText } from 'lucide-react';
import ConfirmationModal from '../molecules/ConfirmationModal';
import NoteBox from '../atoms/NoteBox';
import LicitacionInfoCard from '../molecules/LicitacionInfoCard';
import './SendToPurchaseOrderModal.css';

interface SendToPurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    licitacionId: string;
    buyer: string;
    supervisor: string;
    estimatedAmount: number;
    maxBudget: number;
    providerName: string;
    contractFileName?: string;
}

const SendToPurchaseOrderModal: React.FC<SendToPurchaseOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    licitacionId,
    buyer,
    supervisor,
    estimatedAmount,
    maxBudget,
    providerName,
    contractFileName = "Contrato_Adjudicacion_2025.pdf"
}) => {
    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Enviar a Orden de Compra"
            confirmText="Confirmar"
            cancelText="Cancelar"
            confirmVariant="primary"
            icon={<Send size={24} className="send-icon" />}
        >
            <div className="send-to-purchase-order-content">
                <LicitacionInfoCard
                    id={licitacionId}
                    buyer={buyer}
                    supervisor={supervisor}
                    estimatedAmount={estimatedAmount}
                    maxBudget={maxBudget}
                />

                {/* Winning Provider Section */}
                <div className="winning-provider-section">
                    <h4>Proveedor adjudicado:</h4>
                    <ul className="winning-provider-list">
                        <li>{providerName}</li>
                    </ul>
                </div>

                {/* Contract File Section */}
                <div className="contract-file-section">
                    <h4>Contrato Adjunto:</h4>
                    <div className="uploaded-file-preview">
                        <FileText size={16} />
                        <span className="file-name">{contractFileName}</span>
                        <span className="file-size">2.4 MB</span>
                    </div>
                </div>

                <NoteBox>
                    <p>¿Confirma el envió a Orden de Compra?</p>
                    <p>La licitación pasará junto con el contrato de adjudicación al siguiente apartado, finalizando todo el proceso.</p>
                </NoteBox>
            </div>
        </ConfirmationModal>
    );
};

export default SendToPurchaseOrderModal;
