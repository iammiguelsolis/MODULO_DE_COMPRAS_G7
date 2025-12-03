from flask import Flask, get_flashed_messages
from app.bdd import db
from app.extensiones import bcrypt
from flask_bcrypt import Bcrypt
from app.bdd import coneccion
from flask_cors import CORS
# Lo de abajo es un ejemplo de como importar una BP
#from app.BP.Colaborador import colaborador_bp
from sqlalchemy.sql import text #permite ejecutar consultas sql puras
from app.BP.facturasProveedor.routes import facturas_bp 

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    app.secret_key = '3zM8c.1Z9>@2_x$!;Y`:3u?5'
    app.config["SQLALCHEMY_DATABASE_URI"]=coneccion #%40 es @ pero escapado

    coneccion_facturas = coneccion.replace("modulo_de_compras","facturas")
    app.config["SQLALCHEMY_BINDS"] = {
        'facturas_db': coneccion_facturas
    }

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"]='_Cb15q&o~n81'

    db.init_app(app)
    bcrypt.init_app(app)

    # Registrar Blueprints
    # ejemplo de restro, ahorita tira error si descomento
    # app.register_blueprint(colaborador_bp, url_prefix='/colaborador')

    app.register_blueprint(facturas_bp, url_prefix='/facturas-proveedor')

    # 🔴 Manejador de errores

    #Eso de abajo es cuando se hace server side rendering todo en flask, ahorita se maneja por react
    """
    @app.errorhandler(404)
    def pagina_no_encontrada(error):
        from flask import render_template
        return render_template("error/404.html"), 404
    """
    
    return app

