import type { OrdenHistorial } from "../lib/types"; 

export const mockOrdenes: OrdenHistorial[] = [
  {
    id: 1,
    numero_referencia: "OC-202502-001",
    titulo: "Compra de Laptops Dell",
    proveedor: "TechSolution SAC",
    fecha_creacion: "2025-02-10",
    estado: "EN_PROCESO",
    tipo_origen: "LICITACION",
    moneda: "USD",
    total: 12500.0,
  },
  {
    id: 2,
    numero_referencia: "OC-202502-002",
    titulo: "Compra de Monitores",
    proveedor: "Computronix",
    fecha_creacion: "2025-02-08",
    estado: "BORRADOR",
    tipo_origen: "RFQ",
    moneda: "PEN",
    total: 3500.0,
  },
  {
    id: 3,
    numero_referencia: "OC-202502-003",
    titulo: "Reabastecimiento de Toners",
    proveedor: "OfficePrint SAC",
    fecha_creacion: "2025-02-01",
    estado: "CERRADA",
    tipo_origen: "DIRECTA",
    moneda: "USD",
    total: 900.0,
  }
];
