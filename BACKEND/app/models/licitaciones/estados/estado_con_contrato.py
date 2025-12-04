from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoConContrato(EstadoLicitacionState):
    """
    Estado cuando el contrato está firmado.
    Listo para integración con Órdenes de Compra.
    """
    
    def siguiente(self):
        # CON_CONTRATO -> FINALIZADA (Tras integración exitosa)
        # La integración se hace en el servicio, aquí solo transicionamos
        from app.models.licitaciones.estados.estado_finalizada import EstadoFinalizada
        return EstadoFinalizada(self.licitacion)
        
    def cancelar(self):
        # En esta etapa ya es difícil cancelar, pero por interfaz se mantiene
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "CON_CONTRATO"
    
    def generar_orden_compra(self):
        """
        Acción específica: enviar datos al módulo de Orden de Compra.
        """
        # Esta acción será ejecutada por OrdenCompraIntegrationService
        return True
