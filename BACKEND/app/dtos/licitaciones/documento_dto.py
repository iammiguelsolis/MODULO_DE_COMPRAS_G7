from dataclasses import dataclass

@dataclass
class DocumentoRequeridoDTO:
    id_requerido: int
    nombre: str
    tipo: str
    obligatorio: bool
    ruta_plantilla: str
