from flask import Blueprint, request, jsonify
# from app.licitaciones.services.orden_compra_service import OrdenCompraService

orden_compra_bp = Blueprint('orden_compra', __name__, url_prefix='/api/licitaciones')
# service = OrdenCompraService()

@orden_compra_bp.route('/<int:id>/orden-compra', methods=['POST'])
def crear_orden_compra(id):
    """
    POST /api/licitaciones/{id}/orden-compra
    Crea la orden de compra y finaliza el proceso.
    """
    # Implementación pendiente o simulada
    return jsonify({'mensaje': 'Orden de compra creada (Simulado)'}), 201
