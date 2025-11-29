import React, { useState } from 'react';
import { ArrowLeftFromLine } from 'lucide-react';
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
import type { Proposal } from '../molecules/ProposalCard';
import type { LicitacionStatus, EconomicEvaluation, Item, DocumentCategory } from '../../lib/types';
import { Scale, Wrench, PiggyBank } from 'lucide-react';
import './LicitacionDetailTemplate.css';

interface LicitacionDetailTemplateProps {
    id: string;
    nombre: string;
    createdDate: string;
    buyer: string;
    supervisor: string;
    currentStatus: LicitacionStatus;
    timestamps: Partial<Record<LicitacionStatus, string>>;
    estimatedAmount: number;
    presupuestoMaximo: number;
    proveedoresCount?: number;
    propuestasRegistradas?: number;
    propuestasAprobadasTecnicamente?: number;
    propuestasAprobadasEconomicamente?: number;
    onApprove: () => void;
    onReject: () => void;
    onFinalizarInvitacion?: () => void;
    onFinalizarRegistro?: () => void;
    onEnviarEvaluacion?: () => void;
    onIniciarEvaluacionTecnica?: () => void;
    onIniciarEvaluacionEconomica?: () => void;
    onGenerarContrato?: () => void;
    onEnviarOrdenCompra?: () => void;
    isCancelledNoEconomicApprovals?: boolean;
}

