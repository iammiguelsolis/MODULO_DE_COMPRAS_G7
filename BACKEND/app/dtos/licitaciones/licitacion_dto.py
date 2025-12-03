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
    
    proveedor_ganador: Optional[Dict[str, Any]] = None
    contrato: Optional[Dict[str, Any]] = None
    
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

        # 3. Obtener proveedor ganador
        proveedor_data = None
        if licitacion.propuesta_ganadora:
            prov = licitacion.propuesta_ganadora.proveedor
            proveedor_data = {
                'id_proveedor': prov.id_proveedor,
                'nombre': prov.nombre,
                'ruc': prov.ruc,
                'email': prov.email,
                'telefono': prov.telefono
            }
        
        # 4. Obtener contrato
        contrato_data = None
        if licitacion.contrato:
            contrato_data = {
                'id_contrato': licitacion.contrato.id_contrato,
                'fecha_generacion': licitacion.contrato.fecha_generacion_plantilla.isoformat(),
                'plantilla_url': licitacion.contrato.plantilla_url,
                'documento_firmado_url': licitacion.contrato.documento_firmado_url,
                'estado': licitacion.contrato.estado.value
            }

        return LicitacionResponseDTO(
            id_licitacion=licitacion.id,
            titulo=licitacion.solicitud_origen.titulo if licitacion.solicitud_origen else "",
            comentarios=licitacion.solicitud_origen.notas_adicionales if licitacion.solicitud_origen else "",
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_max=float(licitacion.presupuesto_max) if licitacion.presupuesto_max else 0.0,
            fecha_limite=licitacion.fecha_limite.isoformat() if licitacion.fecha_limite else None,
            items=items_dto,
            documentos_requeridos=docs_requeridos,
            proveedor_ganador=proveedor_data,
            contrato=contrato_data
        )