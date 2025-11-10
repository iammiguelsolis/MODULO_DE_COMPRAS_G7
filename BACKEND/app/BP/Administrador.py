from datetime import date, time, timedelta
from flask import Blueprint, flash, redirect, render_template, request, session, jsonify, url_for
from sqlalchemy import func
from app.bdd import db
from app.models.modelos import Cliente, EstadoReserva, HorarioTerapeuta, Reserva, Sala, Servicio, Usuario, TerapeutaEspecialidad, Especialidad
from app.extensiones import bcrypt
from sqlalchemy.orm import joinedload

from app.models.modelos import Sala
from sqlalchemy import or_, func
from functools import wraps
from flask import session, redirect, url_for, flash
from app.utils.auth_utils import login_requerido

administrador_bp = Blueprint("administrador_bp", __name__, url_prefix="/admin")

# ═══════════════════════════════ PANEL Y VISTAS ═══════════════════════════════

@administrador_bp.route("/panel", methods=["GET"])
def panel_principal():
    id_admin = session.get("id_usuario")
    admin = Usuario.query.get(id_admin)
    nombre = admin.nombre if admin else "Administrador"
    
    return render_template("admin/panel_principal.html", nombre_admin=nombre)

@administrador_bp.route("/crear_usuario", methods=["GET"])
def mostrar_formulario_creacion():
    return render_template("admin/crear_usuario.html")

@administrador_bp.route("/eliminar_usuario", methods=["GET"])
def vista_eliminar_usuario():
    return render_template("admin/eliminar_usuario.html")


# ═══════════════════════════════ CREAR USUARIO ═══════════════════════════════
@administrador_bp.route("/crear_usuario", methods=["POST"])
@login_requerido
def crear_usuario():
    data = request.get_json()
    dni = data.get("dni")
    contrasena = data.get("contraseña")
    nombre = data.get("nombre")
    apellido = data.get("apellido")
    telefono = data.get("telefono")
    fecha_nacimiento = data.get("fecha_nacimiento")
    sexo = data.get("sexo")
    tipo_usuario = data.get("tipo_usuario")

    # Validar y normalizar tipo_usuario si viene mal
    if tipo_usuario == "Admin":
        tipo_usuario = "Administrador"

    if tipo_usuario not in ["Administrador", "Colaborador", "Terapeuta"]:
        return jsonify({"error": "Tipo de usuario no reconocido"}), 400

    if Usuario.query.filter_by(dni=dni).first():
        return jsonify({"error": "El DNI ya está en uso y el sistema no permite duplicados"}), 400

    nuevo_usuario = Usuario(
        nombre=nombre,
        apellido=apellido,
        telefono=telefono,
        dni=dni,
        fecha_nacimiento=fecha_nacimiento,
        sexo=sexo,
        tipo_usuario=tipo_usuario,
        bloqueado=False
    )
    nuevo_usuario.set_password(contrasena)

    if tipo_usuario == "Administrador":
        nivel_autoridad = data.get("nivel_autoridad")
        admin_actual_id = session.get("id_usuario")
        admin_actual = Usuario.query.get(admin_actual_id)

        if not nivel_autoridad:
            return jsonify({"error": "Debe proporcionar el nivel de autoridad"}), 400
        if admin_actual.nivel_autoridad is None:
            return jsonify({"error": "Administrador actual no tiene nivel asignado"}), 400
        if int(nivel_autoridad) > admin_actual.nivel_autoridad:
            return jsonify({"error": "No puede asignar un nivel de autoridad mayor al propio"}), 403

        nuevo_usuario.nivel_autoridad = int(nivel_autoridad)
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({"mensaje": "Administrador creado correctamente"}), 201

    elif tipo_usuario == "Terapeuta":
        especialidades = data.get("especialidades")
        if not especialidades:
            return jsonify({"error": "Debe seleccionar al menos una especialidad"}), 400

        db.session.add(nuevo_usuario)
        db.session.flush()  # Obtener ID generado

        for esp_id in especialidades:
            esp = Especialidad.query.get(esp_id)
            if esp:
                relacion = TerapeutaEspecialidad(
                    id_terapeuta=nuevo_usuario.id_usuario,
                    profesion=esp.nombre,
                    id_especialidad=esp.id_especialidad
                )
                db.session.add(relacion)

        db.session.commit()
        return jsonify({"mensaje": "Terapeuta creado correctamente"}), 201

    elif tipo_usuario == "Colaborador":
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({"mensaje": "Colaborador creado correctamente"}), 201

    return jsonify({"error": "Tipo de usuario no reconocido"}), 400


