from app.bdd import db
from app.models.licitaciones.items.item_solicitado import ItemSolicitado
from app.enums.licitaciones.tipo_item import TipoItem

class MaterialSolicitado(ItemSolicitado):
    """
    Subclase para ítems de tipo Material.
    """
    __tablename__ = 'materiales_solicitados'
    
    id_item = db.Column(db.Integer, db.ForeignKey('items_solicitados.id_item'), primary_key=True)
    
    # Atributos específicos de material si los hubiera
    # Por ejemplo, especificaciones técnicas, marca, etc.
    
    __mapper_args__ = {
        'polymorphic_identity': TipoItem.MATERIAL.value,
    }
