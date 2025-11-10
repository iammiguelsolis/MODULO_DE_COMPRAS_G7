from flask import Blueprint, request, jsonify
from app.bdd import db
from flask import Flask,render_template, request, session, make_response,redirect, session, url_for, flash #todas mis importaciones de mi ejemplo de app la de ozuna
from app.models import Trayectoria, Cliente, Reserva, EstadoReserva, Servicio, Sala, Usuario, Especialidad, HorarioTerapeuta, TerapeutaEspecialidad
from sqlalchemy import and_
from app.models.modelos import GestionParametros, PuntosCliente
from app.service.clienteService import ClienteService
from app.service.usuarioService import UsuarioService
from app.models.enums import in_enum_Metodo_Pago
import os
from openai import OpenAI
from datetime import timedelta, datetime, date
from app.utils.puntos_utils import acumular_puntos_para_cliente
from datetime import date


cliente_bp = Blueprint("cliente_bp",__name__)
ventana_de_contexto = [] #variable global: aqui iran los ultimos 10 mensajes es decir 5 del usuario y 5 de Tera-IA y una vez se llegue a len() = 10 se truncaran 0 y 1

def formateador_contexto(ventana_de_contexto: list) -> str:
    ventana_str = ""
    
    # Elimina solo los dos primeros elementos mientras la lista tenga al menos 10 mensajes.
    while len(ventana_de_contexto) >= 10:
        ventana_de_contexto.pop(0)  # Elimina el primer mensaje.
        ventana_de_contexto.pop(0)  # Elimina el segundo mensaje (que ahora es el primero jsjsjsj).
    
    # Genera la representación de los mensajes.
    for i, mensaje in enumerate(ventana_de_contexto):
        ventana_str += f"[etiqueta: {i}] mensaje: {mensaje} \n"
    
    return ventana_str


@cliente_bp.route("/reservar_cita/chat", methods=["GET", "POST"])
def chat():
    #defino mi cliente de gpt
    client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
    )
    

    #obtencion de especialidades y contexto base
    especialidades = db.session.query(Especialidad).all()
    especialidad_dict = [{"nombre": e.nombre, "descripcion": e.descripcion} for e in especialidades]
    all_especialidades = ""
    for e in especialidad_dict:
        all_especialidades += str(e) + "\n"  #el objetivo es que sea legible la dupla nombre, descripcion de cada especialidad
    indicaciones = f"""Eres un asistente virtual que ayuda a las personas a reservar citas de terapia para una clinica que cuenta con las siguientes especialidades:
    {all_especialidades}
    Estas son las reglas de interacción:
    1) Debes mantener un tono amigable pero no saludes mas de una vez al paciente.
    2) Cuando detectes que el usuario tiene la intencion de averiguar sobre horarios invitalo a consultar en la seccion "Consultar horarios", pero si el usuario ya tiene la intencion de confirmar cita indicale este flujo: en la misma seccion rellane el formulario y confirme su reserva. Una vez confirmada su reserva puede verla accediendo al menu principal/Ver Horarios de Citas.
    3) No tienes la capacidad de rellenar ni responder formularios, solo puedes indicar al usuario como acceder a estas funcionalidades atravez de la interfaz.
    Finalmente considera que los mensajes con la etiqueta par son tuyos mientras que los impares del paciente, donde el 0 es el primero y asi sucesivamente, estos mensajes son la ventana de contexto.
    """
    #obtencion de especialidades y contexto base


    global ventana_de_contexto #aqui iran los ultimos 10 mensajes es decir 5 del usuario y 5 de Tera-IA y una vez se llegue a len() = 10 se truncaran 0 y 1
    if 'id_cliente' not in session:
        return jsonify({'error': 'Usuario no autenticado'}), 403
    cliente = Cliente.query.get(session['id_usuario'])

    first_message= f"Hola {cliente.nombre}, soy Tera-IA, tu asistente virtual. Estoy aquí para ayudarte a identificar, según tus síntomas o necesidades, cuál de nuestras especialidades en Fisioterapia y Psicología es la más adecuada para ti, y contarte más sobre los profesionales que estarán gustosos de atenderte. ¿Con qué te gustaría empezar?"
    if request.method == "GET":
        # Retorna una página con un formulario para buscar reservas
        ventana_de_contexto.append(first_message) #mensaje base
        return render_template("cliente/reservar_cita.html", first_message = first_message)

    user_message = request.json.get('message')
    ventana_de_contexto.append(user_message)
    ventana_str = formateador_contexto(ventana_de_contexto)
    response = client.responses.create(
    model="gpt-4.1-nano-2025-04-14",
    instructions=indicaciones + "\n" + ventana_str,
    input=user_message,
    )
    bot_reply = response.output_text
    ventana_de_contexto.append(bot_reply)
    return jsonify({'reply': bot_reply})

