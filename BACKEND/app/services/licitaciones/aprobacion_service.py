from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.supervisores.supervisor_compra import SupervisorCompra

class AprobacionService:
    """
    Servicio encargado de la lógica de aprobación inicial por parte del supervisor.
    Utiliza el primer eslabón de la cadena de responsabilidad (SupervisorCompra).
    """
    
    def aprobar_licitacion(self, id_licitacion, id_supervisor, comentarios):
        """
        Aprueba una licitación en estado BORRADOR.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Instanciar el supervisor correspondiente
        supervisor = SupervisorCompra(id_supervisor)
        
        try:
            # Ejecutar lógica de aprobación del supervisor
            # Esto setea el flag aprobada_por_supervisor y llama a procesar()
            # que a su vez llama a siguiente_estado() si es válido
            resultado = supervisor.aprobar(licitacion, comentarios)
            
            if resultado:
                db.session.commit()
                return {"success": True, "mensaje": "Licitación aprobada y avanzada a NUEVA"}
            else:
                db.session.rollback()
                return {"success": False, "mensaje": "No se pudo aprobar la licitación"}
                
        except Exception as e:
            db.session.rollback()
            raise e
            
    def rechazar_licitacion(self, id_licitacion, id_supervisor, motivo):
        """
        Rechaza una licitación en estado BORRADOR.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        supervisor = SupervisorCompra(id_supervisor)
        
        try:
            # Ejecutar lógica de rechazo
            supervisor.rechazar(licitacion, motivo)
            db.session.commit()
            return {"success": True, "mensaje": "Licitación rechazada y CANCELADA"}
            
        except Exception as e:
            db.session.rollback()
            raise e
