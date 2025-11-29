from app.licitaciones.models.supervisores.supervisor import Supervisor
from app.licitaciones.enums.tipo_supervisor import TipoSupervisor

class SupervisorEconomico(Supervisor):
    """
    Tercer eslabón de la cadena.
    Evalúa criterios económicos y selecciona al ganador.
    """
    
    def __init__(self, id_supervisor):
        super().__init__(id_supervisor, TipoSupervisor.ECONOMICO)

    def aprobar(self, propuesta, puntuacion, justificacion):
        """
        Asigna puntuación y justificación a una propuesta.
        """
        propuesta.puntuacion_economica = puntuacion
        propuesta.justificacion_economica = justificacion
    
    def validar(self, licitacion):
        """
        Valida que haya al menos una propuesta económicamente viable y selecciona ganador.
        """
        # Solo evalúa propuestas aprobadas técnicamente
        propuestas = getattr(licitacion, 'propuestas', [])
        propuestas_tecnicas = [p for p in propuestas if getattr(p, 'aprobada_tecnicamente', False)]
        
        if len(propuestas_tecnicas) == 0:
            return False
        
        # Evaluar y seleccionar ganador
        ganador = self.seleccionar_ganador(propuestas_tecnicas)
        
        if ganador:
            ganador.es_ganadora = True
            # Avanzar estado a ADJUDICADA
            # Nota: Esto podría hacerse en el servicio, pero el patrón sugiere que el handler actúa
            licitacion.siguiente_estado() 
            return True
        
        return False
    
    def seleccionar_ganador(self, propuestas):
        """
        Selecciona propuesta con mayor puntuación económica.
        """
        if not propuestas:
            return None
        
        # Ordenar por puntuación descendente
        # Asumimos atributo 'puntuacion_economica'
        propuestas_ordenadas = sorted(
            propuestas, 
            key=lambda p: getattr(p, 'puntuacion_economica', 0) or 0, 
            reverse=True
        )
        
        return propuestas_ordenadas[0]
