from flask import Flask
from app.bdd import db, coneccion # Importamos db y la string de conexion
from app.extensiones import bcrypt
from flask_bcrypt import Bcrypt

# Importamos el Blueprint
from app.controllers.solicitudes.solicitudes_controller import solicitudes_bp

def create_app():
    app = Flask(__name__)
    
    # Configuraciones
    app.secret_key = '3zM8c.1Z9>@2_x$!;Y`:3u?5'
    app.config["SQLALCHEMY_DATABASE_URI"] = coneccion 
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = '_Cb15q&o~n81'

    # Inicializar Extensiones
    db.init_app(app)
    bcrypt.init_app(app)

    # Registro de Blueprints
    app.register_blueprint(solicitudes_bp) 

    with app.app_context():
        from app.models.solicitudes.solicitud import Solicitud
        from app.models.solicitudes.items import ItemSolicitado, MaterialSolicitado, ServicioSolicitado
        
        db.create_all()
        print(">>> Base de datos conectada y tablas creadas (si no existían).")

    return app