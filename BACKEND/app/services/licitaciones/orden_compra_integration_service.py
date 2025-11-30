from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor

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
            
        # Verificar que haya un ganador (cargar con relación proveedor)
        from sqlalchemy.orm import joinedload
        propuesta_ganadora = db.session.query(PropuestaProveedor).options(
            joinedload(PropuestaProveedor.proveedor)
        ).filter_by(id_propuesta=licitacion.propuesta_ganadora.id_propuesta).first() if licitacion.propuesta_ganadora else None
        
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
                "fecha_adjudicacion": str(licitacion.fecha_limite),
                "monto_total": 0.0,  # Se calculará desde los items en Orden de Compra
                "moneda": "PEN",
                "condiciones_pago": None,
                "plazo_entrega_dias": None
            },
            "items": []
        }
        
        # Agregar contrato (Regla 4 línea 118: "contrato y documentos del proveedor")
        from app.models.licitaciones.contrato import Contrato
        contrato = Contrato.query.filter_by(licitacion_id=id_licitacion).first()
        if contrato:
            payload["contrato"] = {
                "plantilla_url": contrato.plantilla_url,
                "documento_firmado_url": contrato.documento_firmado_url,
                "fecha_generacion": str(contrato.fecha_generacion_plantilla) if contrato.fecha_generacion_plantilla else None,
                "fecha_firmado": str(contrato.fecha_carga_firmado) if contrato.fecha_carga_firmado else None,
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
                    "precio_unitario": 0.0  # El precio unitario real vendría del detalle de oferta si existiera
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
            
            # Avanzar estado CON_CONTRATO -> FINALIZADA
            licitacion.siguiente_estado()
            
            db.session.commit()
            
            return {
                "success": True,
                "mensaje": "Datos enviados al módulo de Orden de Compra exitosamente",
                "payload_enviado": datos
            }
            
        except Exception as e:
            db.session.rollback()
            raise e
