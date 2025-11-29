from flask import Blueprint, request, jsonify
from app.licitaciones.services.propuesta_service import PropuestaService

propuestas_bp = Blueprint('propuestas', __name__, url_prefix='/api/licitaciones')
service = PropuestaService()

from app.licitaciones.dtos.propuesta_dto import PropuestaResponseDTO

@propuestas_bp.route('/<int:id>/propuestas', methods=['GET'])
def listar_propuestas(id):
    """
    GET /api/licitaciones/{id}/propuestas
    Lista las propuestas de una licitación.
    """
    try:
        # Obtener licitación para verificar existencia (opcional pero recomendado)
        # O simplemente buscar propuestas por licitacion_id
        
        # Aquí asumimos que el servicio tiene un método para listar o usamos el modelo directo
        # Para mantener capas, deberíamos agregar listar_por_licitacion en PropuestaService
        propuestas = service.listar_por_licitacion(id)
        
        response = [PropuestaResponseDTO.from_model(p) for p in propuestas]
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/<int:id>/propuestas', methods=['POST'])
def registrar_propuesta(id):
    """
    POST /api/licitaciones/{id}/propuestas
    Registra una propuesta de proveedor.
    Body: { "proveedor_id": 1, "monto_total": 1000, ... , "documentos": [...] }
    """
    try:
        data = request.get_json()
        documentos = data.pop('documentos', [])
        
        propuesta = service.registrar_propuesta(id, data, documentos)
        
        # Retornar ID de propuesta creada
        return jsonify({
            "success": True, 
            "id_propuesta": propuesta.id_propuesta,
            "mensaje": "Propuesta registrada exitosamente"
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/<int:id>/finalizarRegistro', methods=['PUT'])
def finalizar_registro(id):
    """
    PUT /api/licitaciones/{id}/finalizarRegistro
    Finaliza el periodo de registro de propuestas.
    """
    try:
        result = service.finalizar_registro_propuestas(id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
