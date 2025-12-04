from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

# TRUCO PARA EVITAR CICLOS:
# TYPE_CHECKING es True solo cuando tu editor revisa el código,
# pero es False cuando Python ejecuta el programa.
if TYPE_CHECKING:
    from app.models.facturasProveedor.factura_proveedor import FacturaProveedor

class FacturaObserver(ABC):
    
    @abstractmethod
    # Usamos comillas simples 'FacturaProveedor' (Forward Reference).
    # Esto le dice a Python: "Habrá una clase con este nombre, confía en mí",
    # sin necesidad de importarla ahora mismo.
    def actualizar(self, factura: 'FacturaProveedor') -> None:
        """
        Método llamado automáticamente cuando el 'Observable' reporta un cambio.
        """
        pass