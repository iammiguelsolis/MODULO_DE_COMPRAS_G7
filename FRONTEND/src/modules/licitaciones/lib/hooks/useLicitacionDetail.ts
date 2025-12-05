import { useState, useEffect } from "react";
import { licitacionesService } from "../api/licitaciones.service";
import type {
  LicitacionDetail,
  LicitacionResponseDTO,
  LicitacionStatus,
  Item,
} from "../types";

const adaptLicitacionToDetail = (
  dto: LicitacionResponseDTO
): LicitacionDetail => {
  // Mapear items según su tipo
  const mappedItems: Item[] = dto.items.map((i) => {
    if (i.tipo === "SERVICIO") {
      return {
        id: String(i.id),
        type: "SERVICIO" as const,
        description: i.nombre,
        estimatedHours: i.cantidad, // Para servicios, cantidad = horas
        hourlyRate: i.precio_referencia, // Para servicios, precio = tarifa
        total: i.cantidad * i.precio_referencia,
      };
    } else {
      return {
        id: String(i.id),
        type: "MATERIAL" as const,
        description: i.nombre,
        quantity: i.cantidad,
        price: i.precio_referencia,
        total: i.cantidad * i.precio_referencia,
      };
    }
  });

  // Calcular estimatedAmount sumando los totales de los items
  const totalItemsAmount = mappedItems.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  return {
    id: String(dto.id_licitacion),
    nombre: dto.titulo,
    createdDate: dto.fecha_creacion || new Date().toISOString(),
    buyer: "Usuario Actual", // Backend no envía comprador
    supervisor: "Supervisor", // Backend no envía supervisor
    currentStatus: dto.estado as LicitacionStatus,
    timestamps: {
      creacion: dto.fecha_creacion || new Date().toISOString(),
      // Mapear otros timestamps si el backend los enviara
    },
    estimatedAmount: totalItemsAmount,
    presupuestoMaximo: dto.presupuesto_max,
    fechaLimite: dto.fecha_limite || undefined,
    solicitudId: dto.solicitud_id, // Guardar el ID de la solicitud origen
    items: mappedItems,
    requiredDocuments: dto.documentos_requeridos,
    providers: [],
    contract: dto.contrato
      ? {
          id: String(dto.contrato.id_contrato),
          fileName: "Contrato.docx",
          fileSize: "Unknown",
          uploadedAt: dto.contrato.fecha_generacion,
          licitacionId: String(dto.id_licitacion),
          providerId: 0,
          url: dto.contrato.documento_firmado_url,
        }
      : undefined,
    cantidadInvitaciones: dto.cantidad_invitaciones,
    cantidadPropuestas: dto.cantidad_propuestas,
    invitedProviders: dto.proveedores_invitados,
  };
};

export const useLicitacionDetail = (id: number) => {
  const [licitacion, setLicitacion] = useState<LicitacionDetail | null>(null);
  const [propuestas, setPropuestas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalle = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const [dataLicitacion, dataPropuestas] = await Promise.all([
        licitacionesService.obtenerPorId(id),
        licitacionesService.obtenerPropuestas(id).catch(() => []),
      ]);

      // @ts-ignore - dataLicitacion es any o DTO, forzamos adaptación
      setLicitacion(
        adaptLicitacionToDetail(dataLicitacion as LicitacionResponseDTO)
      );
      setPropuestas(dataPropuestas);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cargar detalle");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  // === FASE: NUEVA ===
  const invitarProveedores = async (proveedores: number[]) => {
    try {
      await licitacionesService.invitarProveedores(id, proveedores);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error al invitar");
    }
  };

  // === FASE: EN_INVITACION ===
  const finalizarInvitacion = async () => {
    try {
      await licitacionesService.finalizarInvitacion(id);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const registrarPropuesta = async (proveedorId: number) => {
    try {
      const result = await licitacionesService.registrarPropuesta(
        id,
        proveedorId
      );
      return result; // { id_propuesta, mensaje }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const subirDocumentoPropuesta = async (
    propuestaId: number,
    documento: {
      nombre: string;
      url_archivo: string;
      tipo: string;
      documento_requerido_id?: number;
    }
  ) => {
    try {
      await licitacionesService.subirDocumentoPropuesta(
        id,
        propuestaId,
        documento
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error al subir documento");
    }
  };

  const finalizarRegistro = async () => {
    try {
      await licitacionesService.finalizarRegistroPropuestas(id);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  // === FASE: CON_PROPUESTAS ===
  const enviarAEvaluacion = async () => {
    try {
      await licitacionesService.enviarAEvaluacion(id);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  // === FASE: EVALUACION_TECNICA ===
  const obtenerPropuestas = async () => {
    try {
      const data = await licitacionesService.obtenerPropuestas(id);
      setPropuestas(data);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const guardarEvaluacionTecnica = async (
    propuestaId: number,
    evaluacion: {
      aprobada_tecnicamente: boolean;
      motivo_rechazo_tecnico?: string;
      documentos: Array<{
        id_documento: number;
        validado: boolean;
        observaciones?: string;
      }>;
    }
  ) => {
    try {
      await licitacionesService.guardarEvaluacionTecnica(
        id,
        propuestaId,
        evaluacion
      );
      await obtenerPropuestas();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const finalizarEvaluacionTecnica = async () => {
    try {
      const result = await licitacionesService.finalizarEvaluacionTecnica(id);
      await fetchDetalle();
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  // === FASE: EVALUACION_ECONOMIA ===
  const guardarEvaluacionEconomica = async (
    propuestaId: number,
    evaluacion: {
      aprobada_economicamente: boolean;
      puntuacion_economica?: number;
      justificacion_economica?: string;
      motivo_rechazo_economico?: string;
    }
  ) => {
    try {
      await licitacionesService.guardarEvaluacionEconomica(
        id,
        propuestaId,
        evaluacion
      );
      await obtenerPropuestas();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const adjudicar = async () => {
    try {
      const result = await licitacionesService.adjudicar(id);
      await fetchDetalle();
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  // === FASE: ADJUDICADA ===
  const generarPlantillaContrato = async (supervisorId: number) => {
    try {
      const result = await licitacionesService.generarPlantillaContrato(
        id,
        supervisorId
      );
      return result;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  const cargarContratoFirmado = async (urlArchivo: string) => {
    try {
      await licitacionesService.cargarContratoFirmado(id, urlArchivo);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  // === FASE: CON_CONTRATO ===
  const finalizar = async () => {
    try {
      await licitacionesService.finalizar(id);
      await fetchDetalle();
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Error");
    }
  };

  return {
    licitacion,
    propuestas,
    loading,
    error,
    refetch: fetchDetalle,
    invitarProveedores,
    finalizarInvitacion,
    registrarPropuesta,
    subirDocumentoPropuesta,
    finalizarRegistro,
    enviarAEvaluacion,
    obtenerPropuestas,
    guardarEvaluacionTecnica,
    finalizarEvaluacionTecnica,
    guardarEvaluacionEconomica,
    adjudicar,
    generarPlantillaContrato,
    cargarContratoFirmado,
    finalizar,
  };
};
