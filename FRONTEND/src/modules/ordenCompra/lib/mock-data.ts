import type { ProveedorType } from './types';

// Proveedores de ejemplo
export const MOCK_PROVEEDORES: ProveedorType[] = [
  {
    id: 'prov-001',
    name: 'Tecnología Avanzada S.A.',
    contact: 'Carlos Rodríguez',
    phone: '+51 300 123 4567',
    email: 'carlos@tecnologia-avanzada.com',
  },
  {
    id: 'prov-002',
    name: 'Suministros Industriales Perú',
    contact: 'María González',
    phone: '+51 310 987 6543',
    email: 'maria@suministros-peru.com',
  },
  {
    id: 'prov-003',
    name: 'Office Solutions Perú',
    contact: 'Roberto Silva',
    phone: '+51 320 555 7890',
    email: 'roberto@office-solutions.pe',
  },
];

// Items de ejemplo para RFQ
export const MOCK_RFQ_ITEMS = [
  {
    id: 'item-001',
    productId: 'prod-001',
    name: 'Laptop Dell XPS 13',
    quantity: 10,
    unitPrice: 1500.00,
    description: 'Laptop i7, 16GB RAM, 512GB SSD',
  },
  {
    id: 'item-002',
    productId: 'prod-002',
    name: 'Monitor 24" LG',
    quantity: 5,
    unitPrice: 250.00,
    description: 'Monitor LED 24 pulgadas Full HD',
  },
];