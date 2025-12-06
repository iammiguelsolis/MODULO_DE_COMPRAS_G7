"""
| Tipo                                 | Convención                                  | Ejemplo                             |
| ------------------------------------ | ------------------------------------------- | ----------------------------------- |
| **Variables / funciones**            | `snake_case` (minúsculas con guiones bajos) | `total_precio`, `obtener_usuario()` |
| **Clases**                           | `PascalCase` o `CamelCase`                  | `Usuario`, `ClientePremium`         |
| **Constantes**                       | `MAYÚSCULAS_CON_GUIONES`                    | `MAX_INTENTOS`, `API_KEY`           |
| **Módulos (archivos .py)**           | `snake_case`                                | `usuarios.py`, `carro_model.py`     |
| **Paquetes (carpetas)**              | `snake_case`                                | `models`, `blueprints`              |

"""

from abc import ABC, abstractmethod
from app.bdd import db
from .inventario_enums import *
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import date
from typing import Optional

#Considera que se trata de una empresa del 
#sector teleco como claro o movistar, en base a esta clase material que viene a ser lo mismo que item
# solo que mi profesor es tontito y pues me obliga a usar esta palabra que le gusta. Pues basandote en mi modelo, proponme un enum para las unidades de medida de productos
# que pues representan basicamente lo que vendo, es como la carta de un restaurante, dice cual es mi pool de opciones

class Material(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "material"
    id_item = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(100), nullable=False)
    unidad = db.Column(
        db.Enum(UnidadMedidaAlmacen, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    ) #me encanta esta forma de utilizar enums

    def to_dict(self):
        return {
            "id_item": self.id_item,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "unidad": self.unidad.value if self.unidad else None
        }
class Almacen(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "almacen"
    id_almacen = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(100), nullable=False)

class Entrega(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "entrega"
    #OJO falta implementar la OC pero siguiendo mi nomenclatura
    #ya puedo ir poniendo las clases
    id_entrega = db.Column(db.Integer, primary_key=True)
    id_proveedor = db.Column(db.Integer, db.ForeignKey("proveedor.id_proveedor"), nullable=False) #KK
    #id_orden_compra = db.Column(db.Integer, db.ForeignKey("orden_compra.id_orden_compra"), nullable=False) FALTA
    fecha_entrega = db.Column(db.Date, nullable=False)

    # Relación 1 a N
    detalles = relationship("DetalleEntrega", backref="entrega", cascade="all, delete-orphan")


class DetalleEntrega(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "detalle_entrega"

    id_detalle_entrega = db.Column(db.Integer, primary_key=True)
    id_entrega = db.Column(db.Integer, db.ForeignKey("entrega.id_entrega"), nullable=False)
    # id_linea_oc = db.Column(db.Integer, db.ForeignKey("linea_oc.id_linea_oc"), nullable=False) FALTA
    cantidad_entrega = db.Column(db.SmallInteger, nullable=False)
    fecha_registro = db.Column(db.Date, default=date.today)

    def __repr__(self):
        return f"<DetalleEntrega línea={self.id_linea_oc} cantidad={self.cantidad_entrega}>"
