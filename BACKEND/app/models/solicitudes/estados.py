from abc import ABC, abstractmethod

class EstadoSolicitud(ABC):
    @abstractmethod
    def nombre(self): pass

    def agregar_items(self, solicitud, lista_items: list):
        raise Exception(f"No se pueden modificar items en estado {self.nombre()}")

    def aprobar(self, solicitud):
        raise Exception(f"Acción inválida en estado {self.nombre()}")

    def rechazar(self, solicitud):
        raise Exception(f"Acción inválida en estado {self.nombre()}")

class Pendiente(EstadoSolicitud):
    def nombre(self): return "PENDIENTE"

    def agregar_items(self, solicitud, lista_items: list):

        if not lista_items:
            return

        tipo_lote = type(lista_items[0])
        if not all(type(item) is tipo_lote for item in lista_items):
            raise Exception("Error de Regla de Negocio: El listado enviado contiene una mezcla de Materiales y Servicios.")

        if solicitud.items:
            tipo_existente = type(solicitud.items[0])
            if tipo_lote is not tipo_existente:
                raise Exception(f"Error: La solicitud ya es de tipo {tipo_existente.__name__} y intentas agregar {tipo_lote.__name__}.")

        solicitud.items.extend(lista_items)

    def aprobar(self, solicitud):
        if not solicitud.items:
            raise Exception("No se puede aprobar una solicitud vacía.")
        solicitud.set_estado(Aprobada())
    
    def rechazar(self, solicitud):
        solicitud.set_estado(Rechazada())

class Aprobada(EstadoSolicitud):
    def nombre(self): return "APROBADA"

class Rechazada(EstadoSolicitud):
    def nombre(self): return "RECHAZADA"
