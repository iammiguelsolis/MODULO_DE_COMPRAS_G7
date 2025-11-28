from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoConContrato(EstadoLicitacionState):
    """
    Estado cuando el contrato ha sido generado y firmado.
    Se espera la creación de la orden de compra.
    """
    
    def siguiente(self):
        """
        Si se creó la orden de compra -> FINALIZADA
        """
        # Asumimos que existe una relación o flag para orden de compra
        # Por ahora usamos un flag genérico o verificamos si existe orden_compra
        if getattr(self.licitacion, 'orden_compra_creada', False):
            from app.licitaciones.models.estados.estado_finalizada import EstadoFinalizada
            return EstadoFinalizada(self.licitacion)
        return self
    
    def get_nombre(self):
        return "CON_CONTRATO"
