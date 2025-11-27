export interface Item {
  id: string;
  type: "Producto" | "Servicio";
  description: string;
  quantity?: number;
  price?: number;
  estimatedHours?: number;
  hourlyRate?: number;
}

/**
 * Representa una licitación en el sistema
 */
export interface Licitacion {
  id: string;
  titulo: string;
  fechaCreacion: string;
  presupuesto: number;
  estado: string;
}

/**
 * Estados posibles de una licitación en el flujo del proceso
 */
export type LicitacionStatus =
  | "BORRADOR"
  | "NUEVA"
  | "EN_INVITACION"
  | "CON_PROPUESTAS"
  | "EVALUACION_TECNICA"
  | "EVALUACION_ECONOMIA"
  | "ADJUDICADO"
  | "CON_CONTRATO"
  | "FINALIZADA"
  | "CANCELADA";

/**
 * Representa un documento requerido en una licitación
 */
export interface Documento {
  id: string;
  name: string;
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
  name: string;
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
  title: string;
  createdDate: string;
  buyer: string;
  supervisor: string;
  currentStatus: LicitacionStatus;
  timestamps: Partial<Record<LicitacionStatus, string>>;
  estimatedAmount: number;
  maxBudget: number;
  items: Item[];
  requiredDocuments: Documento[];
  providers?: Provider[];
  contract?: Contract;
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
  title: string;
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
  presupuesto?: string;
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
export interface EconomicEvaluationResults {
  evaluations: EconomicEvaluation[];
  winnerId?: number; // ID del proveedor ganador (mayor puntuación)
}
