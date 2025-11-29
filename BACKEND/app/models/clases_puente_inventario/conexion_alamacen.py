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
from ...enums.evaluacion_enums import EstadoLineaOC
from dataclasses import dataclass #sirve para reducir boilerplate

class Almacen(db.Model):
    id_almacen = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(100), nullable=False)

class TerminosEntrega():
    almacen : Almacen #aqui creo que lo correcto seria usar un id_almacen no un objeto almacen, dime las ventajas de cada enfoque
    fecha_prevista_oc_completada : date

    #no tiene nada solo me permite crear un tipo de dato especifico
    # que resume muy bien la info de orden de compra asociada



class OrdenCompra(db.Model):
    id_orden_compra = db.Column(db.Integer, primary_key=True)
    estado = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    # Embebed Value
    id_almacen = db.Column(db.Integer, db.ForeignKey("almacen.id_almacen"), nullable=False)

    @cached_property
    def almacen(self): #Aseguro que no se haran consultas tontas, su unico 
        return db.session.get(Almacen, self.id_almacen)

    fecha_prevista_oc_completada = db.Column(db.Date)

class OrdenCompra(db.Model):
    id_orden_compra = db.Column(db.Integer, primary_key=True)
    estado = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    #AQUI FALTAN Más datos, esta es una de mis clases clave, pero no es importante que tengas todo el contexto desde ahora


    #aqui debo hacer una asociacion revesa para traer al proveedor 
    # tambien faltaria solicitud pero es que es parte de un modulo externo, 
    # yo voy a poner solo lo que espero recibir y continuo trabajando ps, no me voy a bloquear
    
    #Terminos entrega como valor embebido
    id_almacen = db.Column(db.Integer, db.ForeignKey("almacen.id_almacen"), nullable=False) #aqui me sirve esto para luego poder recuperar la data y cargar el almacen en modo lazy
    @property
    def almacen(self): #esto es lazy, ya que solo recupero si lo busco 
        return db.session.get(Almacen, id_almace)
    fecha_prevista_oc_completada : date


class Entrega(db.Model):
    __tablename__ = "entrega"
    #OJO falta implementar la OC pero siguiendo mi nomenclatura
    #ya puedo ir poniendo las clases
    id_entrega = db.Column(db.Integer, primary_key=True)
    id_proveedor = db.Column(db.Integer, db.ForeignKey("proveedor.id_proveedor"), nullable=False)
    id_orden_compra = db.Column(db.Integer, db.ForeignKey("orden_compra.id_orden_compra"), nullable=False)
    fecha_entrega = db.Column(db.Date, nullable=False)

    # Relación 1 a N, aqui no creo la reversa porque no le veo sentido
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

@dataclass
class DetallesProveedor:
    """DTO lógico que agrupa información extendida o derivada del proveedor."""
    numero_trabajadores: int
    tiene_sindicato: bool
    ha_tomado_represalias_contra_sindicato: str
    denuncias_incumplimiento_contrato: int
    indice_denuncias: float
    tiene_procesos_de_mejora_de_condiciones_laborales: bool
    
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


class EvaluacionCumplimientoDerechosLaborales:
    """Clase lógica (no tabla) que representa una evaluación derivada de los datos del proveedor."""

    def __init__(self, proveedor):
        self.proveedor = proveedor

    @property #aqui logro hacer una logica de getter, como es natural no puedo modificar posterior a la
    #creacion del atributo
    def indice_denuncias(self) -> float:
        """Ejemplo de cálculo derivado."""
        denuncias = self.proveedor.denuncias_incumplimiento_contrato or 0
        trabajadores = self.proveedor.numero_trabajadores or 1
        return round(denuncias / trabajadores, 3)

    @property
    def calificacion_general(self) -> str:
        """Devuelve una etiqueta cualitativa según el índice."""
        indice = self.indice_denuncias
        if indice == 0:
            return "Excelente"
        elif indice < 0.05:
            return "Buena"
        elif indice < 0.2:
            return "Regular"
        else:
            return "Crítica"
