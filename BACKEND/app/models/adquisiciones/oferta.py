from app.bdd import db
from datetime import datetime

class ItemOfertado(db.Model):
    __tablename__ = 'items_ofertados'
    
    id = db.Column(db.Integer, primary_key=True)
    oferta_id = db.Column(db.Integer, db.ForeignKey('ofertas_proveedor.id'))
    precio_oferta = db.Column(db.Float)
    descripcion = db.Column(db.String(200))
    
    tipo_item = db.Column(db.String(50))
    __mapper_args__ = {
        'polymorphic_identity': 'GENERICO',
        'polymorphic_on': tipo_item
    }
    
    def to_dict(self):
        return {
            'id': self.id,
            'oferta_id': self.oferta_id,
            'precio_oferta': self.precio_oferta,
            'descripcion': self.descripcion,
            'tipo_item': self.tipo_item
        }

class MaterialOfertado(ItemOfertado):
    __tablename__ = 'materiales_ofertados'
    id = db.Column(db.Integer, db.ForeignKey('items_ofertados.id'), primary_key=True)
    marca = db.Column(db.String(100))
    cantidad_disponible = db.Column(db.Integer)
    
    __mapper_args__ = { 'polymorphic_identity': 'MATERIAL' }
    
    def to_dict(self):
        return {
            'id': self.id,
            'oferta_id': self.oferta_id,
            'precio_oferta': self.precio_oferta,
            'descripcion': self.descripcion,
            'tipo_item': self.tipo_item,
            'marca': self.marca,
            'cantidad_disponible': self.cantidad_disponible
        }

class ServicioOfertado(ItemOfertado):
    __tablename__ = 'servicios_ofertados'
    id = db.Column(db.Integer, db.ForeignKey('items_ofertados.id'), primary_key=True)
    dias_ejecucion = db.Column(db.Integer)
    experiencia_tecnico = db.Column(db.String(100))
    
    __mapper_args__ = { 'polymorphic_identity': 'SERVICIO' }
    
    def to_dict(self):
        return {
            'id': self.id,
            'oferta_id': self.oferta_id,
            'precio_oferta': self.precio_oferta,
            'descripcion': self.descripcion,
            'tipo_item': self.tipo_item,
            'dias_ejecucion': self.dias_ejecucion,
            'experiencia_tecnico': self.experiencia_tecnico
        }