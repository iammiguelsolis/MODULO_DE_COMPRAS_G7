import { useState } from 'react';
import PageHeader from '../molecules/PageHeader';
import Button from '../atoms/Button';
import LicitacionTimeline from '../organisms/LicitacionTimeline';
import LicitacionGeneralInfo from '../organisms/LicitacionGeneralInfo';
import LicitacionItemsTable from '../organisms/LicitacionItemsTable';
import LicitacionProposals from '../organisms/LicitacionProposals';
import LicitacionRequiredDocs from '../organisms/LicitacionRequiredDocs';
import ApprovalModal from '../organisms/ApprovalModal';
import CancellationModal from '../organisms/CancellationModal';
import InviteSuppliersModal from '../organisms/InviteSuppliersModal';
import FinalizeInvitationModal from '../organisms/FinalizeInvitationModal';
import RegisterProposalModal from '../organisms/RegisterProposalModal';
import FinalizeProposalsModal from '../organisms/FinalizeProposalsModal';
import SendToEvaluationModal from '../organisms/SendToEvaluationModal';
import TechnicalEvaluationModal from '../organisms/TechnicalEvaluationModal';
import EconomicEvaluationModal from '../organisms/EconomicEvaluationModal';
import GenerateContractModal from '../organisms/GenerateContractModal';
import SendToPurchaseOrderModal from '../organisms/SendToPurchaseOrderModal';
import type { LicitacionStatus, Item, DocumentCategory, PropuestaResponseDTO, DocumentoRequeridoDTO, ProveedorDTO } from '../../lib/types';
import './LicitacionDetailTemplate.css';

interface LicitacionDetailTemplateProps {
    id: number;
    nombre: string;
    createdDate: string;
    buyer: string;
    supervisor: string;
    currentStatus: string;
    timestamps: {
        creacion: string;
        aprobacion?: string;
        invitacion?: string;
        cierre_invitacion?: string;
        inicio_evaluacion?: string;
        fin_evaluacion?: string;
        adjudicacion?: string;
        contrato?: string;
    };
    estimatedAmount: number;
    presupuestoMaximo: number;
    proveedoresCount?: number;
    propuestasRegistradas?: number;
    propuestasAprobadasTecnicamente?: number;
    propuestasAprobadasEconomicamente?: number;
    fechaLimite?: string;
    solicitudId?: number; // ID de la solicitud de origen

    onInvitarProveedores: (proveedores: number[]) => void;
    onFinalizarInvitacion: () => void;
    onRegistrarPropuesta: (proveedorId: number, files: File[]) => void;
    onFinalizarRegistro: () => void;
    onEnviarEvaluacion: () => void;

    onGuardarEvaluacionTecnica: (evaluation: any) => void;
    onFinalizarEvaluacionTecnica: () => void;

    onGuardarEvaluacionEconomica: (evaluation: any) => void;
    onAdjudicar: () => void;

    onGenerarContrato: () => void;
    onGuardarContrato: (file: File) => void;

    onEnviarOrdenCompra: () => void;
    onDownloadContract?: () => void;

    isCancelledNoEconomicApprovals?: boolean;
    onApprove?: () => void;
    onReject?: () => void;

    propuestas?: PropuestaResponseDTO[];
    documentosRequeridos?: DocumentoRequeridoDTO[];
    items?: Item[];
    proveedoresDisponibles?: ProveedorDTO[];
    invitedProviders?: ProveedorDTO[];
}

