from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoFinalizada(EstadoLicitacionState):
    """
    Estado final exitoso del proceso de licitación.
    El proceso ha concluido con una orden de compra generada.
    """
    
    def siguiente(self):
        return self
    
    def get_nombre(self):
        return "FINALIZADA"
