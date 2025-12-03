import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import LicitacionDetailTemplate from '../components/templates/LicitacionDetailTemplate';
import type { LicitacionStatus } from '../lib/types';

const LicitacionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Estado de la licitación
    // TODO: Cargar desde backend usando el ID
    const [currentStatus, setCurrentStatus] = useState<LicitacionStatus>('NUEVA');

    // Timestamps para el timeline
    const [timestamps, setTimestamps] = useState<Record<string, string>>({});

    // Datos mockeados
    const licitacionData = {
        id: id || "2025001",
        nombre: "Compra de equipos de cómputo",
        createdDate: "01/11/2025",
        buyer: "Samnuel Luque",
        supervisor: "Mario Altamirano",
        estimatedAmount: 39000,
        presupuestoMaximo: 45000,
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

    // Handlers para transiciones de estado

    const handleInvitarProveedores = () => {
        // Lógica para abrir modal de invitación
        console.log("Abriendo modal de invitación");
    };

    const handleFinalizarInvitacion = () => {
        // Guardar timestamp de NUEVA y cambiar a EN_INVITACION
        setTimestamps(prev => ({
            ...prev,
            ['NUEVA']: getCurrentTimestamp()
        }));
        setCurrentStatus('EN_INVITACION');
    };

    const handleRegistrarPropuesta = () => {
        console.log("Registrando propuesta");
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
        // Guardar timestamp de EVALUACION_ECONOMIA y cambiar a ADJUDICADA
        setTimestamps(prev => ({
            ...prev,
            ['EVALUACION_ECONOMIA']: getCurrentTimestamp()
        }));
        setCurrentStatus('ADJUDICADA');
    };

    const handleGenerarContrato = () => {
        // Guardar timestamp de ADJUDICADA y cambiar a CON_CONTRATO
        setTimestamps(prev => ({
            ...prev,
            ['ADJUDICADA']: getCurrentTimestamp()
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
            nombre={licitacionData.nombre}
            createdDate={licitacionData.createdDate}
            buyer={licitacionData.buyer}
            supervisor={licitacionData.supervisor}
            currentStatus={currentStatus}
            timestamps={timestamps}
            estimatedAmount={licitacionData.estimatedAmount}
            presupuestoMaximo={licitacionData.presupuestoMaximo}
            proveedoresCount={licitacionData.proveedoresCount}
            propuestasRegistradas={licitacionData.propuestasRegistradas}
            propuestasAprobadasTecnicamente={licitacionData.propuestasAprobadasTecnicamente}
            propuestasAprobadasEconomicamente={licitacionData.propuestasAprobadasEconomicamente}
            onInvitarProveedores={handleInvitarProveedores}
            onFinalizarInvitacion={handleFinalizarInvitacion}
            onRegistrarPropuesta={handleRegistrarPropuesta}
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
