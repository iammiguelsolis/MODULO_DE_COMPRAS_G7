from dataclasses import dataclass

@dataclass
class Reserva:
    cliente_id: int
    terapeuta_id: int
    fecha: str

    def __init__(self, cliente_id: int, terapeuta_id: int):
        self.cliente_id = cliente_id
        self.terapeuta_id = terapeuta_id
        self.fecha = "2025-01-01"  # default