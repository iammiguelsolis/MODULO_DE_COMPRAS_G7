from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoEnEvaluacion(EstadoLicitacionState):
    """
    Estado de Evaluación Técnica.
    En este estado el comité técnico revisa las propuestas.
    """
    
    def siguiente(self):
        """
        Si hay propuestas aprobadas técnicamente -> EVALUACION_ECONOMIA
        Si no -> CANCELADA
        """
        # Filtra propuestas aprobadas técnicamente
        # Asumimos que PropuestaProveedor tiene atributo 'aprobada_tecnicamente'
        propuestas = getattr(self.licitacion, 'propuestas', [])
        aprobadas = [p for p in propuestas if getattr(p, 'aprobada_tecnicamente', False)]
        
        if len(aprobadas) > 0:
            from app.licitaciones.models.estados.estado_evaluacion_economia import EstadoEvaluacionEconomia
            return EstadoEvaluacionEconomia(self.licitacion)
        else:
            return self.cancelar()
    
    def get_nombre(self):
        return "EVALUACION_TECNICA"
    
    def puede_evaluar(self):
        return True
