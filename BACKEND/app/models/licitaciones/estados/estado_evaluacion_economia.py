from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoEvaluacionEconomia(EstadoLicitacionState):
    """
    Estado de Evaluación Económica.
    """
    
    def siguiente(self):
        # EVALUACION_ECONOMIA -> ADJUDICADA (Si hay ganadora)
        if self.licitacion.propuesta_ganadora:
            from app.models.licitaciones.estados.estado_adjudicada import EstadoAdjudicada
            return EstadoAdjudicada(self.licitacion)
        else:
            # Si no hay ganadora (Desierto) -> CANCELADA
            return self.cancelar()
            
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "EVALUACION_ECONOMIA"
        
    def puede_evaluar(self) -> bool:
        return True
