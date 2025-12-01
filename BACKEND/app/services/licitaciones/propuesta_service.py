from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor
from app.models.licitaciones.documentos import Documento
from app.enums.licitaciones.tipo_documento import TipoDocumento
from datetime import datetime

class PropuestaService:
    """
    Servicio para gestionar el registro de propuestas de proveedores.
    """
    
    def registrar_propuesta(self, id_licitacion, data_propuesta, documentos_data):
        """
        Registra una nueva propuesta para una licitación.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Validar estado (debe ser EN_INVITACION)
        if licitacion.estado_actual.get_nombre() != "EN_INVITACION":
            raise ValueError("El periodo de recepción de propuestas no está activo")
            
        try:
            propuesta = PropuestaProveedor(
                licitacion_id=id_licitacion,
                proveedor_id=data_propuesta.get('proveedor_id'),
                fecha_presentacion=datetime.now()
            )
            
            db.session.add(propuesta)
            db.session.flush() # Para obtener ID de propuesta
            
            # Guardar documentos adjuntos
            for doc_data in documentos_data:
                documento = Documento(
                    propuesta_id=propuesta.id_propuesta,
                    documento_requerido_id=doc_data.get('documento_requerido_id'),
                    nombre=doc_data.get('nombre'),
                    url_archivo=doc_data.get('url'),
                    tipo=TipoDocumento(doc_data.get('tipo', 'TECNICO')), # Default a TECNICO
                    validado=False
                )
                db.session.add(documento)
            
            db.session.commit()
            return propuesta
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    def finalizar_registro_propuestas(self, id_licitacion):
        """
        Cierra el periodo de registro y avanza el estado.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        try:
            # El estado EN_INVITACION verifica si hay propuestas al llamar a siguiente()
            # Si hay -> CON_PROPUESTAS
            # Si no -> CANCELADA
            licitacion.siguiente_estado()
            
            db.session.commit()
            return {
                "success": True, 
                "nuevo_estado": licitacion.estado_actual.get_nombre(),
                "mensaje": "Periodo de registro finalizado"
            }
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    def listar_por_licitacion(self, id_licitacion):
        """
        Lista todas las propuestas de una licitación.
        """
        return PropuestaProveedor.query.filter_by(licitacion_id=id_licitacion).all()
