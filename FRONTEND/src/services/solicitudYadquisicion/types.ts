// ==========================================
// ENUMS & TYPES
// ==========================================
export type TipoItem = 'MATERIAL' | 'SERVICIO';
export type TipoProceso = 'COMPRA' | 'LICITACION';
export type CanalInvitacion = 'EMAIL' | 'WHATSAPP';
export type EstadoProceso = 'NUEVO' | 'INVITANDO_PROVEEDORES' | 'EVALUANDO_OFERTAS' | 'CERRADO';

// ==========================================
// SOLICITUDES
// ==========================================

export interface ItemSolicitudInput {
  tipo: TipoItem;
  nombre?: string;
  cantidad: number;
  precio_unitario?: number;
  tarifa_hora?: number;
  horas_estimadas?: number;
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
  items: ItemSolicitudOutput[];
}

// ==========================================
// ADQUISICIONES (OFERTAS)
// ==========================================

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
  marca?: string;
  cantidad?: number;
  dias?: number;
  experiencia?: string;
}

export interface ItemOfertaOutput {
  id: number;
  tipo_item: TipoItem;
  precio_oferta: number;
  descripcion: string;
  marca?: string;
  cantidad_disponible?: number;
  dias_ejecucion?: number;
  experiencia_tecnico?: string;
}

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

// ==========================================
// ADQUISICIONES (PROCESOS)
// ==========================================

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
// PROVEEDORES
// ==========================================

export interface Proveedor {
  id_proveedor: number;
  razon_social: string;
  ruc: string;
  email: string;
  pais: string;
  telefono: string;
  domicilio_legal: string;
}