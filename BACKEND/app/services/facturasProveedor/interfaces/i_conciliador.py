from abc import ABC, abstractmethod
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor

class IConciliador(ABC):
    @abstractmethod
    def conciliar(self, factura: FacturaProveedor, orden_compra_id: str):
        """
        Realiza la conciliación entre una factura y una orden de compra.
        Debe devolver un diccionario con el resultado.
        """
        pass
