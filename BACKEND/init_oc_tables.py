from app import create_app, db
from app.models.OrdenCompra.orden_compra import OrdenCompra, LineaOC

app = create_app()

with app.app_context():
    print("Creando tablas para Orden de Compra...")
    # Crear tablas específicas si no existen
    # db.create_all() crea todas las que no existan, pero es seguro.
    # O podemos usar create_all solo para bindear los modelos importados.
    db.create_all()
    print("Tablas creadas exitosamente.")
