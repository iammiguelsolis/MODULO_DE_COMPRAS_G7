from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor

class OrdenCompraIntegrationService:
    def generar_datos_orden_compra(self, id_licitacion):
        """
        Recopila todos los datos necesarios para generar una Orden de Compra.
        Retorna un diccionario estructurado con la información.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Verificar que haya un ganador
        from sqlalchemy.orm import joinedload
        
        
        if not licitacion.propuesta_ganadora:
             # Intento de fallback por si la relación no cargó
             propuesta_ganadora = PropuestaProveedor.query.filter_by(
                licitacion_id=licitacion.id, 
                es_ganadora=True
             ).first()
        else:
             propuesta_ganadora = licitacion.propuesta_ganadora

        if not propuesta_ganadora:
            raise ValueError("La licitación no tiene una propuesta ganadora adjudicada")
            
        proveedor = propuesta_ganadora.proveedor
        if not proveedor:
            raise ValueError("La propuesta ganadora no tiene un proveedor asociado")
            
        # La Orden de Compra puede obtener los items a partir del id_solicitud
        payload = {
            "origen": "LICITACION",
            "id_origen": licitacion.id,
            "id_solicitud": licitacion.solicitud_id,
            "proveedor": {
                "id": proveedor.id_proveedor,
                "nombre": proveedor.nombre,
                "ruc": proveedor.ruc,
                "email": proveedor.email
            },
            "contrato": {
                "url": None,
                "fecha_firmado": None
            }
        }
        
        
        from app.models.licitaciones.contrato import Contrato

        contrato = Contrato.query.filter_by(licitacion_id=licitacion.id).first()
        
        if contrato:
            payload["contrato"]["url"] = contrato.documento_firmado_url
            payload["contrato"]["fecha_firmado"] = str(contrato.fecha_carga_firmado) if contrato.fecha_carga_firmado else None
                
        return payload

    def notificar_generacion_orden_compra(self, id_licitacion):
        """
        Simula el envío de datos al módulo de Orden de Compra y actualiza el estado local.
        """
        try:
            datos = self.generar_datos_orden_compra(id_licitacion)
            
            # AQUÍ SE HARÍA LA LLAMADA AL OTRO MÓDULO (HTTP POST, Event Bus, etc.)
            print(f"--- ENVIANDO DATOS A MÓDULO ORDEN DE COMPRA ---\n{datos}\n-----------------------------------------------")
            
            # Actualizar estado local
            licitacion = Licitacion.query.get(id_licitacion)
            
            
            propuesta_ganadora = PropuestaProveedor.query.filter_by(
                licitacion_id=licitacion.id,
                es_ganadora=True
            ).first()
            
            # Obtener contrato
            from app.models.licitaciones.contrato import Contrato
            contrato = Contrato.query.filter_by(licitacion_id=licitacion.id).first()
            
            # Avanzar estado CON_CONTRATO -> FINALIZADA
            licitacion.siguiente_estado()
            
            db.session.commit()
            
            # Response según la especificación de la API
            return {
                "id_licitacion": licitacion.id, # CAMBIO: .id
                "estado": licitacion.estado_actual.get_nombre(),
                "proveedor_adjudicado_id": propuesta_ganadora.proveedor_id if propuesta_ganadora else None,
                "contrato_id": contrato.id_contrato if contrato else None,
                "orden_compra_generada": True
            }
            
        except Exception as e:
            db.session.rollback()
            raise e