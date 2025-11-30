from app.bdd import db

class PropuestaProveedor(db.Model):
    """
    Modelo que representa la propuesta enviada por un proveedor para una licitación.
    """
    __tablename__ = 'propuestas'
    
    id_propuesta = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'))
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id_proveedor'))
    
    # Relación con Proveedor
    proveedor = db.relationship('Proveedor', backref='propuestas')
    
    fecha_presentacion = db.Column(db.DateTime)
    
    # Estado de evaluaciones
    aprobada_tecnicamente = db.Column(db.Boolean, default=False)
    motivo_rechazo_tecnico = db.Column(db.Text)
    
    aprobada_economicamente = db.Column(db.Boolean, default=False)
    puntuacion_economica = db.Column(db.Float)
    justificacion_economica = db.Column(db.Text)
    motivo_rechazo_economico = db.Column(db.Text)
    
    es_ganadora = db.Column(db.Boolean, default=False)
    
    # Relaciones
    documentos = db.relationship('Documento', backref='propuesta', lazy=True)
