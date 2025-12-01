from app.bdd import db
from datetime import datetime

class InvitacionProveedor(db.Model):
    """
    Modelo que representa la invitación enviada a un proveedor para participar en una licitación.
    Tabla: invitaciones_proveedores
    """
    __tablename__ = 'invitaciones_proveedores'
    
    id_invitacion = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'), nullable=False)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id_proveedor'), nullable=False)
    fecha_invitacion = db.Column(db.DateTime, default=datetime.now)
    
    # Relaciones
    licitacion = db.relationship('Licitacion', backref=db.backref('invitaciones', lazy=True))
    proveedor = db.relationship('Proveedor', backref='invitaciones_licitacion')
