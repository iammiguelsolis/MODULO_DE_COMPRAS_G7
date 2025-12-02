from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoNueva(EstadoLicitacionState):
    """
    Estado cuando la licitación ha sido aprobada.
    En este estado se pueden enviar invitaciones a proveedores.
    """
    
    def siguiente(self):
        # NUEVA -> EN_INVITACION (Si se enviaron invitaciones)
        if self.licitacion.invitaciones_enviadas:
            from app.models.licitaciones.estados.estado_en_invitacion import EstadoEnInvitacion
            return EstadoEnInvitacion(self.licitacion)
        return self
        
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        
    def get_nombre(self) -> str:
        return "NUEVA"
        
    def puede_invitar_proveedores(self) -> bool:
        return True
