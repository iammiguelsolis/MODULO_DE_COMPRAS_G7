from abc import ABC, abstractmethod
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor

class ValidadorFactura(ABC):
    
    def __init__(self):
        self._siguiente = None

    def set_siguiente(self, validador: 'ValidadorFactura') -> None:
        """Define cuál es el siguiente validador en la cadena."""
        self._siguiente = validador

    @abstractmethod
    def validar_factura_proveedor(self, factura: FacturaProveedor) -> None:
        """
        Ejecuta la validación. Si pasa, debe llamar a self._siguiente.validar_factura_proveedor(factura)
        Si falla, debe lanzar una excepción o registrar el error.
        """
        pass