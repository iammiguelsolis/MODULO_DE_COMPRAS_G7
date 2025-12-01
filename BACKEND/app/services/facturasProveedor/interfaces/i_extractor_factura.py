from abc import ABC, abstractmethod

class IExtractorFactura(ABC):
    @abstractmethod
    def extraer_datos(self, documento_path: str) -> dict:
        pass