const LicitacionDetailTemplate: React.FC<LicitacionDetailTemplateProps> = ({
    id,
    nombre,
    buyer,
    supervisor,
    currentStatus,
    timestamps,
    estimatedAmount,
    presupuestoMaximo,
    fechaLimite,
    solicitudId,
    proveedoresCount,
    propuestasRegistradas,
    propuestasAprobadasTecnicamente,
    propuestasAprobadasEconomicamente,
    onInvitarProveedores,
    onFinalizarInvitacion,
    onRegistrarPropuesta,
    onFinalizarRegistro,
    onEnviarEvaluacion,
    onGuardarEvaluacionTecnica,
    onFinalizarEvaluacionTecnica,
    onGuardarEvaluacionEconomica,
    onAdjudicar,
    onGenerarContrato,
    onGuardarContrato,
    onEnviarOrdenCompra,
    onDownloadContract,
    isCancelledNoEconomicApprovals,
    onApprove,
    onReject,
    propuestas = [],
    documentosRequeridos = [],
    items = [],
    proveedoresDisponibles = [],
    invitedProviders = []
}) => {
    // Modal states
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showCancellationModal, setShowCancellationModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showFinalizeInviteModal, setShowFinalizeInviteModal] = useState(false);
    const [showRegisterProposalModal, setShowRegisterProposalModal] = useState(false);
    const [showFinalizeProposalsModal, setShowFinalizeProposalsModal] = useState(false);
    const [showSendToEvaluationModal, setShowSendToEvaluationModal] = useState(false);
    const [showTechnicalEvaluationModal, setShowTechnicalEvaluationModal] = useState(false);
    const [showEconomicEvaluationModal, setShowEconomicEvaluationModal] = useState(false);
    const [showGenerateContractModal, setShowGenerateContractModal] = useState(false);
    const [showSendToPurchaseOrderModal, setShowSendToPurchaseOrderModal] = useState(false);

    const displayItems = items;

    const timelineTimestamps: Partial<Record<LicitacionStatus, string>> = {
        PENDIENTE: timestamps.creacion,
        NUEVA: timestamps.aprobacion,
        EN_INVITACION: timestamps.invitacion,
        CON_PROPUESTAS: timestamps.cierre_invitacion,
        EVALUACION_TECNICA: timestamps.inicio_evaluacion,
        EVALUACION_ECONOMIA: timestamps.fin_evaluacion,
        ADJUDICADA: timestamps.adjudicacion,
        CON_CONTRATO: timestamps.contrato,
        FINALIZADA: timestamps.contrato,
        CANCELADA: undefined
    };

    const handleApproveClick = () => {
        setShowApprovalModal(true);
    };

    const handleCancelClick = () => {
        setShowCancellationModal(true);
    };

    const handleApprovalConfirm = () => {
        setShowApprovalModal(false);
        if (onApprove) onApprove();
    };

    const handleCancellationConfirm = () => {
        setShowCancellationModal(false);
        if (onReject) onReject();
    };

    const handleInviteSuppliers = () => {
        setShowInviteModal(true);
    };

    const handleFinalizarInvitacionClick = () => {
        setShowFinalizeInviteModal(true);
    };

    const handleConfirmFinalizeInvitation = () => {
        setShowFinalizeInviteModal(false);
        onFinalizarInvitacion();
    };

    const handleRegistrarPropuesta = () => {
        setShowRegisterProposalModal(true);
    };

    const handleRegisterProposalConfirm = (supplierId: number, files: File[]) => {
        onRegistrarPropuesta(supplierId, files);
    };

    const handleFinalizarRegistroClick = () => {
        setShowFinalizeProposalsModal(true);
    };

    const handleConfirmFinalizeProposals = () => {
        setShowFinalizeProposalsModal(false);
        onFinalizarRegistro();
    };

    const handleSendToEvaluation = () => {
        setShowSendToEvaluationModal(true);
    };

    const handleConfirmSendToEvaluation = () => {
        setShowSendToEvaluationModal(false);
        onEnviarEvaluacion();
    };

    const handleIniciarEvaluacionTecnica = () => {
        setShowTechnicalEvaluationModal(true);
    };

    const handleSaveEvaluation = (evaluation: any) => {
        onGuardarEvaluacionTecnica(evaluation);
    };

    const handleFinishTechnicalEvaluation = () => {
        setShowTechnicalEvaluationModal(false);
        onFinalizarEvaluacionTecnica();
    };

    const handleIniciarEvaluacionEconomica = () => {
        setShowEconomicEvaluationModal(true);
    };

    const handleSaveEconomicEvaluation = (evaluation: any) => {
        onGuardarEvaluacionEconomica(evaluation);
    };

    const handleFinishEconomicEvaluation = () => {
        setShowEconomicEvaluationModal(false);
        onAdjudicar();
    };

    const handleGenerarContrato = () => {
        setShowGenerateContractModal(true);
    };

    const handleSaveContract = (file: File) => {
        setShowGenerateContractModal(false);
        onGuardarContrato(file);
    };

    const handleSendToPurchaseOrderClick = () => {
        setShowSendToPurchaseOrderModal(true);
    };

    const handleSendToPurchaseOrderConfirm = () => {
        setShowSendToPurchaseOrderModal(false);
        onEnviarOrdenCompra();
    };

    const docsByType = documentosRequeridos.reduce((acc, doc) => {
        if (!acc[doc.tipo]) {
            acc[doc.tipo] = [];
        }
        acc[doc.tipo].push(doc.nombre);
        return acc;
    }, {} as Record<string, string[]>);

    const displayDocs: DocumentCategory[] = Object.entries(docsByType).map(([type, docs]) => ({
        title: type === 'LEGAL' ? 'Documentación Legal' :
            type === 'TECNICO' ? 'Propuesta Técnica' :
                type === 'ECONOMICO' ? 'Documentación Financiera' : type,
        documents: docs,
    }));

    return (
        <div className="licitacion-detail-template">
            <PageHeader
                title={`Licitación #${id} - ${nombre}`}
                description="Detalle y gestión del proceso de licitación"
                action={
                    (currentStatus === 'BORRADOR' || currentStatus === 'PENDIENTE') ? (
                        <div className="header-actions">
                            <Button variant="danger" onClick={handleCancelClick}>
                                Rechazar Solicitud
                            </Button>
                            <Button variant="primary" onClick={handleApproveClick}>
                                Aprobar Solicitud
                            </Button>
                        </div>
                    ) : undefined
                }
            />

            <div className="licitacion-detail-layout">
                <div className="licitacion-detail-left-col">
                    <LicitacionTimeline
                        currentStatus={currentStatus as LicitacionStatus}
                        timestamps={timelineTimestamps}
                        proveedoresCount={proveedoresCount}
                        propuestasRegistradas={propuestasRegistradas}
                        propuestasAprobadasTecnicamente={propuestasAprobadasTecnicamente}
                        propuestasAprobadasEconomicamente={propuestasAprobadasEconomicamente}
                        onInvitarProveedores={handleInviteSuppliers}
                        onFinalizarInvitacion={handleFinalizarInvitacionClick}
                        onRegistrarPropuesta={handleRegistrarPropuesta}
                        onFinalizarRegistro={handleFinalizarRegistroClick}
                        onEnviarEvaluacion={handleSendToEvaluation}
                        onIniciarEvaluacionTecnica={handleIniciarEvaluacionTecnica}
                        onIniciarEvaluacionEconomica={handleIniciarEvaluacionEconomica}
                        onGenerarContrato={handleGenerarContrato}
                        onEnviarOrdenCompra={handleSendToPurchaseOrderClick}
                        onDownloadContract={onDownloadContract}
                        isCancelledNoEconomicApprovals={isCancelledNoEconomicApprovals}
                    />
                </div>

                <div className="licitacion-detail-right-col">
                    <LicitacionGeneralInfo
                        presupuestoMaximo={`S/. ${presupuestoMaximo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                        solicitudOrigen={solicitudId ? `#${solicitudId}` : 'N/A'}
                        fechaLimite={fechaLimite ? new Date(fechaLimite).toLocaleDateString('es-PE') : 'No especificada'}
                        comprador={buyer}
                    />

                    <LicitacionItemsTable items={displayItems} />

                    <LicitacionRequiredDocs documentCategories={displayDocs} />

                    {(currentStatus === 'NUEVA' ||
                        currentStatus === 'EN_INVITACION' ||
                        currentStatus === 'CON_PROPUESTAS' ||
                        currentStatus === 'EVALUACION_TECNICA' ||
                        currentStatus === 'EVALUACION_ECONOMIA' ||
                        currentStatus === 'ADJUDICADA' ||
                        currentStatus === 'CON_CONTRATO' ||
                        currentStatus === 'FINALIZADA') && (
                            <LicitacionProposals
                                proposals={propuestas?.map(p => ({
                                    id: p.proveedor.id,
                                    supplierName: p.proveedor.razon_social,
                                    ruc: p.proveedor.ruc,
                                    technicalStatus: p.estado_tecnico === 'APROBADO' ? 'Approved' : p.estado_tecnico === 'RECHAZADO' ? 'Rejected' : 'Pending',
                                    economicStatus: p.estado_economico === 'APROBADO' ? 'Approved' : p.estado_economico === 'RECHAZADO' ? 'Rejected' : 'Pending',
                                    isWinner: p.es_ganadora,
                                    score: p.puntuacion_economica
                                })) || []}
                            />
                        )}
                </div>
            </div>

            <ApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onConfirm={handleApprovalConfirm}
                licitacionId={String(id)}
                buyer={buyer}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
            />

            <CancellationModal
                isOpen={showCancellationModal}
                onClose={() => setShowCancellationModal(false)}
                onConfirm={handleCancellationConfirm}
                licitacionId={String(id)}
                buyer={buyer}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
            />

            <InviteSuppliersModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onInvitarProveedores={onInvitarProveedores}
                licitacionId={String(id)}
                licitacionTitle={nombre}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                fechaLimite={fechaLimite}
                items={displayItems}
                availableSuppliers={proveedoresDisponibles}
                requiredDocuments={documentosRequeridos}
            />

            <FinalizeInvitationModal
                isOpen={showFinalizeInviteModal}
                onClose={() => setShowFinalizeInviteModal(false)}
                onConfirm={handleConfirmFinalizeInvitation}
                licitacionId={String(id)}
                buyer={buyer}
                supervisor={supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                invitedSuppliers={[]}
            />

            <RegisterProposalModal
                isOpen={showRegisterProposalModal}
                onClose={() => setShowRegisterProposalModal(false)}
                licitacionId={String(id)}
                licitacionTitle={nombre}
                suppliers={invitedProviders.length > 0 ? invitedProviders : proveedoresDisponibles}
                onRegisterProposal={handleRegisterProposalConfirm}
            />

            <FinalizeProposalsModal
                isOpen={showFinalizeProposalsModal}
                onClose={() => setShowFinalizeProposalsModal(false)}
                onConfirm={handleConfirmFinalizeProposals}
                licitacionId={String(id)}
                buyerName={buyer}
                supervisorName={supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                suppliersWithProposals={[]}
                suppliersWithoutDocs={0}
            />

            <SendToEvaluationModal
                isOpen={showSendToEvaluationModal}
                onClose={() => setShowSendToEvaluationModal(false)}
                onConfirm={handleConfirmSendToEvaluation}
                licitacionId={String(id)}
                buyer={buyer}
                supervisor={supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                suppliersWithProposals={[]}
            />

            <TechnicalEvaluationModal
                isOpen={showTechnicalEvaluationModal}
                onClose={() => setShowTechnicalEvaluationModal(false)}
                licitacionId={String(id)}
                licitacionTitle={nombre}
                suppliers={propuestas}
                requiredDocuments={documentosRequeridos}
                onSaveEvaluation={handleSaveEvaluation}
                onFinishEvaluation={handleFinishTechnicalEvaluation}
            />

            <EconomicEvaluationModal
                isOpen={showEconomicEvaluationModal}
                onClose={() => setShowEconomicEvaluationModal(false)}
                licitacionId={String(id)}
                licitacionTitle={nombre}
                presupuesto={`S/. ${presupuestoMaximo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                suppliers={propuestas.filter(p => p.estado_tecnico === 'APROBADO')}
                onSaveEvaluation={handleSaveEconomicEvaluation}
                onFinishEvaluation={handleFinishEconomicEvaluation}
            />

            <GenerateContractModal
                isOpen={showGenerateContractModal}
                onClose={() => setShowGenerateContractModal(false)}
                licitacionId={String(id)}
                licitacionTitle={nombre}
                winnerProvider={propuestas.find(p => p.es_ganadora)?.proveedor}
                requiredDocuments={documentosRequeridos}
                onSaveContract={handleSaveContract}
                onDownloadTemplate={onGenerarContrato}
            />

            <SendToPurchaseOrderModal
                isOpen={showSendToPurchaseOrderModal}
                onClose={() => setShowSendToPurchaseOrderModal(false)}
                onConfirm={handleSendToPurchaseOrderConfirm}
                licitacionId={String(id)}
                buyer={buyer}
                supervisor={supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                providerName={propuestas.find(p => p.es_ganadora)?.proveedor.razon_social || ''}
            />
        </div>
    );
};

export default LicitacionDetailTemplate;
