from app.bdd import db

class Proveedor(db.Model):
    """
    Modelo que representa a un Proveedor (Simulación doma))

    """
    __tablename__ = 'proveedores'
    
    id_proveedor = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    ruc = db.Column(db.String(20), nullable=False, unique=True)
    direccion = db.Column(db.String(255))
    telefono = db.Column(db.String(50))
    email = db.Column(db.String(100))
    
    # Estado (PENDIENTE, ACTIVO, INACTIVO)
    estado = db.Column(db.String(20), default='ACTIVO')
    
    def __repr__(self):
        return f'<Proveedor {self.nombre}>'
