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
  { id: "acta-constitucion", name: "Acta de Constitución" },
  { id: "vigencia-poder", name: "Certificado de Vigencia de Poder" },
  { id: "ruc", name: "RUC y Ficha RUC" },
  { id: "dni-representante", name: "DNI del Representante Legal" },
  { id: "poder-representacion", name: "Poder de Representación" },
  { id: "no-impedimento", name: "Declaración Jurada de No Impedimento" },
  { id: "estatutos-empresa", name: "Estatutos de la Empresa" },
  { id: "buena-pro-anterior", name: "Certificado de Buena Pro Anterior" },
  { id: "licencia-funcionamiento", name: "Licencia de Funcionamiento" },
];

// Documentos Técnicos
export const doc_tec: Documento[] = [
  { id: "cert-calidad-iso", name: "Certificaciones de Calidad (ISO)" },
  { id: "ficha-tecnica", name: "Ficha Técnica del Producto/Servicio" },
  { id: "cert-homologacion", name: "Certificados de Homologación" },
  { id: "catalogos-brochures", name: "Catálogos y Brochures" },
  { id: "especificaciones-tecnicas", name: "Especificaciones Técnicas" },
  { id: "muestras-prototipos", name: "Muestras o Prototipos" },
  { id: "cert-origen", name: "Certificado de Origen" },
  { id: "cert-garantia", name: "Certificado de Garantía" },
  { id: "plan-implementacion", name: "Plan de implementación" },
  { id: "metodologia-trabajo", name: "Metodología de Trabajo" },
  { id: "ordenes-compra-pasadas", name: "Órdenes de Compra Pasadas" },
];

// Documentos Financieros
export const doc_finan: Documento[] = [
  { id: "propuesta-economica", name: "Propuesta Económica" },
  {
    id: "estados-financieros-auditados",
    name: "Estados Financieros Auditados",
  },
  { id: "linea-credito-aprobada", name: "Línea de Crédito Aprobada" },
  { id: "carta-fianza", name: "Carta de Fianza" },
  { id: "poliza-fianza", name: "Póliza de Fianza" },
  {
    id: "cert-no-adeudo-tributario",
    name: "Certificado de No Adeudo Tributario",
  },
  { id: "cert-no-adeudo-essalud", name: "Certificado de No Adeudo a ESSALUD" },
  { id: "balance-general", name: "Balance General" },
  { id: "estado-resultados", name: "Estado de Resultados" },
  { id: "flujo-caja-proyectado", name: "Flujo de Caja Proyectado" },
  { id: "referencia-bancaria", name: "Referencia Bancaria" },
  {
    id: "constancia-inscripcion-registro",
    name: "Constancia de Inscripción en Registro",
  },
];

// IDs de documentos requeridos obligatorios
export const doc_finan_req = ["propuesta-economica"];

// Límite de monto para proceso de licitación (S/)
export const limite_money = 10000;
