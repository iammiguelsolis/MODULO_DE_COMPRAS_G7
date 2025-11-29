from app.licitaciones.models.supervisores.supervisor import Supervisor
from app.licitaciones.enums.tipo_supervisor import TipoSupervisor

class SupervisorTecnico(Supervisor):
    """
    Segundo eslabón de la cadena.
    Valida la documentación técnica de las propuestas.
    """
    
    def __init__(self, id_supervisor):
        super().__init__(id_supervisor, TipoSupervisor.TECNICO)
    
    def validar(self, licitacion):
        """
        Valida que al menos una propuesta tenga documentación completa y correcta.
        """
        propuestas_validas = 0
        propuestas = getattr(licitacion, 'propuestas', [])
        
        for propuesta in propuestas:
            if self.aprobar_propuesta(propuesta):
                propuestas_validas += 1
        
        # Si ninguna propuesta es válida -> rechazar
        if propuestas_validas == 0:
            return False
        
        return True
    
    def aprobar_propuesta(self, propuesta):
        """
        Valida todos los documentos obligatorios de la propuesta.
        Retorna True si todos son correctos.
        """
        # Lógica simplificada: verificamos flag 'aprobada_tecnicamente'
        # En una implementación real, iteraríamos sobre documentos
        return getattr(propuesta, 'aprobada_tecnicamente', False)
