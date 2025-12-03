from app import create_app, db

# 1. IMPORTA TODOS TUS MODELOS (Obligatorio)
# Si no los importas aquí, SQLAlchemy no sabrá que existen y no creará las tablas.
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.models.facturasProveedor.factura_trazabilidad import FacturaTrazabilidad
from app.models.facturasProveedor.obligacion_pago import ObligacionPago
from app.models.facturasProveedor.resultado_conciliacion import ResultadoConciliacion

app = create_app()

with app.app_context():
    print("⚠️  ATENCIÓN: Borrando tablas del schema 'facturas'...")
    # Esto borra solo las tablas asociadas a tu bind 'facturas_db'
    db.drop_all(bind_key='facturas_db') 
    
    print("🏗️  Creando tablas nuevas con la estructura actualizada...")
    # Crea las tablas de nuevo con los cambios de tus modelos
    db.create_all(bind_key='facturas_db')
    
    print("✅ ¡Base de datos actualizada correctamente!")

exit()