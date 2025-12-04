import axios from 'axios';
import type { 
  SolicitudInput, 
  Solicitud, 
  ProcesoResumen, 
  TipoProceso, 
  ProcesoDetalle, 
  CanalInvitacion, 
  OfertaInput, 
  OfertaOutput 
} from '../types';

// Configuración del cliente HTTP
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de Solicitudes
export const SolicitudesApi = {
  crear: async (data: SolicitudInput) => {
    const response = await apiClient.post<{ id: number; mensaje: string }>('/api/solicitudes', data);
    return response.data;
  },

  listar: async () => {
    const response = await apiClient.get<Solicitud[]>('/api/solicitudes');
    return response.data;
  },

  obtener: async (id: number) => {
    const response = await apiClient.get<Solicitud>(`/api/solicitudes/${id}`);
    return response.data;
  },

  aprobar: async (id: number) => {
    const response = await apiClient.put<Solicitud>(`/api/solicitudes/${id}/aprobar`);
    return response.data;
  },

  rechazar: async (id: number) => {
    const response = await apiClient.put<Solicitud>(`/api/solicitudes/${id}/rechazar`);
    return response.data;
  }
};

// Servicios de Adquisiciones
export const AdquisicionesApi = {
  listar: async () => {
    const response = await apiClient.get<ProcesoResumen[]>('/api/adquisiciones');
    return response.data;
  },

  generar: async (idSolicitud: number) => {
    const response = await apiClient.post<{ 
      tipo_proceso: TipoProceso; 
      mensaje: string; 
      proceso: ProcesoResumen 
    }>('/api/adquisiciones/generar', { id_solicitud: idSolicitud });
    return response.data;
  },

  obtener: async (idProceso: number) => {
    const response = await apiClient.get<ProcesoDetalle>(`/api/adquisiciones/${idProceso}`);
    return response.data;
  },

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

  ofertar: async (idCompra: number, data: OfertaInput) => {
    const response = await apiClient.post<{ 
      mensaje: string; 
      oferta: OfertaOutput 
    }>(`/api/adquisiciones/${idCompra}/ofertar`, data);
    return response.data;
  },

  adjudicar: async (idCompra: number, idOferta: number) => {
    const response = await apiClient.put<{ 
      mensaje: string; 
      compra: ProcesoDetalle 
    }>(`/api/adquisiciones/${idCompra}/elegir-ganador`, { id_oferta: idOferta });
    return response.data;
  }
};

export default apiClient;