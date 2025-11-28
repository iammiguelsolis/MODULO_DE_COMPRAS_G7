from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoCancelada(EstadoLicitacionState):
    """
    Estado final cuando la licitación ha sido cancelada.
    No hay transiciones desde este estado.
    """
    
    def siguiente(self):
        return self
    
    def get_nombre(self):
        return "CANCELADA"
