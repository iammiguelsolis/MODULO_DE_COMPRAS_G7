from abc import ABC, abstractmethod
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.obligacion_pago import ObligacionPago

class CreadorObligacion(ABC):
    
    @abstractmethod
    def crear_obligacion_pago(self, factura: FacturaProveedor) -> ObligacionPago:
        """Crea el objeto ObligacionPago basado en la factura."""
        pass

    @abstractmethod
    def enviar_obligacion_cxp(self, obligacion: ObligacionPago) -> None:
        """Envía la obligación al sistema externo (CxP)."""
        pass