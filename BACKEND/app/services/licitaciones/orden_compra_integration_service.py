from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.estados.estado_finalizada import EstadoFinalizada

class OrdenCompraIntegrationService:
    """
    Servicio que confirma que la licitación fue enviada a Orden de Compra
    y actualiza su estado a FINALIZADA.
    """
    
    def confirmar_envio_a_orden_compra(self, id_licitacion):
        """
        Marca la licitación como FINALIZADA después de que el usuario 
        confirme que está lista para pasar a Orden de Compra.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Cambiar estado a FINALIZADA
        # Asumimos que la transición es válida desde CON_CONTRATO
        licitacion.cambiar_estado(EstadoFinalizada(licitacion))
        
        db.session.commit()
        
        return {
            "success": True,
            "mensaje": "Licitación marcada como FINALIZADA. Ya puede ser utilizada en Orden de Compra.",
            "id_licitacion": id_licitacion
        }