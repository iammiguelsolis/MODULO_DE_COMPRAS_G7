from flask import Flask
from app.bdd import db
from app.extensiones import bcrypt
from flask_bcrypt import Bcrypt
from app.bdd import coneccion
from sqlalchemy.sql import text
from app.BP.Proveedor import proveedor_bp

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.secret_key = 'sdfa'
    app.config["SQLALCHEMY_DATABASE_URI"] = coneccion
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = '_Cb15q&o~n81'
    
    db.init_app(app)
    bcrypt.init_app(app)
    
    # ✅ CREA TODAS LAS TABLAS AUTOMÁTICAMENTE
    with app.app_context():
        # Importa todos tus modelos ANTES de create_all
        from app.models.proveedor_inventario.dominio_proveedor import (
            Proveedor, ContactoProveedor, DetallesProveedor
        )
        from app.models.proveedor_inventario.conexion_alamacen import (
            Almacen, Entrega, DetalleEntrega
        )
        # Importa otros modelos de evaluacion si los tienes...
        
        db.create_all()  # Crea todas las tablas
        print("✅ Tablas creadas exitosamente")
    
    # Registrar Blueprints
    app.register_blueprint(proveedor_bp, url_prefix="/api/proveedores")
    
    return app