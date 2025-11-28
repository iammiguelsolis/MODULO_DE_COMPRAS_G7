from dataclasses import dataclass
from typing import List, Optional, Dict, Any

@dataclass
class CrearPropuestaDTO:
    proveedor_id: int
    monto_total: float
    plazo_entrega: int
    garantia: int
    comentarios: Optional[str] = None

@dataclass
class DocumentoPropuestaDTO:
    nombre: str
    url: str
    tipo: str
