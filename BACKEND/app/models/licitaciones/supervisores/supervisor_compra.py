from app.models.licitaciones.supervisores.supervisor import Supervisor
from app.enums.licitaciones.tipo_supervisor import TipoSupervisor

class SupervisorCompra(Supervisor):
    """
    Primer eslabón de la cadena.
    Valida que la licitación haya sido aprobada por el supervisor de compras.
    """
    
    def __init__(self, id_supervisor):
        super().__init__(id_supervisor, TipoSupervisor.COMPRA)
    
    def validar(self, licitacion):
        """
        Valida que Licitacion fue aprobada (BORRADOR -> NUEVA).
        """
        # Si está en BORRADOR, verificamos si tiene el flag de aprobación
        if licitacion.estado_actual.get_nombre() == "BORRADOR":
            if getattr(licitacion, 'aprobada_por_supervisor', False):
                # Avanzamos el estado aquí o dejamos que el servicio lo haga
                # Según el patrón, el supervisor aprueba y eso dispara el cambio
                licitacion.siguiente_estado() # BORRADOR -> NUEVA
                return True
            else:
                return False
        
        # Si ya pasó de BORRADOR, asumimos que fue aprobada
        return True
    
    def aprobar(self, licitacion, comentarios):
        """
        Acción explícita de aprobación.
        """
        licitacion.aprobada_por_supervisor = True
        licitacion.comentarios_supervisor = comentarios
        return self.procesar(licitacion)
    
    def rechazar(self, licitacion, motivo):
        """
        Acción explícita de rechazo.
        """
        licitacion.aprobada_por_supervisor = False
        licitacion.motivo_rechazo = motivo
        licitacion.cancelar()
        return False
