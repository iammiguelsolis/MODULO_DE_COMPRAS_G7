import xml.etree.ElementTree as ET
from app.services.facturasProveedor.interfaces.i_extractor_factura import IExtractorFactura

class ExtractorXML(IExtractorFactura):
    def __init__(self):
        self.xml_path = None

    def extraer_datos(self, documento_path: str) -> dict:
        self.xml_path = documento_path
        try:
            tree = ET.parse(self.xml_path)
            root = tree.getroot()
            
            # Nota: En XML reales hay namespaces como {urn:oasis:names:specification:ubl:schema:xsd:Invoice-2}
            # Aquí hacemos una búsqueda simple simulada
            data = {}
            
            # Buscando ID (Numero Factura) - Ejemplo simple
            # En UBL real sería algo como: root.find('.//{urn:...}ID').text
            nodo_id = root.find('ID') 
            if nodo_id is not None:
                data['numero_factura'] = nodo_id.text
            else:
                data['numero_factura'] = "XML-INDETERMINADO"

            # Simulamos total
            data['total'] = 1000.00 
            
            return data
        except Exception as e:
            print(f"Error parseando XML: {e}")
            return {}