from flask import Blueprint, request, jsonify
from app.services.licitaciones.contrato_service import ContratoService

contrato_bp = Blueprint('contrato', __name__, url_prefix='/api/licitaciones')
service = ContratoService()

@contrato_bp.route('/<int:id>/contrato', methods=['POST'])
def generar_contrato(id):
    """
    POST /api/licitaciones/{id}/contrato
    Genera el contrato para la licitación adjudicada.
    """
    try:
        data = request.get_json()
        result = service.generar_contrato(id, data)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contrato_bp.route('/<int:id>/contrato', methods=['GET'])
def obtener_contrato(id):
    """
    GET /api/licitaciones/{id}/contrato
    Obtiene el contrato generado.
    """
    try:
        result = service.obtener_contrato(id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
