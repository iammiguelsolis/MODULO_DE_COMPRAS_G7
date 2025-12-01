# Archivo: app/models/proveedor.py
from app.bdd import db

class Proveedor(db.Model):
    __tablename__ = 'proveedores'
    
    # IMPORTANTE: El nombre debe coincidir con lo que pusiste en ForeignKey
    id_proveedor = db.Column(db.Integer, primary_key=True)
    
    nombre = db.Column(db.String(100), nullable=False)
    ruc = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(100))
    telefono = db.Column(db.String(20))

    def __init__(self, nombre, ruc, email, telefono=None):
        self.nombre = nombre
        self.ruc = ruc
        self.email = email
        self.telefono = telefono