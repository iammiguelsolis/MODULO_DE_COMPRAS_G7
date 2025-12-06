from flask import Flask
from app.bdd import db, coneccion
from app.extensiones import bcrypt
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from sqlalchemy.sql import text 
from app.BP.facturasProveedor.routes import facturas_bp 
from app.BP.Proveedor import proveedor_bp
from app.BP.Inventario import inventario_bp
from app.BP.solicitudes.solicitudes_controller import solicitudes_bp
from app.models.OrdenCompra.oc_routes import oc_bp

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})
    CORS(app)

    app.secret_key = '3zM8c.1Z9>@2_x$!;Y`:3u?5'
    app.config["SQLALCHEMY_DATABASE_URI"]=coneccion #%40 es @ pero escapado

    coneccion_facturas = coneccion.replace("modulo_de_compras","facturas")
    coneccion_solicitudes = coneccion.replace("modulo_de_compras", "miguelPruebas")
    app.config["SQLALCHEMY_BINDS"] = {
        'facturas_db': coneccion_facturas,
        'solicitudes_db': coneccion_solicitudes,
    }

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"]='_Cb15q&o~n81'

    db.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(facturas_bp, url_prefix='/facturas-proveedor')
    app.register_blueprint(proveedor_bp, url_prefix="/api/proveedores")
    app.register_blueprint(inventario_bp, url_prefix="/api/inventario")
    app.register_blueprint(solicitudes_bp) 
    app.register_blueprint(oc_bp)

    return app