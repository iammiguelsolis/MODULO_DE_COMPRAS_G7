from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.services.facturasProveedor.interfaces.factura_observer import FacturaObserver

class FacturaObservable(ABC):
    
    def __init__(self):
        self._observers = []

    # Métodos concretos (ya implementados)
    def add_observer(self, observer: 'FacturaObserver') -> None:
        if not hasattr(self, '_observers'): self._observers = []
        if observer not in self._observers:
            self._observers.append(observer)

    def remove_observer(self, observer: 'FacturaObserver') -> None:
        if hasattr(self, '_observers') and observer in self._observers:
            self._observers.remove(observer)

    # Método Abstracto (Si quieres obligar a quien herede a implementarlo)
    # OJO: Si 'notify' ya tiene lógica común, NO debería ser abstracto.
    # Pero si el diagrama lo pide abstracto, lo pones así:
    @abstractmethod
    def notify(self, factura) -> None:
        """
        Las clases hijas deben implementar cómo notifican.
        """
        pass