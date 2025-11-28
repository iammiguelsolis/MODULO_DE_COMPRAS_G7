import type { Documento } from "./types";

// Status options para filtros de licitaciones
export const estados_li = [
  "BORRADOR",
  "NUEVA",
  "EN INVITACION",
  "CON PROPUESTAS",
  "EN EVALUACION",
  "ADJUDICADO",
  "CON CONTRATO",
  "FINALIZADA",
  "CANCELADA",
] as const;

// Documentos Legales
export const doc_legales: Documento[] = [
  {
    id: "acta-constitucion",
    nombre: "Acta de Constitución",
    tipo: "LEGAL",
    obligatorio: true,
  },
  {
    id: "vigencia-poder",
    nombre: "Certificado de Vigencia de Poder",
    tipo: "LEGAL",
    obligatorio: true,
  },
  { id: "ruc", nombre: "RUC y Ficha RUC", tipo: "LEGAL", obligatorio: true },
  {
    id: "dni-representante",
    nombre: "DNI del Representante Legal",
    tipo: "LEGAL",
    obligatorio: true,
  },
  {
    id: "poder-representacion",
    nombre: "Poder de Representación",
    tipo: "LEGAL",
    obligatorio: false,
  },
  {
    id: "no-impedimento",
    nombre: "Declaración Jurada de No Impedimento",
    tipo: "LEGAL",
    obligatorio: true,
  },
  {
    id: "estatutos-empresa",
    nombre: "Estatutos de la Empresa",
    tipo: "LEGAL",
    obligatorio: false,
  },
  {
    id: "buena-pro-anterior",
    nombre: "Certificado de Buena Pro Anterior",
    tipo: "LEGAL",
    obligatorio: false,
  },
  {
    id: "licencia-funcionamiento",
    nombre: "Licencia de Funcionamiento",
    tipo: "LEGAL",
    obligatorio: true,
  },
];

// Documentos Técnicos
export const doc_tec: Documento[] = [
  {
    id: "cert-calidad-iso",
    nombre: "Certificaciones de Calidad (ISO)",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "ficha-tecnica",
    nombre: "Ficha Técnica del Producto/Servicio",
    tipo: "TECNICO",
    obligatorio: true,
  },
  {
    id: "cert-homologacion",
    nombre: "Certificados de Homologación",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "catalogos-brochures",
    nombre: "Catálogos y Brochures",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "especificaciones-tecnicas",
    nombre: "Especificaciones Técnicas",
    tipo: "TECNICO",
    obligatorio: true,
  },
  {
    id: "muestras-prototipos",
    nombre: "Muestras o Prototipos",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "cert-origen",
    nombre: "Certificado de Origen",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "cert-garantia",
    nombre: "Certificado de Garantía",
    tipo: "TECNICO",
    obligatorio: true,
  },
  {
    id: "plan-implementacion",
    nombre: "Plan de implementación",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "metodologia-trabajo",
    nombre: "Metodología de Trabajo",
    tipo: "TECNICO",
    obligatorio: false,
  },
  {
    id: "ordenes-compra-pasadas",
    nombre: "Órdenes de Compra Pasadas",
    tipo: "TECNICO",
    obligatorio: false,
  },
];

// Documentos Financieros
export const doc_finan: Documento[] = [
  {
    id: "propuesta-economica",
    nombre: "Propuesta Económica",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
  {
    id: "estados-financieros-auditados",
    nombre: "Estados Financieros Auditados",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
  {
    id: "linea-credito-aprobada",
    nombre: "Línea de Crédito Aprobada",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "carta-fianza",
    nombre: "Carta de Fianza",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
  {
    id: "poliza-fianza",
    nombre: "Póliza de Fianza",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "cert-no-adeudo-tributario",
    nombre: "Certificado de No Adeudo Tributario",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
  {
    id: "cert-no-adeudo-essalud",
    nombre: "Certificado de No Adeudo a ESSALUD",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
  {
    id: "balance-general",
    nombre: "Balance General",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "estado-resultados",
    nombre: "Estado de Resultados",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "flujo-caja-proyectado",
    nombre: "Flujo de Caja Proyectado",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "referencia-bancaria",
    nombre: "Referencia Bancaria",
    tipo: "ECONOMICO",
    obligatorio: false,
  },
  {
    id: "constancia-inscripcion-registro",
    nombre: "Constancia de Inscripción en Registro",
    tipo: "ECONOMICO",
    obligatorio: true,
  },
];

// IDs de documentos requeridos obligatorios
export const doc_finan_req = ["propuesta-economica"];

// Límite de monto para proceso de licitación (S/)
export const limite_money = 10000;
