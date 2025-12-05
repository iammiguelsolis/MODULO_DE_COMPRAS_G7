import React from "react";

export interface Item {
  id: string;
  type: "MATERIAL" | "SERVICIO";
  description: string;
  quantity?: number;
  price?: number;
  estimatedHours?: number;
  hourlyRate?: number;
  total?: number;
}

/**
 * Representa una licitación en el sistema
 */
export interface Licitacion {
  id: string;
  nombre: string;
  fechaCreacion: string;
  presupuestoMaximo: number;
  estado: string;
}

/**
 * Estados posibles de una licitación en el flujo del proceso
 */
export type LicitacionStatus =
  | "PENDIENTE"
  | "NUEVA"
  | "EN_INVITACION"
  | "CON_PROPUESTAS"
  | "EVALUACION_TECNICA"
  | "EVALUACION_ECONOMIA"
  | "ADJUDICADA"
  | "CON_CONTRATO"
  | "FINALIZADA"
  | "CANCELADA";

/**
 * Representa un documento requerido en una licitación
 */
export interface Documento {
  id: string;
  nombre: string; // Renamed from name to match API 'documento' or keep 'name' and map? API says 'documento'. Let's use 'nombre' as it's more standard for an object. API 'documento' field is the name.
  tipo: "LEGAL" | "TECNICO" | "ECONOMICO";
  obligatorio: boolean;
}

/**
 * Categoría de documentos con icono y lista
 */
export interface DocumentCategory {
  title: string;
  documents: string[];
  icon?: React.ReactNode;
}

/**
 * Proveedor/Supplier en el sistema
 */
export interface Provider {
  id: number;
  razon_social: string;
  ruc: string;
  email: string;
}

/**
 * Contrato de adjudicación
 */
export interface Contract {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  licitacionId: string;
  providerId: number;
}

/**
 * Licitación completa con todos los detalles
 */
export interface LicitacionDetail {
  id: string;
  nombre: string;
  createdDate: string;
  buyer: string;
  supervisor: string;
  currentStatus: LicitacionStatus;
  timestamps: {
    creacion: string;
    aprobacion?: string;
    invitacion?: string;
    cierre_invitacion?: string;
    inicio_evaluacion?: string;
    fin_evaluacion?: string;
    adjudicacion?: string;
    contrato?: string;
  };
  estimatedAmount: number;
  presupuestoMaximo: number;
  fechaLimite?: string; // Fecha límite para recibir propuestas
  items: Item[];
  requiredDocuments: DocumentoRequeridoDTO[];
  providers?: Provider[];
  invitedProviders?: Provider[];
  contract?: Contract;
  cantidadInvitaciones?: number;
  cantidadPropuestas?: number;
}

/**
 * Solicitud de licitación en estado pendiente
 */
export interface SolicitudPendiente {
  id: string;
  nombre: string;
  notas: string;
  items: Item[];
  presupuestoMaximo: number;
  documentosRequeridos: Documento[];
  fechaCreacion: string;
  solicitante: string;
}

// ==================================================================
// PROPS DE COMPONENTES COMPARTIDOS
// ==================================================================

/**
 * Props para DetallesSolicitudForm (usado en múltiples templates)
 */
export interface DetallesSolicitudProps {
  title: string;
  onTitleChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  titleError?: string;
}

/**
 * Props para ResumenCard (usado en SolicitudCompraTemplate y RequestLicitacionTemplate)
 */
export interface ResumenProps {
  totalAmount: number;
  onSubmit: () => void;
  nombre: string;
  items: Item[];
  subtitle?: string;
  buttonText?: string;
}

/**
 * Props para ProductosYServicios
 */
export interface ProductosYServiciosProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
  error?: string;
}

/**
 * Props para LicitacionesTable
 */
export interface LicitacionesTableProps {
  licitaciones: Licitacion[];
}

/**
 * Props para FilterPanel/FilterBar
 */
export interface FilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

// ==================================================================
// EVALUATION TYPES
// ==================================================================

/**
 * Estado de evaluación de un documento: null (no evaluado), 'correct', 'incorrect'
 */
export type DocumentEvaluationStatus = "correct" | "incorrect" | null;

/**
 * Evaluación de un documento individual
 */
export interface DocumentEvaluation {
  documentId: string;
  documentName: string;
  fileSize: string;
  url?: string;
  status: DocumentEvaluationStatus; // null = no evaluado aún
}

/**
 * Evaluación completa de un proveedor por el comité técnico
 */
export interface ProviderEvaluation {
  providerId: number;
  providerName: string;
  providerRuc: string;
  documentsEvaluation: DocumentEvaluation[];
  status: "approved" | "rejected";
  rejectionReason?: string;
  evaluatedCount: number; // documentos con status !== null
  approvedCount: number; // documentos con status === 'correct'
  rejectedCount: number; // documentos con status === 'incorrect'
}

/**
 * Props para LicitacionGeneralInfo (ahora parametrizable)
 */
export interface LicitacionGeneralInfoProps {
  presupuestoMaximo?: string;
  solicitudOrigen?: string;
  fechaLimite?: string;
  comprador?: string;
  proveedoresTecnicamenteAprobados?: number;
}

// ==================================================================
// ECONOMIC EVALUATION TYPES
// ==================================================================

/**
 * Evaluación económica de un proveedor
 */
export interface EconomicEvaluation {
  providerId: number;
  providerName: string;
  providerRuc: string;
  score?: number; // 0-100, undefined si rechazado
  justification: string;
  status: "approved" | "rejected";
  isRejected: boolean; // Indica si se marcó checkbox de rechazo
}

/**
 * Resultado final con ganador
 */
// ==================================================================
// BACKEND DTO TYPES
// ==================================================================

export interface ItemDTO {
  id: number;
  nombre: string;
  cantidad: number;
  tipo: "MATERIAL" | "SERVICIO";
  comentario?: string;
  precio_referencia: number;
}

export interface DocumentoRequeridoDTO {
  id_requerido: number;
  nombre: string;
  tipo: string;
  obligatorio: boolean;
  ruta_plantilla?: string;
}

export interface ProveedorDTO {
  id: number;
  razon_social: string;
  ruc: string;
  email: string;
}

export interface DocumentoDTO {
  id_documento: number;
  nombre: string;
  url_archivo: string;
  tipo: string;
  validado: boolean;
  observaciones: string;
  fecha_subida: string;
}

export interface PropuestaResponseDTO {
  id_propuesta: number;
  fecha_presentacion: string;
  estado_tecnico: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  estado_economico: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  puntuacion_economica?: number;
  es_ganadora: boolean;
  proveedor: ProveedorDTO;
  documentos: DocumentoDTO[];
}

export interface ContratoDTO {
  id_contrato: number;
  fecha_generacion: string;
  plantilla_url: string;
  documento_firmado_url?: string;
  estado: string;
}

export interface LicitacionResponseDTO {
  id_licitacion: number;
  titulo: string;
  comentarios: string;
  estado: string;
  presupuesto_max: number;
  fecha_limite: string | null;
  items: ItemDTO[];
  documentos_requeridos: DocumentoRequeridoDTO[];
  proveedor_ganador?: any; // Ajustar según necesidad
  contrato?: ContratoDTO;
  cantidad_invitaciones?: number;
  cantidad_propuestas?: number;
  proveedores_invitados?: ProveedorDTO[];
}
