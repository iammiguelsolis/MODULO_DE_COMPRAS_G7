from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoEvaluacionEconomia(EstadoLicitacionState):
    """
    Estado de Evaluación Económica.
    En este estado el comité económico revisa las propuestas aprobadas técnicamente.
    """
    
    def get_nombre(self):
        return "EVALUACION_ECONOMIA"
    
    def siguiente(self):
        """
        Si se seleccionó un ganador -> ADJUDICADA
        Si no -> CANCELADA
        """
        # Verificar que hay un ganador
        if getattr(self.licitacion, 'propuesta_ganadora', None):
            from app.licitaciones.models.estados.estado_adjudicada import EstadoAdjudicada
            return EstadoAdjudicada(self.licitacion)
        else:
            # Cancelar si no hay ganador viable
            from app.licitaciones.models.estados.estado_cancelada import EstadoCancelada
            return EstadoCancelada(self.licitacion)
    
    def puede_evaluar(self):
        return True
