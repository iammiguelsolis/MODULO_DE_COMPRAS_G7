from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.services.facturasProveedor.interfaces.i_extractor_factura import IExtractorFactura
from datetime import datetime

class RellenadorAutomatico:
    
    def rellenar_automaticamente(self, factura: FacturaProveedor, documento: DocumentoAdjunto, adjuntador_tool, extractor: IExtractorFactura, file_content: bytes):
        """
        Orquesta la extracción de datos y la vinculación del archivo.
        Agregamos 'file_content' para pasarlo al adjuntador.
        """
        print("🤖 Rellenador: Iniciando proceso automático...")
        
        # 1. Extracción de Datos (Usando la Estrategia - OCR o XML)
        # El documento.ruta aquí debe ser una ruta local temporal válida
        datos_extraidos = extractor.extraer_datos(documento.ruta)
        
        print(f"📊 Datos extraídos: {datos_extraidos}")

        # 2. Poblar la Factura (Mapping)
        if "numero_factura" in datos_extraidos:
            factura.numero_factura = datos_extraidos["numero_factura"]
        
        if "total" in datos_extraidos:
            factura.total = float(datos_extraidos["total"])

        # Intento de parseo de fecha (ajusta el formato según tu OCR)
        if "fecha" in datos_extraidos:
            try:
                # Asumiendo formato YYYY-MM-DD
                factura.fecha_emision = datetime.strptime(datos_extraidos["fecha"], "%Y-%m-%d").date()
            except ValueError:
                print("⚠️ No se pudo parsear la fecha automáticamente")

        # 3. Adjuntar el documento (Subida a Supabase + DB)
        # Llamamos a tu herramienta de adjuntado
        adjuntador_tool.adjuntar_documento(factura, documento, file_content)