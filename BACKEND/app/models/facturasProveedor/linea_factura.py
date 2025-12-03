from app import db

class LineaFactura(db.Model):
    __bind_key__ = 'facturas_db'
    __tablename__ = 'lineas_factura'

    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(200), nullable=False)
    cantidad = db.Column(db.Numeric(10, 2), nullable=False) # Decimal en diagrama
    precio_unitario = db.Column(db.Float, nullable=False)
    impuestos_linea = db.Column(db.Float, default=0.0)
    total_linea = db.Column(db.Float, nullable=False)

    # Clave foránea para relacionar con la cabecera (FacturaProveedor)
    factura_id = db.Column(db.Integer, db.ForeignKey('facturas_proveedor.id'), nullable=False)

    def calcular_total(self):
        # Lógica del método [cite: 23]
        self.total_linea = (float(self.cantidad) * self.precio_unitario) + self.impuestos_linea

    def to_dict(self):
        return {
            "descripcion": self.descripcion,
            "cantidad": float(self.cantidad),
            "total": self.total_linea
        }