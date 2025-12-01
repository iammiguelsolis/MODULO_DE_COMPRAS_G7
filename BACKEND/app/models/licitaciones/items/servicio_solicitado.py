from app.bdd import db
from app.models.licitaciones.items.item_solicitado import ItemSolicitado
from app.enums.licitaciones.tipo_item import TipoItem

class ServicioSolicitado(ItemSolicitado):
    """
    Subclase para ítems de tipo Servicio.
    """
    __tablename__ = 'servicios_solicitados'
    
    id_item = db.Column(db.Integer, db.ForeignKey('items_solicitados.id_item'), primary_key=True)
    
    # Atributos específicos de ServicioSolicitado (Diagrama)
    horas = db.Column(db.Numeric(10, 2)) # float en diagrama
    tarifa_hora = db.Column(db.Numeric(10, 2)) # float en diagrama
    
    def get_subtotal(self):
        return self.horas * self.tarifa_hora
    
    __mapper_args__ = {
        'polymorphic_identity': TipoItem.SERVICIO.value,
    }
