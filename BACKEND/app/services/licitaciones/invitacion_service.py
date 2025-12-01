from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion

class InvitacionService:
    """
    Servicio para gestionar las invitaciones a proveedores.
    """
    
    def enviar_invitaciones(self, id_licitacion, ids_proveedores):
        """
        Registra el envío de invitaciones a una lista de proveedores.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Validar estado (debe ser NUEVA)
        if not licitacion.estado_actual.puede_invitar_proveedores():
            raise ValueError(f"No se pueden enviar invitaciones en estado {licitacion.estado_actual.get_nombre()}")
            
        try:
            # Aquí iría la lógica de crear registros en una tabla 'invitaciones'
            # y enviar correos electrónicos reales.
            # Por ahora, simulamos actualizando el flag en la licitación.
            
            print(f"Enviando correos a proveedores: {ids_proveedores}")
            
            licitacion.invitaciones_enviadas = True
            
            # Intentar avanzar estado (NUEVA -> EN_INVITACION)
            # Nota: El estado NUEVA avanza si invitaciones_enviadas es True
            licitacion.siguiente_estado()
            
            db.session.commit()
            return {"success": True, "mensaje": f"Invitaciones enviadas a {len(ids_proveedores)} proveedores"}
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    def finalizar_periodo_invitacion(self, id_licitacion):
        """
        Fuerza el cierre del periodo de invitación si es necesario.
        """
        # En nuestro flujo actual, el envío de invitaciones ya transiciona el estado.
        pass
