from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoBorrador(EstadoLicitacionState):
    """
    Estado inicial de una licitación.
    Espera aprobación del supervisor de compras.
    """
    
    def siguiente(self):
        """
        Si el supervisor aprobó -> NUEVA
        Si rechazó -> CANCELADA
        """
        if getattr(self.licitacion, 'aprobada_por_supervisor', False):
            from app.models.licitaciones.estados.estado_nueva import EstadoNueva
            return EstadoNueva(self.licitacion)
        else:
            return self.cancelar()
    
    def get_nombre(self):
        return "BORRADOR"