# ═══════════════════════════════ OBTENER ESPECIALIDADES ═══════════════════════════════

@administrador_bp.route("/especialidades", methods=["GET"])
def obtener_especialidades():
    especialidades = Especialidad.query.all()
    lista = [{"id": esp.id_especialidad, "nombre": esp.nombre} for esp in especialidades]
    return jsonify(lista)


# ═══════════════════════════════  USUARIO ═══════════════════════════════════════════════

@administrador_bp.route("/usuarios", methods=["GET"])

def obtener_usuarios():
    tipo = request.args.get("tipo")
    buscar = request.args.get("buscar", "").strip()

    usuarios = Usuario.query

    if tipo:
        usuarios = usuarios.filter(Usuario.tipo_usuario == tipo)

    if buscar:
        buscar_like = f"%{buscar}%"
        usuarios = usuarios.filter(
            or_(
                Usuario.nombre.ilike(buscar_like),
                Usuario.apellido.ilike(buscar_like),
                func.cast(Usuario.dni, db.String).ilike(buscar_like)
            )
        )

    usuarios = usuarios.all()

    return jsonify([
        {
            "id": u.id_usuario,
            "nombre": u.nombre,
            "apellido": u.apellido,
            "tipo": u.tipo_usuario,
            "bloqueado": u.bloqueado
        } for u in usuarios
    ])

def listar_usuarios():
    tipo = request.args.get("tipo")
    termino = request.args.get("buscar")  # 🆕 Nuevo parámetro para búsquedas

    query = Usuario.query

    if tipo:
        query = query.filter(Usuario.tipo_usuario == tipo)

    if termino:
        search = f"%{termino}%"
        query = query.filter(
            db.or_(
                Usuario.nombre.ilike(search),
                Usuario.apellido.ilike(search),
                db.cast(Usuario.dni, db.String).ilike(search)
            )
        )

    usuarios = query.all()
    lista = [
        {
            "id": u.id_usuario,
            "nombre": u.nombre,
            "apellido": u.apellido,
            "tipo": u.tipo_usuario,
            "nivel_autoridad": u.nivel_autoridad,
            "bloqueado": u.bloqueado
        } for u in usuarios
    ]
    return jsonify(lista)


# ═══════════════════════════════ ELIMINAR USUARIO ═══════════════════════════════

@administrador_bp.route("/eliminar_usuario/<int:id_usuario>", methods=["DELETE"])
@login_requerido
def eliminar_usuario(id_usuario):
    if session.get('tipo_usuario') != "Admin":
        return jsonify({"error": "No autenticado"}), 401

    id_admin_actual = session.get('id_usuario')
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Caso: Administrador
    if usuario.tipo_usuario == "Administrador":
        admin_actual = Usuario.query.get(id_admin_actual)
        if usuario.nivel_autoridad is None or admin_actual.nivel_autoridad is None:
            return jsonify({"error": "No se puede verificar niveles de autoridad"}), 403
        if usuario.nivel_autoridad >= admin_actual.nivel_autoridad:
            return jsonify({"error": "No puedes eliminar un administrador con igual o mayor autoridad"}), 403

        usuario.bloqueado = True  # Eliminación virtual
        db.session.commit()
        return jsonify({"mensaje": "Administrador bloqueado correctamente"}), 200

    # Caso: Terapeuta
    elif usuario.tipo_usuario == "Terapeuta":
        if usuario.bloqueado:
            return jsonify({"mensaje": "El terapeuta ya se encuentra bloqueado. No puede ser eliminado físicamente."}), 200
        else:
            usuario.bloqueado = True
            # Opcional: Aquí se agregaría lógica para anular horarios investigar de esto
            db.session.commit()
            return jsonify({"mensaje": "Terapeuta bloqueado. Horarios quedarán nulos y acceso denegado"}), 200

    # Caso: Colaborador
    elif usuario.tipo_usuario == "Colaborador":
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"mensaje": "Colaborador eliminado permanentemente"}), 200

    return jsonify({"error": "Tipo de usuario no reconocido"}), 400


