from abc import ABC, abstractmethod

class EstadoLicitacionState(ABC):
    """
    Interfaz para el patrón State de Licitación.
    Define los métodos que todos los estados concretos deben implementar.
    """
    
    def __init__(self, licitacion):
        self.licitacion = licitacion
        
    @abstractmethod
    def siguiente(self):
        """
        Intenta avanzar al siguiente estado.
        Retorna la instancia del nuevo estado o self si no se puede avanzar.
        """
        pass
    
    @abstractmethod
    def cancelar(self):
        """
        Intenta cancelar la licitación.
        """
        pass
        
    @abstractmethod
    def get_nombre(self) -> str:
        pass
