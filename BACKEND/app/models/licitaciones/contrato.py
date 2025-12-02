from app.bdd import db
from datetime import datetime
from app.enums.licitaciones.estado_contrato import EstadoContrato

class Contrato(db.Model):
    """
    Modelo que representa el contrato de adjudicación de una licitación.
    Soporta flujo de 2 pasos:
    1. Generación de plantilla prellenada (PLANTILLA_GENERADA)
    2. Carga del documento firmado (FIRMADO_CARGADO)
    """
    __tablename__ = 'contratos'
    
    id_contrato = db.Column(db.Integer, primary_key=True, autoincrement=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id'), nullable=False)
    proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id_proveedor'), nullable=False)
    
    # Paso 1: Plantilla
    fecha_generacion_plantilla = db.Column(db.DateTime, default=datetime.now, nullable=False)
    plantilla_url = db.Column(db.String(500))  # URL de la plantilla generada
    
    # Paso 2: Firmado
    fecha_carga_firmado = db.Column(db.DateTime)
    documento_firmado_url = db.Column(db.String(500))  # URL del PDF firmado
    
    # Estado y Auditoría
    estado = db.Column(db.Enum(EstadoContrato), default=EstadoContrato.PLANTILLA_GENERADA, nullable=False)
    generado_por = db.Column(db.Integer)  # ID del supervisor
    
    # Relaciones
    licitacion = db.relationship('Licitacion', backref=db.backref('contrato', uselist=False))
    proveedor = db.relationship('Proveedor', backref='contratos')
    
    def __repr__(self):
        return f'<Contrato {self.id_contrato} - Lic:{self.licitacion_id} - {self.estado.value}>'
