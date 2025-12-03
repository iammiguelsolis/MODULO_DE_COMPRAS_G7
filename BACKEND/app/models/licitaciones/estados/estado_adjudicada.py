from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState
from app.enums.licitaciones.estado_contrato import EstadoContrato

class EstadoAdjudicada(EstadoLicitacionState):
    """
    Estado cuando ya hay un proveedor ganador.
    Se gestiona la firma del contrato.
    """
    
    def siguiente(self):
        # ADJUDICADA -> CON_CONTRATO (Si contrato está firmado)
        # Verificamos si existe contrato y su estado
        contrato = self.licitacion.contrato
        if contrato and contrato.estado == EstadoContrato.FIRMADO_CARGADO:
            from app.models.licitaciones.estados.estado_con_contrato import EstadoConContrato
            return EstadoConContrato(self.licitacion)
        return self
        
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "ADJUDICADA"
