from app.bdd import db
from app.models.licitaciones.items.item_solicitado import ItemSolicitado
from app.enums.licitaciones.tipo_item import TipoItem

class MaterialSolicitado(ItemSolicitado):
    """
    Subclase para ítems de tipo Material.
    """
    __tablename__ = 'materiales_solicitados'
    
    id_item = db.Column(db.Integer, db.ForeignKey('items_solicitados.id_item'), primary_key=True)
    
    cantidad = db.Column(db.Integer)
    precio_unitario = db.Column(db.Numeric(10, 2)) # float en diagrama, Numeric en BD
    
    def get_subtotal(self):
        return self.cantidad * self.precio_unitario
    
    __mapper_args__ = {
        'polymorphic_identity': TipoItem.MATERIAL.value,
    }
