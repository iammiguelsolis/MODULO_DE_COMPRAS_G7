from enum import Enum

class TipoSupervisor(Enum):
    """
    Tipos de supervisores que intervienen en el proceso de aprobación.
    """
    COMPRA = "COMPRA"
    TECNICO = "TECNICO"
    ECONOMICO = "ECONOMICO"
