from flask import Blueprint, request, jsonify
from app.services.licitaciones.evaluacion_service import EvaluacionService

evaluaciones_bp = Blueprint('evaluaciones', __name__, url_prefix='/api/licitaciones')
service = EvaluacionService()

@evaluaciones_bp.route('/<int:id>/propuestas', methods=['GET'])
def listar_propuestas_evaluacion(id):
    """
    GET /api/licitaciones/{id}/propuestas
    Listar propuestas para evaluación (con documentos y estados).
    """
    try:
        propuestas = service.listar_propuestas_para_evaluacion(id)
        return jsonify(propuestas), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/enviar-a-evaluacion', methods=['POST'])
def enviar_a_evaluacion(id):
    """
    POST /api/licitaciones/{id}/enviar-a-evaluacion
    Iniciar Evaluación Técnica.
    """
    try:
        service.iniciar_evaluacion_tecnica(id)
        return jsonify({'mensaje': 'Estado actualizado a EVALUACION_TECNICA'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/propuestas/<int:propuesta_id>/evaluacion-tecnica', methods=['PUT'])
def registrar_evaluacion_tecnica(id, propuesta_id):
    """
    PUT /api/licitaciones/{id}/propuestas/{propuesta_id}/evaluacion-tecnica
    Guardar Evaluación Técnica de Proveedor.
    Body: {
        "aprobada_tecnicamente": bool,
        "motivo_rechazo_tecnico": str (opcional),
        "documentos": [{"id_documento": int, "validado": bool, "observaciones": str}]
    }
    """
    try:
        data = request.get_json()
        result = service.registrar_evaluacion_tecnica(id, propuesta_id, data)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/finalizar-evaluacion-tecnica', methods=['POST'])
def finalizar_evaluacion_tecnica(id):
    """
    POST /api/licitaciones/{id}/finalizar-evaluacion-tecnica
    Finalizar Evaluación Técnica.
    Verifica si hay propuestas válidas y pasa a EVALUACION_ECONOMIA o CANCELADA.
    """
    try:
        result = service.finalizar_evaluacion_tecnica(id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/propuestas/<int:propuesta_id>/evaluacion-economica', methods=['PUT'])
def registrar_evaluacion_economica(id, propuesta_id):
    """
    PUT /api/licitaciones/{id}/propuestas/{propuesta_id}/evaluacion-economica
    Guardar Evaluación Económica.
    Body: {
        "aprobada_economicamente": bool,
        "puntuacion_economica": float (opcional),
        "justificacion_economica": str (opcional),
        "motivo_rechazo_economico": str (opcional)
    }
    """
    try:
        data = request.get_json()
        result = service.registrar_evaluacion_economica(id, propuesta_id, data)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@evaluaciones_bp.route('/<int:id>/adjudicar', methods=['POST'])
def adjudicar_licitacion(id):
    """
    POST /api/licitaciones/{id}/adjudicar
    Adjudicar Licitación.
    Selecciona la propuesta con mayor puntaje, marca es_ganadora=TRUE y cambia estado a ADJUDICADA.
    """
    try:
        result = service.adjudicar_licitacion(id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
