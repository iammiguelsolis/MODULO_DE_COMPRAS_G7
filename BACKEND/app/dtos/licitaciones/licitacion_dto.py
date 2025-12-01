from dataclasses import dataclass
from typing import List, Optional, Dict, Any

@dataclass
class ItemDTO:
    codigo: str
    nombre: str
    cantidad: int
    tipo: str  # MATERIAL o SERVICIO
    comentario: Optional[str] = None
    fecha_entrega: Optional[str] = None

@dataclass
class CrearLicitacionDTO:
    solicitud_id: int
    limite_monto: float
    fecha_limite: str
    comprador_id: int
    items: List[Dict[str, Any]]

@dataclass
class LicitacionResponseDTO:
    id_licitacion: int
    estado: str
    limite_monto: float
    fecha_limite: str
    
    items: List[ItemDTO]
    
    @staticmethod
    def from_model(licitacion):
        # Mapear items solicitados
        items_dto = []
        if hasattr(licitacion, 'items'):
            for item in licitacion.items:
                # Determinar cantidad según tipo
                cantidad = 0
                if item.tipo == 'MATERIAL':
                    cantidad = item.cantidad
                elif item.tipo == 'SERVICIO':
                    cantidad = int(item.horas) if item.horas else 0

                items_dto.append(ItemDTO(
                    codigo=item.codigo,
                    nombre=item.nombre,
                    cantidad=cantidad,
                    tipo=item.tipo,
                    comentario=item.comentario,
                    fecha_entrega=str(item.fecha_entrega) if item.fecha_entrega else None
                ))
        
        return LicitacionResponseDTO(
            id_licitacion=licitacion.id_licitacion,
            estado=licitacion.estado_actual.get_nombre(),
            limite_monto=float(licitacion.limite_monto) if licitacion.limite_monto else 0.0,
            fecha_limite=str(licitacion.fecha_limite) if licitacion.fecha_limite else "",
            items=items_dto
        )
