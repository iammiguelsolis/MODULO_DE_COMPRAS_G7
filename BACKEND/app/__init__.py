from flask import Flask
from app.bdd import db, coneccion
from app.extensiones import bcrypt

# Importamos Blueprints
from app.BP.solicitudes.solicitudes_controller import solicitudes_bp
from app.BP.adquisiciones.adquisiciones_controller import adquisiciones_bp
from app.BP.licitaciones import register_licitaciones_blueprints

def create_app():
    # CAMBIO: Usamos 'flask_app' en lugar de 'app' para evitar conflicto de nombres
    flask_app = Flask(__name__)
    
    # Configuraciones
    flask_app.secret_key = '3zM8c.1Z9>@2_x$!;Y`:3u?5'
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = coneccion 
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    flask_app.config["SECRET_KEY"] = '_Cb15q&o~n81'
    flask_app.json.sort_keys = False

    # Inicializar Extensiones
    db.init_app(flask_app)
    bcrypt.init_app(flask_app)

    # Registro de Blueprints
    flask_app.register_blueprint(solicitudes_bp) 
    flask_app.register_blueprint(adquisiciones_bp)
    register_licitaciones_blueprints(flask_app)

    with flask_app.app_context():
        from app.models.solicitudes.solicitud import Solicitud
        from app.models.solicitudes.items import ItemSolicitado, MaterialSolicitado, ServicioSolicitado
        from app.models.adquisiciones.proceso import ProcesoAdquisicion, Compra
        from app.models.proveedor import Proveedor
        
        # Esta línea era la culpable: 'import app...' sobreescribía la variable 'app'
        # Al haber cambiado el nombre de la variable a 'flask_app', ya no hay conflicto.
        import app.models.licitaciones 
        
        db.create_all()
        print(">>> Base de datos conectada y tablas creadas.")

    return flask_app  # Devolvemos la instancia correcta