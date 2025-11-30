from flask import Blueprint, request, jsonify
from app.services.licitaciones.invitacion_service import InvitacionService

invitaciones_bp = Blueprint('invitaciones', __name__, url_prefix='/api/licitaciones')
service = InvitacionService()

@invitaciones_bp.route('/<int:id>/invitaciones', methods=['POST'])
def enviar_invitaciones(id):
    """
    POST /api/licitaciones/{id}/invitaciones
    Envía invitaciones a una lista de proveedores.
    Body: { "proveedores_ids": [1, 2, 3] }
    """
    try:
        data = request.get_json()
        proveedores_ids = data.get('proveedores_ids', [])
        
        if not proveedores_ids:
            return jsonify({'error': 'Debe proporcionar una lista de proveedores'}), 400
            
        result = service.enviar_invitaciones(id, proveedores_ids)
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invitaciones_bp.route('/<int:id>/finalizarInvitacion', methods=['PUT'])
def finalizar_invitacion(id):
    """
    PUT /api/licitaciones/{id}/finalizarInvitacion
    Finaliza el periodo de invitación manualmente (si aplica).
    """
    try:
        result = service.finalizar_periodo_invitacion(id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
