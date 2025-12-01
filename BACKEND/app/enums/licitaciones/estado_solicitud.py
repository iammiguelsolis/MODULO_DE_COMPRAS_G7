from enum import Enum

class EstadoSolicitud(Enum):
    PENDIENTE = "PENDIENTE"
    APROBADA = "APROBADA"
    RECHAZADA = "RECHAZADA"
    EN_LICITACION = "EN_LICITACION"
