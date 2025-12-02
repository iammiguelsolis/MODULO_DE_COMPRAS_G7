from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoBorrador(EstadoLicitacionState):
    """
    Estado inicial de una licitación.
    Espera aprobación del supervisor de compras.
    """
    
    def siguiente(self):
        # BORRADOR -> NUEVA (Si fue aprobada por supervisor)
        if self.licitacion.aprobada_por_supervisor:
            from app.models.licitaciones.estados.estado_nueva import EstadoNueva
            return EstadoNueva(self.licitacion)
        return self
        
    def cancelar(self):
        # BORRADOR -> CANCELADA (Rechazo o cancelación manual)
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        
    def get_nombre(self) -> str:
        return "BORRADOR"
