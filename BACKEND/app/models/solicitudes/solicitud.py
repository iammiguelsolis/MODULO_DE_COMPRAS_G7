from app.bdd import db
from app.models.solicitudes.items import ItemSolicitado
from app.models.solicitudes.estados import Borrador, Pendiente, Aprobada, Rechazada

class Solicitud(db.Model):
  
  __tablename__ = 'solicitudes'
  
  id = db.Column(db.Integer, primary_key=True)
  
  titulo = db.Column(db.String(100))
  fecha_creacion = db.Column(db.DateTime, default=db.func.now())
  
  _estado_str = db.Column('estado', db.String(20), nullable=False, default='BORRADOR')