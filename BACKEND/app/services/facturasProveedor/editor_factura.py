from app.bdd import db
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto

from app.services.facturasProveedor.validador_totales import ValidadorTotales
from app.services.facturasProveedor.validador_impuestos import ValidadorImpuestos

class EditorFactura:
    _instance = None

    def __init__(self):
        if EditorFactura._instance is not None:
            raise Exception("Esta clase es Singleton. Usa get_instance().")

    @staticmethod
    def get_instance():
        if EditorFactura._instance is None:
            EditorFactura._instance = EditorFactura()
        return EditorFactura._instance

    # Métodos del diagrama
    def agregar_linea(self, linea: LineaFactura, factura: FacturaProveedor):
        print(f"Agregando línea {linea.descripcion} a factura {factura.numero_factura}")
        factura.lineas.append(linea)

    def quitar_linea(self, index: int, factura: FacturaProveedor):
        if 0 <= index < len(factura.lineas):
            print(f"Quitando línea índice {index}")
            factura.lineas.pop(index)

    def adjuntar_documento_adjunto(self, documento: DocumentoAdjunto, factura: FacturaProveedor):
        print(f"Adjuntando documento {documento.nombre_archivo}")
        factura.documentos_adjuntos.append(documento)

    def eliminar_adjunto(self, numero_factura: str):
        # Lógica para buscar y eliminar adjunto por número de factura
        pass

    def calcular_total(self, numero_factura: str):
        print(f"Recalculando totales para {numero_factura}...")
        pass

    def registrar(self, factura: FacturaProveedor):
        print(f"Registrando factura {factura.numero_factura} en DB...")
        
        # --- PATRÓN CHAIN OF RESPONSIBILITY ---
        # 1. Instanciar validadores
        validador_totales = ValidadorTotales()
        validador_impuestos = ValidadorImpuestos()
        
        # 2. Configurar la cadena: Totales -> Impuestos
        validador_totales.set_siguiente(validador_impuestos)
        
        # 3. Ejecutar la cadena
        print("Ejecutando cadena de validación...")
        validador_totales.validar_factura_proveedor(factura)
        print("Validación completada exitosamente.")
        # --------------------------------------
        
        try:
            db.session.add(factura)
            db.session.commit()
            
            print(f"Factura guardada con ID: {factura.id}")
            
            # 3. Notificamos a los observers (si tienes implementado el patrón observer)
            factura.notify(factura)
            
        except Exception as e:
            db.session.rollback() # Si falla, deshacemos cambios pendientes
            print(f"Error al guardar en DB: {str(e)}")
            raise e # Relanzamos el error para que la ruta sepa que falló