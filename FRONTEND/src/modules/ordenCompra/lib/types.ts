// Tipos base
export interface ItemType {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description: string;
}

export interface ProveedorType {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

// Tipos específicos para RFQ/Licitación/Directa
export interface RFQData {
  id: string;
  proveedorGanadorId: string;
  items: ItemType[];
  moneda: 'USD' | 'PEN';
}

export interface LicitacionData {
  id: string;
  numeroContrato: string;
  proveedor: ProveedorType;
  items: ItemType[];
  moneda: 'USD' | 'PEN';
  fechaEntregaContrato: string;
  isReadOnly: true; // Siempre true para licitaciones
}

export interface DirectaData {
  notificacionId: string;
  productoId: string;
  productoNombre: string;
  cantidadSugerida: number;
  nivelMinimo: number;
  cantidadActual: number;
}

// Props para componentes
export interface ProductRowProps {
  item: ItemType;
  currency: string;
  onChange: (id: string, field: keyof ItemType, value: string | number) => void;
  onDelete: (id: string) => void;
  calculateSubtotal: (quantity: number, unitPrice: number) => number;
  isReadOnly?: boolean;
}

export interface SummaryCardProps {
  totalAmount: number;
  currency: string;
  orderType: 'RFQ' | 'LICITACION' | 'DIRECTA';
  itemsCount: number;
  supplierName?: string;
  onCreateOrder: () => void;
  isDisabled?: boolean;
}

export interface OrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  notes: string;
  orderType: 'RFQ' | 'LICITACION' | 'DIRECTA';
  currency: string;
  items: ItemType[];
  totalAmount: number;
  supplier: ProveedorType | null;
  expectedDelivery: string;
  paymentMode: 'CONTADO' | 'TRANSFERENCIA' | 'CREDITO';
  paymentDays: number;
  deliveryTerms: string;
  solicitudId?: string;
  notificacionInventarioId?: string;
}

export interface ProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSupplier: (supplier: ProveedorType) => void;
  selectedSupplier: ProveedorType | null;
}


export interface CondicionesPago {
  diasPlazo: number;
  modalidad: 'CONTADO' | 'TRANSFERENCIA' | 'CREDITO';
}

export interface OrdenCompraRequest {
  tipoOrigen: 'RFQ' | 'LICITACION' | 'DIRECTA';
  proveedorId: string;
  solicitudId?: string;  // Para RFQ/Licitación
  notificacionInventarioId?: string;  // Para DIRECTA
  lineas: ItemType[];
  moneda: 'USD' | 'PEN';
  fechaEntregaEsperada: string;
  condicionesPago: CondicionesPago;
  terminosEntrega: string;
  observaciones?: string;
  titulo?: string;
}