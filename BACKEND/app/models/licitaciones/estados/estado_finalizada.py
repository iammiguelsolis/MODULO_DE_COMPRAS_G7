from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoFinalizada(EstadoLicitacionState):
    """
    Estado final exitoso.
    """
    
    def siguiente(self):
        return self
        
    def cancelar(self):
        return self # No se puede cancelar una finalizada
        
    def get_nombre(self) -> str:
        return "FINALIZADA"
