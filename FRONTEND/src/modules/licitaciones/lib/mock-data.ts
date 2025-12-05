import type { Licitacion, SolicitudPendiente } from "./types";
import { estados_li } from "./constants";

// ============================================================================
// MOCK DATA
// ============================================================================
// TODO: Los proveedores están mockeados en LicitacionDetailTemplate.tsx
// (líneas 133 y 360 con mockSuppliersForRegistration y mockAvailableSuppliers)
// Cuando el módulo de proveedores esté disponible, crear proveedoresService.ts
// y llamar a GET /api/proveedores para obtener la lista real.
// ============================================================================

export const allLicitaciones: Licitacion[] = Array.from(
  { length: 400 },
  (_, i) => {
    // Filtrar PENDIENTE para que no aparezca en la lista principal
    const estados_visibles = estados_li.filter((e) => e);
    return {
      id: `2025${String(i + 1).padStart(3, "0")}`,
      nombre: `Equipo de Cómputo #${i + 1}`,
      fechaCreacion: new Date(2025, 0, 1 + i).toISOString().split("T")[0],
      presupuestoMaximo: 10000 + ((i * 1337) % 149000) + i * 3.14,
      estado: estados_visibles[i % estados_visibles.length],
    };
  }
);

export const mockSolicitudesPendientes: SolicitudPendiente[] = [
  {
    id: "2025001",
    nombre: "Compra de Servidores 2025",
    notas:
      "Servidores para centro de datos principal. Se requiere alta disponibilidad.",
    items: [
      {
        id: "1",
        type: "Producto",
        description: "Server Dell PowerEdge R750",
        quantity: 5,
        price: 8000,
        total: 40000,
      },
    ],
    presupuestoMaximo: 45000,
    documentosRequeridos: [
      {
        id: "propuesta-economica",
        nombre: "Propuesta Económica",
        tipo: "ECONOMICO",
        obligatorio: true,
      },
      {
        id: "ficha-tecnica",
        nombre: "Ficha Técnica del Producto",
        tipo: "TECNICO",
        obligatorio: true,
      },
    ],
    fechaCreacion: "2025-01-15",
    solicitante: "Samuel Luque",
  },
  {
    id: "2025002",
    nombre: "Instalación de Redes 2025",
    notas: "Instalación de redes en todas las oficinas.",
    items: [
      {
        id: "1",
        type: "Servicio",
        description: "Instalación de redes",
        quantity: 50,
        price: 450,
        total: 22500,
      },
    ],
    presupuestoMaximo: 25000,
    documentosRequeridos: [
      {
        id: "propuesta-economica",
        nombre: "Propuesta Económica",
        tipo: "ECONOMICO",
        obligatorio: true,
      },
    ],
    fechaCreacion: "2025-01-16",
    solicitante: "Maria Rodriguez",
  },
];
