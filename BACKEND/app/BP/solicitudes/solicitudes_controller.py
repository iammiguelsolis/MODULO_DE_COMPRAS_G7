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
  
@solicitudes_bp.route('', methods=['GET'])
def obtener_solicitudes():
  try:
    lista_solicitudes = service.obtener_todas()
    
    datos_json = [solicitud.to_dict() for solicitud in lista_solicitudes]
    
    return jsonify(datos_json), 200
  except Exception as e:
    return jsonify({'error': 'Error al obtener las solicitudes', 'detalle': str(e)}), 500

@solicitudes_bp.route('/<int:id>', methods=['GET'])
def obtener_solicitud(id):
  try:
    solicitud = service.obtener_por_id(id)
    return jsonify(solicitud.to_dict()), 200
  except Exception as e:
    return jsonify({'error': 'Error al obtener la solicitud', 'detalle': str(e)}), 500
  
  
@solicitudes_bp.route('/<int:id>/aprobar', methods=['PUT'])
def aprobar_solicitud(id):
  try:
    solicitud = service.procesar_aprobacion(id)
    return jsonify(solicitud.to_dict()), 200
  except Exception as e:
    return jsonify({'error': 'Error al aprobar la solicitud', 'detalle': str(e)}), 500
  
  
@solicitudes_bp.route('/<int:id>/rechazar', methods=['PUT'])
def rechazar_solicitud(id):
  try:
    solicitud = service.procesar_rechazo(id)
    return jsonify(solicitud.to_dict()), 200
  except Exception as e:
    return jsonify({'error': 'Error al rechazar la solicitud', 'detalle': str(e)}), 500