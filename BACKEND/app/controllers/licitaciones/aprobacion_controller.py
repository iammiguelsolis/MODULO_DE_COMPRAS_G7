from flask import Blueprint, request, jsonify
from app.licitaciones.services.aprobacion_service import AprobacionService

aprobacion_bp = Blueprint('aprobacion', __name__, url_prefix='/api/licitaciones')
service = AprobacionService()

@aprobacion_bp.route('/<int:id>/aprobacion', methods=['PUT'])
def gestionar_aprobacion(id):
    """
    PUT /api/licitaciones/{id}/aprobacion
    Aprueba o rechaza una licitación en estado BORRADOR.
    Body: { "accion": "APROBAR"|"RECHAZAR", "supervisor_id": 1, "comentarios": "..." }
    """
    try:
        data = request.get_json()
        accion = data.get('accion')
        supervisor_id = data.get('supervisor_id')
        comentarios = data.get('comentarios')
        
        if accion == "APROBAR":
            result = service.aprobar_licitacion(id, supervisor_id, comentarios)
        elif accion == "RECHAZAR":
            result = service.rechazar_licitacion(id, supervisor_id, comentarios)
        else:
            return jsonify({'error': 'Acción no válida'}), 400
            
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
