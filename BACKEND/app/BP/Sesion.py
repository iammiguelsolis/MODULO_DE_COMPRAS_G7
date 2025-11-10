from flask import Blueprint, render_template, request, redirect, flash, session, url_for
from app.models import Cliente
from app.models.modelos import Usuario

sesion_bp = Blueprint("sesion", __name__, url_prefix="")  # sin prefijo


# Pagina inicial ------------------------------------------
@sesion_bp.route("/")
def home_page():
    return render_template("sesion/principal.html")


# Login ---------------------------------------------------
@sesion_bp.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        dni = request.form.get("dni")
        contraseña = request.form.get("contraseña")

        # Buscar en clientes
        cliente = Cliente.query.filter_by(dni=dni).first()
        if cliente and cliente.check_password(contraseña):
            session["id_usuario"] = cliente.id_cliente
            session["id_cliente"] = cliente.id_cliente
            session["tipo_usuario"] = "cliente"
            return redirect(url_for("cliente_bp.panel_cliente"))

        # Buscar en usuarios
        usuario = Usuario.query.filter_by(dni=dni).first()
        if usuario and usuario.check_password(contraseña):
            session["id_usuario"] = usuario.id_usuario
            session["tipo_usuario"] = usuario.tipo_usuario  # Usa esto en lugar de 'rol'

            if usuario.tipo_usuario == "Admin":
                return redirect(url_for("administrador_bp.panel_principal"))
            elif usuario.tipo_usuario == 'Colaborador':
                session['id_usuario'] = usuario.id_usuario
                session['tipo_usuario'] = usuario.tipo_usuario

                return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))
            elif usuario.tipo_usuario == "Terapeuta":
                return redirect(url_for("terapeuta_bp.panel_terapeuta"))

        error = "DNI o contraseña incorrectos."

    return render_template("sesion/login.html", error=error)
