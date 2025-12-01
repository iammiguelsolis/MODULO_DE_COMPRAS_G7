from app.bdd import db
from app.enums.licitaciones.tipo_documento import TipoDocumento

class Documento(db.Model):
    """
    Modelo para documentos adjuntos a una propuesta o licitación.
    """
    __tablename__ = 'documentos_licitacion'
    
    id_documento = db.Column(db.Integer, primary_key=True)
    propuesta_id = db.Column(db.Integer, db.ForeignKey('propuestas.id_propuesta'), nullable=False)
    documento_requerido_id = db.Column(db.Integer, db.ForeignKey('documentos_requeridos.id_requerido'), nullable=True)
    
    nombre = db.Column(db.String(255))
    url_archivo = db.Column(db.String(500))
    tipo = db.Column(db.Enum(TipoDocumento))
    
    # Validación técnica
    validado = db.Column(db.Boolean, default=False)
    observaciones = db.Column(db.Text)
    fecha_subida = db.Column(db.DateTime, default=db.func.current_timestamp())

class DocumentoRequerido(db.Model):
    """
    Modelo para definir qué documentos se requieren en una licitación y sus plantillas.
    """
    __tablename__ = 'documentos_requeridos'
    
    id_requerido = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'))
    
    nombre = db.Column(db.String(255))
    tipo = db.Column(db.Enum(TipoDocumento))
    obligatorio = db.Column(db.Boolean, default=True)
    
    # Información de la plantilla
    ruta_plantilla = db.Column(db.String(500)) # Ruta relativa en frontend/public o URL externa
    
    # Relación inversa
    licitacion = db.relationship('Licitacion', backref=db.backref('documentos_requeridos', lazy=True))
