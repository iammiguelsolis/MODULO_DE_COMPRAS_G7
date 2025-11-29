from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ProveedorDTO:
    id: int
    nombre: str
    ruc: str
    email: str

@dataclass
class PropuestaResponseDTO:
    id_propuesta: int
    fecha_presentacion: str
    monto_total: float
    plazo_entrega_dias: int
    garantia_meses: int
    comentarios: Optional[str]
    estado_tecnico: str  # PENDIENTE, APROBADO, RECHAZADO
    estado_economico: str # PENDIENTE, APROBADO, RECHAZADO
    es_ganadora: bool
    proveedor: ProveedorDTO
    
    @staticmethod
    def from_model(propuesta):
        # Determinar estados de evaluación para el frontend
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

        return PropuestaResponseDTO(
            id_propuesta=propuesta.id_propuesta,
            fecha_presentacion=str(propuesta.fecha_presentacion),
            monto_total=float(propuesta.monto_total) if propuesta.monto_total else 0.0,
            plazo_entrega_dias=propuesta.plazo_entrega_dias,
            garantia_meses=propuesta.garantia_meses,
            comentarios=propuesta.comentarios,
            estado_tecnico=estado_tec,
            estado_economico=estado_eco,
            es_ganadora=propuesta.es_ganadora,
            proveedor=ProveedorDTO(
                id=propuesta.proveedor.id_proveedor,
                nombre=propuesta.proveedor.nombre,
                ruc=propuesta.proveedor.ruc,
                email=propuesta.proveedor.email
            ) if propuesta.proveedor else None
        )
