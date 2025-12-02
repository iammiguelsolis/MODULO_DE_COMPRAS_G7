from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoCancelada(EstadoLicitacionState):
    """
    Estado final de cancelación.
    """
    
    def siguiente(self):
        return self
        
    def cancelar(self):
        return self
        
    def get_nombre(self) -> str:
        return "CANCELADA"
