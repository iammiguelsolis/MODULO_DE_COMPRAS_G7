from app.bdd import db

class ItemSolicitado(db.Model):
  
  __tablename__ = 'items_solicitados'
  
  
  # Definición de columnas
  id = db.Column(db.Integer, primary_key=True)
  solicitud_id = db.Column(db.Integer, db.ForeignKey('solicitudes.id'))
  comentario = db.Column(db.Text)
  tipo_item = db.Column(db.String(50))
  
  __mapper_args__ = {
      'polymorphic_identity': 'item_generico',
      'polymorphic_on': tipo_item
  }
  
  def calcular_subtotal(self):
      raise NotImplementedError("Este método debe ser implementado por las subclases.")
  

class MaterialSolicitado(ItemSolicitado):
  
  __tablename__ = 'materiales_solicitados'
  
  id = db.Column(db.Integer, db.ForeignKey('items_solicitados.id'), primary_key=True)
  nombre_material = db.Column(db.String(255))
  cantidad = db.Column(db.Integer)
  precio_unitario = db.Column(db.Float)
  
  __mapper_args__ = {
      'polymorphic_identity': 'MATERIAL',
  }
  
  def calcular_subtotal(self):
      return self.cantidad * self.precio_unitario
    
class ServicioSolicitado(ItemSolicitado):
  
  __tablename__ = 'servicios_solicitados'
  
  id = db.Column(db.Integer, db.ForeignKey('items_solicitados.id'), primary_key=True)
  nombre_servicio = db.Column(db.String(100))
  horas_estimadas = db.Column(db.Float)
  tarifa_hora = db.Column(db.Float)

  __mapper_args__ = {
      'polymorphic_identity': 'SERVICIO',
  }

  def calcular_subtotal(self):
      return self.horas_estimadas * self.tarifa_hora