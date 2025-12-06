import React from 'react';
import TimelineItem from '../molecules/TimelineItem';
import Button from '../atoms/Button';
import { Send, Mail, Flag, PencilLine, ArrowRight, Settings, FileText } from 'lucide-react';
import type { LicitacionStatus } from '../../lib/types';
import './LicitacionTimeline.css';

interface LicitacionTimelineProps {
    currentStatus: LicitacionStatus;
    timestamps: Partial<Record<LicitacionStatus, string>>;
    isRejected?: boolean;
    proveedoresCount?: number;
    propuestasRegistradas?: number;
    propuestasAprobadasTecnicamente?: number;
    propuestasAprobadasEconomicamente?: number;
    onRegistrarPropuesta?: () => void;
    onInvitarProveedores?: () => void;
    onFinalizarInvitacion?: () => void;
    onFinalizarRegistro?: () => void;
    onEnviarEvaluacion?: () => void;
    onIniciarEvaluacionTecnica?: () => void;
    onIniciarEvaluacionEconomica?: () => void;
    onGenerarContrato?: () => void;
    onEnviarOrdenCompra?: () => void;
    isCancelledNoProposals?: boolean;
    isCancelledNoApprovals?: boolean;
    isCancelledNoEconomicApprovals?: boolean;
    // Props kept for compatibility but not used in this version
    onApprove?: () => void;
    onReject?: () => void;
    isApproved?: boolean;
    supervisorName?: string;
    onDownloadContract?: () => void;
}

// Mapeo del orden de los estados
const statusOrder: LicitacionStatus[] = [
    'PENDIENTE', // Aunque no se muestra en el timeline, es el estado inicial
    'NUEVA',
    'EN_INVITACION',
    'CON_PROPUESTAS',
    'EVALUACION_TECNICA',
    'EVALUACION_ECONOMIA',
    'ADJUDICADA',
    'CON_CONTRATO',
    'FINALIZADA'
];

