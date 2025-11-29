from abc import ABC, abstractmethod

class EstadoLicitacionState(ABC):
    """
    Interface abstracta para los estados de una licitación (Patrón State).
    Define el comportamiento común y los métodos que deben implementar los estados concretos.
    """
    
    def __init__(self, licitacion):
        self.licitacion = licitacion
    
    @abstractmethod
    def siguiente(self):
        """
        Transición al siguiente estado según la lógica del estado actual.
        Debe retornar una instancia del nuevo estado.
        """
        pass
    
    @abstractmethod
    def get_nombre(self):
        """
        Retorna el nombre del estado actual (string).
        """
        pass
    
    def puede_invitar_proveedores(self):
        """
        Indica si en este estado se pueden enviar invitaciones.
        Por defecto False, los estados que lo permitan deben sobreescribirlo.
        """
        return False
    
    def puede_evaluar(self):
        """
        Indica si en este estado se pueden evaluar propuestas.
        Por defecto False.
        """
        return False
    
    def cancelar(self):
        """
        Transición forzada al estado CANCELADA.
        """
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        return EstadoCancelada(self.licitacion)
