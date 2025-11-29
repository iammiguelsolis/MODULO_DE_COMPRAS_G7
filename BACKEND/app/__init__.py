from flask import Flask, get_flashed_messages
from app.bdd import db
from app.extensiones import bcrypt
from flask_bcrypt import Bcrypt
from app.bdd import coneccion
from app.BP.Colaborador import colaborador_bp
from sqlalchemy.sql import text #permite ejecutar consultas sql puras 
import os
from dotenv import load_dotenv

load_dotenv() # aqui usamos esto para cargar API keys de otros servicios

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.secret_key = '3zM8c.1Z9>@2_x$!;Y`:3u?5'
    app.config["SQLALCHEMY_DATABASE_URI"]=coneccion #%40 es @ pero escapado
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"]='_Cb15q&o~n81'

    db.init_app(app)
    bcrypt.init_app(app)

    # Registrar Blueprints
    # ejemplo de restro, ahorita tira error si descomento
    # app.register_blueprint(colaborador_bp, url_prefix='/colaborador')

    # 🔴 Manejador de errores

    #Eso de abajo es cuando se hace server side rendering todo en flask, ahorita se maneja por react
    """
    @app.errorhandler(404)
    def pagina_no_encontrada(error):
        from flask import render_template
        return render_template("error/404.html"), 404
    """
    
    return app

