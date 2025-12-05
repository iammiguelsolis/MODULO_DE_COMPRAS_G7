
from abc import ABC, abstractmethod
from app.bdd import db
from .evaluacion_enums import *
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import date
from typing import Optional

class LineaOC(db.Model):
    id_linea_oc = db.Column(db.Integer, primary_key=True)
    id_item = 1 #esto es una fk con producto
    id_orden_compra = 2 #esto es fk con OC
    precio_unitario = db.Column(db.Integer)
    cantidad = db.Column(db.Integer)
    estado = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )

    #datos de condicion linea OC, lo que llaman DTO ps
    permite_entrega_parcial = db.Column(db.Boolean, default=False)
    cantidad_esperada_entrega_parcial = db.Column(db.Integer)
    fecha_limite_entrega_parcial = db.Column(db.Date, nullable=True)
    fecha_limite_entrega_final = db.Column(db.Date, nullable=False)

    #DTO de DetallesLineaOC

    estado_parcial = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )

    estado_final = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    ########################        Agregado EVA #####################
    cantidad_recibida_entrega_parcial = db.Column(db.Integer)
    fecha_efectiva_entrega_parcial = db.Column(db.Date, nullable=True)
    fecha_efectiva_entrega_final = db.Column(db.Date, nullable=False)
    #ojo no estoy creando un nuevo campo de cantidad reci para entrega final
    # ya que se deduce de la cantidad de linea OC, seria un nosense jajajaja

    def calcular_subtotal(self):
        return self.precio_unitario * self.cantidad

    def verificar_estado():
        pass
    ########################        Agregado EVA #####################
class DetallesLineaOC:
    """Lógica de negocio y validación para los detalles de una línea de orden de compra."""

    def __init__(
        self,
        estado_parcial: EstadoLineaOC = EstadoLineaOC.Pendiente,
        estado_final: EstadoLineaOC = EstadoLineaOC.Pendiente,
        cantidad_recibida_entrega_parcial: Optional[int] = None,
        fecha_efectiva_entrega_parcial: Optional[date] = None,
        fecha_efectiva_entrega_final: Optional[date] = None,
    ):
        self.estado_parcial = estado_parcial
        self.estado_final = estado_final
        self.cantidad_recibida_entrega_parcial = cantidad_recibida_entrega_parcial
        self.fecha_efectiva_entrega_parcial = fecha_efectiva_entrega_parcial
        self.fecha_efectiva_entrega_final = fecha_efectiva_entrega_final

    # --- MÉTODOS DE NEGOCIO ---

    def validar(self, permite_entrega_parcial: bool):
        """Valida coherencia interna respecto a las condiciones de la línea."""
        if permite_entrega_parcial:
            if self.estado_parcial == EstadoLineaOC.Completada and not self.cantidad_recibida_entrega_parcial:
                raise ValueError("Debe registrar cantidad recibida si se completó entrega parcial.")
            if self.estado_parcial == EstadoLineaOC.Pendiente and self.cantidad_recibida_entrega_parcial:
                raise ValueError("No puede haber cantidad parcial si el estado está pendiente.")
        else:
            if self.estado_parcial != EstadoLineaOC.Pendiente:
                raise ValueError("No debe haber estado parcial si la entrega parcial no está permitida.")
            if self.cantidad_recibida_entrega_parcial:
                raise ValueError("No debe registrar entrega parcial si no está permitida.")

        if not self.fecha_efectiva_entrega_final:
            raise ValueError("Debe indicar la fecha efectiva de entrega final.")

    def actualizar_estados(self):
        """Actualiza los estados según cantidades o fechas."""
        if self.estado_final != EstadoLineaOC.Completada:
            if self.fecha_efectiva_entrega_final and self.estado_parcial == EstadoLineaOC.Completada:
                self.estado_final = EstadoLineaOC.Completada

    def resumen(self) -> str:
        """Devuelve un texto legible de la situación actual."""
        txt = f"Final: {self.estado_final.value}"
        if self.estado_parcial != EstadoLineaOC.Pendiente:
            txt += f" | Parcial: {self.estado_parcial.value} ({self.cantidad_recibida_entrega_parcial or 0} unidades)"
        return txt

class CondicionesLineaOC:
    """
    Representa las condiciones lógicas o administrativas de una línea de OC
    sin necesidad de persistencia en base de datos.
    """

    def __init__(
        self,
        permite_entrega_parcial: bool = False,
        cantidad_esperada_entrega_parcial: Optional[int] = None,
        fecha_limite_entrega_parcial: Optional[date] = None,
        fecha_limite_entrega_final: Optional[date] = None
    ):
        self.permite_entrega_parcial = permite_entrega_parcial
        self.cantidad_esperada_entrega_parcial = cantidad_esperada_entrega_parcial
        self.fecha_limite_entrega_parcial = fecha_limite_entrega_parcial
        self.fecha_limite_entrega_final = fecha_limite_entrega_final

    def validar(self):
        """Valida coherencia entre los campos."""
        if self.permite_entrega_parcial:
            if not self.cantidad_esperada_entrega_parcial:
                raise ValueError("Debe definir cantidad esperada si se permite entrega parcial.")
            if not self.fecha_limite_entrega_parcial:
                raise ValueError("Debe definir fecha límite de entrega parcial.")
        else:
            # Si no hay entregas parciales, se ignoran los otros valores
            self.cantidad_esperada_entrega_parcial = None
            self.fecha_limite_entrega_parcial = None

    def resumen(self):
        """Devuelve una descripción legible de las condiciones."""
        if self.permite_entrega_parcial:
            return (
                f"Entrega parcial permitida ({self.cantidad_esperada_entrega_parcial} unidades "
                f"antes del {self.fecha_limite_entrega_parcial}), "
                f"entrega final antes del {self.fecha_limite_entrega_final}"
            )
        return f"Entrega única antes del {self.fecha_limite_entrega_final}"

    def __repr__(self):
        return (
            f"<CondicionesLineaOC("
            f"permite_entrega_parcial={self.permite_entrega_parcial}, "
            f"cantidad_esperada_entrega_parcial={self.cantidad_esperada_entrega_parcial}, "
            f"fecha_limite_entrega_parcial={self.fecha_limite_entrega_parcial}, "
            f"fecha_limite_entrega_final={self.fecha_limite_entrega_final})>"
        )

