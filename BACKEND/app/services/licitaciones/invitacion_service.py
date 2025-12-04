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
            from app.models.licitaciones.invitacion import InvitacionProveedor
            
            registros_creados = 0
            for proveedor_id in ids_proveedores:
                # Verificar si ya existe invitación para evitar duplicados
                existe = InvitacionProveedor.query.filter_by(
                    licitacion_id=id_licitacion, 
                    proveedor_id=proveedor_id
                ).first()
                
                if not existe:
                    nueva_invitacion = InvitacionProveedor(
                        licitacion_id=id_licitacion,
                        proveedor_id=proveedor_id
                    )
                    db.session.add(nueva_invitacion)
                    registros_creados += 1
            
            if registros_creados > 0:
                licitacion.invitaciones_enviadas = True
                # Avanzar estado automáticamente (NUEVA -> EN_INVITACION)
                licitacion.siguiente_estado()
            
            db.session.commit()
            return {"success": True, "mensaje": f"Invitaciones enviadas a {registros_creados} proveedores"}
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    def finalizar_periodo_invitacion(self, id_licitacion):
        """
        Fuerza el cierre del periodo de invitación y avanza al siguiente estado.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")

        try:
            # Avanzar estado: NUEVA -> EN_INVITACION
            # Esto asume que el estado actual es NUEVA y tiene implementado siguiente()
            licitacion.siguiente_estado()
            db.session.commit()
            return {"success": True, "mensaje": "Periodo de invitación finalizado. Estado actualizado."}
        except Exception as e:
            db.session.rollback()
            raise e
