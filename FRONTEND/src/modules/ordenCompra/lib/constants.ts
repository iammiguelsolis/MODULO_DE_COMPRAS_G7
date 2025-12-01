// Monedas disponibles
export const CURRENCIES = [
  { value: 'USD', label: 'USD - Dólar Americano', symbol: '$' },
  { value: 'PEN', label: 'PEN - Sol Peruano', symbol: 'S/.' },
] as const;

// Tipos de orden
export const ORDER_TYPES = [
  { value: 'RFQ', label: 'Compra Simple (RFQ)', description: 'Orden generada desde cotización simple' },
  { value: 'LICITACION', label: 'Licitación', description: 'Orden vinculada a contrato aprobado' },
  { value: 'DIRECTA', label: 'Compra Directa', description: 'Orden automática para reabastecimiento' },
] as const;

// Estados de orden
export const ORDER_STATUSES = [
  { value: 'BORRADOR', label: 'Borrador', color: 'gray' },
  { value: 'EN_PROCESO', label: 'En Proceso', color: 'blue' },
  { value: 'APROBADA', label: 'Aprobada', color: 'green' },
  { value: 'RECIBIDA', label: 'Recibida', color: 'purple' },
  { value: 'CERRADA', label: 'Cerrada', color: 'indigo' },
  { value: 'CANCELADA', label: 'Cancelada', color: 'pink' },
] as const;