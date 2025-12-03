import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/facturas-proveedor';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= TYPES =============
export interface FacturaProveedor {
  id: string;
  numero_factura: string;
  version: number;
  proveedor_nombre: string;
  proveedor_ruc: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  moneda: string;
  sub_total: number;
  igv: number;
  total: number;
  estado: 'BORRADOR' | 'EN_CONCILIACION' | 'APROBADA';
  orden_compra_id?: string;
  origen: 'MANUAL' | 'AUTOMATICO';
  created_at: string;
  updated_at: string;
}

export interface FacturaDetalle extends FacturaProveedor {
  serie: string;
  numero: string;
  lineas_detalle?: LineaDetalle[];
}

export interface LineaDetalle {
  id: string;
  item: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  igv: number;
  subtotal: number;
  estado_conciliacion?: string;
}

export interface Adjunto {
  id: string;
  nombre_archivo: string;
  tipo_archivo: string;
  url_storage: string;
  tamano_bytes: number;
  fecha_subida: string;
}

export interface ResultadoConciliacion {
  id: string;
  factura_id: string;
  estado: 'EXITOSA' | 'FALLIDA';
  discrepancias: string[];
  mensaje: string;
  fecha_conciliacion: string;
}

export interface TrazabilidadLog {
  id: string;
  accion: string;
  usuario: string;
  timestamp: string;
  detalles: string;
}

export interface CreateFacturaManual {
  proveedor_nombre: string;
  proveedor_ruc: string;
  serie: string;
  numero: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  moneda: string;
  sub_total: number;
  igv: number;
  total: number;
  orden_compra_id?: string;
}

// ============= API FUNCTIONS =============

// Listar todas las facturas
export const listarFacturas = async (): Promise<FacturaProveedor[]> => {
  const response = await api.get('/');
  return response.data;
};

// Crear factura manual
export const crearFacturaManual = async (data: CreateFacturaManual): Promise<FacturaProveedor> => {
  const response = await api.post('/', data);
  return response.data;
};

// Crear factura con prellenado automático
export const crearFacturaPrellenado = async (file: File): Promise<FacturaProveedor> => {
  const formData = new FormData();
  formData.append('archivo', file);
  
  const response = await api.post('/prellenado', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Obtener detalle de una factura específica
export const obtenerFacturaDetalle = async (id: string): Promise<FacturaDetalle> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Obtener todas las versiones de una factura por numero_factura
export const obtenerVersionesFactura = async (numeroFactura: string): Promise<FacturaProveedor[]> => {
  const response = await api.get(`/?numero_factura=${numeroFactura}`);
  return response.data;
};

// Actualizar factura (ej. agregar orden_compra_id)
export const actualizarFactura = async (
  id: string,
  data: Partial<CreateFacturaManual>
): Promise<FacturaProveedor> => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

// Listar adjuntos de una factura
export const listarAdjuntos = async (id: string): Promise<Adjunto[]> => {
  const response = await api.get(`/${id}/adjuntos`);
  return response.data;
};

// Subir adjunto adicional
export const subirAdjunto = async (id: string, file: File): Promise<Adjunto> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/${id}/adjuntos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Ejecutar conciliación
export const ejecutarConciliacion = async (
  id: string,
  ordenCompraId: string
): Promise<ResultadoConciliacion> => {
  const response = await api.post(`/${id}/conciliacion`, {
    ordenCompraId,
  });
  return response.data;
};

// Obtener resultados de conciliación
export const obtenerResultadosConciliacion = async (
  id: string
): Promise<ResultadoConciliacion[]> => {
  const response = await api.get(`/${id}/resultados-conciliacion`);
  return response.data;
};

// Obtener trazabilidad
export const obtenerTrazabilidad = async (id: string): Promise<TrazabilidadLog[]> => {
  const response = await api.get(`/${id}/trazabilidad`);
  return response.data;
};

// Enviar a CxP (crear obligación de pago)
export const enviarACuentasPorPagar = async (id: string): Promise<any> => {
  const response = await api.post(`/${id}/obligacion-pago`);
  return response.data;
};

export default api;