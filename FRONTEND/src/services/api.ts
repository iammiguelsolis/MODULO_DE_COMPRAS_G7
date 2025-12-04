import axios from 'axios';

// ==========================================
// 1. CONFIGURACIÓN DEL CLIENTE HTTP
// ==========================================
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores (Opcional pero recomendado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==========================================
// 2. INTERFACES (TIPOS TS)
// ==========================================

// --- Enums ---
export type TipoItem = 'MATERIAL' | 'SERVICIO';
export type TipoProceso = 'COMPRA' | 'LICITACION';
export type CanalInvitacion = 'EMAIL' | 'WHATSAPP';
export type EstadoProceso = 'NUEVO' | 'INVITANDO_PROVEEDORES' | 'EVALUANDO_OFERTAS' | 'CERRADO';

// --- Items de Solicitud ---
export interface ItemSolicitudInput {
  tipo: TipoItem;
  nombre?: string; // El backend lo mapea a nombre_material o nombre_servicio
  cantidad: number;
  precio_unitario?: number; // Para materiales
  tarifa_hora?: number; // Para servicios
  horas_estimadas?: number; // Para servicios
  comentario?: string;
}

export interface ItemSolicitudOutput {
  id: number;
  tipo_item: TipoItem;
  nombre_material?: string;
  nombre_servicio?: string;
  cantidad?: number;
  horas_estimadas?: number;
  precio_unitario?: number;
  tarifa_hora?: number;
  subtotal: number;
  comentario: string;
}

// --- Solicitudes ---
export interface SolicitudInput {
  titulo: string;
  notas_adicionales: string;
  items: ItemSolicitudInput[];
}

export interface Solicitud extends SolicitudInput {
  id: number;
  estado: string;
  fecha_creacion: string;
  total: number;
  tipo_adquisicion: TipoProceso;
  items: ItemSolicitudOutput[]; // Sobreescribe con el tipo de salida
}

// --- Items de Oferta (Estructura compleja con 'extra') ---
export interface ItemOfertaExtra {
  marca?: string;
  cantidad_disponible?: number;
  dias_ejecucion?: number;
  experiencia_tecnico?: string;
}

export interface ItemOfertaInput {
  tipo: TipoItem;
  precio: number;
  descripcion: string;
  marca?: string; // Frontend envía plano
  cantidad?: number; // Frontend envía plano
  dias?: number; // Frontend envía plano (mapeado a dias_ejecucion)
  experiencia?: string; // Frontend envía plano
}

export interface ItemOfertaOutput {
  id: number;
  tipo: string; // "MaterialOfertado" o "ServicioOfertado"
  precio: number;
  descripcion: string;
  extra: ItemOfertaExtra; // Backend devuelve objeto anidado
}

// --- Ofertas ---
export interface OfertaInput {
  id_proveedor: number;
  monto_total: number;
  comentarios: string;
  items: ItemOfertaInput[];
}

export interface OfertaOutput {
  id: number;
  proceso_id: number;
  proveedor_id: number;
  nombre_proveedor: string;
  monto_total: number;
  comentarios: string;
  fecha_oferta: string;
  items: ItemOfertaOutput[];
}

// --- Adquisiciones (Procesos) ---
export interface ProcesoResumen {
  id: number;
  solicitud_id: number;
  tipo_proceso: TipoProceso;
  estado: EstadoProceso;
  fecha_creacion: string;
}

export interface ProcesoDetalle extends ProcesoResumen {
  ganador_id: number | null;
  ofertas: OfertaOutput[];
}

// ==========================================
// 3. SERVICIOS (FUNCIONES)
// ==========================================

export const SolicitudesApi = {
  // Crear una solicitud
  crear: async (data: SolicitudInput) => {
    const response = await apiClient.post<{ id: number; mensaje: string }>('/api/solicitudes', data);
    return response.data;
  },

  // Listar todas
  listar: async () => {
    const response = await apiClient.get<Solicitud[]>('/api/solicitudes');
    return response.data;
  },

  // Obtener por ID
  obtener: async (id: number) => {
    const response = await apiClient.get<Solicitud>(`/api/solicitudes/${id}`);
    return response.data;
  },

  // Aprobar
  aprobar: async (id: number) => {
    const response = await apiClient.put<Solicitud>(`/api/solicitudes/${id}/aprobar`);
    return response.data;
  },

  // Rechazar
  rechazar: async (id: number) => {
    const response = await apiClient.put<Solicitud>(`/api/solicitudes/${id}/rechazar`);
    return response.data;
  }
};

export const AdquisicionesApi = {
  // Listar procesos (Resumen)
  listar: async () => {
    const response = await apiClient.get<ProcesoResumen[]>('/api/adquisiciones');
    return response.data;
  },

  // Generar proceso desde solicitud aprobada
  generar: async (idSolicitud: number) => {
    const response = await apiClient.post<{ 
      tipo_proceso: TipoProceso; 
      mensaje: string; 
      proceso: ProcesoResumen 
    }>('/api/adquisiciones/generar', { id_solicitud: idSolicitud });
    return response.data;
  },

  // Obtener detalle completo (con ofertas)
  obtener: async (idProceso: number) => {
    const response = await apiClient.get<ProcesoDetalle>(`/api/adquisiciones/${idProceso}`);
    return response.data;
  },

  // Invitar proveedores
  invitar: async (idCompra: number, proveedoresIds: number[], canal: CanalInvitacion = 'EMAIL') => {
    const response = await apiClient.post<{ 
      mensaje: string; 
      compra: ProcesoDetalle 
    }>(`/api/adquisiciones/${idCompra}/invitar`, {
      proveedores: proveedoresIds,
      canal
    });
    return response.data;
  },

  // Registrar oferta de proveedor
  ofertar: async (idCompra: number, data: OfertaInput) => {
    const response = await apiClient.post<{ 
      mensaje: string; 
      oferta: OfertaOutput 
    }>(`/api/adquisiciones/${idCompra}/ofertar`, data);
    return response.data;
  },

  // Elegir ganador (Adjudicar)
  adjudicar: async (idCompra: number, idOferta: number) => {
    const response = await apiClient.put<{ 
      mensaje: string; 
      compra: ProcesoDetalle 
    }>(`/api/adquisiciones/${idCompra}/elegir-ganador`, { id_oferta: idOferta });
    return response.data;
  }
};

export default apiClient;