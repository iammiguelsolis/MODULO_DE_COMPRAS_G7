import JSZip from "jszip";

// Mapeo de IDs de documentos a rutas de archivos en public/
const TEMPLATE_MAPPING: Record<string, string> = {
  // Legales
  "acta-constitucion":
    "documentos licitaciones/legales/Plantilla - Acta de Constitucion.docx",
  "vigencia-poder":
    "documentos licitaciones/legales/Plantilla - Certificado de Vigencia de Poder.docx",
  ruc: "documentos licitaciones/legales/Plantilla - RUC y Ficha RUC - Ejemplo.pdf",
  "dni-representante":
    "documentos licitaciones/legales/Plantilla - DNI del Representante Legal.docx",
  "poder-representacion":
    "documentos licitaciones/legales/Plantilla - Poder de Representacion.docx",
  "no-impedimento":
    "documentos licitaciones/legales/Plantilla - Declaracion Jurada de No Impedimento.docx",
  "estatutos-empresa":
    "documentos licitaciones/legales/Plantilla - Estatutos de la Empresa.docx",
  "buena-pro-anterior":
    "documentos licitaciones/legales/Plantilla - Certificado de Buena Pro Anterior.docx",
  "licencia-funcionamiento":
    "documentos licitaciones/legales/Plantilla - Licencia de Funcionamiento - Ejemplo.pdf",

  // Técnicos
  "cert-calidad-iso":
    "documentos licitaciones/tecnicos/Plantilla - Cerificaciones de Calidad (ISO) - Ejemplo.pdf",
  "ficha-tecnica":
    "documentos licitaciones/tecnicos/Plantilla - Ficha Tecnica del ProductoServicio.docx",
  "cert-homologacion":
    "documentos licitaciones/tecnicos/Plantilla - Certificado de Homologacion - Ejemplo.pdf",
  "catalogos-brochures":
    "documentos licitaciones/tecnicos/Plantilla - Catalogos y Brochures - Ejemplo.pdf",
  "especificaciones-tecnicas":
    "documentos licitaciones/tecnicos/Plantilla - Especificaciones Tecnicas.docx",
  "muestras-prototipos":
    "documentos licitaciones/tecnicos/Plantilla - Muestras o Prototipos.docx",
  "cert-origen":
    "documentos licitaciones/tecnicos/Plantilla - Certificado de Origen.docx",
  "cert-garantia":
    "documentos licitaciones/tecnicos/Plantilla - Certificado de Garantia.docx",
  "plan-implementacion":
    "documentos licitaciones/tecnicos/Plantilla - Plan de Implementacion.xlsx",
  "metodologia-trabajo":
    "documentos licitaciones/tecnicos/Plantilla - Metodologia de Trabajo.docx",
  "ordenes-compra-pasadas":
    "documentos licitaciones/legales/Plantilla - Ordenes de Compra Pasadas.doc", // Nota: Estaba en legales en el listado de archivos

  // Financieros
  "propuesta-economica":
    "documentos licitaciones/financieros/Plantilla - Propuesta Económica.docx",
  "estados-financieros-auditados":
    "documentos licitaciones/financieros/Plantilla - Estados Financieros Auditados.xlsx",
  "linea-credito-aprobada":
    "documentos licitaciones/financieros/Plantilla - Linea de Credito Aprobada.docx",
  "carta-fianza":
    "documentos licitaciones/financieros/Plantilla - Carta Fianza o Garantia Bancaria.docx",
  "poliza-fianza":
    "documentos licitaciones/financieros/Plantilla - Poliza de Fianza.docx",
  "cert-no-adeudo-tributario":
    "documentos licitaciones/financieros/Plantilla - Certificado de No Adeudo Tributario - Ejemplo.pdf",
  "cert-no-adeudo-essalud":
    "documentos licitaciones/financieros/Plantilla - Certificado de No Adeudo a ESALUD - Ejemplo.pdf",
  "balance-general":
    "documentos licitaciones/financieros/Plantilla - Balance General.xlsx",
  "estado-resultados":
    "documentos licitaciones/financieros/Plantilla - Estados de Resultados.xlsx",
  "flujo-caja-proyectado":
    "documentos licitaciones/financieros/Plantilla - Flujo de Caja Proyectado.xlsx",
  "referencia-bancaria":
    "documentos licitaciones/financieros/Plantilla - Referencias Bancarias.docx",
  "constancia-inscripcion-registro":
    "documentos licitaciones/financieros/Plantilla - Constancia de Inscripcion en Registro - Ejemplo.pdf",
};

const CONTRACT_TEMPLATE_PATH =
  "documentos licitaciones/Contrato/Plantilla - Contrato Adjudicacion.docx";

/**
 * Obtiene la ruta relativa de la plantilla basada en el ID del documento
 */
export const getTemplatePathById = (documentId: string): string | null => {
  const path = TEMPLATE_MAPPING[documentId];
  return path ? `/${path}` : null;
};

/**
 * Obtiene la ruta relativa de la plantilla del contrato
 */
export const getContractTemplatePath = (): string => {
  return `/${CONTRACT_TEMPLATE_PATH}`;
};

/**
 * Descarga un archivo individual
 */
export const downloadFile = (filePath: string, fileName: string): void => {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = fileName;
  link.setAttribute("target", "_blank");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Descarga múltiples archivos comprimidos en un ZIP
 */
export const downloadMultipleFilesAsZip = async (
  files: { path: string; name: string }[],
  zipName: string
): Promise<void> => {
  const zip = new JSZip();
  const promises = [];

  // Cargar cada archivo
  for (const file of files) {
    const promise = fetch(file.path)
      .then((response) => {
        if (!response.ok) throw new Error(`Error loading ${file.path}`);
        return response.blob();
      })
      .then((blob) => {
        // Determinar extensión si no está en el nombre
        let fileName = file.name;
        const pathExt = file.path.split(".").pop();
        if (
          pathExt &&
          !fileName.toLowerCase().endsWith(`.${pathExt.toLowerCase()}`)
        ) {
          fileName = `${fileName}.${pathExt}`;
        }
        zip.file(fileName, blob);
      })
      .catch((error) => {
        console.error(`Error downloading file ${file.name}:`, error);
      });

    promises.push(promise);
  }

  // Esperar a que todos se carguen
  await Promise.all(promises);

  // Generar y descargar ZIP
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating ZIP:", error);
  }
};
