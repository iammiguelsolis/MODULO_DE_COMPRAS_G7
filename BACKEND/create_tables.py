# create_tables.py
from app import create_app
from app.bdd import db

# Importa TODOS tus modelos
from app.models.proveedor_inventario.dominio_proveedor import (
    Proveedor, ContactoProveedor, DetallesProveedor
)
from app.models.proveedor_inventario.conexion_alamacen import (
    Almacen, Entrega, DetalleEntrega
)
# Agrega otros modelos si tienes...

print("=" * 60)
print("🚀 CREACIÓN DE TABLAS EN LOCAL")
print("=" * 60)

app = create_app()

with app.app_context():
    try:
        print("\n🔄 Conectando a LOCAL MySQL...")
        print(f"📍 Base de datos: modulo_de_compras_test")
        
        print("\n🔄 Creando tablas basadas en modelos...")
        db.create_all()
        
        print("\n✅ ¡Tablas creadas exitosamente")
        
        # Opcional: listar tablas creadas
        inspector = db.inspect(db.engine)
        print("\n📋 Tablas en la base de datos:")
        for table in inspector.get_table_names():
            print(f"   ✓ {table}")
            
    except Exception as e:
        print(f"\n❌ Error al crear tablas: {e}")

print("\n" + "=" * 60)