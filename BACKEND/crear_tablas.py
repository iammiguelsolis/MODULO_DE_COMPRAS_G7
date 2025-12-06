from app import create_app, db

# Importar todos los modelos para asegurar que SQLAlchemy los reconozca
# (Asegúrate de que todos los modelos estén importados aquí o en app/__init__.py)
from app.models.solicitudes.solicitud import Solicitud
from app.models.solicitudes.items import ItemSolicitado, MaterialSolicitado, ServicioSolicitado
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.models.facturasProveedor.factura_trazabilidad import FacturaTrazabilidad
from app.models.facturasProveedor.resultado_conciliacion import ResultadoConciliacion
from app.models.facturasProveedor.obligacion_pago import ObligacionPago
from app.models.adquisiciones.proceso import ProcesoAdquisicion, Compra
from app.models.adquisiciones.oferta import OfertaProveedor, ItemOfertado, MaterialOfertado, ServicioOfertado
from app.models.OrdenCompra.orden_compra import OrdenCompra, LineaOC
from app.models.proveedor_inventario.dominio_proveedor import Proveedor, DetallesProveedor, ContactoProveedor


app = create_app()

with app.app_context():
    print("Creando todas las tablas en la base de datos 'modulo_de_compras'...")
    # Esto creará todas las tablas que no tengan un bind_key específico (o sea, todas ahora)
    # en la base de datos por defecto.
    db.create_all()
    print("Tablas creadas exitosamente.")
