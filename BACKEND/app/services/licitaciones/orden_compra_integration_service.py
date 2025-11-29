from app.bdd import db
from app.licitaciones.models.licitacion import Licitacion

class OrdenCompraIntegrationService:
    """
    Servicio encargado de preparar y enviar los datos necesarios al módulo de Orden de Compra
    una vez que una licitación ha sido adjudicada.
    """
    
    def generar_datos_orden_compra(self, id_licitacion):
        """
        Recopila todos los datos necesarios para generar una Orden de Compra.
        Retorna un diccionario estructurado con la información.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Verificar que haya un ganador
        propuesta_ganadora = licitacion.propuesta_ganadora
        if not propuesta_ganadora:
            raise ValueError("La licitación no tiene una propuesta ganadora adjudicada")
            
        proveedor = propuesta_ganadora.proveedor
        if not proveedor:
            raise ValueError("La propuesta ganadora no tiene un proveedor asociado")
            
        # Construir payload
        payload = {
            "origen": "LICITACION",
            "id_origen": licitacion.id_licitacion,
            "proveedor": {
                "id_externo": proveedor.id_proveedor,
                "nombre": proveedor.nombre,
                "ruc": proveedor.ruc,
                "direccion": proveedor.direccion,
                "email": proveedor.email
            },
            "detalles": {
                "fecha_adjudicacion": str(licitacion.fecha_limite), # O fecha actual
                "monto_total": float(propuesta_ganadora.monto_total),
                "moneda": "PEN", # Default por ahora
                "condiciones_pago": propuesta_ganadora.comentarios, # Usar comentarios como proxy
                "plazo_entrega_dias": propuesta_ganadora.plazo_entrega_dias
            },
            "items": []
        }
        
        # Agregar items (pueden ser los solicitados o los ofertados si hubiera detalle por item en oferta)
        # Por ahora usamos los solicitados que es lo que tenemos mapeado
        if hasattr(licitacion, 'items'):
            for item in licitacion.items:
                payload["items"].append({
                    "codigo": item.codigo,
                    "descripcion": item.nombre,
                    "cantidad": item.cantidad,
                    "unidad": item.unidad_medida,
                    "precio_unitario": 0.0 # El precio unitario real vendría del detalle de oferta si existiera
                })
                
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
            licitacion.contrato_generado = True
            
            # Avanzar estado a CON_CONTRATO o FINALIZADA
            # Asumimos que generar OC implica cerrar el proceso de licitación en este lado
            # O moverlo a un estado de 'ESPERANDO_OC'. 
            # Según diagrama: ADJUDICADA -> CON_CONTRATO
            
            # Forzamos cambio de estado si existe la transición
            # licitacion.cambiar_estado(EstadoConContrato(licitacion)) 
            # Por ahora usamos la lógica de estados existente si la hay, o solo marcamos el flag.
            
            db.session.commit()
            
            return {
                "success": True,
                "mensaje": "Datos enviados al módulo de Orden de Compra exitosamente",
                "payload_enviado": datos
            }
            
        except Exception as e:
            db.session.rollback()
            raise e
