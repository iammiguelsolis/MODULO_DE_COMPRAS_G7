from flask import Blueprint, request, jsonify
from app.services.licitaciones.evaluacion_service import EvaluacionService

evaluaciones_bp = Blueprint('evaluaciones', __name__, url_prefix='/api/licitaciones')
service = EvaluacionService()

@evaluaciones_bp.route('/<int:id>/enviar-a-evaluacion', methods=['POST'])
def enviar_a_evaluacion(id):
    """
    POST /api/licitaciones/{id}/enviar-a-evaluacion
    Iniciar Evaluación Técnica.
    """
    # Aquí deberíamos llamar a un servicio que haga la transición explícita
    # Por ahora, si el servicio no lo tiene, podemos hacerlo manualmente o asumir que ya está
    # Si usamos EvaluacionService, podríamos agregar un método iniciar_evaluacion()
    try:
        service.iniciar_evaluacion_tecnica(id)
        return jsonify({'mensaje': 'Estado actualizado a EVALUACION_TECNICA'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
