# app/patrones/clasificadores.py
from abc import ABC, abstractmethod

class EstrategiaClasificacion(ABC):
    @abstractmethod
    def determinar_tipo(self, solicitud) -> str:
        pass

class ClasificadorPorMonto(EstrategiaClasificacion):
    
    UMBRAL_LICITACION = 10000.00 

    def determinar_tipo(self, solicitud) -> str:
        total = solicitud.calcular_total()
        
        if total >= self.UMBRAL_LICITACION:
            return "LICITACION"
        else:
            return "COMPRA"

class ClasificadorSiempreCompra(EstrategiaClasificacion):
    def determinar_tipo(self, solicitud) -> str:
        return "COMPRA"