# ═══════════════════════════════ Gestionar disponibilidad de horario terapeuta ═══════════════════════════════

def validar_cruces(id_terapeuta, id_especialidad, dia, nuevo_inicio, nuevo_fin, id_horario_exclude=None):
    # Filtrar todos los horarios del terapeuta para ese día (excepto el que se edita)
    horarios = HorarioTerapeuta.query.filter(
        HorarioTerapeuta.id_terapeuta == id_terapeuta,
        HorarioTerapeuta.dia == dia,
        HorarioTerapeuta.id_horario_terapeuta != id_horario_exclude  # excluye el que se edita
    ).all()

    for h in horarios:
        # Solape: si el nuevo inicio es antes del fin existente Y el nuevo fin es después del inicio existente
        if nuevo_inicio < h.hora_fin and nuevo_fin > h.hora_inicio:
            especialidad = Especialidad.query.get(h.id_especialidad).nombre
            return f"Cruce detectado con la especialidad {especialidad} en horario {h.hora_inicio} - {h.hora_fin}."
        
        # Bloque idéntico (duplicado exacto)
        if nuevo_inicio == h.hora_inicio and nuevo_fin == h.hora_fin and id_especialidad == h.id_especialidad:
            return f"Ya existe un horario idéntico para la especialidad {especialidad}."
    
    return None



@administrador_bp.route('/gestionar_horarios', methods=['GET', 'POST'])
@login_requerido
def gestionar_horarios():
    filtro_nombre = request.args.get('filtro_nombre', '').strip()
    terapeutas = Usuario.query.filter(
        Usuario.tipo_usuario == 'Terapeuta',
        Usuario.nombre.ilike(f'%{filtro_nombre}%') if filtro_nombre else True
    ).all()

    id_terapeuta = request.args.get('terapeuta', type=int)
    especialidades_terapeuta = []
    horarios_existentes = []

    if id_terapeuta:
        especialidades_terapeuta = db.session.query(TerapeutaEspecialidad, Especialidad).\
            join(Especialidad, TerapeutaEspecialidad.id_especialidad == Especialidad.id_especialidad).\
            filter(TerapeutaEspecialidad.id_terapeuta == id_terapeuta).all()
        horarios_existentes = HorarioTerapeuta.query.filter_by(id_terapeuta=id_terapeuta).order_by(HorarioTerapeuta.dia, HorarioTerapeuta.hora_inicio).all()

    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            id_especialidad = int(request.form.get('id_especialidad'))
            dia = request.form.get('dia')
            hora_inicio = request.form.get('hora_inicio')
            hora_fin = request.form.get('hora_fin')
            id_sala = int(request.form.get('id_sala'))

            try:
                hora_inicio_obj = time.fromisoformat(hora_inicio)
                hora_fin_obj = time.fromisoformat(hora_fin)
            except ValueError:
                flash(f'Formato inválido de hora.', 'danger')
                return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))

            if hora_inicio_obj >= hora_fin_obj:
                flash('La hora de inicio debe ser menor que la hora de fin.', 'danger')
                return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))

            error_cruce = validar_cruces(id_terapeuta, id_especialidad, dia, hora_inicio_obj, hora_fin_obj)
            if error_cruce:
                flash(error_cruce, 'danger')
                return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))
                    
            sala_ocupada = HorarioTerapeuta.query.filter(
                HorarioTerapeuta.id_sala == id_sala,
                HorarioTerapeuta.dia == dia,
                HorarioTerapeuta.hora_inicio < hora_fin_obj,
                HorarioTerapeuta.hora_fin > hora_inicio_obj
            ).first()

            if sala_ocupada:
                terapeuta_ocupado = Usuario.query.get(sala_ocupada.id_terapeuta)
                flash(
                    f"La sala ya está ocupada por {terapeuta_ocupado.nombre} {terapeuta_ocupado.apellido} "
                    f"en el horario de {sala_ocupada.hora_inicio} - {sala_ocupada.hora_fin}.",
                    "danger"
                )
                return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))

            nuevo = HorarioTerapeuta(
                dia=dia,
                hora_inicio=hora_inicio_obj,
                hora_fin=hora_fin_obj,
                id_terapeuta=id_terapeuta,
                id_especialidad=id_especialidad,
                id_sala=id_sala
            )
            db.session.add(nuevo)
            db.session.commit()
            flash('Horario agregado correctamente.', 'success')
            return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))

        elif action == 'delete':
            id_horario = int(request.form.get('id_horario'))
            horario = HorarioTerapeuta.query.get(id_horario)
            if horario:
                db.session.delete(horario)
                db.session.commit()
                flash('Horario eliminado correctamente.', 'success')
            else:
                flash('Horario no encontrado.', 'danger')
            return redirect(url_for('administrador_bp.gestionar_horarios', terapeuta=id_terapeuta))

    salas = Sala.query.all()

    return render_template(
        'admin/gestionar_horarios.html',
        terapeutas=terapeutas,
        filtro_nombre=filtro_nombre,
        id_terapeuta=id_terapeuta,
        especialidades_terapeuta=especialidades_terapeuta,
        horarios_existentes=horarios_existentes,
        salas=salas
    )

