from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.contrato import Contrato, EstadoContrato
from datetime import datetime

class ContratoService:
    """
    Servicio para la generación y gestión de contratos de licitaciones adjudicadas.
    Maneja el flujo de 2 pasos: Generar Plantilla -> Cargar Firmado.
    """
    
    def generar_plantilla_contrato(self, id_licitacion, id_supervisor):
        """
        Paso 1: Genera la plantilla del contrato prellenada con datos del proveedor ganador.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        if licitacion.estado_actual.get_nombre() != "ADJUDICADA":
            raise ValueError("La licitación no está en estado ADJUDICADA")
            
        if not licitacion.propuesta_ganadora:
            raise ValueError("La licitación no tiene propuesta ganadora asignada")
            
        try:
            # Lógica simulada de generación de documento (docxtpl)
            # En producción: usare docxtpl para llenar template y guardar en S3/Local
            # nombre_archivo = f"contrato_plantilla_{id_licitacion}.docx"
            url_plantilla = "contrato-adjudicacion"
            
            # Verificar si ya existe contrato previo para actualizar o crear nuevo
            contrato = Contrato.query.filter_by(licitacion_id=id_licitacion).first()
            
            if not contrato:
                contrato = Contrato(
                    licitacion_id=id_licitacion,
                    proveedor_id=licitacion.propuesta_ganadora.proveedor_id,
                    generado_por=id_supervisor,
                    plantilla_url=url_plantilla,
                    estado=EstadoContrato.PLANTILLA_GENERADA,
                    fecha_generacion_plantilla=datetime.now()
                )
                db.session.add(contrato)
            else:
                # Actualizar existente si se regenera
                contrato.plantilla_url = url_plantilla
                contrato.fecha_generacion_plantilla = datetime.now()
                contrato.generado_por = id_supervisor
            
            db.session.commit()
            
            return {
                "success": True, 
                "mensaje": "Plantilla de contrato generada exitosamente",
                "url_plantilla": url_plantilla,
                "id_contrato": contrato.id_contrato
            }
            
        except Exception as e:
            db.session.rollback()
            raise e

    def cargar_contrato_firmado(self, id_licitacion, archivo_firmado_url):
        """
        Paso 2: Registra la carga del contrato firmado y finaliza la etapa de contrato.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        contrato = Contrato.query.filter_by(licitacion_id=id_licitacion).first()
        if not contrato:
            raise ValueError("No se ha generado previamente la plantilla del contrato")
            
        try:
            # Actualizar contrato con el documento firmado
            contrato.documento_firmado_url = archivo_firmado_url
            contrato.fecha_carga_firmado = datetime.now()
            contrato.estado = EstadoContrato.FIRMADO_CARGADO
            
            # Actualizar flag en licitación
            licitacion.contrato_generado = True
            
            # Avanzar estado (ADJUDICADA -> CON_CONTRATO)
            # Solo si aún no está en CON_CONTRATO (idempotencia)
            if licitacion.estado_actual.get_nombre() == "ADJUDICADA":
                licitacion.siguiente_estado()
            
            db.session.commit()
            return {
                "success": True, 
                "mensaje": "Contrato firmado cargado exitosamente",
                "estado_licitacion": licitacion.estado_actual.get_nombre()
            }
            
        except Exception as e:
            db.session.rollback()
            raise e
            
    def obtener_contrato(self, id_licitacion):
        """
        Obtiene los datos del contrato generado.
        """
        contrato = Contrato.query.filter_by(licitacion_id=id_licitacion).first()
        if not contrato:
            return None
            
        return {
            "id_contrato": contrato.id_contrato,
            "estado": contrato.estado.value,
            "plantilla_url": contrato.plantilla_url,
            "firmado_url": contrato.documento_firmado_url,
            "fecha_generacion": contrato.fecha_generacion_plantilla.isoformat() if contrato.fecha_generacion_plantilla else None
        }
