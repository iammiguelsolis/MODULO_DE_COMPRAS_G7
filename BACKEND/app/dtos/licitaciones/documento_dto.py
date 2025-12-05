from dataclasses import dataclass

@dataclass
class DocumentoRequeridoDTO:
    id_requerido: int
    nombre: str
    tipo: str
    obligatorio: bool
    ruta_plantilla: str

@dataclass
class DocumentoDTO:
    id_documento: int
    nombre: str
    url_archivo: str
    tipo: str
    validado: bool
    observaciones: str
    fecha_subida: str