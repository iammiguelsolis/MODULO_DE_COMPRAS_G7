from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from app.dtos.licitaciones.item_dto import ItemDTO
from app.dtos.licitaciones.documento_dto import DocumentoRequeridoDTO

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
        # 1. Mapear items usando el DTO de items
        items_dto = []
        if licitacion.solicitud_origen and licitacion.solicitud_origen.items:
            items_dto = [ItemDTO.from_model(i) for i in licitacion.solicitud_origen.items]
        
        # 2. Mapear documentos requeridos
        docs_requeridos = []
        if licitacion.documentos_requeridos:
            for doc in licitacion.documentos_requeridos:
                docs_requeridos.append(DocumentoRequeridoDTO(
                    id_requerido=doc.id_requerido,
                    nombre=doc.nombre,
                    tipo=doc.tipo.value if hasattr(doc.tipo, 'value') else str(doc.tipo),
                    obligatorio=doc.obligatorio,
                    ruta_plantilla=doc.ruta_plantilla
                ))

        return LicitacionResponseDTO(
            id_licitacion=licitacion.id,  # CORRECCIÓN: Usamos .id (heredado)
            titulo=licitacion.solicitud_origen.titulo if licitacion.solicitud_origen else "",
            comentarios=licitacion.solicitud_origen.notas_adicionales if licitacion.solicitud_origen else "",
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_max=float(licitacion.presupuesto_max) if licitacion.presupuesto_max else 0.0,
            fecha_limite=licitacion.fecha_limite.isoformat() if licitacion.fecha_limite else None,
            items=items_dto,
            documentos_requeridos=docs_requeridos
        )