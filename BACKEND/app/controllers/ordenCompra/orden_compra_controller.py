from flask import Blueprint, request, jsonify
from app.services.ordenCompra.orden_compra_service import OrdenCompraService
from app.dtos.ordenCompra.orden_compra_dto import (
    CrearOrdenCompraRequest, 
    OrdenCompraResponse,
    CambiarEstadoRequest
)
from app.models.Evaluacion.evaluacion_enums import EstadoOC

orden_compra_bp = Blueprint('orden_compra', __name__, url_prefix='/api/ordenes-compra')

@orden_compra_bp.route('', methods=['POST'])
def crear_orden_compra():
    """Crea una nueva orden de compra"""
    try:
        # Validar y parsear request
        data = CrearOrdenCompraRequest(**request.json)
        
        # Crear orden usando el servicio
        orden = OrdenCompraService.crear_orden_compra(data)
        
        # Convertir a response DTO
        response_data = OrdenCompraService.to_response(orden)
        
        return jsonify({
            'success': True,
            'message': 'Orden de compra creada exitosamente',
            'data': response_data
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        # Log del error (deberías usar logging)
        print(f"Error creando orden de compra: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500

@orden_compra_bp.route('', methods=['GET'])
def listar_ordenes():
    """Lista órdenes de compra con filtros opcionales"""
    try:
        # Obtener parámetros de query
        estado = request.args.get('estado')
        proveedor_id = request.args.get('proveedor_id', type=int)
        tipo_origen = request.args.get('tipo_origen')
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        
        # Convertir fechas si existen
        from datetime import datetime
        fecha_desde_dt = datetime.fromisoformat(fecha_desde) if fecha_desde else None
        fecha_hasta_dt = datetime.fromisoformat(fecha_hasta) if fecha_hasta else None
        
        # Obtener órdenes
        ordenes = OrdenCompraService.listar_ordenes(
            estado=estado,
            proveedor_id=proveedor_id,
            tipo_origen=tipo_origen,
            fecha_desde=fecha_desde_dt,
            fecha_hasta=fecha_hasta_dt
        )
        
        # Convertir a response
        response_data = [OrdenCompraService.to_response(orden) for orden in ordenes]
        
        return jsonify({
            'success': True,
            'data': response_data,
            'total': len(response_data)
        }), 200
        
    except Exception as e:
        print(f"Error listando órdenes: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error al listar órdenes'
        }), 500

@orden_compra_bp.route('/<int:id_orden>', methods=['GET'])
def obtener_orden(id_orden: int):
    """Obtiene una orden específica por ID"""
    try:
        orden = OrdenCompraService.obtener_por_id(id_orden)
        
        if not orden:
            return jsonify({
                'success': False,
                'error': f'Orden con ID {id_orden} no encontrada'
            }), 404
        
        response_data = OrdenCompraService.to_response(orden)
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except Exception as e:
        print(f"Error obteniendo orden {id_orden}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error al obtener la orden'
        }), 500

@orden_compra_bp.route('/<int:id_orden>/estado', methods=['PATCH'])
def cambiar_estado_orden(id_orden: int):
    """Cambia el estado de una orden"""
    try:
        # Validar request
        data = CambiarEstadoRequest(**request.json)
        
        # Cambiar estado
        orden = OrdenCompraService.cambiar_estado(id_orden, data)
        
        response_data = OrdenCompraService.to_response(orden)
        
        return jsonify({
            'success': True,
            'message': f'Estado cambiado a {data.nuevo_estado.value}',
            'data': response_data
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        print(f"Error cambiando estado de orden {id_orden}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error al cambiar estado'
        }), 500

@orden_compra_bp.route('/<int:id_orden>/historial', methods=['GET'])
def obtener_historial(id_orden: int):
    """Obtiene el historial de una orden (si implementas historial)"""
    try:
        # TODO: Implementar servicio de historial
        # historial = HistorialService.obtener_por_orden(id_orden)
        
        return jsonify({
            'success': True,
            'message': 'Historial endpoint - Por implementar',
            'data': []
        }), 200
        
    except Exception as e:
        print(f"Error obteniendo historial de orden {id_orden}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error al obtener historial'
        }), 500