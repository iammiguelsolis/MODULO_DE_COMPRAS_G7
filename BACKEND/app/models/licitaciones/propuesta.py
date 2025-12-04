from app.bdd import db

class PropuestaProveedor(db.Model):
    """
    Modelo que representa la propuesta enviada por un proveedor para una licitación.
    """
    __tablename__ = 'propuestas'
    
    id_propuesta = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id', use_alter=True, name='fk_propuesta_licitacion'), nullable=False)
    proveedor_id = db.Column(db.Integer, nullable=False)
    
    # Relación con Proveedor
    proveedor = db.relationship(
        'Proveedor', 
        primaryjoin='foreign(PropuestaProveedor.proveedor_id) == remote(Proveedor.id_proveedor)',
        backref='propuestas'
    )
    
    fecha_presentacion = db.Column(db.DateTime, default=db.func.current_timestamp())
    
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

