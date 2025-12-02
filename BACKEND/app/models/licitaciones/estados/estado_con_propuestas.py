from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoConPropuestas(EstadoLicitacionState):
    """
    Estado cuando se han registrado propuestas y se cierra la recepción.
    Listo para iniciar evaluación técnica.
    """
    
    def siguiente(self):
        # CON_PROPUESTAS -> EVALUACION_TECNICA
        from app.models.licitaciones.estados.estado_en_evaluacion import EstadoEnEvaluacion
        return EstadoEnEvaluacion(self.licitacion)
        
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "CON_PROPUESTAS"
