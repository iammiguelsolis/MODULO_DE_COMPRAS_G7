from app.bdd import db
from app.enums.licitaciones.tipo_documento import TipoDocumento

class Documento(db.Model):
    """
    Modelo para documentos adjuntos a una propuesta o licitación.
    """
    __tablename__ = 'documentos_licitacion'
    
    id_documento = db.Column(db.Integer, primary_key=True)
    propuesta_id = db.Column(db.Integer, db.ForeignKey('propuestas.id_propuesta'), nullable=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'), nullable=True)
    
    nombre = db.Column(db.String(255))
    url_archivo = db.Column(db.String(500))
    tipo = db.Column(db.Enum(TipoDocumento))
    
    # Validación técnica
    validado = db.Column(db.Boolean, default=False)
    observaciones = db.Column(db.Text)
