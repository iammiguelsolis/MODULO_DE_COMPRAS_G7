from app.bdd import db
from app.licitaciones.models.licitacion import Licitacion

class ContratoService:
    """
    Servicio para la generación y gestión de contratos de licitaciones adjudicadas.
    """
    
    def generar_contrato(self, id_licitacion, datos_contrato):
        """
        Genera el contrato para una licitación adjudicada.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Validar estado (debe ser ADJUDICADA)
        if licitacion.estado_actual.get_nombre() != "ADJUDICADA":
            raise ValueError("La licitación no está en estado ADJUDICADA")
            
        try:
            # Aquí iría la lógica de generación de PDF o registro en tabla 'contratos'
            # Por ahora simulamos
            print(f"Generando contrato para licitación {id_licitacion}")
            
            licitacion.contrato_generado = True
            
            # Avanzar estado (ADJUDICADA -> CON_CONTRATO)
            licitacion.siguiente_estado()
            
            db.session.commit()
            return {"success": True, "mensaje": "Contrato generado exitosamente"}
            
        except Exception as e:
            db.session.rollback()
            raise e
            
    def obtener_contrato(self, id_licitacion):
        """
        Obtiene los datos del contrato generado.
        """
        # Retornar mock o buscar en tabla contratos
        return {"url": "http://ejemplo.com/contrato.pdf", "fecha": "2023-11-28"}
