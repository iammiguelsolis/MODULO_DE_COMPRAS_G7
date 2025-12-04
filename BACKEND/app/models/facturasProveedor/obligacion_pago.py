from app import db
from .enums import Moneda, EstadoPago

class ObligacionPago(db.Model):
    __tablename__ = 'obligaciones_pago'

    id = db.Column(db.Integer, primary_key=True)
    
    # Datos heredados o vinculados de la factura
    factura_id = db.Column(db.Integer, db.ForeignKey('facturas_proveedor.id'))
    numero_factura = db.Column(db.String(50))
    proveedor_id = db.Column(db.Integer) # ID referencia
    
    fecha_emision = db.Column(db.Date)
    fecha_vencimiento = db.Column(db.Date)
    moneda = db.Column(db.Enum(Moneda))
    
    subtotal = db.Column(db.Float)
    impuestos = db.Column(db.Float)
    total = db.Column(db.Float) # [cite: 138]
    
    saldo_pendiente = db.Column(db.Float)
    estado_pago = db.Column(db.Enum(EstadoPago), default=EstadoPago.PENDIENTE)
    observaciones = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "numero_factura": self.numero_factura,
            "estado": self.estado_pago.name if self.estado_pago else None,
            "saldo_pendiente": self.saldo_pendiente
        }