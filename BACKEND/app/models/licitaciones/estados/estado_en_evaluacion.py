from app.models.licitaciones.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoEnEvaluacion(EstadoLicitacionState):
    """
    Estado de Evaluación Técnica.
    """
    
    def siguiente(self):
        # EVALUACION_TECNICA -> EVALUACION_ECONOMIA (Si hay al menos 1 propuesta válida técnicamente)
        propuestas_validas = [p for p in self.licitacion.propuestas if p.aprobada_tecnicamente]
        
        if propuestas_validas:
            from app.models.licitaciones.estados.estado_evaluacion_economia import EstadoEvaluacionEconomia
            return EstadoEvaluacionEconomia(self.licitacion)
        else:
            # Si todas fueron rechazadas -> CANCELADA
            # Esto podría ser automático o manual, según regla 5: "Si Propuestas_Validas == 0 -> CANCELADA"
            # Asumimos que el servicio llama a siguiente() después de evaluar todas.
            return self.cancelar()
            
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.licitacion.cambiar_estado(EstadoCancelada(self.licitacion))
        return self.licitacion.estado_actual
        
    def get_nombre(self) -> str:
        return "EVALUACION_TECNICA"
        
    def puede_evaluar(self) -> bool:
        return True
