from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoConPropuestas(EstadoLicitacionState):
    """
    Estado donde se han recibido propuestas y están listas para evaluación.
    """
    
    def siguiente(self):
        """
        Pasa a evaluación técnica.
        """
        from app.models.licitaciones.estados.estado_en_evaluacion import EstadoEnEvaluacion
        return EstadoEnEvaluacion(self.licitacion)
    
    def get_nombre(self):
        return "CON_PROPUESTAS"
