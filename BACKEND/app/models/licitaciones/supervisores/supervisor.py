from abc import ABC, abstractmethod

class Supervisor(ABC):
    """
    Handler abstracto para el patrón Chain of Responsibility.
    Define la interfaz para manejar solicitudes de aprobación y encadenar supervisores.
    """
    
    def __init__(self, id_supervisor, tipo):
        self.id_supervisor = id_supervisor
        self.tipo = tipo
        self._siguiente = None  # Siguiente supervisor en la cadena
    
    def set_siguiente(self, supervisor):
        """
        Configura el siguiente supervisor en la cadena.
        Retorna el supervisor configurado para permitir encadenamiento fluido.
        """
        self._siguiente = supervisor
        return supervisor
    
    @abstractmethod
    def validar(self, licitacion):
        """
        Método abstracto que debe implementar cada supervisor concreto.
        Retorna True si aprueba la licitación, False si la rechaza.
        """
        pass
    
    def procesar(self, licitacion):
        """
        Método principal que ejecuta la lógica de la cadena.
        Si el supervisor actual aprueba, pasa la solicitud al siguiente.
        Si rechaza, detiene la cadena y cancela la licitación.
        """
        if self.validar(licitacion):
            # Aprobado por este supervisor
            if self._siguiente is not None:
                # Pasar al siguiente
                return self._siguiente.procesar(licitacion)
            else:
                # Final de la cadena, todo aprobado
                return True
        else:
            # Rechazado, romper cadena
            if hasattr(licitacion, 'cancelar'):
                licitacion.cancelar()
            return False
    
    def pasar_al_siguiente(self, licitacion):
        """
        Permite pasar al siguiente eslabón sin validar (para casos especiales).
        """
        if self._siguiente:
            return self._siguiente.procesar(licitacion)
        return True