const LicitacionTimeline: React.FC<LicitacionTimelineProps> = ({
    currentStatus,
    timestamps,
    isRejected = false,
    proveedoresCount = 8,
    propuestasRegistradas = 3,
    propuestasAprobadasTecnicamente = 2,
    propuestasAprobadasEconomicamente = 1,
    onRegistrarPropuesta,
    onInvitarProveedores,
    onFinalizarInvitacion,
    onFinalizarRegistro,
    onEnviarEvaluacion,
    onIniciarEvaluacionTecnica,
    onIniciarEvaluacionEconomica,
    onGenerarContrato,
    onEnviarOrdenCompra,
    isCancelledNoProposals = false,
    isCancelledNoApprovals = false,
    isCancelledNoEconomicApprovals = false,
    onDownloadContract
}) => {
    // Determinar el índice del estado actual
    const currentIndex = statusOrder.indexOf(currentStatus);

    // Función helper para determinar el status de cada step
    const getStepStatus = (stepStatus: LicitacionStatus): 'active' | 'completed' | 'pending' => {
        const stepIndex = statusOrder.indexOf(stepStatus);
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    // Función helper para obtener el texto de estado
    const getStatusText = (stepStatus: LicitacionStatus): string | undefined => {
        // FINALIZADA nunca muestra statusText, solo timestamp
        if (stepStatus === 'FINALIZADA') return undefined;

        const status = getStepStatus(stepStatus);
        if (status === 'active') return '---';
        if (status === 'pending') return 'Pendiente';
        return undefined; // Los completados no tienen statusText, solo timestamp
    };

    return (
        <div className="licitacion-timeline">
            <h3 className="timeline-header-title">Flujo del proceso de licitación</h3>

            {!isRejected && (
                <TimelineItem
                    stepNumber={1}
                    title="Nueva"
                    description={
                        currentStatus === 'EN_INVITACION' || timestamps['EN_INVITACION']
                            ? `Invitaciones enviadas a ${proveedoresCount} proveedores`
                            : "Invitando proveedores"
                    }
                    status={getStepStatus('NUEVA')}
                    timestamp={currentStatus === 'NUEVA' ? undefined : timestamps['NUEVA']}
                    statusText={getStatusText('NUEVA')}
                >
                    {currentStatus === 'NUEVA' && (
                        <>
                            <Button variant="primary" size="sm" onClick={onInvitarProveedores}>
                                <Mail size={16} />
                                Invitar proveedores
                            </Button>
                            {proveedoresCount > 0 && (
                                <Button variant="secondary" size="sm" onClick={onFinalizarInvitacion}>
                                    <Flag size={16} />
                                    Finalizar invitación
                                </Button>
                            )}
                        </>
                    )}
                </TimelineItem>
            )}

            {isCancelledNoProposals ? (
                <TimelineItem
                    stepNumber={2}
                    title="Cancelada"
                    description="Licitación cancelada debido a la falta de propuestas"
                    status="completed"
                    timestamp={timestamps['EN_INVITACION']}
                    isRejected={true}
                />
            ) : (
                <TimelineItem
                    stepNumber={2}
                    title="En invitación"
                    description={
                        currentStatus === 'CON_PROPUESTAS' || getStepStatus('EN_INVITACION') === 'completed'
                            ? `${propuestasRegistradas} de ${proveedoresCount} propuestas registradas`
                            : "Registrando propuesta de los proveedores"
                    }
                    status={getStepStatus('EN_INVITACION')}
                    timestamp={timestamps['EN_INVITACION']}
                    statusText={getStatusText('EN_INVITACION')}
                >
                    {currentStatus === 'EN_INVITACION' && (
                        <>
                            <Button variant="primary" size="sm" onClick={onRegistrarPropuesta}>
                                <PencilLine size={16} />
                                Registrar propuesta
                            </Button>
                            <Button variant="secondary" size="sm" onClick={onFinalizarRegistro}>
                                <ArrowRight size={16} />
                                Finalizar registro
                            </Button>
                        </>
                    )}
                </TimelineItem>
            )}

            <TimelineItem
                stepNumber={3}
                title="Con propuestas"
                description={
                    currentStatus === 'EVALUACION_TECNICA' || getStepStatus('CON_PROPUESTAS') === 'completed'
                        ? "Enviado a evaluación"
                        : "Pendiente del envío a evaluación"
                }
                status={getStepStatus('CON_PROPUESTAS')}
                timestamp={timestamps['CON_PROPUESTAS']}
                statusText={getStatusText('CON_PROPUESTAS')}
            >
                {currentStatus === 'CON_PROPUESTAS' && (
                    <Button variant="primary" size="sm" onClick={onEnviarEvaluacion}>
                        <Send size={16} />
                        Enviar a evaluación
                    </Button>
                )}
            </TimelineItem>

            {isCancelledNoApprovals ? (
                <TimelineItem
                    stepNumber={4}
                    title="Cancelada"
                    description="Ningún proveedor pasó la evaluación técnica"
                    status="completed"
                    timestamp={timestamps['EVALUACION_TECNICA']}
                    isRejected={true}
                />
            ) : (
                <TimelineItem
                    stepNumber={4}
                    title="En evaluación - Comité Técnico"
                    description={
                        currentStatus === 'EVALUACION_ECONOMIA' || getStepStatus('EVALUACION_TECNICA') === 'completed'
                            ? `${propuestasAprobadasTecnicamente} de ${propuestasRegistradas} propuestas aprobadas técnicamente`
                            : "Validando documentos y especificaciones técnicas"
                    }
                    status={getStepStatus('EVALUACION_TECNICA')}
                    timestamp={timestamps['EVALUACION_TECNICA']}
                    statusText={getStatusText('EVALUACION_TECNICA')}
                >
                    {currentStatus === 'EVALUACION_TECNICA' && (
                        <Button variant="primary" size="sm" onClick={onIniciarEvaluacionTecnica}>
                            <Settings size={16} />
                            Iniciar evaluación
                        </Button>
                    )}
                </TimelineItem>
            )}

            {isCancelledNoEconomicApprovals ? (
                <TimelineItem
                    stepNumber={5}
                    title="Cancelada"
                    description="Ningún proveedor pasó la evaluación económica"
                    status="completed"
                    timestamp={timestamps['EVALUACION_ECONOMIA']}
                    isRejected={true}
                />
            ) : (
                <TimelineItem
                    stepNumber={5}
                    title="En evaluación - Comité de Economía"
                    description={
                        currentStatus === 'ADJUDICADA' || getStepStatus('EVALUACION_ECONOMIA') === 'completed'
                            ? `${propuestasAprobadasEconomicamente} de ${propuestasAprobadasTecnicamente} propuestas aprobadas económicamente`
                            : "Analizando los criterios económicos y financieros"
                    }
                    status={getStepStatus('EVALUACION_ECONOMIA')}
                    timestamp={timestamps['EVALUACION_ECONOMIA']}
                    statusText={getStatusText('EVALUACION_ECONOMIA')}
                >
                    {currentStatus === 'EVALUACION_ECONOMIA' && (
                        <Button variant="primary" size="sm" onClick={onIniciarEvaluacionEconomica}>
                            <Settings size={16} />
                            Iniciar evaluación
                        </Button>
                    )}
                </TimelineItem>
            )}

            <TimelineItem
                stepNumber={6}
                title="Adjudicada"
                description={
                    currentStatus === 'CON_CONTRATO' || getStepStatus('ADJUDICADA') === 'completed'
                        ? "Contrato de adjudicación generado"
                        : "A la espera del contrato de adjudicación"
                }
                status={getStepStatus('ADJUDICADA')}
                timestamp={timestamps['ADJUDICADA']}
                statusText={getStatusText('ADJUDICADA')}
            >
                {currentStatus === 'ADJUDICADA' && (
                    <Button variant="primary" size="sm" onClick={onGenerarContrato}>
                        <FileText size={16} />
                        Generar contrato
                    </Button>
                )}
            </TimelineItem>

            <TimelineItem
                stepNumber={7}
                title="Con contrato"
                description={
                    currentStatus === 'FINALIZADA' || getStepStatus('CON_CONTRATO') === 'completed'
                        ? "Licitación enviada a orden de compra"
                        : "Pendiente de envío a orden de compra"
                }
                status={getStepStatus('CON_CONTRATO')}
                timestamp={timestamps['CON_CONTRATO']}
                statusText={getStatusText('CON_CONTRATO')}
            >
                {currentStatus === 'CON_CONTRATO' && (
                    <Button variant="primary" size="sm" onClick={onEnviarOrdenCompra}>
                        <Send size={16} />
                        Enviar a Orden de Compra
                    </Button>
                )}
            </TimelineItem>

            <TimelineItem
                stepNumber={8}
                title="Finalizada"
                description="Proceso de Licitación finalizado"
                status={getStepStatus('FINALIZADA')}
                timestamp={timestamps['FINALIZADA']}
                statusText={getStatusText('FINALIZADA')}
                isFinalState={true}
            >
                {currentStatus === 'FINALIZADA' && onDownloadContract && (
                    <Button variant="primary" size="sm" onClick={onDownloadContract}>
                        <FileText size={16} />
                        Descargar contrato
                    </Button>
                )}
            </TimelineItem>
        </div>
    );
};

export default LicitacionTimeline;
