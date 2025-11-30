from app.bdd import db
from app.models.solicitudes.items import ItemSolicitado
from app.models.solicitudes.estados import Borrador, Pendiente, Aprobada, Rechazada

class Solicitud(db.Model):
  
  __tablename__ = 'solicitudes'
  
  id = db.Column(db.Integer, primary_key=True)
  
  titulo = db.Column(db.String(100))
  notas_adicionales = db.Column(db.Text)
  fecha_creacion = db.Column(db.DateTime, default=db.func.now())
  
  _estado_str = db.Column('estado', db.String(20), nullable=False, default='BORRADOR')
  
  items = db.relationship('ItemSolicitado', backref='solicitud', cascade="all, delete-orphan")
  
  def __init__(self, titulo, notas_adicionales=None):
    self.titulo = titulo
    self.notas_adicionales = notas_adicionales
    self._estado_str = "BORRADOR"
    
  @property
  def estado(self):
    mapeo = {
      'BORRADOR': Borrador(),
      'PENDIENTE': Pendiente(),
      'APROBADA': Aprobada(),
      'RECHAZADA': Rechazada()
    }
    return mapeo.get(self._estado_str, Borrador())
  
  def set_estado(self, nuevo_estado_obj):
    self._estado_str = nuevo_estado_obj.nombre()
    
  def agregar_items(self, lista_items: list):
    self.estado.agregar_items(self, lista_items)
    
  def aprobar(self):
    self.estado.aprobar(self)
    
  def rechazar(self):
    self.estado.rechazar(self)
    
  def calcular_total(self):
    return sum(item.calcular_subtotal() for item in self.items)

  def obtener_tipo_solicitud(self):
    if not self.items:
      return None
    return self.items[0].tipo_item