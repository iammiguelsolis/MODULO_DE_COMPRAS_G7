from dataclasses import dataclass
from typing import Optional

@dataclass
class ItemDTO:
    id: int
    nombre: str
    cantidad: float
    tipo: str  # MATERIAL o SERVICIO
    comentario: Optional[str] = None
    precio_referencia: float = 0.0

    @staticmethod
    def from_model(item):
        # Lógica para extraer nombre y cantidad según el tipo de item (Polimorfismo)
        nombre = getattr(item, 'nombre_material', getattr(item, 'nombre_servicio', 'Sin Nombre'))
        cantidad = getattr(item, 'cantidad', getattr(item, 'horas_estimadas', 0))
        precio = getattr(item, 'precio_unitario', getattr(item, 'tarifa_hora', 0))

        return ItemDTO(
            id=item.id,
            nombre=nombre,
            cantidad=float(cantidad),
            tipo=item.tipo_item,
            comentario=item.comentario,
            precio_referencia=float(precio)
        )