@cliente_bp.route('/registro', methods=['GET', 'POST'])
def registrar_cliente():
    if request.method == 'POST':
        dni = request.form.get('dni', '').strip()
        nombre = request.form.get('nombre', '').strip()
        apellido = request.form.get('apellido', '').strip()
        telefono = request.form.get('telefono', '').strip()
        fecha_nacimiento = request.form.get('fecha_nacimiento', '').strip()
        sexo = request.form.get('sexo', '').strip()
        contraseña = request.form.get('contraseña', '')
        confirmar = request.form.get('confirmar', '')

        # --- Validaciones ---
        if not dni.isdigit() or len(dni) != 8:
            flash("El DNI debe tener exactamente 8 dígitos numéricos.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        if Cliente.query.filter_by(dni=dni).first():
            flash("Ya existe una cuenta con ese DNI.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        telefono_limpio = telefono.replace(" ", "")
        if not telefono_limpio.isdigit() or len(telefono_limpio) != 9 or not telefono_limpio.startswith("9"):
            flash("El teléfono debe tener 9 dígitos, comenzar con 9 y contener solo números o espacios.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        if Cliente.query.filter_by(telefono=telefono_limpio).first():
            flash("Ya existe un cliente con ese teléfono.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        if contraseña != confirmar:
            flash("Las contraseñas no coinciden.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        try:
            fecha_nac = date.fromisoformat(fecha_nacimiento)
            if fecha_nac > date.today():
                flash("La fecha de nacimiento no puede ser mayor que hoy.", "danger")
                return render_template('cliente/crear_cliente.html', date=date)
        except ValueError:
            flash("La fecha de nacimiento no es válida.", "danger")
            return render_template('cliente/crear_cliente.html', date=date)

        cliente = Cliente(
            dni=dni,
            telefono=telefono_limpio,
            nombre=nombre,
            apellido=apellido,
            sexo=sexo,
            contraseña=contraseña,
            fecha_nacimiento=fecha_nac,
        )

        creado = ClienteService().crear_cliente(cliente)
        if creado:
            flash("Cuenta creada exitosamente. Inicia sesión", "success")
            return redirect('/login')
        else:
            flash("Error al crear la cuenta. Intente de nuevo", "danger")

    return render_template('cliente/crear_cliente.html', date=date)



        


@cliente_bp.route('/recuperar_especialidades', methods=['GET'])
def data_especialidades():
    especialidades = db.session.query(Especialidad).all()
    especialidad_dict = [{"id": e.id_especialidad,"nombre": e.nombre} for e in especialidades]
    return jsonify({"especialidades" : especialidad_dict})


@cliente_bp.route('/especialidad/<id_especialidad>/horarios', methods=['GET'])
def get_horarios(id_especialidad):
    horarios_terapeuta_para_dicha_especialidad = db.session.query(
        # Info de horario
        HorarioTerapeuta.dia,  # Día
        HorarioTerapeuta.hora_inicio.label("hora_i"),  # Hora inicio
        HorarioTerapeuta.hora_fin.label("hora_f"),  # Hora fin
        HorarioTerapeuta.id_sala,  # Sala
        # Info de terapeuta
        HorarioTerapeuta.id_terapeuta,  # ID terapeuta
        Usuario.nombre.label("nombre"),  # Nombre terapeuta
        Usuario.apellido.label("apellido"),  # Apellido terapeuta
        # Info servicios
        Servicio.precio,  # Precio del servicio
        Servicio.nombre.label("nombre_servicio"),  # Nombre del servicio
        Servicio.id_servicio  # ID del servicio
    ).join(TerapeutaEspecialidad, HorarioTerapeuta.id_terapeuta == TerapeutaEspecialidad.id_terapeuta) \
     .join(Usuario, Usuario.id_usuario == HorarioTerapeuta.id_terapeuta) \
     .join(Servicio, Servicio.id_especialidad == TerapeutaEspecialidad.id_especialidad) \
     .filter(TerapeutaEspecialidad.id_especialidad == id_especialidad).all()
    
    # Diccionario auxiliar para agrupar por terapeuta
    terapeutas_dict = {}
    
    for horario in horarios_terapeuta_para_dicha_especialidad:
        terapeuta_id = horario.id_terapeuta
        terapeuta_nombre = f"{horario.nombre} {horario.apellido}"
        
        if terapeuta_id not in terapeutas_dict:
            terapeutas_dict[terapeuta_id] = {
                "datos_terapeuta": terapeuta_nombre,
                "id_terapeuta": terapeuta_id,
                "horarios": []
            }
        
        # Crear bloques de 55 minutos con 5 minutos de acondicionamiento
        hora_inicio = datetime.combine(datetime.today(), horario.hora_i)  # Convertir a datetime
        hora_fin = datetime.combine(datetime.today(), horario.hora_f)    # Convertir a datetime
        while hora_inicio + timedelta(minutes=55) <= hora_fin:
            bloque_fin = hora_inicio + timedelta(minutes=55)  # Fin del bloque
            horario_bloque = {
                "dia": horario.dia,
                "hora_inicio": hora_inicio.strftime('%H:%M:%S'),
                "hora_fin": bloque_fin.strftime('%H:%M:%S'),
                "sala": horario.id_sala,
                "servicios": []
            }
            terapeutas_dict[terapeuta_id]["horarios"].append(horario_bloque)
            hora_inicio = hora_inicio + timedelta(minutes=60)  # Avanzar 1 hora (55 actividad + 5 acondicionamiento)

        # Agregar servicios a todos los bloques
        for horario_bloque in terapeutas_dict[terapeuta_id]["horarios"]:
            #enviamos solo servicios nuevos jsjs
            candidato = { 
                "nombre_servicio": horario.nombre_servicio,
                "id_servicio": horario.id_servicio,
                "precio": horario.precio
            }
                # Evitar duplicados basado en id_servicio
            if not any(servicio["id_servicio"] == candidato["id_servicio"] for servicio in horario_bloque["servicios"]):
                horario_bloque["servicios"].append(candidato)
    
    # Convertir el diccionario a lista
    data = list(terapeutas_dict.values())
    
    return jsonify(data)


@cliente_bp.route('/consultar_trayectoria/<id_especialista>/<datos>', methods=['GET'])
def get_especialista(id_especialista, datos):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    #no quiero que maneje dentro de descripcion a la logica de persistencia de contexto
    #pero si que capture info para que luego pueda recomendar a un doc sobre otro jsjs
    # Consulta la información de la trayectoria del terapeuta
    desc_trayectoria = Trayectoria.query.filter_by(id_terapeuta=id_especialista).first()
    if not desc_trayectoria:
        return jsonify({'error': 'Trayectoria no encontrada'}), 404

    prompt = f"""
    Esta es la información de {datos}: {desc_trayectoria.trayectoria}
    Responde en no más de 5 líneas.
    """

    msj_fake_de_user = f"Cuéntame sobre el terapeuta {datos}"
    ventana_de_contexto.append(msj_fake_de_user)

    response = client.responses.create(
        model="gpt-4.1-nano-2025-04-14",
        instructions="Eres un asistente virtual médico. Usa la siguiente información para describir profesionalmente a un especialista, con un tono cálido y confiable. Termina preguntando si el paciente desea reservar una cita.",
        input=prompt,
    )
    ventana_de_contexto.append(response.output_text)
    return jsonify({'reply': response.output_text})



    """
        # Buscar o crear el horario
        horario_existente = next(
            (h for h in terapeutas_dict[terapeuta_id]["horarios"] if  #P: explicame que significa este doble [][] con un ejemplo simple
             h["dia"] == horario.dia and 
             h["hora_inicio"] == horario.hora_i.strftime('%H:%M:%S') and 
             h["hora_fin"] == horario.hora_f.strftime('%H:%M:%S') and 
             h["sala"] == horario.id_sala),
            None
        )
        
        if not horario_existente:
            horario_existente = {
                "dia": horario.dia,
                "hora_inicio": horario.hora_i.strftime('%H:%M:%S'),
                "hora_fin": horario.hora_f.strftime('%H:%M:%S'),
                "sala": horario.id_sala,
                "servicios": []
            }
            terapeutas_dict[terapeuta_id]["horarios"].append(horario_existente)
        
        # Agregar el servicio al horario
        horario_existente["servicios"].append({
            "nombre_servicio": horario.nombre_servicio,
            "id_servicio": horario.id_servicio,
            "precio": horario.precio
        })
    
    # Convertir el diccionario a lista
    data = list(terapeutas_dict.values())
    
    return jsonify(data)
    """

@cliente_bp.route("/confirmar_reserva", methods=["POST"])
def confirmar_reserva():
    print("JSON recibido:", request.json)
    
    if 'id_cliente' not in session:
        return jsonify({'error': 'Usuario no autenticado'}), 403
    cliente = Cliente.query.get(session['id_usuario'])
    id_cliente = cliente.id_cliente


    # Datos enviados por el cliente
    reservar_data = request.json.get('reservarData')
    if not reservar_data:
        return jsonify({'error': 'Faltan datos para realizar la reserva'}), 400

    id_terapeuta = reservar_data.get('id_terapeuta')
    id_sala = reservar_data.get('id_sala')
    id_servicio = reservar_data.get('id_servicio')
    hora_inicio_str = reservar_data.get('hora_inicio')
    hora_fin_str = reservar_data.get('hora_fin')
    fecha_str = reservar_data.get('fecha')

    # Validar que todos los campos requeridos están presentes
    if not all([id_terapeuta, id_sala, id_servicio, hora_inicio_str, hora_fin_str, fecha_str]):
        return jsonify({'error': 'Todos los campos son obligatorios'}), 400

    try:
        # Convertir los datos de cadenas a los tipos requeridos
        fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M:%S").time()
        hora_fin = datetime.strptime(hora_fin_str, "%H:%M:%S").time()
    except ValueError as e:
        return jsonify({"error": f"Error al procesar fecha u hora: {e}"}), 400

    # Crear la nueva reserva
    nueva_reserva = Reserva(
        id_terapeuta=id_terapeuta,
        id_sala=id_sala,
        id_servicio=id_servicio,
        id_cliente=id_cliente,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin,
        fecha=fecha
    )

    try:
    # Guardar la reserva en la base de datos
        db.session.add(nueva_reserva)
        db.session.commit()
        print(f"la nueva reserva {nueva_reserva.id_reserva}")

        nuevo_estado_reserva = EstadoReserva(
            was_paid=False,
            id_reserva=nueva_reserva.id_reserva,
            id_colaborador=None,
            metodo_pago=None
        )

        db.session.add(nuevo_estado_reserva)
        db.session.commit()
        print(f"el nuevo estado gaaaaaaaa {nuevo_estado_reserva.id_reserva}")

        return jsonify({
            'message': 'Reserva creada exitosamente',
            'id_reserva': str(nueva_reserva.id_reserva),
            'id_colaborador': str(nuevo_estado_reserva.id_colaborador),
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error al guardar la reserva o estado: {e}'}), 500

#el modelito de open AI es gpt-4.1-nano-2025-04-14
@cliente_bp.route('/openai/test', methods=['GET'])
def test_openai():
    ventana_de_contexto = [] #aqui iran los ultimos 10 mensajes es decir 5 del usuario y 5 de Tera-IA luego se borran aunque no pareciera necesario tanto contexto pero bueno
    client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
    )
    
    response = client.responses.create(
    model="gpt-4.1-nano-2025-04-14",
    instructions="Tu eres un experto en motos de baja cilindrada",
    input="Dime una curiosidad interesante sobre la moto fz 3.0 abs de yamaha.",
    )
    return jsonify({'response': response.output_text})

@cliente_bp.route("/panel", methods=["GET"])
def panel_cliente():
    if 'id_usuario' not in session or session.get('tipo_usuario') != 'cliente':
        return redirect(url_for("cliente_bp.login"))
    cliente = Cliente.query.get(session['id_usuario'])
    total_puntos = sum(p.cantidad_puntos for p in cliente.puntos)
    return render_template("cliente/panel_cliente.html", cliente=cliente, total_puntos=total_puntos)

@cliente_bp.route("/puntos", methods=["GET"])
def ver_puntos():
    if 'id_cliente' not in session:
        return redirect(url_for("cliente_bp.chat"))
    cliente_id = session['id_cliente']

    puntos = PuntosCliente.query.filter_by(id_cliente=cliente_id).all()

    return render_template("cliente/ver_puntos.html", puntos=puntos)




@cliente_bp.route("/regalar_puntos", methods=["GET", "POST"])
def regalar_puntos():
    if 'id_cliente' not in session:
        return redirect(url_for("cliente_bp.chat"))

    resultado = None
    if request.method == "POST":
        dni_destinatario = request.form.get("dni_destinatario")
        puntos_a_regalar = int(request.form.get("puntos"))
        mensaje = request.form.get("mensaje", "")[:160]

        cliente_id = session.get('id_cliente')
        emisor = Cliente.query.get(cliente_id)

        receptor = Cliente.query.filter_by(dni=dni_destinatario).first()

        if not receptor:
            resultado = "El destinatario no fue encontrado en el sistema."
        elif receptor.id_cliente == emisor.id_cliente:
            resultado = "No puedes regalarte puntos a ti mismo."
        else:
            puntos_disponibles = PuntosCliente.query.filter_by(id_cliente=emisor.id_cliente).all()
            puntos_totales = sum(p.cantidad_puntos for p in puntos_disponibles)

            if puntos_totales < puntos_a_regalar:
                resultado = "No tienes suficientes puntos para realizar esta operación."
            else:
                parametros = GestionParametros.query.order_by(GestionParametros.id_gestion_parametros.desc()).first()
                if not parametros:
                    resultado = "No hay parámetros configurados en el sistema."
                else:
                    FE = parametros.factor_equivalencia
                    EF = parametros.exchange_factor
                    bonificador = parametros.bonificador_promo_regalo

                    puntos_transferidos = puntos_a_regalar * FE * EF * bonificador

                    # Descontar puntos del emisor
                    puntos_ordenados = sorted(puntos_disponibles, key=lambda p: p.fecha_obtencion)
                    puntos_a_descontar = puntos_a_regalar
                    for punto in puntos_ordenados:
                        if puntos_a_descontar <= 0:
                            break
                        if punto.cantidad_puntos <= puntos_a_descontar:
                            puntos_a_descontar -= punto.cantidad_puntos
                            db.session.delete(punto)
                        else:
                            punto.cantidad_puntos -= puntos_a_descontar
                            puntos_a_descontar = 0
                            db.session.add(punto)

                    hoy = datetime.now().date()
                    vencimiento = hoy + timedelta(days=365)

                    nuevo_registro = PuntosCliente(
                        id_cliente=receptor.id_cliente,
                        cantidad_puntos=puntos_transferidos,
                        fecha_obtencion=hoy,
                        fecha_vencimiento=vencimiento
                    )
                    db.session.add(nuevo_registro)
                    db.session.commit()
                    resultado = f"Se transfirieron correctamente {round(puntos_transferidos, 2)} puntos a {receptor.nombre}."

    return render_template("cliente/regalar_puntos.html", resultado=resultado)



@cliente_bp.route("/panel/horario_cita")
def horario_cita():
    if 'id_usuario' not in session or session.get('tipo_usuario') != 'cliente':
        return redirect(url_for("cliente_bp.login"))

    id_cliente = session['id_usuario']
    hoy = date.today()

    # Citas futuras (actuales)
    
    actuales = (
    db.session.query(
        Reserva,
        Usuario.nombre,
        Usuario.apellido,
        Servicio.nombre,
        EstadoReserva.was_paid,
        Sala.numero,
        Sala.alias
    )
    .join(Usuario, Usuario.id_usuario == Reserva.id_terapeuta)
    .join(Servicio, Servicio.id_servicio == Reserva.id_servicio)
    .join(Sala, Sala.id_sala == Reserva.id_sala)
    .join(EstadoReserva, EstadoReserva.id_reserva == Reserva.id_reserva)
    .filter(Reserva.id_cliente == session['id_usuario'])
    .filter(Reserva.fecha >= date.today())
    .all()
    )


    # Citas pasadas (historial)
    historial = (
    db.session.query(
        Reserva,
        Usuario.nombre,
        Usuario.apellido,
        Servicio.nombre,
        EstadoReserva.was_paid,
        Sala.numero,
        Sala.alias
    )
    .join(Usuario, Usuario.id_usuario == Reserva.id_terapeuta)
    .join(Servicio, Servicio.id_servicio == Reserva.id_servicio)
    .join(Sala, Sala.id_sala == Reserva.id_sala)
    .join(EstadoReserva, EstadoReserva.id_reserva == Reserva.id_reserva)
    .filter(Reserva.id_cliente == session['id_usuario'])
    .filter(Reserva.fecha < date.today())
    .all()
    )


    return render_template("cliente/horario_cita.html", actuales=actuales, historial=historial, hoy=hoy,timedelta=timedelta)

@cliente_bp.route("/panel/horario_cita/cancelar/<int:id_reserva>", methods=["POST"])
def cancelar_reserva(id_reserva):
    reserva = Reserva.query.get_or_404(id_reserva)
    hoy = date.today()

    if reserva.fecha - hoy <= timedelta(days=3):
        flash("Solo puedes cancelar con al menos 3 días de anticipación.")
        return redirect(url_for("cliente_bp.horario_cita"))

    try:
        # Eliminar primero el estado_reserva relacionado
        estado = EstadoReserva.query.filter_by(id_reserva=id_reserva).first()
        if estado:
            db.session.delete(estado)

        # Luego eliminar la reserva
        db.session.delete(reserva)
        db.session.commit()
        flash("Reserva cancelada exitosamente.")
    except Exception as e:
        db.session.rollback()
        flash(f"Error al cancelar la reserva: {e}", "danger")

    return redirect(url_for("cliente_bp.horario_cita"))


