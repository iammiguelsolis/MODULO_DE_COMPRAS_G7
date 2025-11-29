class Proveedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    productos = db.relationship("Producto", back_populates="proveedor")

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    proveedor_id = db.Column(db.Integer, db.ForeignKey("proveedor.id"))
    proveedor = db.relationship("Proveedor", back_populates="productos")