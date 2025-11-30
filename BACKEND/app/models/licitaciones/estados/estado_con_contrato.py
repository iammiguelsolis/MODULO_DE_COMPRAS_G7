from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoConContrato(EstadoLicitacionState):
    """
    Estado CON_CONTRATO: Contrato firmado y cargado.
    Espera la generación de Orden de Compra para pasar a FINALIZADA.
    """
    
    def get_nombre(self):
        return "CON_CONTRATO"
    
    def siguiente(self):
        """
        Transición a FINALIZADA después de generar la Orden de Compra.
        """
        from app.models.licitaciones.estados.estado_finalizada import EstadoFinalizada
        return EstadoFinalizada(self.licitacion)
    
    def generar_orden_compra(self):
        """
        Acción específica: enviar datos al módulo de Orden de Compra.
        """
        # Esta acción será ejecutada por OrdenCompraIntegrationService
        return True
