from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from app.dtos.licitaciones.item_dto import ItemDTO
from app.dtos.licitaciones.documento_dto import DocumentoRequeridoDTO
from app.dtos.licitaciones.propuesta_dto import ProveedorDTO

@dataclass
class CrearLicitacionDTO:
    solicitud_id: int
    presupuesto_max: float
    fecha_limite: str
    comprador_id: int


# DTO Ligero para la lista (sin items ni documentos para mejor rendimiento)
@dataclass
class LicitacionListItemDTO:
    id_licitacion: int
    titulo: str
    estado: str
    presupuesto_max: float
    fecha_limite: Optional[str]
    fecha_creacion: Optional[str]
    solicitud_id: Optional[int]
    
    @staticmethod
    def from_model(licitacion):
        return LicitacionListItemDTO(
            id_licitacion=licitacion.id,
            titulo=licitacion.solicitud_origen.titulo if licitacion.solicitud_origen else "",
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_max=float(licitacion.presupuesto_max) if licitacion.presupuesto_max else 0.0,
            fecha_limite=licitacion.fecha_limite.isoformat() if licitacion.fecha_limite else None,
            fecha_creacion=licitacion.fecha_creacion.isoformat() if licitacion.fecha_creacion else None,
            solicitud_id=licitacion.solicitud_id
        )


@dataclass
class LicitacionResponseDTO:
    id_licitacion: int
    estado: str
    presupuesto_max: float
    fecha_limite: str
    fecha_creacion: str
    solicitud_id: Optional[int]
    items: List[ItemDTO]
    documentos_requeridos: List[DocumentoRequeridoDTO]
    titulo: str = ""
    comentarios: str = ""
    
    proveedor_ganador: Optional[Dict[str, Any]] = None
    contrato: Optional[Dict[str, Any]] = None
    cantidad_invitaciones: int = 0
    cantidad_propuestas: int = 0
    proveedores_invitados: List[ProveedorDTO] = None
    
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
        if licitacion.propuesta_ganadora and licitacion.propuesta_ganadora.proveedor:
            prov = licitacion.propuesta_ganadora.proveedor
            proveedor_data = {
                'id_proveedor': prov.id_proveedor,
                'razon_social': prov.razon_social,
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

        # Calcular contadores y lista de invitados
        cant_invitaciones = 0
        invitados_dto = []
        if hasattr(licitacion, 'invitaciones'):
            cant_invitaciones = len(licitacion.invitaciones)
            for inv in licitacion.invitaciones:
                if inv.proveedor:
                    invitados_dto.append(ProveedorDTO(
                        id=inv.proveedor.id_proveedor,
                        razon_social=inv.proveedor.razon_social,
                        ruc=inv.proveedor.ruc,
                        email=inv.proveedor.email
                    ))
            
        cant_propuestas = 0
        if licitacion.propuestas:
            cant_propuestas = len(licitacion.propuestas)

        return LicitacionResponseDTO(
            id_licitacion=licitacion.id,
            titulo=licitacion.solicitud_origen.titulo if licitacion.solicitud_origen else "",
            comentarios=licitacion.solicitud_origen.notas_adicionales if licitacion.solicitud_origen else "",
            estado=licitacion.estado_actual.get_nombre(),
            presupuesto_max=float(licitacion.presupuesto_max) if licitacion.presupuesto_max else 0.0,
            fecha_limite=licitacion.fecha_limite.isoformat() if licitacion.fecha_limite else None,
            fecha_creacion=licitacion.fecha_creacion.isoformat() if licitacion.fecha_creacion else None,
            solicitud_id=licitacion.solicitud_id,
            items=items_dto,
            documentos_requeridos=docs_requeridos,
            proveedor_ganador=proveedor_data,
            contrato=contrato_data,
            cantidad_invitaciones=cant_invitaciones,
            cantidad_propuestas=cant_propuestas,
            proveedores_invitados=invitados_dto
        )