import React, { useState } from 'react';
import LicitacionDetailTemplate from '../components/templates/LicitacionDetailTemplate';
import type { LicitacionStatus } from '../lib/types';

const LicitacionDetailPage: React.FC = () => {
    // Estado de la licitación - Por ahora local, luego vendrá del backend
    const [currentStatus, setCurrentStatus] = useState<LicitacionStatus>('BORRADOR');

    // Timestamps de cuando se completó cada estado (simulado por ahora)
    const [timestamps, setTimestamps] = useState<Partial<Record<LicitacionStatus, string>>>({});

    const licitacionData = {
        id: "2025001",
        title: "Compra de equipos de cómputo",
        createdDate: "01/11/2025",
        buyer: "Samnuel Luque",
        supervisor: "---",
        estimatedAmount: 39000,
        maxBudget: 45000,
        proveedoresCount: 8,
        propuestasRegistradas: 3,
        propuestasAprobadasTecnicamente: 2,
        propuestasAprobadasEconomicamente: 1
    };

    // Función helper para generar timestamp actual
    const getCurrentTimestamp = () => {
        const now = new Date();
        return now.toLocaleString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Handlers para cambiar de estado
    const handleApprove = () => {
        // Guardar timestamp del estado actual antes de cambiar
        setTimestamps(prev => ({
            ...prev,
            [currentStatus]: getCurrentTimestamp()
        }));
        setCurrentStatus('NUEVA');
    };

    const handleReject = () => {
        // Guardar timestamp del estado actual antes de cambiar
        setTimestamps(prev => ({
            ...prev,
            [currentStatus]: getCurrentTimestamp()
        }));
        // La licitación rechazada se maneja en el template, no cambiamos el status aquí
        console.log('Solicitud rechazada');
    };

    const handleFinalizarInvitacion = () => {
        // Guardar timestamp de NUEVA y cambiar a EN_INVITACION
        setTimestamps(prev => ({
            ...prev,
            ['NUEVA']: getCurrentTimestamp()
        }));
        setCurrentStatus('EN_INVITACION');
    };

    const handleFinalizarRegistro = () => {
        // Guardar timestamp de EN_INVITACION y cambiar a CON_PROPUESTAS
        setTimestamps(prev => ({
            ...prev,
            ['EN_INVITACION']: getCurrentTimestamp()
        }));
        setCurrentStatus('CON_PROPUESTAS');
    };

    const handleEnviarEvaluacion = () => {
        // Guardar timestamp de CON_PROPUESTAS y cambiar a EVALUACION_TECNICA
        setTimestamps(prev => ({
            ...prev,
            ['CON_PROPUESTAS']: getCurrentTimestamp()
        }));
        setCurrentStatus('EVALUACION_TECNICA');
    };

    const handleIniciarEvaluacionTecnica = () => {
        // Guardar timestamp de EVALUACION_TECNICA y cambiar a EVALUACION_ECONOMIA
        setTimestamps(prev => ({
            ...prev,
            ['EVALUACION_TECNICA']: getCurrentTimestamp()
        }));
        setCurrentStatus('EVALUACION_ECONOMIA');
    };

    const handleIniciarEvaluacionEconomica = () => {
        // Guardar timestamp de EVALUACION_ECONOMIA y cambiar a ADJUDICADO
        setTimestamps(prev => ({
            ...prev,
            ['EVALUACION_ECONOMIA']: getCurrentTimestamp()
        }));
        setCurrentStatus('ADJUDICADO');
    };

    const handleGenerarContrato = () => {
        // Guardar timestamp de ADJUDICADO y cambiar a CON_CONTRATO
        setTimestamps(prev => ({
            ...prev,
            ['ADJUDICADO']: getCurrentTimestamp()
        }));
        setCurrentStatus('CON_CONTRATO');
    };

    const handleEnviarOrdenCompra = () => {
        // Guardar el mismo timestamp para CON_CONTRATO y FINALIZADA ya que finalizan al mismo tiempo
        const timestamp = getCurrentTimestamp();
        setTimestamps(prev => ({
            ...prev,
            ['CON_CONTRATO']: timestamp,
            ['FINALIZADA']: timestamp
        }));
        setCurrentStatus('FINALIZADA');
    };


    return (
        <LicitacionDetailTemplate
            id={licitacionData.id}
            title={licitacionData.title}
            createdDate={licitacionData.createdDate}
            buyer={licitacionData.buyer}
            supervisor={licitacionData.supervisor}
            currentStatus={currentStatus}
            timestamps={timestamps}
            estimatedAmount={licitacionData.estimatedAmount}
            maxBudget={licitacionData.maxBudget}
            proveedoresCount={licitacionData.proveedoresCount}
            propuestasRegistradas={licitacionData.propuestasRegistradas}
            propuestasAprobadasTecnicamente={licitacionData.propuestasAprobadasTecnicamente}
            propuestasAprobadasEconomicamente={licitacionData.propuestasAprobadasEconomicamente}
            onApprove={handleApprove}
            onReject={handleReject}
            onFinalizarInvitacion={handleFinalizarInvitacion}
            onFinalizarRegistro={handleFinalizarRegistro}
            onEnviarEvaluacion={handleEnviarEvaluacion}
            onIniciarEvaluacionTecnica={handleIniciarEvaluacionTecnica}
            onIniciarEvaluacionEconomica={handleIniciarEvaluacionEconomica}
            onGenerarContrato={handleGenerarContrato}
            onEnviarOrdenCompra={handleEnviarOrdenCompra}
        />
    );
};

export default LicitacionDetailPage;
