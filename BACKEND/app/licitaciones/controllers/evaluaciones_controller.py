from flask import Blueprint, request, jsonify
from app.licitaciones.services.evaluacion_service import EvaluacionService

evaluaciones_bp = Blueprint('evaluaciones', __name__, url_prefix='/api/licitaciones')
service = EvaluacionService()

@evaluaciones_bp.route('/<int:id>/enviarEvaluacion', methods=['PUT'])
def enviar_a_evaluacion(id):
    """
    PUT /api/licitaciones/{id}/enviarEvaluacion
    Envía la licitación a evaluación técnica (cierra recepción de propuestas).
    """
    # Esta lógica podría estar en PropuestaService.finalizar_registro_propuestas
    # o ser un paso explícito. Asumimos que finalizar registro ya hace la transición.
    # Si este endpoint es para iniciar la evaluación explícitamente:
    return jsonify({'mensaje': 'Endpoint redundante si finalizarRegistro ya avanza estado'}), 200

@evaluaciones_bp.route('/<int:id>/evaluacion-tecnica', methods=['POST'])
def registrar_evaluacion_tecnica(id):
    """
    POST /api/licitaciones/{id}/evaluacion-tecnica
    Registra evaluaciones técnicas de propuestas.
    Body: { "supervisor_id": 1, "evaluaciones": [{ "propuesta_id": 1, "aprobada": true }] }
    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisor_id')
        evaluaciones = data.get('evaluaciones', [])
        
        result = service.registrar_evaluacion_tecnica(id, supervisor_id, evaluaciones)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/evaluacion-economica', methods=['POST'])
def registrar_evaluacion_economica(id):
    """
    POST /api/licitaciones/{id}/evaluacion-economica
    Registra evaluaciones económicas y selecciona ganador.
    Body: { "supervisor_id": 1, "evaluaciones": [{ "propuesta_id": 1, "puntuacion": 95 }] }
    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisor_id')
        evaluaciones = data.get('evaluaciones', [])
        
        result = service.registrar_evaluacion_economica(id, supervisor_id, evaluaciones)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
