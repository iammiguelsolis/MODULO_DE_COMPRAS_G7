from abc import ABC, abstractmethod
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.services.facturasProveedor.interfaces.i_extractor_factura import IExtractorFactura

class IPrellenadoFactura(ABC):
    @abstractmethod
    def rellenar_automaticamente(self, factura: FacturaProveedor, documento: DocumentoAdjunto, adjuntador_tool, extractor: IExtractorFactura):
        pass
