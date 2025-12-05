import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LicitacionDetailTemplate from '../components/templates/LicitacionDetailTemplate';
import { useLicitacionDetail } from '../lib/hooks/useLicitacionDetail';
import { useSupabaseUpload } from '../lib/hooks/useSupabaseUpload';
import { proveedoresService } from '../lib/api/proveedores.service';
import { downloadFile, getContractTemplatePath } from '../lib/documentTemplateUtils';
import type { ProveedorDTO } from '../lib/types';

const LicitacionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState<ProveedorDTO[]>([]);
    const {
        licitacion,
        propuestas,
        loading,
        error,
        invitarProveedores,
        finalizarInvitacion,
        registrarPropuesta,
        subirDocumentoPropuesta,
        finalizarRegistro,
        enviarAEvaluacion,
        guardarEvaluacionTecnica,
        finalizarEvaluacionTecnica,
        guardarEvaluacionEconomica,
        adjudicar,
        generarPlantillaContrato,
        cargarContratoFirmado,
        finalizar,
    } = useLicitacionDetail(Number(id));

    const { upload: uploadFile } = useSupabaseUpload();

    // Cargar proveedores disponibles
    useEffect(() => {
        const cargarProveedores = async () => {
            try {
                const proveedores = await proveedoresService.listar();
                setProveedoresDisponibles(proveedores);
            } catch (error) {
                console.error('Error cargando proveedores:', error);
            }
        };
        cargarProveedores();
    }, []);

    // Handlers para Invitación
    const handleInvitarProveedores = async (proveedores: number[]) => {
        try {
            await invitarProveedores(proveedores);
            alert('Proveedores invitados exitosamente');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleFinalizarInvitacion = async () => {
        try {
            await finalizarInvitacion();
            alert('Invitación finalizada exitosamente');
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Handlers para Registro de Propuestas
    const handleRegistrarPropuesta = async (proveedorId: number, files: File[]) => {
        try {
            // 1. Crear la propuesta
            const { id_propuesta } = await registrarPropuesta(proveedorId);

            // 2. Subir documentos uno por uno con feedback
            let uploadedCount = 0;
            for (const file of files) {
                uploadedCount++;
                console.log(`Subiendo documento ${uploadedCount}/${files.length}: ${file.name}`);

                // Subir a Supabase
                const url = await uploadFile(file, 'propuestas');

                // Determinar tipo basado en extensión y nombre
                const tipo = determinarTipoDocumento(file.name);

                // Registrar en backend
                await subirDocumentoPropuesta(id_propuesta, {
                    nombre: file.name,
                    url_archivo: url,
                    tipo: tipo
                });
            }
            alert(`Propuesta registrada exitosamente con ${files.length} documento(s)`);
        } catch (err: any) {
            alert(`Error al registrar propuesta: ${err.message}`);
        }
    };

    // Helper function to determine document type
    const determinarTipoDocumento = (fileName: string): string => {
        const lowerName = fileName.toLowerCase();

        // Documentos legales
        if (lowerName.includes('ruc') || lowerName.includes('dni') ||
            lowerName.includes('acta') || lowerName.includes('legal')) {
            return 'LEGAL';
        }

        // Documentos técnicos  
        if (lowerName.includes('tecnic') || lowerName.includes('ficha') ||
            lowerName.includes('certificacion') || lowerName.includes('catalogo') ||
            lowerName.includes('iso')) {
            return 'TECNICO';
        }

        // Documentos económicos
        if (lowerName.includes('economica') || lowerName.includes('financier') ||
            lowerName.includes('fianza') || lowerName.includes('estado') ||
            lowerName.includes('cotizacion')) {
            return 'ECONOMICO';
        }

        // Por defecto, asumir técnico
        return 'TECNICO';
    };

    const handleFinalizarRegistro = async () => {
        try {
            await finalizarRegistro();
            alert('Registro de propuestas finalizado');
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Handlers para Evaluación Técnica
    const handleEnviarEvaluacion = async () => {
        try {
            await enviarAEvaluacion();
            alert('Licitación enviada a evaluación técnica');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleGuardarEvaluacionTecnica = async (evaluation: any) => {
        try {
            // evaluation viene del modal TechnicalEvaluationModal con esta estructura:
            // { propuestaId, aprobada_tecnicamente, motivo_rechazo_tecnico, documentos: [{id_documento, validado, observaciones}] }
            await guardarEvaluacionTecnica(evaluation.propuestaId, {
                aprobada_tecnicamente: evaluation.aprobada_tecnicamente,
                motivo_rechazo_tecnico: evaluation.motivo_rechazo_tecnico,
                documentos: evaluation.documentos
            });
            alert('Evaluación técnica guardada');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleFinalizarEvaluacionTecnica = async () => {
        try {
            await finalizarEvaluacionTecnica();
            alert('Evaluación técnica finalizada');
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Handlers para Evaluación Económica
    const handleGuardarEvaluacionEconomica = async (evaluation: any) => {
        try {
            // evaluation viene de EconomicEvaluationModal con estructura:
            // {  propuestaId, aprobada_economicamente, puntuacion_economica, justificacion_economica, motivo_rechazo_economico }
            await guardarEvaluacionEconomica(evaluation.propuestaId, {
                aprobada_economicamente: evaluation.aprobada_economicamente,
                puntuacion_economica: evaluation.puntuacion_economica,
                justificacion_economica: evaluation.justificacion_economica,
                motivo_rechazo_economico: evaluation.motivo_rechazo_economico
            });
            alert('Evaluación económica guardada');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleAdjudicar = async () => {
        try {
            await adjudicar();
            alert('Licitación adjudicada exitosamente');
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Handlers para Contrato
    const handleGenerarContrato = async () => {
        try {
            // Asumimos supervisor ID 1 por ahora o lo sacamos del contexto
            const supervisorId = 1;
            await generarPlantillaContrato(supervisorId);

            // Descargar la plantilla estática
            const contractPath = getContractTemplatePath();
            downloadFile(contractPath, 'Plantilla - Contrato Adjudicacion.docx');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleGuardarContrato = async (file: File) => {
        try {
            const url = await uploadFile(file, 'contratos');
            await cargarContratoFirmado(url);
            alert('Contrato cargado exitosamente');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const navigate = useNavigate();

    // Handler Final
    const handleEnviarOrdenCompra = async () => {
        try {
            await finalizar();

            // Preparar datos para Orden de Compra
            const winnerProposal = propuestas.find(p => p.es_ganadora);

            // Mapear items al formato de Orden de Compra
            const orderItems = licitacion?.items.map(item => ({
                id: item.id,
                productId: '',
                name: item.description,
                quantity: item.type === 'SERVICIO' ? (item.estimatedHours || 1) : (item.quantity || 1),
                unitPrice: item.type === 'SERVICIO' ? (item.hourlyRate || 0) : (item.price || 0),
                description: item.description
            })) || [];

            const orderData = {
                proveedor: winnerProposal ? {
                    id: String(winnerProposal.proveedor.id),
                    name: winnerProposal.proveedor.razon_social,
                    email: winnerProposal.proveedor.email,
                    ruc: winnerProposal.proveedor.ruc,
                    phone: '',
                    address: ''
                } : null,
                items: orderItems,
                id_solicitud: licitacion?.solicitudId ? String(licitacion.solicitudId) : '',
                contrato: { fecha_firmado: "2025-12-27" },
                titulo: licitacion?.nombre || '',
                notas: `Generado desde Licitación #${id}`
            };

            navigate('/ordenes', { state: orderData });

        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDownloadContract = () => {
        if (licitacion?.contract?.url) {
            downloadFile(licitacion.contract.url, `Contrato_Licitacion_${id}.docx`);
        } else {
            alert('No hay contrato disponible para descargar');
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando detalles de la licitación...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!licitacion) return <div className="p-8 text-center">No se encontró la licitación</div>;

    return (
        <div className="p-6">
            <LicitacionDetailTemplate
                id={Number(licitacion.id)}
                nombre={licitacion.nombre}
                createdDate={licitacion.createdDate}
                buyer={licitacion.buyer}
                supervisor={licitacion.supervisor}
                currentStatus={licitacion.currentStatus}
                timestamps={licitacion.timestamps}
                estimatedAmount={licitacion.estimatedAmount}
                presupuestoMaximo={licitacion.presupuestoMaximo}
                fechaLimite={licitacion.fechaLimite}
                solicitudId={licitacion.solicitudId}
                proveedoresCount={licitacion.providers?.length || 0}
                propuestasRegistradas={propuestas.length}
                propuestasAprobadasTecnicamente={propuestas.filter(p => p.estado_tecnico === 'APROBADO').length}
                propuestasAprobadasEconomicamente={propuestas.filter(p => p.estado_economico === 'APROBADO').length}

                // Callbacks conectados
                onInvitarProveedores={handleInvitarProveedores}
                onFinalizarInvitacion={handleFinalizarInvitacion}
                onRegistrarPropuesta={handleRegistrarPropuesta}
                onFinalizarRegistro={handleFinalizarRegistro}
                onEnviarEvaluacion={handleEnviarEvaluacion}

                // Callbacks de evaluación (el template maneja la apertura de modales, aquí pasamos lógica de guardado)
                onGuardarEvaluacionTecnica={handleGuardarEvaluacionTecnica}
                onFinalizarEvaluacionTecnica={handleFinalizarEvaluacionTecnica}

                onGuardarEvaluacionEconomica={handleGuardarEvaluacionEconomica}
                onAdjudicar={handleAdjudicar} // Para finalizar evaluación económica

                onGenerarContrato={handleGenerarContrato}
                onGuardarContrato={handleGuardarContrato}

                onEnviarOrdenCompra={handleEnviarOrdenCompra}
                onDownloadContract={handleDownloadContract}

                // Props adicionales para los modales que necesitan datos
                documentosRequeridos={licitacion.requiredDocuments}
                propuestas={propuestas}
                items={licitacion.items}
                proveedoresDisponibles={proveedoresDisponibles}
                invitedProviders={licitacion.invitedProviders}
            />
        </div>
    );
};

export default LicitacionDetailPage;
