from flask import Blueprint, request, jsonify
from app.services.licitaciones.licitacion_service import LicitacionService
from app.dtos.licitaciones.licitacion_dto import LicitacionResponseDTO

licitaciones_bp = Blueprint('licitaciones', __name__, url_prefix='/api/licitaciones')
service = LicitacionService()

@licitaciones_bp.route('', methods=['GET'])
def listar_licitaciones():
    """
    GET /api/licitaciones
    Lista todas las licitaciones.
    """
    try:
        licitaciones = service.listar_todas()
        response = [LicitacionResponseDTO.from_model(l) for l in licitaciones]
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@licitaciones_bp.route('', methods=['POST'])
def crear_licitacion():
    """
    POST /api/licitaciones
    Crea una nueva licitación.
    """
    try:
        data = request.get_json()
        # Aquí se podría usar una librería de validación como Marshmallow
        # Por simplicidad pasamos el dict directo al servicio
        nueva_licitacion = service.crear_licitacion(data)
        return jsonify(LicitacionResponseDTO.from_model(nueva_licitacion)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@licitaciones_bp.route('/<int:id>', methods=['GET'])
def obtener_licitacion(id):
    """
    GET /api/licitaciones/{id}
    Obtiene el detalle de una licitación.
    """
    try:
        licitacion = service.obtener_por_id(id)
        if not licitacion:
            return jsonify({'error': 'Licitación no encontrada'}), 404
        return jsonify(LicitacionResponseDTO.from_model(licitacion)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
