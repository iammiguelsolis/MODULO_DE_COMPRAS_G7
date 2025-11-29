from dataclasses import dataclass
from typing import List, Optional, Dict, Any

@dataclass
class ItemDTO:
    codigo: str
    nombre: str
    cantidad: int
    unidad_medida: str
    tipo: str  # MATERIAL o SERVICIO
    comentario: Optional[str] = None
    fecha_entrega: Optional[str] = None

@dataclass
class CrearLicitacionDTO:
    solicitud_id: int
    nombre: str
    presupuesto_maximo: float
    fecha_limite: str
    comprador_id: int
    items: List[Dict[str, Any]]

@dataclass
class LicitacionResponseDTO:
    id_licitacion: int
    nombre: str
    estado: str
    presupuesto_maximo: float
    fecha_creacion: str
    fecha_limite: str
    
    @staticmethod
    def from_model(licitacion):
        return LicitacionResponseDTO(
            id_licitacion=licitacion.id_licitacion,
            nombre=licitacion.nombre,
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_maximo=float(licitacion.presupuesto_maximo) if licitacion.presupuesto_maximo else 0.0,
            fecha_creacion=str(licitacion.fecha_creacion) if licitacion.fecha_creacion else "",
            fecha_limite=str(licitacion.fecha_limite) if licitacion.fecha_limite else ""
        )
