from flask import Blueprint, request, jsonify
from app.services.solicitudes.solicitud_service import SolicitudService

solicitudes_bp = Blueprint('solicitudes', __name__, url_prefix='/api/solicitudes')
service = SolicitudService()

@solicitudes_bp.route('', methods=['POST'])
def crear():
  data = request.get_json()
  
  try:
    solicitud = service.crear_solicitud(data)
    return jsonify({
      'id': solicitud.id,
      'mensaje': 'Solicitud creada exitosamente',
      'status': 201
    }), 201
  except ValueError as e:
    return jsonify({'error': str(e)}), 400
  except Exception as e:
    return jsonify({'error': 'Error al crear la solicitud', 'detalle': str(e)}), 500