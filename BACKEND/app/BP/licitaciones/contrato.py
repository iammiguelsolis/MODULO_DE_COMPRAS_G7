from flask import Blueprint, request, jsonify
from app.services.licitaciones.contrato_service import ContratoService

contrato_bp = Blueprint('contrato', __name__, url_prefix='/api/licitaciones')
service = ContratoService()

@contrato_bp.route('/<int:id>/contrato', methods=['POST'])
def generar_contrato(id):
    """
    POST /api/licitaciones/{id}/contrato
    Genera el contrato para la licitación adjudicada.
    Body (Multipart):
      - supervisorId: int
      - terminosAdicionales: string
      - condicionesPago: string
      - fechaFirma: date string
      - archivoContrato: file (opcional)
    """
    try:
        # 1. Extraer datos del formulario
        supervisor_id = request.form.get('supervisorId', type=int)
        
        if not supervisor_id:
             return jsonify({'error': 'Falta supervisorId'}), 400

        data = {
            'supervisorId': supervisor_id
        }

        # 2. Manejar archivo (Simulado)
        archivo = request.files.get('archivoContrato')
        if archivo:
            data['archivo_nombre'] = archivo.filename
            # data['archivo_objeto'] = archivo 

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
