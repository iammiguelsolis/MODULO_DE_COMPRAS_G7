from enum import Enum

class EstadoLicitacion(Enum):
    """
    Enumeración de los posibles estados de una licitación.
    Representa el flujo completo del proceso de adquisición.
    """
    BORRADOR = "BORRADOR"
    NUEVA = "NUEVA"
    EN_INVITACION = "EN_INVITACION"
    CON_PROPUESTAS = "CON_PROPUESTAS"
    EVALUACION_TECNICA = "EVALUACION_TECNICA"
    EVALUACION_ECONOMIA = "EVALUACION_ECONOMIA"
    ADJUDICADA = "ADJUDICADA"
    CON_CONTRATO = "CON_CONTRATO"
    FINALIZADA = "FINALIZADA"
    CANCELADA = "CANCELADA"
