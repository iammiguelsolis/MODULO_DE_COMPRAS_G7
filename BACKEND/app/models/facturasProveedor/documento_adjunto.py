from app.bdd import db
from app.models.facturasProveedor.enums import DocTipo
from datetime import datetime

class DocumentoAdjunto(db.Model):
    __tablename__ = 'documentos_adjuntos'

    id = db.Column(db.Integer, primary_key=True)
    fecha_carga = db.Column(db.DateTime, default=datetime.utcnow)
    tipo = db.Column(db.Enum(DocTipo), nullable=False)
    nombre_archivo = db.Column(db.String(100), nullable=False)
    ruta = db.Column(db.String(255), nullable=False)
    tamano_bytes = db.Column(db.Integer)
    
    # 🔴 CORRECCIÓN AQUÍ:
    # Como ambas tablas están en el mismo bind ('facturas_db'), 
    # es SEGURO y NECESARIO poner el ForeignKey aquí para que el relationship funcione.
    factura_id = db.Column(db.Integer, db.ForeignKey('facturas_proveedor.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre_archivo": self.nombre_archivo,
            "tipo_archivo": self.tipo.name if self.tipo else "DESCONOCIDO",
            "url_storage": self.ruta,
            "tamano_bytes": self.tamano_bytes or 0,
            "fecha_subida": self.fecha_carga.isoformat() if self.fecha_carga else None
        }