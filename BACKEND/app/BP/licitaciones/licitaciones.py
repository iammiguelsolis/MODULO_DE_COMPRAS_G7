from flask import Blueprint, request, jsonify
from app.services.licitaciones.licitacion_service import LicitacionService
from app.dtos.licitaciones.licitacion_dto import LicitacionResponseDTO, LicitacionListItemDTO

licitaciones_bp = Blueprint('licitaciones', __name__, url_prefix='/api/licitaciones')
service = LicitacionService()

@licitaciones_bp.route('', methods=['GET'])
def listar_licitaciones():
    """
    GET /api/licitaciones
    Lista todas las licitaciones con paginación
    """
    try:
        filters = {
            'estado': request.args.get('estado'),
            'fechaDesde': request.args.get('fechaDesde'),
            'fechaHasta': request.args.get('fechaHasta'),
            'limiteMontoMin': request.args.get('limiteMontoMin', type=float),
            'limiteMontoMax': request.args.get('limiteMontoMax', type=float),
            'titulo': request.args.get('titulo'),
            'id': request.args.get('id', type=int)
        }
        # Eliminar filtros vacíos
        filters = {k: v for k, v in filters.items() if v is not None}
        
        # Paginación
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        result = service.listar_todas(filters, page, per_page)
        # Usar DTO ligero para la lista
        items = [LicitacionListItemDTO.from_model(l) for l in result['items']]
        
        return jsonify({
            'items': items,
            'total': result['total'],
            'page': page,
            'per_page': per_page
        }), 200
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

@licitaciones_bp.route('/<int:id>/completar-detalles', methods=['PUT'])
def completar_detalles(id):
    """
    PUT /api/licitaciones/{id}/completar-detalles
    Actualiza presupuesto_max, fecha_limite y documentos_requeridos
    de una licitación en estado NUEVA.
    
    Body esperado:
    {
        "presupuesto_max": 50000.00,
        "fecha_limite": "2025-01-15",
        "documentos_requeridos": ["certificado-bancario", "experiencia-tecnica"]
    }
    """
    try:
        data = request.get_json()
        licitacion_actualizada = service.actualizar_detalles(id, data)
        return jsonify({
            'mensaje': 'Detalles de licitación actualizados correctamente',
            'licitacion': LicitacionResponseDTO.from_model(licitacion_actualizada)
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