@administrador_bp.route("/panel/ver_citas", methods=["GET"])
def ver_citas_admin():
    filtro = request.args.get("filtro", "").strip().lower()
    hoy = date.today()

    reservas = Reserva.query.options(
        joinedload(Reserva.cliente),
        joinedload(Reserva.terapeuta),
        joinedload(Reserva.sala),
        joinedload(Reserva.servicio),
        joinedload(Reserva.estado)
    ).all()

    actuales, historial = [], []

    for r in reservas:
        cliente = r.cliente
        if not cliente:
            continue

        if filtro and filtro not in str(cliente.dni).lower() and filtro not in cliente.nombre.lower():
            continue

        terapeuta = r.terapeuta
        sala = r.sala
        servicio = r.servicio
        estado = r.estado
        was_paid = estado.was_paid if estado else False

        grupo = (r, cliente, terapeuta, servicio.nombre if servicio else "", was_paid, sala)
        if r.fecha >= hoy:
            actuales.append(grupo)
        else:
            historial.append(grupo)

    return render_template("admin/ver_citas.html", actuales=actuales, historial=historial)


@administrador_bp.route("/panel/horario_cita/cancelar/<int:id_reserva>", methods=["POST"])
def cancelar_reserva_admin(id_reserva):
    reserva = Reserva.query.get_or_404(id_reserva)

    # eliminar también su estado de pago, si existe
    estado = EstadoReserva.query.filter_by(id_reserva=id_reserva).first()
    if estado:
        db.session.delete(estado)

    db.session.delete(reserva)
    db.session.commit()
    flash("Reserva cancelada exitosamente.")
    return redirect(url_for("administrador_bp.ver_citas_admin"))
@administrador_bp.route("/gestionar_salas", methods=["GET", "POST"])
@login_requerido
def gestionar_salas():
    if request.method == "POST":
        accion = request.form.get("accion")
        alias_sala = request.form.get("nombre_sala")  # sigue viniendo del mismo input
        numero_sala = request.form.get("numero_sala")

        if accion == "crear" and alias_sala and numero_sala:
            if Sala.query.filter_by(alias=alias_sala).first():
                flash("Ya existe una sala con ese alias.", "danger")
            else:
                nueva_sala = Sala(alias=alias_sala, numero=numero_sala)
                db.session.add(nueva_sala)
                db.session.commit()
                flash("Sala creada exitosamente.", "success")

        elif accion == "eliminar":
            sala_id = request.form.get("sala_id")
            sala = Sala.query.get(sala_id)
            if sala:
                db.session.delete(sala)
                db.session.commit()
                flash("Sala eliminada correctamente.", "success")
            else:
                flash("Sala no encontrada.", "danger")

    salas = Sala.query.all()
    return render_template("admin/gestionar_salas.html", salas=salas)

@administrador_bp.route("/desbloquear_usuario/<int:id_usuario>", methods=["PATCH"])
def desbloquear_usuario(id_usuario):
    if session.get('tipo_usuario') != "Admin":
        return jsonify({"error": "No autenticado"}), 401

    usuario = Usuario.query.get(id_usuario)
    if not usuario or usuario.tipo_usuario != "Terapeuta":
        return jsonify({"error": "Usuario no encontrado o no es terapeuta"}), 404

    if not usuario.bloqueado:
        return jsonify({"mensaje": "El terapeuta ya está activo"}), 200

    usuario.bloqueado = False
    db.session.commit()
    return jsonify({"mensaje": "Terapeuta desbloqueado correctamente"}), 200



