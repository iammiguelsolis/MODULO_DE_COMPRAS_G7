from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoNueva(EstadoLicitacionState):
    """
    Estado cuando la licitación ha sido aprobada.
    En este estado se pueden enviar invitaciones a proveedores.
    """
    
    def siguiente(self):
        """
        Si se enviaron invitaciones y se finalizó el periodo -> EN_INVITACION
        """
        if getattr(self.licitacion, 'invitaciones_enviadas', False):
            from app.models.licitaciones.estados.estado_en_invitacion import EstadoEnInvitacion
            return EstadoEnInvitacion(self.licitacion)
        return self
    
    def get_nombre(self):
        return "NUEVA"
    
    def puede_invitar_proveedores(self):
        return True
