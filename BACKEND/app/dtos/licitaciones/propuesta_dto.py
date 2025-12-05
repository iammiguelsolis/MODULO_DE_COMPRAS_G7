from dataclasses import dataclass
from typing import Optional, List, Dict, Any
from app.dtos.licitaciones.documento_dto import DocumentoDTO

@dataclass
class ProveedorDTO:
    id: int
    razon_social: str
    ruc: str
    email: str

@dataclass
class PropuestaResponseDTO:
    id_propuesta: int
    fecha_presentacion: str
    estado_tecnico: str  # PENDIENTE, APROBADO, RECHAZADO
    estado_economico: str # PENDIENTE, APROBADO, RECHAZADO
    puntuacion_economica: Optional[float]
    es_ganadora: bool
    proveedor: ProveedorDTO
    documentos: List[DocumentoDTO]
    
    @staticmethod
    def from_model(propuesta):
        estado_tec = "PENDIENTE"
        if propuesta.aprobada_tecnicamente:
            estado_tec = "APROBADO"
        elif propuesta.motivo_rechazo_tecnico:
            estado_tec = "RECHAZADO"
            
        estado_eco = "PENDIENTE"
        if propuesta.aprobada_economicamente:
            estado_eco = "APROBADO"
        elif propuesta.motivo_rechazo_economico:
            estado_eco = "RECHAZADO"

        # Mapear documentos
        docs_dto = []
        if propuesta.documentos:
            for doc in propuesta.documentos:
                docs_dto.append(DocumentoDTO(
                    id_documento=doc.id_documento,
                    nombre=doc.nombre,
                    url_archivo=doc.url_archivo,
                    tipo=doc.tipo.value if hasattr(doc.tipo, 'value') else str(doc.tipo),
                    validado=doc.validado,
                    observaciones=doc.observaciones,
                    fecha_subida=str(doc.fecha_subida)
                ))

        return PropuestaResponseDTO(
            id_propuesta=propuesta.id_propuesta,
            fecha_presentacion=str(propuesta.fecha_presentacion),
            estado_tecnico=estado_tec,
            estado_economico=estado_eco,
            puntuacion_economica=propuesta.puntuacion_economica,
            es_ganadora=propuesta.es_ganadora,
            proveedor=ProveedorDTO(
                id=propuesta.proveedor.id_proveedor,
                razon_social=propuesta.proveedor.razon_social,
                ruc=propuesta.proveedor.ruc,
                email=propuesta.proveedor.email
            ) if propuesta.proveedor else None,
            documentos=docs_dto
        )

