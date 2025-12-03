from app.bdd import db

class Contrato(db.Model):
    """
    Modelo que representa el contrato de adjudicación de una licitación.
    Se genera cuando la licitación está en estado ADJUDICADA y se sube el documento firmado.
    """
    __tablename__ = 'contratos'
    
    id_contrato = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'), nullable=False)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id_proveedor'), nullable=False)
    fecha_generacion = db.Column(db.DateTime, nullable=False)
    documento = db.Column(db.String(500))  # URL o path del documento firmado
    
    # Relaciones
    licitacion = db.relationship('Licitacion', backref='contrato', uselist=False)
    proveedor = db.relationship('Proveedor', backref='contratos')
    
    def __repr__(self):
        return f'<Contrato Licitacion:{self.licitacion_id}>'
