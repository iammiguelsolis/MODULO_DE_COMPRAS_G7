from app.models.OrdenCompra.orden_compra import OrdenCompra
from app.models.Evaluacion.dominio_orden_compra import LineaOC, EstadoLineaOC, EstadoOC
from app.enums.ordenCompra.orden_compra_enums import TipoOrigen
from app.dtos.ordenCompra.orden_compra_dto import (
    CrearOrdenCompraRequest, 
    OrdenCompraResponse,
    CambiarEstadoRequest
)
from app.bdd import db
from datetime import datetime
from typing import List, Optional

class OrdenCompraService:
    
    @staticmethod
    def crear_orden_compra(request: CrearOrdenCompraRequest) -> OrdenCompra:
        """Crea una nueva orden de compra"""
        
        # 1. Validar proveedor existe (deberías tener un servicio de proveedores)
        # proveedor = ProveedorService.obtener_por_id(request.proveedor_id)
        # if not proveedor:
        #     raise ValueError(f"Proveedor con ID {request.proveedor_id} no existe")
        
        # 2. Crear orden principal
        orden = OrdenCompra(
            tipo_origen=request.tipo_origen,
            id_proveedor=request.proveedor_id,
            id_solicitud=request.solicitud_id,
            id_notificacion_inventario=request.notificacion_inventario_id,
            moneda=request.moneda,
            fecha_entrega_esperada=request.fecha_entrega_esperada,
            condiciones_pago_dias_plazo=request.condiciones_pago_dias_plazo,
            condiciones_pago_modalidad=request.condiciones_pago_modalidad,
            terminos_entrega=request.terminos_entrega,
            titulo=request.titulo,
            observaciones=request.observaciones
        )
        
        # 3. Generar número de referencia
        orden.generar_numero_referencia()
        
        # 4. Crear líneas de orden
        for linea_request in request.lineas:
            linea = LineaOC(
                id_item=linea_request.producto_id,
                precio_unitario=linea_request.precio_unitario,
                cantidad=linea_request.cantidad,
                estado=EstadoLineaOC.Todavia_no_cp,  # Estado inicial
                
                # Condiciones de línea (si existen)
                permite_entrega_parcial=linea_request.permite_entrega_parcial,
                cantidad_esperada_entrega_parcial=linea_request.cantidad_esperada_entrega_parcial,
                fecha_limite_entrega_parcial=linea_request.fecha_limite_entrega_parcial,
                fecha_limite_entrega_final=linea_request.fecha_limite_entrega_final or request.fecha_entrega_esperada,
                
                # Detalles iniciales
                estado_parcial=EstadoLineaOC.Todavia_no_cp,
                estado_final=EstadoLineaOC.Todavia_no_cp
            )
            orden.lineas.append(linea)
        
        # 5. Estado inicial según tipo
        if request.tipo_origen == TipoOrigen.DIRECTA:
            orden.estado = EstadoOC.Borrador
        else:
            orden.estado = EstadoOC.En_Proceso
        
        # 6. Guardar en BD
        db.session.add(orden)
        db.session.commit()
        
        return orden
    
    @staticmethod
    def obtener_por_id(id_orden: int) -> Optional[OrdenCompra]:
        """Obtiene una orden por su ID"""
        return OrdenCompra.query.get(id_orden)
    
    @staticmethod
    def listar_ordenes(
        estado: Optional[str] = None,
        proveedor_id: Optional[int] = None,
        tipo_origen: Optional[str] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> List[OrdenCompra]:
        """Lista órdenes con filtros opcionales"""
        query = OrdenCompra.query
        
        if estado:
            query = query.filter(OrdenCompra.estado == estado)
        if proveedor_id:
            query = query.filter(OrdenCompra.id_proveedor == proveedor_id)
        if tipo_origen:
            query = query.filter(OrdenCompra.tipo_origen == tipo_origen)
        if fecha_desde:
            query = query.filter(OrdenCompra.fecha_creacion >= fecha_desde)
        if fecha_hasta:
            query = query.filter(OrdenCompra.fecha_creacion <= fecha_hasta)
        
        return query.order_by(OrdenCompra.fecha_creacion.desc()).all()
    
    @staticmethod
    def cambiar_estado(id_orden: int, request: CambiarEstadoRequest) -> OrdenCompra:
        """Cambia el estado de una orden"""
        orden = OrdenCompraService.obtener_por_id(id_orden)
        if not orden:
            raise ValueError(f"Orden con ID {id_orden} no encontrada")
        
        orden.cambiar_estado(request.nuevo_estado)
        
        # Aquí podrías registrar en historial con el comentario
        # HistorialService.registrar_cambio_estado(orden, request.comentario)
        
        db.session.commit()
        return orden
    
    @staticmethod
    def to_response(orden: OrdenCompra) -> dict:
        """Convierte modelo OrdenCompra a DTO de respuesta"""
        from app.models import Proveedor  # Asumiendo que existe
        
        proveedor = Proveedor.query.get(orden.id_proveedor)
        
        return {
            'id_orden_compra': orden.id_orden_compra,
            'numero_referencia': orden.numero_referencia,
            'fecha_creacion': orden.fecha_creacion,
            'estado': orden.estado.value,
            'titulo': orden.titulo,
            'proveedor_id': orden.id_proveedor,
            'proveedor_nombre': proveedor.nombre if proveedor else 'Desconocido',
            'tipo_origen': orden.tipo_origen.value,
            'solicitud_id': orden.id_solicitud,
            'notificacion_inventario_id': orden.id_notificacion_inventario,
            'total': orden.calcular_total(),
            'moneda': orden.moneda.value,
            'condiciones_pago_dias_plazo': orden.condiciones_pago_dias_plazo,
            'condiciones_pago_modalidad': orden.condiciones_pago_modalidad.value,
            'terminos_entrega': orden.terminos_entrega,
            'fecha_entrega_esperada': orden.fecha_entrega_esperada,
            'observaciones': orden.observaciones,
            'es_editable': orden.es_editable(),
            'lineas': [
                {
                    'id_linea_oc': linea.id_linea_oc,
                    'producto_id': linea.id_item,
                    'descripcion': linea.descripcion,
                    'cantidad': linea.cantidad,
                    'precio_unitario': linea.precio_unitario,
                    'subtotal': linea.calcular_subtotal(),
                    'estado': linea.estado.value
                }
                for linea in orden.lineas
            ]
        }