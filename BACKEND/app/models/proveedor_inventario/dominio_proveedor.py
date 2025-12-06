"""
| Tipo                                 | Convención                                  | Ejemplo                             |
| ------------------------------------ | ------------------------------------------- | ----------------------------------- |
| **Variables / funciones**            | `snake_case` (minúsculas con guiones bajos) | `total_precio`, `obtener_usuario()` |
| **Clases**                           | `PascalCase` o `CamelCase`                  | `Usuario`, `ClientePremium`         |
| **Constantes**                       | `MAYÚSCULAS_CON_GUIONES`                    | `MAX_INTENTOS`, `API_KEY`           |
| **Módulos (archivos .py)**           | `snake_case`                                | `usuarios.py`, `carro_model.py`     |
| **Paquetes (carpetas)**              | `snake_case`                                | `models`, `blueprints`              |

"""


#En desarrollo, todavia no listo para ejecutar run.py


from abc import ABC, abstractmethod
from app.bdd import db
from .inventario_enums import *
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import date
from typing import Optional

class Proveedor(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "proveedor"
    id_proveedor = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(100), nullable = False)
    ruc = db.Column(db.String(20), nullable = False)
    pais = db.Column(db.String(100), nullable = True)
    email = db.Column(db.String(100), nullable = False)
    telefono = db.Column(db.String(20), nullable = False)
    domicilio_legal = db.Column(db.String(100), nullable = False)
    fecha_registro = db.Column(db.Date, nullable=False)
    esta_suspendido = db.Column(db.Boolean, default=False)

    confiabilidad_en_entregas = db.Column(
        db.Enum(EscalaCalificacion, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )

    confiabilidad_en_condiciones_pago = db.Column(
        db.Enum(EscalaCalificacion, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    #Objeto embebido
    numero_trabajadores = db.Column(db.Integer) 
    tiene_sindicato = db.Column(db.Boolean, default=False, nullable = False)
    ha_tomado_represalias_contra_sindicato = db.Column(
        db.Enum(PosiblesValores, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    denuncias_incumplimiento_contrato = db.Column(db.Integer) 
    indice_denuncias = db.Column(db.Float)
    tiene_procesos_de_mejora_de_condiciones_laborales = db.Column(db.Boolean, default=False, nullable = False)

    def to_dict(self):
        """Convierte el proveedor a un diccionario serializable"""
        return {
            "id_proveedor": self.id_proveedor,
            "razon_social": self.razon_social,
            "ruc": self.ruc,
            "pais": self.pais,
            "email": self.email,
            "telefono": self.telefono,
            "domicilio_legal": self.domicilio_legal,
            "fecha_registro": self.fecha_registro.isoformat() if self.fecha_registro else None,
            "esta_suspendido": self.esta_suspendido,
            "confiabilidad_en_entregas": self.confiabilidad_en_entregas.value if self.confiabilidad_en_entregas else None,
            "confiabilidad_en_condiciones_pago": self.confiabilidad_en_condiciones_pago.value if self.confiabilidad_en_condiciones_pago else None,
            # Campos embebidos (detalles)
            "numero_trabajadores": self.numero_trabajadores,
            "tiene_sindicato": self.tiene_sindicato,
            "ha_tomado_represalias_contra_sindicato": self.ha_tomado_represalias_contra_sindicato.value if self.ha_tomado_represalias_contra_sindicato else None,
            "denuncias_incumplimiento_contrato": self.denuncias_incumplimiento_contrato,
            "indice_denuncias": self.indice_denuncias,
            "tiene_procesos_de_mejora_de_condiciones_laborales": self.tiene_procesos_de_mejora_de_condiciones_laborales
        }

    def registrar_proveedor(self):
        pass

    def actualizar_datos(self):
        pass

    def cambiar_estado_proveedor(self):
        pass

class DetallesProveedor:
    
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

    def evaluar_riesgo_laboral(self) -> str:

        if self.ha_tomado_represalias_contra_sindicato == "Sí" or self.denuncias_incumplimiento_contrato > 10:
            return "Alto"
        elif self.tiene_sindicato and self.tiene_procesos_de_mejora_de_condiciones_laborales:
            return "Bajo"
        return "Medio"

    def resumen(self) -> str:
        
        return (
            f"Trabajadores: {self.numero_trabajadores}, Sindicato: {self.tiene_sindicato}, "
            f"Denuncias: {self.denuncias_incumplimiento_contrato}, Riesgo: {self.evaluar_riesgo_laboral()}"
        )


class ContactoProveedor(db.Model):
    __bind_key__ = 'desarrollo_db' 
    __tablename__ = "contacto_proveedor"
    id_contacto_proveedor = db.Column(db.Integer, primary_key=True)
    id_proveedor = db.Column(db.Integer, db.ForeignKey("proveedor.id_proveedor"), nullable=False) 
    nombre = db.Column(db.String(100), nullable = False)
    cargo = db.Column(db.String(100), nullable = False)
    email = db.Column(db.String(100), nullable = False)
    telefono = db.Column(db.String(20), nullable = False)