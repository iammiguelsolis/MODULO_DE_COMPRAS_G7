from enum import Enum

class TipoDocumento(Enum):
    """
    Tipos de documentos requeridos en una licitación.
    """
    LEGAL = "LEGAL"
    TECNICO = "TECNICO"
    ECONOMICO = "ECONOMICO"
