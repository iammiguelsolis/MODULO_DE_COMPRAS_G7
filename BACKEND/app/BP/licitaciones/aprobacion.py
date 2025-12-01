from flask import Blueprint, request, jsonify
from app.services.licitaciones.aprobacion_service import AprobacionService

aprobacion_bp = Blueprint('aprobacion', __name__, url_prefix='/api/licitaciones')
service = AprobacionService()

@aprobacion_bp.route('/<int:id>/aprobar', methods=['POST'])
def aprobar_licitacion(id):
    """
    POST /api/licitaciones/{id}/aprobar
    Aprobar licitación (Supervisor).
    Body: { "supervisor_id": int }
    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisor_id')
        
        if not supervisor_id:
            return jsonify({'error': 'Falta supervisor_id'}), 400
            
        # Comentarios opcionales no están en el body requerido del API, pero el servicio los acepta
        comentarios = data.get('comentarios', '')
        
        result = service.aprobar_licitacion(id, supervisor_id, comentarios)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@aprobacion_bp.route('/<int:id>/rechazar', methods=['POST'])
def rechazar_licitacion(id):
    """
    POST /api/licitaciones/{id}/rechazar
    Rechazar licitación (Supervisor).
    Body: { "supervisor_id": int, "motivo_rechazo": str }
    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisor_id')
        motivo_rechazo = data.get('motivo_rechazo')
        
        if not supervisor_id or not motivo_rechazo:
            return jsonify({'error': 'Faltan datos (supervisor_id, motivo_rechazo)'}), 400
            
        result = service.rechazar_licitacion(id, supervisor_id, motivo_rechazo)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
