from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoEnInvitacion(EstadoLicitacionState):
    """
    Estado donde se ha cerrado el periodo de invitaciones y se esperan propuestas.
    """
    
    def siguiente(self):
        """
        Si hay propuestas registradas -> CON_PROPUESTAS
        Si no hay propuestas -> CANCELADA
        """
        # Nota: Asumimos que licitacion.propuestas es una lista o relación
        if getattr(self.licitacion, 'propuestas', []) and len(self.licitacion.propuestas) > 0:
            from app.licitaciones.models.estados.estado_con_propuestas import EstadoConPropuestas
            return EstadoConPropuestas(self.licitacion)
        else:
            return self.cancelar()
    
    def get_nombre(self):
        return "EN_INVITACION"
