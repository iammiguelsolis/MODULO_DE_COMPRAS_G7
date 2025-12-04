from app.bdd import db
from datetime import datetime

class OfertaProveedor(db.Model):
    __tablename__ = 'ofertas_proveedor'
    
    id = db.Column(db.Integer, primary_key=True)
    proceso_id = db.Column(db.Integer, db.ForeignKey('procesos_adquisicion.id'))
    
    # --- NUEVO: Vinculación con la tabla real de Proveedores ---
    # Usamos 'proveedor.id_proveedor' porque así se llama la tabla y PK en tu modelo Proveedor
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedor.id_proveedor'), nullable=True)
    
    # Relación para acceder a los datos del proveedor (ej: oferta.proveedor_rel.email)
    proveedor_rel = db.relationship('Proveedor', backref='ofertas_enviadas')
    # -----------------------------------------------------------

    # Mantenemos este campo como "snapshot" o respaldo por si se borra el proveedor
    nombre_proveedor = db.Column(db.String(100))
    
    fecha_oferta = db.Column(db.DateTime, default=datetime.now)
    monto_total = db.Column(db.Float)
    comentarios = db.Column(db.Text)
    
    items = db.relationship('ItemOfertado', backref='oferta', cascade="all, delete-orphan")
    
    def to_dict(self):
        # Lógica para obtener el nombre: Prioriza la relación real, si no usa el texto guardado
        nombre_mostrar = self.nombre_proveedor
        if self.proveedor_rel:
            nombre_mostrar = self.proveedor_rel.razon_social

        return {
            'id': self.id,
            'proceso_id': self.proceso_id,
            'proveedor_id': self.proveedor_id,  # Devolvemos el ID también
            'nombre_proveedor': nombre_mostrar,
            'fecha_oferta': self.fecha_oferta.isoformat(),
            'monto_total': self.monto_total,
            'comentarios': self.comentarios,
            'items': [item.to_dict() for item in self.items]
        }

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