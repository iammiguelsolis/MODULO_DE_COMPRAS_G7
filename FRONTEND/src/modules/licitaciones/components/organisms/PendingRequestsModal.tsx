import React, { useState } from 'react';
import WideModal from '../atoms/WideModal';
import PendingRequestCard from '../molecules/PendingRequestCard';
import ApprovalModal from './ApprovalModal';
import CancellationModal from './CancellationModal';
import type { SolicitudPendiente } from '../../lib/types';
import { PackageOpen } from 'lucide-react';
import './PendingRequestsModal.css';

interface PendingRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
    solicitudes: SolicitudPendiente[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const PendingRequestsModal: React.FC<PendingRequestsModalProps> = ({
    isOpen,
    onClose,
    solicitudes,
    onApprove,
    onReject
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

    const handleApproveClick = (id: string) => {
        setSelectedId(id);
        setConfirmAction('approve');
    };

    const handleRejectClick = (id: string) => {
        setSelectedId(id);
        setConfirmAction('reject');
    };

    const handleConfirm = () => {
        if (selectedId && confirmAction) {
            if (confirmAction === 'approve') {
                onApprove(selectedId);
            } else {
                onReject(selectedId);
            }
            handleCloseConfirm();
        }
    };

    const handleCloseConfirm = () => {
        setSelectedId(null);
        setConfirmAction(null);
    };

    const selectedSolicitud = solicitudes.find(s => s.id === selectedId);

    return (
        <>
            <WideModal
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="pending-requests-container">
                    <div className="modal-header-styled">
                        <h2 className="header-title">Solicitudes de Licitación Pendientes ({solicitudes.length})</h2>
                    </div>
                    {solicitudes.length > 0 ? (
                        <div className="requests-list">
                            {solicitudes.map(solicitud => (
                                <PendingRequestCard
                                    key={solicitud.id}
                                    solicitud={solicitud}
                                    onApprove={handleApproveClick}
                                    onReject={handleRejectClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <PackageOpen size={48} className="empty-icon" />
                            <h3>No hay solicitudes pendientes</h3>
                            <p>Todas las solicitudes han sido procesadas.</p>
                        </div>
                    )}
                </div>
            </WideModal>

            {/* Modal de confirmación de aprobación */}
            {selectedSolicitud && confirmAction === 'approve' && (
                <ApprovalModal
                    isOpen={true}
                    onClose={handleCloseConfirm}
                    onConfirm={handleConfirm}
                    licitacionId={selectedSolicitud.id}
                    buyer={selectedSolicitud.solicitante}
                    estimatedAmount={selectedSolicitud.presupuestoMaximo} // Usamos presupuesto como estimado
                    maxBudget={selectedSolicitud.presupuestoMaximo}
                />
            )}

            {/* Modal de confirmación de rechazo */}
            {selectedSolicitud && confirmAction === 'reject' && (
                <CancellationModal
                    isOpen={true}
                    onClose={handleCloseConfirm}
                    onConfirm={handleConfirm}
                    licitacionId={selectedSolicitud.id}
                    buyer={selectedSolicitud.solicitante}
                    estimatedAmount={selectedSolicitud.presupuestoMaximo}
                    maxBudget={selectedSolicitud.presupuestoMaximo}
                />
            )}
        </>
    );
};

export default PendingRequestsModal;
