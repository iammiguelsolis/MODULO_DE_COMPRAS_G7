from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoAdjudicada(EstadoLicitacionState):
    """
    Estado cuando se ha seleccionado un proveedor ganador.
    Se espera la generación del contrato.
    """
    
    def siguiente(self):
        """
        Si se generó el contrato -> CON_CONTRATO
        """
        if getattr(self.licitacion, 'contrato_generado', False):
            from app.licitaciones.models.estados.estado_con_contrato import EstadoConContrato
            return EstadoConContrato(self.licitacion)
        return self
    
    def get_nombre(self):
        return "ADJUDICADA"
