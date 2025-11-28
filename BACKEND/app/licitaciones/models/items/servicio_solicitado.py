from app.bdd import db
from app.licitaciones.models.items.item_solicitado import ItemSolicitado
from app.licitaciones.enums.tipo_item import TipoItem

class ServicioSolicitado(ItemSolicitado):
    """
    Subclase para ítems de tipo Servicio.
    """
    __tablename__ = 'servicios_solicitados'
    
    id_item = db.Column(db.Integer, db.ForeignKey('items_solicitados.id_item'), primary_key=True)
    
    # Atributos específicos de servicio
    # Por ejemplo, lugar de ejecución, entregables, etc.
    
    __mapper_args__ = {
        'polymorphic_identity': TipoItem.SERVICIO.value,
    }
