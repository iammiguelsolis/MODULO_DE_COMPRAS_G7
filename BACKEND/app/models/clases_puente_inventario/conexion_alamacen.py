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

class Almacen(db.Model):
    id_almacen = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(100), nullable=False)

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

class Proveedor(db.Model):
    __tablename__ = "proveedor"
    id_proveedor = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable = False)
    ruc = db.Column(db.String(20), nullable = False)
    direccion = db.Column(db.String(100), nullable = False)
    correo = db.Column(db.String(100), nullable=False)
    fecha_registro = db.Column(db.Date, nullable=False)

    confiabilidad_en_entregas = db.Column(
        db.Enum(EscalaCalificacion, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )

    confiabilidad_en_condiciones_pago = db.Column(
        db.Enum(EscalaCalificacion, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    #DTO DetallesProveedor

    numero_trabajadores = db.Column(db.Integer) #deberia ser small int pero me da pereza xddd
    tiene_sindicato = db.Column(db.Boolean, default=False, nullable = False)
    ha_tomado_represalias_contra_sindicato = db.Column(
        db.Enum(PosiblesValores, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    denuncias_incumplimiento_contrato = db.Column(db.Integer) #aqui tambien deberia ser un small int porque es complejo tener mas de 30k denuncias
    indice_denuncias = db.Column(db.Float)
    tiene_procesos_de_mejora_de_condiciones_laborales = db.Column(db.Boolean, default=False, nullable = False)

    def registrar_proveedor(self):
        pass

    def actualizar_datos(self):
        pass


class DetallesProveedor:
    """DTO lógico que agrupa información extendida o derivada del proveedor."""

    def __init__(
        self,
        numero_trabajadores: int,
        tiene_sindicato: bool,
        ha_tomado_represalias_contra_sindicato: str,
        denuncias_incumplimiento_contrato: int,
        indice_denuncias: float,
        tiene_procesos_de_mejora_de_condiciones_laborales: bool,
    ):
        self.numero_trabajadores = numero_trabajadores
        self.tiene_sindicato = tiene_sindicato
        self.ha_tomado_represalias_contra_sindicato = ha_tomado_represalias_contra_sindicato
        self.denuncias_incumplimiento_contrato = denuncias_incumplimiento_contrato
        self.indice_denuncias = indice_denuncias
        self.tiene_procesos_de_mejora_de_condiciones_laborales = (
            tiene_procesos_de_mejora_de_condiciones_laborales
        )

    # --- Métodos de negocio / validación ---

    def evaluar_riesgo_laboral(self) -> str:
        """Evalúa el riesgo de relaciones laborales del proveedor."""
        if self.ha_tomado_represalias_contra_sindicato == "Sí" or self.denuncias_incumplimiento_contrato > 10:
            return "Alto"
        elif self.tiene_sindicato and self.tiene_procesos_de_mejora_de_condiciones_laborales:
            return "Bajo"
        return "Medio"

    def resumen(self) -> str:
        """Devuelve un resumen textual."""
        return (
            f"Trabajadores: {self.numero_trabajadores}, Sindicato: {self.tiene_sindicato}, "
            f"Denuncias: {self.denuncias_incumplimiento_contrato}, Riesgo: {self.evaluar_riesgo_laboral()}"
        )