const LicitacionDetailTemplate: React.FC<LicitacionDetailTemplateProps> = ({
    id,
    nombre,
    createdDate,
    buyer,
    supervisor,
    currentStatus,
    timestamps,
    estimatedAmount,
    presupuestoMaximo,
    proveedoresCount: _proveedoresCount,
    propuestasRegistradas: _propuestasRegistradas,
    propuestasAprobadasTecnicamente,
    propuestasAprobadasEconomicamente,
    onApprove,
    onReject,
    onFinalizarInvitacion,
    onFinalizarRegistro,
    onEnviarEvaluacion,
    onIniciarEvaluacionTecnica,
    onIniciarEvaluacionEconomica,
    onGenerarContrato,
    onEnviarOrdenCompra,
    isCancelledNoEconomicApprovals = false
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

    // Approval/Rejection states
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [supervisorName, setSupervisorName] = useState(supervisor);

    // Supplier invitation states
    const [invitedSuppliers, setInvitedSuppliers] = useState<string[]>([]);

    // Proposal registration states
    const [registeredProposals, setRegisteredProposals] = useState<Proposal[]>([]);
    const [isCancelledNoProposals, setIsCancelledNoProposals] = useState(false);

    // Technical evaluation states
    const [technicalEvaluations, setTechnicalEvaluations] = useState<Map<number, 'approved' | 'rejected'>>(new Map());
    const [isCancelledNoApprovals, setIsCancelledNoApprovals] = useState(false);
    const [cancellationTimestamp, setCancellationTimestamp] = useState<string | undefined>(undefined);

    // Economic evaluation states
    const [showEconomicEvaluationModal, setShowEconomicEvaluationModal] = useState(false);
    const [economicCancellationTimestamp, setEconomicCancellationTimestamp] = useState<string | undefined>(undefined);

    const handleApproveClick = () => {
        setShowApprovalModal(true);
    };

    const handleCancelClick = () => {
        setShowCancellationModal(true);
    };

    const handleApprovalConfirm = () => {
        setIsApproved(true);
        setSupervisorName('Mario Altamirano');
        setShowApprovalModal(false);
        onApprove();
    };

    const handleCancellationConfirm = () => {
        setIsRejected(true);
        setSupervisorName('Mario Altamirano');
        setShowCancellationModal(false);
        onReject();
    };

    // Mock suppliers for registration (should come from API/Props in real app)
    const mockSuppliersForRegistration = [
        { id: 1, name: "Tech Solutions SAC", ruc: "20123456789", email: "ventas@techsolutions.com" },
        { id: 2, name: "Computadoras del Perú SA", ruc: "20987654321", email: "contacto@computadoras.pe" },
        { id: 3, name: "Digital Store EIRL", ruc: "20456789123", email: "info@digitalstore.com" },
        { id: 4, name: "TechMart Perú S.A.C.", ruc: "20789123456", email: "ventas@techmart.pe" },
        { id: 5, name: "Global Tech Solutions S.A.", ruc: "20321654987", email: "cotizaciones@globaltech.com.pe" }
    ];

    const handleRegistrarPropuesta = () => {
        setShowRegisterProposalModal(true);
    };

    const handleFinalizarRegistroClick = () => {
        setShowFinalizeProposalsModal(true);
    };

    const handleRegisterProposalConfirm = (supplierId: number, _files: File[]) => {
        const supplier = mockSuppliersForRegistration.find(s => s.id === supplierId);
        if (supplier) {
            const newProposal: Proposal = {
                id: supplier.id,
                supplierName: supplier.name,
                ruc: supplier.ruc,
                technicalStatus: 'Pending',
                economicStatus: 'Pending'
            };

            // Check if already registered to avoid duplicates
            if (!registeredProposals.find(p => p.id === supplierId)) {
                setRegisteredProposals(prev => [...prev, newProposal]);
            }
        }
    };

    const handleConfirmFinalizeProposals = () => {
        setShowFinalizeProposalsModal(false);
        if (registeredProposals.length === 0) {
            setIsCancelledNoProposals(true);
        } else {
            onFinalizarRegistro?.();
        }
    };

    const handleSendToEvaluation = () => {
        setShowSendToEvaluationModal(true);
    };

    const handleConfirmSendToEvaluation = () => {
        setShowSendToEvaluationModal(false);
        onEnviarEvaluacion?.();
    };

    const handleSaveEvaluation = (evaluation: any) => {
        // Update technical evaluations map
        setTechnicalEvaluations(prev => {
            const newMap = new Map(prev);
            newMap.set(evaluation.providerId, evaluation.status);
            return newMap;
        });

        // Update proposal status in registered proposals
        setRegisteredProposals(prev => prev.map(proposal => {
            if (proposal.id === evaluation.providerId) {
                return {
                    ...proposal,
                    technicalStatus: evaluation.status === 'approved' ? 'Approved' : 'Rejected'
                };
            }
            return proposal;
        }));
    };

    const handleFinishTechnicalEvaluation = () => {
        // Count how many providers were approved
        const approvedCount = Array.from(technicalEvaluations.values())
            .filter(status => status === 'approved').length;

        if (approvedCount === 0) {
            // No providers passed: cancel
            setIsCancelledNoApprovals(true);
            setCancellationTimestamp(new Date().toLocaleString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            setShowTechnicalEvaluationModal(false);
            // DO NOT call onIniciarEvaluacionTecnica
        } else {
            // At least one provider passed: continue to economic evaluation
            setShowTechnicalEvaluationModal(false);
            if (onIniciarEvaluacionTecnica) {
                onIniciarEvaluacionTecnica();
            }
        }
    };

    const handleIniciarEvaluacionTecnica = () => {
        setShowTechnicalEvaluationModal(true);
    };

    const handleIniciarEvaluacionEconomica = () => {
        setShowEconomicEvaluationModal(true);
    };

    const handleSaveEconomicEvaluation = (evaluation: EconomicEvaluation) => {
        // Update proposal economic status
        setRegisteredProposals(prev => prev.map(proposal => {
            if (proposal.id === evaluation.providerId) {
                return {
                    ...proposal,
                    economicStatus: evaluation.status === 'approved' ? 'Approved' : 'Rejected',
                    isWinner: false // Will be set in handleFinishEconomicEvaluation
                };
            }
            return proposal;
        }));
    };

    const handleFinishEconomicEvaluation = (results: {
        evaluations: EconomicEvaluation[];
        winnerId?: number
    }) => {
        console.log('[Template] Economic evaluations finished:', results);

        // Update proposals with winner
        if (results.winnerId) {
            setRegisteredProposals(prev => prev.map(proposal => ({
                ...proposal,
                isWinner: proposal.id === results.winnerId
            })));
        }

        const approvedCount = results.evaluations.filter(e => e.status === 'approved').length;

        if (approvedCount === 0) {
            // No providers passed: cancel
            setEconomicCancellationTimestamp(new Date().toLocaleString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        } else {
            // Call parent handler to update page-level state only if there are approved providers
            if (onIniciarEvaluacionEconomica) {
                onIniciarEvaluacionEconomica();
            }
        }

        setShowEconomicEvaluationModal(false);
    };

    const handleInviteSuppliers = () => {
        setShowInviteModal(true);
    };

    const handleFinalizarInvitacionClick = () => {
        setShowFinalizeInviteModal(true);
    };

    const handleConfirmFinalizeInvitation = () => {
        setShowFinalizeInviteModal(false);
        onFinalizarInvitacion?.();
    };

    const [showGenerateContractModal, setShowGenerateContractModal] = useState(false);
    const [showSendToPurchaseOrderModal, setShowSendToPurchaseOrderModal] = useState(false);

    const handleGenerarContrato = () => {
        setShowGenerateContractModal(true);
    };

    const handleSaveContract = (file: File) => {
        console.log('[Template] Contract saved:', file.name);
        setShowGenerateContractModal(false);
        if (onGenerarContrato) {
            onGenerarContrato();
        }
    };

    const handleSendToPurchaseOrderClick = () => {
        setShowSendToPurchaseOrderModal(true);
    };

    const handleSendToPurchaseOrderConfirm = () => {
        setShowSendToPurchaseOrderModal(false);
        if (onEnviarOrdenCompra) {
            onEnviarOrdenCompra();
        }
    };

    // Mock data for LicitacionItemsTable (should come from API/Props in real app)
    const mockItems: Item[] = [
        {
            id: '1',
            type: 'Producto',
            description: 'Laptops hp G10',
            quantity: 15,
            price: 2600.00
        }
    ];

    // Mock data for LicitacionRequiredDocs (should come from API/Props in real app)
    const mockDocumentCategories: DocumentCategory[] = [
        {
            title: 'Documentos Legales',
            documents: ['RUC y Ficha RUC', 'DNI del Representante Legal', 'Acta de Constitución'],
            icon: <Scale size={20} />
        },
        {
            title: 'Documentos Técnicos',
            documents: ['Ficha Técnica del Producto', 'Certificaciones de Calidad (ISO)', 'Catálogos y Brochures'],
            icon: <Wrench size={20} />
        },
        {
            title: 'Documentos Financieros',
            documents: ['Propuesta Económica', 'Estados Financieros Auditados', 'Carta de Fianza'],
            icon: <PiggyBank size={20} />
        }
    ];

    // Mock data for InviteSuppliersModal (should come from Providers API in real app)
    const mockAvailableSuppliers = [
        { id: 1, name: "Tech Solutions SAC", ruc: "20123456789", email: "ventas@techsolutions.com", category: "Tecnología" },
        { id: 2, name: "Computadoras del Perú SA", ruc: "20987654321", email: "contacto@computadoras.pe", category: "Tecnología" },
        { id: 3, name: "Digital Store EIRL", ruc: "20456789123", email: "info@digitalstore.com", category: "Tecnología" },
        { id: 4, name: "TechMart Perú S.A.C.", ruc: "20789123456", email: "ventas@techmart.pe", category: "Tecnología" },
        { id: 5, name: "Global Tech Solutions S.A.", ruc: "20321654987", email: "cotizaciones@globaltech.com.pe", category: "Tecnología" },
        { id: 6, name: "ElectroSystems del Sur E.I.R.L.", ruc: "20147258369", email: "ventas@electrosur.pe", category: "Tecnología" },
        { id: 7, name: "Distribuidora Integral S.A.C.", ruc: "20963852741", email: "info@distintegral.com", category: "Tecnología" },
        { id: 8, name: "Computación Integral Andina S.A.", ruc: "20258741963", email: "cotizaciones@compuandina.pe", category: "Tecnología" }
    ];

    const mockRequiredDocuments = [
        "RUC y Ficha RUC",
        "DNI del Representante Legal",
        "Vigencia de Poder del Representante Legal",
        "Ficha Técnica del Producto",
        "Certificaciones de Calidad (ISO)",
        "Referencias Comerciales",
        "Propuesta Económica",
        "Estados Financieros Auditados",
        "Carta de Fianza"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="licitacion-detail-header-wrapper">
                <PageHeader
                    title={nombre}
                    description={
                        <div className="header-metadata">
                            <span><strong>ID:</strong> {id}</span>
                            <span><strong>Fecha creación:</strong> {createdDate}</span>
                            <span><strong>Comprador:</strong> {buyer}</span>
                            <span><strong>Supervisor:</strong> {isApproved || isRejected ? supervisorName : supervisor}</span>
                        </div>
                    }
                />
                <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeftFromLine size={16} />
                    Volver
                </Button>
            </div>

            <div className="licitacion-detail-layout">
                <div className="licitacion-detail-left-col">
                    <LicitacionTimeline
                        currentStatus={currentStatus}
                        timestamps={{
                            ...timestamps,
                            ...(cancellationTimestamp ? { EVALUACION_TECNICA: cancellationTimestamp } : {}),
                            ...(economicCancellationTimestamp ? { EVALUACION_ECONOMIA: economicCancellationTimestamp } : {})
                        }}
                        onApprove={handleApproveClick}
                        onReject={handleCancelClick}
                        isApproved={isApproved}
                        supervisorName={supervisorName}
                        isRejected={isRejected}
                        proveedoresCount={invitedSuppliers.length}
                        propuestasRegistradas={registeredProposals.length}
                        propuestasAprobadasTecnicamente={propuestasAprobadasTecnicamente}
                        propuestasAprobadasEconomicamente={propuestasAprobadasEconomicamente}
                        onRegistrarPropuesta={handleRegistrarPropuesta}
                        onInvitarProveedores={handleInviteSuppliers}
                        onFinalizarInvitacion={handleFinalizarInvitacionClick}
                        onFinalizarRegistro={handleFinalizarRegistroClick}
                        onEnviarEvaluacion={handleSendToEvaluation}
                        onIniciarEvaluacionTecnica={handleIniciarEvaluacionTecnica}
                        onIniciarEvaluacionEconomica={handleIniciarEvaluacionEconomica}
                        onGenerarContrato={handleGenerarContrato}
                        onEnviarOrdenCompra={handleSendToPurchaseOrderClick}
                        isCancelledNoProposals={isCancelledNoProposals}
                        isCancelledNoApprovals={isCancelledNoApprovals}
                        isCancelledNoEconomicApprovals={isCancelledNoEconomicApprovals || economicCancellationTimestamp !== undefined}
                    />
                </div>
                <div className="licitacion-detail-right-col">
                    <LicitacionGeneralInfo presupuestoMaximo={`S/. ${presupuestoMaximo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} />
                    <LicitacionItemsTable items={mockItems} />
                    <LicitacionProposals proposals={registeredProposals} />
                    <LicitacionRequiredDocs documentCategories={mockDocumentCategories} />
                </div>
            </div>

            {/* Modals */}
            <ApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onConfirm={handleApprovalConfirm}
                licitacionId={id}
                buyer={buyer}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
            />

            <CancellationModal
                isOpen={showCancellationModal}
                onClose={() => setShowCancellationModal(false)}
                onConfirm={handleCancellationConfirm}
                licitacionId={id}
                buyer={buyer}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
            />

            <InviteSuppliersModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                licitacionId={id}
                licitacionTitle={nombre}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                availableSuppliers={mockAvailableSuppliers}
                requiredDocuments={mockRequiredDocuments}
                onSuppliersInvited={setInvitedSuppliers}
            />

            <FinalizeInvitationModal
                isOpen={showFinalizeInviteModal}
                onClose={() => setShowFinalizeInviteModal(false)}
                onConfirm={handleConfirmFinalizeInvitation}
                licitacionId={id}
                buyer={buyer}
                supervisor={supervisorName}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                invitedSuppliers={invitedSuppliers}
            />

            <RegisterProposalModal
                isOpen={showRegisterProposalModal}
                onClose={() => setShowRegisterProposalModal(false)}
                licitacionId={id}
                licitacionTitle={nombre}
                suppliers={mockSuppliersForRegistration.filter(s => invitedSuppliers.includes(s.name))}
                onRegisterProposal={handleRegisterProposalConfirm}
            />

            <FinalizeProposalsModal
                isOpen={showFinalizeProposalsModal}
                onClose={() => setShowFinalizeProposalsModal(false)}
                onConfirm={handleConfirmFinalizeProposals}
                licitacionId={id}
                buyerName={buyer}
                supervisorName={supervisorName}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                suppliersWithProposals={registeredProposals.map(p => p.supplierName)}
                suppliersWithoutDocs={Math.max(0, (invitedSuppliers.length > 0 ? invitedSuppliers.length : mockSuppliersForRegistration.length) - registeredProposals.length)}
            />


            <SendToEvaluationModal
                isOpen={showSendToEvaluationModal}
                onClose={() => setShowSendToEvaluationModal(false)}
                onConfirm={handleConfirmSendToEvaluation}
                licitacionId={id}
                buyer={buyer}
                supervisor={isApproved || isRejected ? supervisorName : supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                suppliersWithProposals={registeredProposals.map(p => p.supplierName)}
            />


            <TechnicalEvaluationModal
                isOpen={showTechnicalEvaluationModal}
                onClose={() => setShowTechnicalEvaluationModal(false)}
                licitacionId={id}
                licitacionTitle={nombre}
                suppliers={registeredProposals.map(p => ({
                    id: p.id,
                    name: p.supplierName,
                    ruc: p.ruc,
                    email: `${p.supplierName.toLowerCase().replace(/\s/g, '')}@example.com`
                }))}
                onSaveEvaluation={handleSaveEvaluation}
                onFinishEvaluation={handleFinishTechnicalEvaluation}
            />


            <EconomicEvaluationModal
                isOpen={showEconomicEvaluationModal}
                onClose={() => setShowEconomicEvaluationModal(false)}
                licitacionId={id}
                licitacionTitle={nombre}
                presupuesto={`S/. ${presupuestoMaximo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                solicitudOrigen={`Nº ${id}`}
                proveedoresTecnicamenteAprobados={registeredProposals.filter(p => p.technicalStatus === 'Approved').length}
                suppliers={registeredProposals
                    .filter(p => p.technicalStatus === 'Approved')
                    .map(p => ({
                        id: p.id,
                        name: p.supplierName,
                        ruc: p.ruc,
                        email: `${p.supplierName.toLowerCase().replace(/\s/g, '')}@example.com`
                    }))
                }
                onSaveEvaluation={handleSaveEconomicEvaluation}
                onFinishEvaluation={handleFinishEconomicEvaluation}
            />

            <GenerateContractModal
                isOpen={showGenerateContractModal}
                onClose={() => setShowGenerateContractModal(false)}
                licitacionId={id}
                licitacionTitle={nombre}
                winnerProvider={registeredProposals.find(p => p.isWinner) ? {
                    id: registeredProposals.find(p => p.isWinner)!.id,
                    name: registeredProposals.find(p => p.isWinner)!.supplierName,
                    ruc: registeredProposals.find(p => p.isWinner)!.ruc,
                    email: `${registeredProposals.find(p => p.isWinner)!.supplierName.toLowerCase().replace(/\s/g, '')}@example.com`
                } : undefined}
                onSaveContract={handleSaveContract}
            />

            <SendToPurchaseOrderModal
                isOpen={showSendToPurchaseOrderModal}
                onClose={() => setShowSendToPurchaseOrderModal(false)}
                onConfirm={handleSendToPurchaseOrderConfirm}
                licitacionId={id}
                buyer={buyer}
                supervisor={isApproved || isRejected ? supervisorName : supervisor}
                estimatedAmount={estimatedAmount}
                maxBudget={presupuestoMaximo}
                providerName={registeredProposals.find(p => p.isWinner)?.supplierName || "Proveedor Ganador"}
            />
        </div>
    );
};

export default LicitacionDetailTemplate;
