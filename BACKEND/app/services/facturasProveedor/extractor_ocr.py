import pdfplumber
import re
from datetime import datetime
from app.services.facturasProveedor.interfaces.i_extractor_factura import IExtractorFactura

class ExtractorOCR(IExtractorFactura):
    def __init__(self, modelo: str = "pdfplumber", idioma: str = "spa"):
        self.modelo = modelo
        self.idioma = idioma

    def extraer_datos(self, documento_path: str) -> dict:
        print(f"📄 Leyendo PDF real desde: {documento_path}")
        
        texto_completo = ""
        datos = {}

        try:
            # 1. Abrir el PDF y extraer texto
            with pdfplumber.open(documento_path) as pdf:
                # Leemos solo la primera página (usualmente ahí están los totales)
                first_page = pdf.pages[0]
                texto_completo = first_page.extract_text()
            
            print("--- TEXTO EXTRAÍDO ---")
            print(texto_completo)
            print("----------------------")

            # 2. Buscar datos usando Expresiones Regulares (Regex)
            # Esto es buscar patrones en el texto crudo

            # A. BUSCAR NÚMERO DE FACTURA
            # Busca patrones como "Factura: F001-23" o "N° F001-23"
            # Regex explicada: (Factura|N°|Invoice) seguido de chars, espacios y luego captura el código
            match_factura = re.search(r'(Factura|N°|Número)[:\s]*([A-Za-z0-9-]+)', texto_completo, re.IGNORECASE)
            if match_factura:
                datos['numero_factura'] = match_factura.group(2)
            else:
                # Fallback: Si no encuentra etiqueta, busca algo que parezca una serie (F001-...)
                match_serie = re.search(r'([F|B]\d{3}-\d+)', texto_completo)
                if match_serie:
                    datos['numero_factura'] = match_serie.group(1)

            # B. BUSCAR TOTAL
            # Busca "Total: 1500.00" o "Importe: 1,500.00"
            # Regex: Busca la palabra Total seguida de cualquier cosa y luego números con puntos/comas
            match_total = re.search(r'(Total|Importe|Monto)[\D]*([\d,]+\.?\d{2})', texto_completo, re.IGNORECASE)
            if match_total:
                # Limpiamos el string (quitamos comas si es miles, ej: 1,500.00 -> 1500.00)
                monto_str = match_total.group(2).replace(',', '')
                datos['total'] = float(monto_str)

            # C. BUSCAR FECHA
            # Busca formatos como YYYY-MM-DD o DD/MM/YYYY
            # Prioridad 1: Formato ISO (2023-11-30)
            match_fecha_iso = re.search(r'(\d{4}-\d{2}-\d{2})', texto_completo)
            if match_fecha_iso:
                datos['fecha'] = match_fecha_iso.group(1)
            else:
                # Prioridad 2: Formato Latino (30/11/2023)
                match_fecha_lat = re.search(r'(\d{2}/\d{2}/\d{4})', texto_completo)
                if match_fecha_lat:
                    fecha_str = match_fecha_lat.group(1)
                    # Convertimos a YYYY-MM-DD para que el backend lo entienda
                    fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y')
                    datos['fecha'] = fecha_obj.strftime('%Y-%m-%d')

            return datos

        except Exception as e:
            print(f"❌ Error leyendo PDF real: {e}")
            return {}