from flask import Blueprint, request, render_template, session, redirect, url_for, flash
from app.bdd import db
from app.models.modelos import EstadoReserva, PuntosCliente, Cliente, Reserva, Servicio, Sala, Usuario, GestionParametros
from app.service.usuarioService import UsuarioService
from datetime import datetime
from app.utils.puntos_utils import acumular_puntos_para_cliente, descontar_puntos
from app.models.enums import in_enum_Metodo_Pago


colaborador_bp = Blueprint("colaborador_bp",__name__)


@colaborador_bp.route('/login_colaborador', methods=['GET', 'POST'])
def login_colaborador():
    if request.method == 'GET':
        return render_template('colaborador/login_colaborador.html')  # Tu formulario HTML

    # POST: lógica de autenticación
    data = request.form  # Si usas HTML
    dni = data.get('dni')
    contraseña = data.get('contraseña')

    if not dni or not contraseña:
        flash("DNI y contraseña requeridos")
        return redirect(url_for("sesion.login"))  # ✅ CORRECTO


    colaborador = Usuario.query.filter_by(dni=dni, tipo_usuario="Colaborador").first()

    if colaborador and colaborador.check_password(contraseña):
        session['colaborador_id'] = colaborador.id_usuario
        session['tipo_usuario'] = colaborador.tipo_usuario  # ← para validación
        session['id_usuario'] = colaborador.id_usuario      # ← si usas en otras rutas
        flash("Inicio de sesión exitoso")
        return redirect(url_for('colaborador_bp.gestionar_reservas_por_pagar'))

    else:
        flash("Credenciales incorrectas")
        return redirect(url_for('colaborador_bp.login_colaborador'))

    
    
@colaborador_bp.route('/estado_reserva', methods=["GET", "POST"])
def gestionar_reservas_por_pagar():
    if session.get("tipo_usuario") != "Colaborador":
        flash("Debe iniciar sesión como colaborador")
        return redirect(url_for("sesion.login"))



    if request.method == "GET":
        return render_template("colaborador/gestionar_reservas.html")


    dni_cliente = request.form.get("dni")
    if not dni_cliente:
        flash("Debe ingresar un DNI válido")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    cliente = Cliente.query.filter_by(dni=dni_cliente).first()
    if not cliente:
        flash("Cliente no encontrado")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    puntos = PuntosCliente.query.filter_by(id_cliente=cliente.id_cliente).all()
    total_puntos = sum(p.cantidad_puntos for p in puntos)

    reservas_por_pagar = db.session.query(
        EstadoReserva.id_reserva,
        Servicio.nombre.label("servicio"),
        Reserva.hora_inicio,
        Reserva.hora_fin,
        Servicio.precio,
        Reserva.fecha,
        Sala.alias,
        Usuario.nombre.label("nombre_terapeuta"),
        Usuario.apellido.label("apellido_terapeuta")
    ).join(Reserva, Reserva.id_reserva == EstadoReserva.id_reserva) \
     .join(Servicio, Reserva.id_servicio == Servicio.id_servicio) \
     .join(Usuario, Reserva.id_terapeuta == Usuario.id_usuario) \
     .join(Sala, Reserva.id_sala == Sala.id_sala) \
     .filter(
        Reserva.id_cliente == cliente.id_cliente,
        EstadoReserva.was_paid == False
    ).all()

    if not reservas_por_pagar:
        flash("No hay reservas por pagar para este cliente")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    return render_template(
        "colaborador/gestionar_reservas.html",
        reservas=reservas_por_pagar,
        cliente=cliente,
        puntos_cliente=total_puntos
    )


@colaborador_bp.route('/estado_reserva/<int:id_reserva>/pagar', methods=['POST'])
def pagar_reserva(id_reserva):
    if session.get("tipo_usuario") != "Colaborador":
        flash("Debe iniciar sesión como colaborador")
        return redirect(url_for("sesion.login"))

    colaborador_id = session.get("id_usuario")
    metodo_pago_str = request.form.get("metodo_pago")
    descuento_soles = float(request.form.get("usar_puntos", 0))  # En soles (10 o 20)

    metodo_pago = in_enum_Metodo_Pago(metodo_pago_str)
    if not metodo_pago:
        flash("Método de pago no válido")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    estado_reserva = EstadoReserva.query.get(id_reserva)
    reserva = Reserva.query.get(id_reserva)

    if not estado_reserva or not reserva:
        flash("Reserva no encontrada")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    cliente = Cliente.query.get(reserva.id_cliente)
    if not cliente:
        flash("Cliente no encontrado")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    param = GestionParametros.query.first()
    if not param:
        flash("No se encontró configuración de parámetros")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    factor = param.factor_equivalencia*10  # Ej: 10 puntos = 1 sol

    puntos_a_descontar = int(descuento_soles * factor)
    monto_pagado = 0.0
    descuento_realizado = 0.0
    puntos_usados = 0

    print(f"🔁 Intentando descontar {puntos_a_descontar} puntos del cliente {cliente.id_cliente}")

    if puntos_a_descontar > 0:
        exito = descontar_puntos(cliente.id_cliente, puntos_a_descontar)
        if not exito:
            flash("No tienes suficientes puntos para aplicar este descuento.")
            return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))
        puntos_usados = puntos_a_descontar
        descuento_realizado = descuento_soles

    servicio = Servicio.query.get(reserva.id_servicio)
    if not servicio:
        flash("No se pudo encontrar el servicio de esta reserva.")
        return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))

    precio_original = servicio.precio
    monto_pagado = max(precio_original - descuento_realizado, 0)

    print(f"💰 Precio original: {precio_original} - Descuento: {descuento_realizado} = Pagado: {monto_pagado}")
    print(f"➡ Acumulando puntos por S/{monto_pagado} para el cliente {cliente.id_cliente}")

    estado_reserva.was_paid = True
    estado_reserva.metodo_pago = metodo_pago.value
    estado_reserva.id_colaborador = colaborador_id

    if monto_pagado > 0:
        acumular_puntos_para_cliente(cliente.id_cliente, monto_pagado)

    try:
        db.session.commit()
        flash(
            f"✅ Pago exitoso: usaste {puntos_usados} puntos (S/{descuento_realizado:.2f} de descuento). "
            f"Pagaste S/{monto_pagado:.2f}.", "success"
        )
    except Exception as e:
        db.session.rollback()
        flash("❌ Error al registrar el pago. Intenta nuevamente.", "danger")
        print("ERROR:", str(e))

    return redirect(url_for("colaborador_bp.gestionar_reservas_por_pagar"))



