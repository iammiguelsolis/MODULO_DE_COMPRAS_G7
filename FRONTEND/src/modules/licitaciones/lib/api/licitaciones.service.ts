import apiClient from "./axios-config";

// TODO: Crear proveedoresService.ts separado cuando el módulo de proveedores esté disponible
// Este servicio debería manejar: listarProveedores(), obtenerPorId(id), etc.
// Endpoint esperado: GET /api/proveedores?categoria=Tecnología

export const licitacionesService = {
  // Lista con filtros y paginación
  listar: async (params?: {
    page?: number;
    per_page?: number;
    estado?: string;
    titulo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    limiteMontoMin?: number;
    limiteMontoMax?: number;
    id?: number;
  }) => {
    const response = await apiClient.get("/api/licitaciones", { params });
    return response.data;
  },

  // Detalle por ID
  obtenerPorId: async (id: number) => {
    const response = await apiClient.get(`/api/licitaciones/${id}`);
    return response.data;
  },

  // Completar detalles de licitación (presupuesto, fecha límite, documentos)
  completarDetalles: async (
    id: number,
    data: {
      presupuesto_max: number;
      fecha_limite: string;
      documentos_requeridos?: string[];
    }
  ) => {
    const response = await apiClient.put(
      `/api/licitaciones/${id}/completar-detalles`,
      data
    );
    return response.data;
  },

  // === FASE: NUEVA ===
  invitarProveedores: async (id: number, proveedores: number[]) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/invitaciones`,
      { proveedores }
    );
    return response.data;
  },

  // === FASE: EN_INVITACION ===
  finalizarInvitacion: async (id: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/finalizar-invitacion`
    );
    return response.data;
  },

  registrarPropuesta: async (id: number, proveedorId: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/propuestas`,
      { proveedor_id: proveedorId }
    );
    return response.data; // { id_propuesta, mensaje }
  },

  subirDocumentoPropuesta: async (
    id: number,
    propuestaId: number,
    documento: {
      nombre: string;
      url_archivo: string;
      tipo: string;
      documento_requerido_id?: number;
    }
  ) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/propuestas/${propuestaId}/documentos`,
      documento
    );
    return response.data; // { id_documento }
  },

  finalizarRegistroPropuestas: async (id: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/finalizar-registro-propuestas`
    );
    return response.data;
  },

  // === FASE: CON_PROPUESTAS ===
  enviarAEvaluacion: async (id: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/enviar-a-evaluacion`
    );
    return response.data;
  },

  // === FASE: EVALUACION_TECNICA ===
  obtenerPropuestas: async (id: number) => {
    const response = await apiClient.get(`/api/licitaciones/${id}/propuestas`);
    return response.data; // PropuestaResponseDTO[]
  },

  guardarEvaluacionTecnica: async (
    id: number,
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
    const response = await apiClient.put(
      `/api/licitaciones/${id}/propuestas/${propuestaId}/evaluacion-tecnica`,
      evaluacion
    );
    return response.data;
  },

  finalizarEvaluacionTecnica: async (id: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/finalizar-evaluacion-tecnica`
    );
    return response.data; // { mensaje, propuestas_validas, estado }
  },

  // === FASE: EVALUACION_ECONOMIA ===
  guardarEvaluacionEconomica: async (
    id: number,
    propuestaId: number,
    evaluacion: {
      aprobada_economicamente: boolean;
      puntuacion_economica?: number;
      justificacion_economica?: string;
      motivo_rechazo_economico?: string;
    }
  ) => {
    const response = await apiClient.put(
      `/api/licitaciones/${id}/propuestas/${propuestaId}/evaluacion-economica`,
      evaluacion
    );
    return response.data;
  },

  adjudicar: async (id: number) => {
    const response = await apiClient.post(`/api/licitaciones/${id}/adjudicar`);
    return response.data; // { mensaje, ganador_id, estado }
  },

  // === FASE: ADJUDICADA ===
  generarPlantillaContrato: async (id: number, supervisorId: number) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/contrato/generar`,
      { supervisorId }
    );
    return response.data; // { plantilla_url, mensaje }
  },

  cargarContratoFirmado: async (id: number, urlArchivo: string) => {
    const response = await apiClient.post(
      `/api/licitaciones/${id}/contrato/cargar-firmado`,
      { url_archivo: urlArchivo }
    );
    return response.data; // { mensaje, estado }
  },

  // === FASE: CON_CONTRATO ===
  finalizar: async (id: number) => {
    const response = await apiClient.post(`/api/licitaciones/${id}/finalizar`);
    return response.data;
  },
};
