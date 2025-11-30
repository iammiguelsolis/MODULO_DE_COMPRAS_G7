from flask import Blueprint, request, jsonify
from app.services.licitaciones.contrato_service import ContratoService

contrato_bp = Blueprint('contrato', __name__, url_prefix='/api/licitaciones')
service = ContratoService()

@contrato_bp.route('/<int:id>/contrato/plantilla', methods=['POST'])
def generar_plantilla(id):
    """
    POST /api/licitaciones/{id}/contrato/plantilla
    Paso 1: Genera la plantilla del contrato prellenada.
    Body (JSON): { "supervisorId": int }
    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisorId')
        
        if not supervisor_id:
             return jsonify({'error': 'Falta supervisorId'}), 400

        result = service.generar_plantilla_contrato(id, supervisor_id)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contrato_bp.route('/<int:id>/contrato', methods=['POST'])
def cargar_contrato(id):
    """
    POST /api/licitaciones/{id}/contrato
    Paso 2: Carga el contrato firmado y finaliza la etapa.
    Body (Multipart):
      - archivoContrato: file (PDF firmado)
    """
    try:
        # Manejar archivo
        archivo = request.files.get('archivoContrato')
        if not archivo:
            return jsonify({'error': 'Falta archivoContrato'}), 400
            
        # Simular guardado de archivo y obtener URL
        # En producción: guardar en S3/Local y obtener path real
        archivo_url = f"/storage/contratos/firmados/{id}_{archivo.filename}"
        
        result = service.cargar_contrato_firmado(id, archivo_url)
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
