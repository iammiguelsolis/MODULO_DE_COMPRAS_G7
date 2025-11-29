from enum import Enum

class TipoItem(Enum):
    """
    Tipos de ítems que se pueden solicitar en una licitación.
    """
    MATERIAL = "MATERIAL"
    SERVICIO = "SERVICIO"
