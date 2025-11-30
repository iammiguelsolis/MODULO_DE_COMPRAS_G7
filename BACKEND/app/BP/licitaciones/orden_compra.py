from flask import Blueprint, request, jsonify
# from app.licitaciones.services.orden_compra_service import OrdenCompraService

from app.services.licitaciones.orden_compra_integration_service import OrdenCompraIntegrationService

orden_compra_bp = Blueprint('orden_compra', __name__, url_prefix='/api/licitaciones')
service = OrdenCompraIntegrationService()

@orden_compra_bp.route('/<int:id>/orden-compra', methods=['POST'])
def crear_orden_compra(id):
    """
    POST /api/licitaciones/{id}/orden-compra
    Genera la orden de compra (envía datos al módulo externo).
    """
    try:
        result = service.notificar_generacion_orden_compra(id)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
