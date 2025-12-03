from flask import Blueprint, request, jsonify
# from app.licitaciones.services.orden_compra_service import OrdenCompraService

from app.services.licitaciones.orden_compra_integration_service import OrdenCompraIntegrationService

orden_compra_bp = Blueprint('orden_compra', __name__, url_prefix='/api/licitaciones')
service = OrdenCompraIntegrationService()

@orden_compra_bp.route('/<int:id>/finalizar', methods=['POST'])
def finalizar_licitacion(id):
    """
    POST /api/licitaciones/{id}/finalizar
    Finaliza la licitación para que esté disponible en el módulo de órdenes de compra.
    """
    try:
        result = service.confirmar_envio_a_orden_compra(id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
