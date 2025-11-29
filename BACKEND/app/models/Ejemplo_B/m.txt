from app.bdd import db
from .enums import Dias_Semana
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

class Entrega(db.Model):
    __tablename__ = "entrega"
    #OJO falta implementar la OC pero siguiendo mi nomenclatura
    #ya puedo ir poniendo las clases
    id_entrega = db.Column(db.Integer, primary_key=True)
    id_proveedor = db.Column(db.Integer, db.ForeignKey("proveedor.id_proveedor"), nullable=False)
    id_orden_compra = db.Column(db.Integer, db.ForeignKey("orden_compra.id_orden_compra"), nullable=False)
    fecha_entrega = db.Column(db.Date, nullable=False)

    # Relación 1 a N
    detalles = relationship("DetalleEntrega", backref="entrega", cascade="all, delete-orphan")


class DetalleEntrega(db.Model):
    __tablename__ = "detalle_entrega"

    id_detalle_entrega = db.Column(db.Integer, primary_key=True)
    id_entrega = db.Column(db.Integer, db.ForeignKey("entrega.id_entrega"), nullable=False)
    id_linea_oc = db.Column(db.Integer, db.ForeignKey("linea_oc.id_linea_oc"), nullable=False)
    cantidad_entrega = db.Column(db.SmallInteger, nullable=False)
    fecha_registro = db.Column(db.Date, default=date.today)

    def __repr__(self):
        return f"<DetalleEntrega línea={self.id_linea_oc} cantidad={self.cantidad_entrega}>"