from flask import Blueprint, request, jsonify
from app.services.licitaciones.contrato_service import ContratoService

contrato_bp = Blueprint('contrato', __name__, url_prefix='/api/licitaciones')
service = ContratoService()

@contrato_bp.route('/<int:id>/contrato/generar', methods=['POST'])
def generar_plantilla(id):
    """
    POST /api/licitaciones/{id}/contrato/generar
    Genera la plantilla del contrato.
    """
    try:
        data = request.get_json() or {}
        supervisor_id = data.get('supervisorId')
        
        if not supervisor_id:
             pass

        result = service.generar_plantilla_contrato(id, supervisor_id)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contrato_bp.route('/<int:id>/contrato/cargar-firmado', methods=['POST'])
def cargar_contrato(id):
    """
    POST /api/licitaciones/{id}/contrato/cargar-firmado
    Carga el contrato firmado.
    Body: { "url_archivo": "..." }
    """
    try:
        data = request.get_json()
        url_archivo = data.get('url_archivo')
        
        if not url_archivo:
            return jsonify({'error': 'Falta url_archivo'}), 400
            
        result = service.cargar_contrato_firmado(id, url_archivo)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
