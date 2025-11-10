from flask import Blueprint, render_template, request, session, redirect, flash, jsonify, url_for
from app.bdd import db
from app.models import TerapeutaEspecialidad, Especialidad, Usuario, Trayectoria
from datetime import date, timedelta
from app.models.modelos import EstadoReserva, Reserva, Sala, Servicio, Cliente



terapeuta_bp = Blueprint("terapeuta_bp", __name__, url_prefix="/terapeuta")

@terapeuta_bp.route("/especialidad/descripcion", methods=["GET", "POST"])
def describir_especialidad():
    id_terapeuta = session.get("id_usuario")

    if not id_terapeuta:
        flash("Debes iniciar sesión como terapeuta", "danger")
        return redirect("/")

    especialidades = db.session.query(
        Especialidad
    ).join(TerapeutaEspecialidad, Especialidad.id_especialidad == TerapeutaEspecialidad.id_especialidad
    ).filter(TerapeutaEspecialidad.id_terapeuta == id_terapeuta).all()

    descripcion_actual = ""
    especialidad_seleccionada = especialidades[0].id_especialidad if especialidades else None

    if request.method == "POST":
        especialidad_seleccionada = int(request.form.get("especialidad"))
        descripcion = request.form.get("descripcion", "").strip()

        if not descripcion:
            flash("La descripción no puede estar vacía", "danger")
        elif len(descripcion) > 500:
            flash("La descripción no puede exceder 500 caracteres", "danger")
        else:
            especialidad = Especialidad.query.get(especialidad_seleccionada)
            especialidad.descripcion = descripcion
            db.session.commit()
            flash("Descripción actualizada exitosamente", "success")
            return redirect("/terapeuta/especialidad/descripcion")

    # Obtener descripción actual de la especialidad seleccionada
    if especialidad_seleccionada:
        especialidad = Especialidad.query.get(especialidad_seleccionada)
        descripcion_actual = especialidad.descripcion if especialidad and especialidad.descripcion else ""

    return render_template(
        "terapeuta/descripcion_especialidad.html",
        especialidades=especialidades,
        descripcion_actual=descripcion_actual,
        especialidad_seleccionada=especialidad_seleccionada
    )

@terapeuta_bp.route("/panel", methods=["GET"])
def panel_terapeuta():
    id_terapeuta = session.get("id_usuario")
    if not id_terapeuta:
        return "No autenticado", 401

    terapeuta = Usuario.query.get(id_terapeuta)
    nombre = terapeuta.nombre if terapeuta else None

    return render_template("terapeuta/panel_principal.html", nombre_terapeuta=nombre)

@terapeuta_bp.route("/trayectoria", methods=["GET"])
def mostrar_trayectoria():
    id_usuario = session.get("id_usuario")
    tipo = session.get("tipo_usuario")

    if not id_usuario or tipo != "Terapeuta":
        return "No autenticado", 401

    trayectoria = Trayectoria.query.filter_by(id_terapeuta=id_usuario).first()
    trayectoria_actual = trayectoria.trayectoria if trayectoria else ""

    return render_template("terapeuta/gestionar_trayectoria.html", trayectoria_actual=trayectoria_actual)

@terapeuta_bp.route("/trayectoria", methods=["PATCH"])
def actualizar_trayectoria():
    id_terapeuta = session.get("id_usuario")
    if not id_terapeuta:
        return jsonify({"error": "No autenticado"}), 401

    data = request.get_json()
    texto = data.get("trayectoria", "").strip()

    if not texto:
        return jsonify({"error": "Texto vacío"}), 400
    if len(texto) > 400:
        return jsonify({"error": "La trayectoria no puede superar los 400 caracteres"}), 400

    trayectoria = Trayectoria.query.filter_by(id_terapeuta=id_terapeuta).first()

    if trayectoria:
        trayectoria.trayectoria = texto
    else:
        trayectoria = Trayectoria(id_terapeuta=id_terapeuta, trayectoria=texto)
        db.session.add(trayectoria)

    db.session.commit()
    return jsonify({"mensaje": "Actualización exitosa"}), 200

@terapeuta_bp.route("/panel/ver_citas")
def ver_citas_terapeuta():
    if 'id_usuario' not in session or session.get('tipo_usuario') != 'Terapeuta':
        flash("Debes iniciar sesión como terapeuta")
        return redirect(url_for("sesion.login"))

    id_terapeuta = session['id_usuario']
    hoy = date.today()

    # Citas actuales (futuras)
    actuales = (
        db.session.query(
            Reserva,
            Cliente.nombre,
            Cliente.apellido,
            Servicio.nombre,
            EstadoReserva.was_paid,
            Sala.numero,
            Sala.alias
        )
        .join(Cliente, Cliente.id_cliente == Reserva.id_cliente)
        .join(Servicio, Servicio.id_servicio == Reserva.id_servicio)
        .join(Sala, Sala.id_sala == Reserva.id_sala)
        .join(EstadoReserva, EstadoReserva.id_reserva == Reserva.id_reserva)
        .filter(Reserva.id_terapeuta == id_terapeuta)
        .filter(Reserva.fecha >= hoy)
        .all()
    )

    # Citas pasadas (historial)
    historial = (
        db.session.query(
            Reserva,
            Cliente.nombre,
            Cliente.apellido,
            Servicio.nombre,
            EstadoReserva.was_paid,
            Sala.numero,
            Sala.alias
        )
        .join(Cliente, Cliente.id_cliente == Reserva.id_cliente)
        .join(Servicio, Servicio.id_servicio == Reserva.id_servicio)
        .join(Sala, Sala.id_sala == Reserva.id_sala)
        .join(EstadoReserva, EstadoReserva.id_reserva == Reserva.id_reserva)
        .filter(Reserva.id_terapeuta == id_terapeuta)
        .filter(Reserva.fecha < hoy)
        .all()
    )

    return render_template(
        "terapeuta/ver_citas.html",
        actuales=actuales,
        historial=historial,
        hoy=hoy,
        timedelta=timedelta
    )
