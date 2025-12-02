from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import date
from enum import Enum
from models.Evaluacion.evaluacion_enums import TipoPago, EstadoLineaOC, EstadoOC
from enums.ordenCompra.orden_compra_enums import TipoOrigen, Moneda


class LineaOCRequest(BaseModel):
    """DTO para crear una línea de orden de compra"""
    producto_id: int = Field(..., gt=0, description="ID del producto")
    cantidad: int = Field(..., gt=0, description="Cantidad solicitada")
    precio_unitario: float = Field(..., gt=0, description="Precio unitario")
    descripcion: Optional[str] = Field(None, max_length=500)
    
    # Condiciones específicas por línea (opcional)
    permite_entrega_parcial: bool = False
    cantidad_esperada_entrega_parcial: Optional[int] = Field(None, ge=0)
    fecha_limite_entrega_parcial: Optional[date] = None
    fecha_limite_entrega_final: Optional[date] = None
    
    @validator('cantidad_esperada_entrega_parcial')
    def validar_cantidad_parcial(cls, v, values):
        if values.get('permite_entrega_parcial') and v is None:
            raise ValueError('Si permite entrega parcial, debe especificar cantidad esperada')
        if not values.get('permite_entrega_parcial') and v is not None:
            raise ValueError('No puede especificar cantidad parcial si no permite entrega parcial')
        return v

class CrearOrdenCompraRequest(BaseModel):
    """DTO para crear una orden de compra completa"""
    tipo_origen: TipoOrigen
    proveedor_id: int = Field(..., gt=0)
    
    # Referencias según tipo
    solicitud_id: Optional[int] = Field(None, gt=0)
    notificacion_inventario_id: Optional[int] = Field(None, gt=0)
    
    # Líneas de la orden
    lineas: List[LineaOCRequest] = Field(..., min_items=1)
    
    # Datos financieros
    moneda: Moneda
    fecha_entrega_esperada: date
    
    # Condiciones
    condiciones_pago_dias_plazo: int = Field(0, ge=0)
    condiciones_pago_modalidad: TipoPago
    
    # Información descriptiva
    terminos_entrega: str = Field(..., min_length=1, max_length=1000)
    titulo: str = Field(..., min_length=1, max_length=200)
    observaciones: Optional[str] = Field(None, max_length=2000)
    
    @validator('solicitud_id', 'notificacion_inventario_id')
    def validar_origen(cls, v, values, **kwargs):
        tipo_origen = values.get('tipo_origen')
        campo = kwargs['field'].name
        
        if tipo_origen in [TipoOrigen.RFQ, TipoOrigen.LICITACION]:
            if campo == 'solicitud_id' and not v:
                raise ValueError(f'{tipo_origen.value} requiere una solicitud_id')
            if campo == 'notificacion_inventario_id' and v:
                raise ValueError(f'{tipo_origen.value} no debe tener notificacion_inventario_id')
        
        elif tipo_origen == TipoOrigen.DIRECTA:
            if campo == 'notificacion_inventario_id' and not v:
                raise ValueError('DIRECTA requiere notificacion_inventario_id')
            if campo == 'solicitud_id' and v:
                raise ValueError('DIRECTA no debe tener solicitud_id')
        
        return v
    
    @validator('condiciones_pago_dias_plazo')
    def validar_dias_plazo(cls, v, values):
        modalidad = values.get('condiciones_pago_modalidad')
        if modalidad == TipoPago.contado and v > 0:
            raise ValueError('Al contado no puede tener días de plazo')
        return v

class LineaOCResponse(BaseModel):
    """DTO para responder una línea de orden"""
    id_linea_oc: int
    producto_id: int
    descripcion: Optional[str]
    cantidad: int
    precio_unitario: float
    subtotal: float
    estado: str
    
    class Config:
        from_attributes = True

class OrdenCompraResponse(BaseModel):
    """DTO para responder una orden de compra completa"""
    id_orden_compra: int
    numero_referencia: str
    fecha_creacion: datetime
    estado: str
    titulo: str
    
    # Información de proveedor
    proveedor_id: int
    proveedor_nombre: str
    
    # Tipo y referencias
    tipo_origen: str
    solicitud_id: Optional[int]
    notificacion_inventario_id: Optional[int]
    
    # Datos financieros
    total: float
    moneda: str
    
    # Condiciones
    condiciones_pago_dias_plazo: int
    condiciones_pago_modalidad: str
    terminos_entrega: str
    fecha_entrega_esperada: date
    
    # Información adicional
    observaciones: Optional[str]
    
    # Líneas
    lineas: List[LineaOCResponse]
    
    # Metadata
    es_editable: bool
    
    class Config:
        from_attributes = True

class CambiarEstadoRequest(BaseModel):
    """DTO para cambiar estado de orden"""
    nuevo_estado: EstadoOC
    comentario: Optional[str] = Field(None, max_length=500)