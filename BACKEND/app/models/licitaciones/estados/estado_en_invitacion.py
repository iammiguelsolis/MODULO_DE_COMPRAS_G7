from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState
from datetime import datetime

class EstadoEnInvitacion(EstadoLicitacionState):
    """
    Estado de espera de recepción de propuestas.
    """
    
    def siguiente(self):
        # EN_INVITACION -> CON_PROPUESTAS (Manual)
        # La validación de si hay propuestas se hace en el servicio antes de llamar a siguiente()
        if self.licitacion.propuestas:
             from app.models.licitaciones.estados.estado_con_propuestas import EstadoConPropuestas
             return EstadoConPropuestas(self.licitacion)
        
        # Si fecha limite pasó y no hay propuestas -> CANCELADA (Timeout)
        if self.licitacion.fecha_limite and datetime.now() > self.licitacion.fecha_limite:
             if not self.licitacion.propuestas:
                 return self.cancelar()
                 
        return self
        
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "EN_INVITACION"
