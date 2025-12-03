from app import db
from datetime import datetime
from .enums import EstadoConciliacion

class ResultadoConciliacion(db.Model):
    __bind_key__ = 'facturas_db'
    __tablename__ = 'resultados_conciliacion'

    id = db.Column(db.Integer, primary_key=True)
    
    # ID de referencia a la factura [cite: 118]
    factura_proveedor_id = db.Column(db.Integer, db.ForeignKey('facturas_proveedor.id'), nullable=False)
    
    fecha = db.Column(db.Date, default=datetime.utcnow) # [cite: 119]
    resultado = db.Column(db.Enum(EstadoConciliacion), nullable=False) # [cite: 120]
    nota = db.Column(db.String(255)) # [cite: 121]

    def to_dict(self):
        return {
            "id": self.id,
            "factura_id": self.factura_proveedor_id,
            "resultado": self.resultado.value,
            "nota": self.nota
        }