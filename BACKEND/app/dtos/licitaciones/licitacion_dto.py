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
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from app.dtos.licitaciones.item_dto import ItemDTO
from app.dtos.licitaciones.documento_dto import DocumentoRequeridoDTO

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
    presupuesto_max: float
    fecha_limite: str
    comprador_id: int
    # items removido, se heredan de solicitud

@dataclass
class LicitacionResponseDTO:
    id_licitacion: int
    estado: str
    presupuesto_max: float
    fecha_limite: str
    
    items: List[ItemDTO]
    documentos_requeridos: List[DocumentoRequeridoDTO]
    titulo: str = ""
    comentarios: str = ""
    
    @staticmethod
    def from_model(licitacion):
        # Mapear items desde solicitud_origen
        items_dto = []
        if licitacion.solicitud_origen and hasattr(licitacion.solicitud_origen, 'items'):
            for item in licitacion.solicitud_origen.items:
                # Determinar cantidad según tipo (asumiendo estructura común)
                cantidad = getattr(item, 'cantidad', 0)

                items_dto.append(ItemDTO(
                    codigo=getattr(item, 'codigo', 'SIN_CODIGO'),
                    nombre=getattr(item, 'nombre', 'Sin nombre'),
                    cantidad=cantidad,
                    tipo=getattr(item, 'tipo', 'MATERIAL'),
                    comentario=getattr(item, 'comentario', None),
                    fecha_entrega=str(getattr(item, 'fecha_entrega', None)) if getattr(item, 'fecha_entrega', None) else None
                ))
        
        # Mapear documentos requeridos
        docs_requeridos = []
        if hasattr(licitacion, 'documentos_requeridos'):
            for doc in licitacion.documentos_requeridos:
                docs_requeridos.append(DocumentoRequeridoDTO(
                    id_requerido=doc.id_requerido,
                    nombre=doc.nombre,
                    tipo=doc.tipo.name if hasattr(doc.tipo, 'name') else str(doc.tipo),
                    obligatorio=doc.obligatorio,
                    ruta_plantilla=doc.ruta_plantilla
                ))

        return LicitacionResponseDTO(
            id_licitacion=licitacion.id_licitacion,
            titulo=licitacion.titulo,
            comentarios=licitacion.comentarios,
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_max=float(licitacion.presupuesto_max) if licitacion.presupuesto_max else 0.0,
            fecha_limite=str(licitacion.fecha_limite) if licitacion.fecha_limite else "",
            items=items_dto,
            documentos_requeridos=docs_requeridos
        )
