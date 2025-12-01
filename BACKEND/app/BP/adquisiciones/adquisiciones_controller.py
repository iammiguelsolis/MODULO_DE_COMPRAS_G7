from flask import Blueprint, request, jsonify
from app.services.adquisiciones.adquisicion_service import AdquisicionService

adquisiciones_bp = Blueprint('adquisiciones', __name__, url_prefix='/api/adquisiciones')

service = AdquisicionService()

@adquisiciones_bp.route('/generar', methods=['POST'])
def generar_proceso():

    data = request.get_json()
    id_solicitud = data.get('id_solicitud')

    if not id_solicitud:
        return jsonify({'error': 'Falta el id_solicitud'}), 400

    try:
        resultado = service.generar_proceso_compra(id_solicitud)
        
        response = {
            'tipo_proceso': resultado['tipo'],
            'mensaje': resultado['mensaje'],
        }

        if resultado['data']:
            response['proceso'] = resultado['data'].to_dict()
            status_code = 201
        else:
            status_code = 200

        return jsonify(response), status_code

    except Exception as e:
        return jsonify({'error': 'Error al generar el proceso', 'detalle': str(e)}), 500


@adquisiciones_bp.route('/<int:id_compra>/invitar', methods=['POST'])
def invitar_proveedores(id_compra):

    data = request.get_json()
    lista_contactos = data.get('proveedores', [])
    canal = data.get('canal', 'EMAIL')

    try:
        compra_actualizada = service.invitar_proveedores(id_compra, lista_contactos, canal)
        
        return jsonify({
            'mensaje': f'Invitaciones enviadas correctamente vía {canal}',
            'estado_proceso': compra_actualizada.estado,
            'compra': compra_actualizada.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error al enviar invitaciones', 'detalle': str(e)}), 500


@adquisiciones_bp.route('/<int:id_compra>/ofertar', methods=['POST'])
def recibir_oferta(id_compra):
    data = request.get_json()

    try:
        nueva_oferta = service.registrar_oferta(id_compra, data)
        
        return jsonify({
            'mensaje': 'Oferta registrada exitosamente',
            'oferta': nueva_oferta.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'error': 'Error al registrar la oferta', 'detalle': str(e)}), 500

@adquisiciones_bp.route('/<int:id_compra>/elegir-ganador', methods=['PUT'])
def adjudicar_compra(id_compra):

    data = request.get_json()
    id_oferta = data.get('id_oferta')

    if not id_oferta:
        return jsonify({'error': 'Debe especificar el id_oferta ganadora'}), 400

    try:
        compra_cerrada = service.elegir_ganador(id_compra, id_oferta)
        
        return jsonify({
            'mensaje': 'Compra adjudicada y cerrada correctamente',
            'compra': compra_cerrada.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error al adjudicar la compra', 'detalle': str(e)}), 500
      
      
@adquisiciones_bp.get("")
def listar_procesos():
    service = AdquisicionService()
    try:
        data = service.listar_procesos()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@adquisiciones_bp.get("<int:id_proceso>")
def obtener_proceso(id_proceso):
    service = AdquisicionService()
    try:
        data = service.obtener_proceso(id_proceso)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500