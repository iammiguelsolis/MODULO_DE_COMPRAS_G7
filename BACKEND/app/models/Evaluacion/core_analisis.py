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
from .enums import Dias_Semana
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

class EvaluacionRendimiento(ABC):
    cantidad_positivas 
    cantidad_negativas
    @abstractmethod
    def calcular_cantidad_positivas(self):
        pass

    @abstractmethod
    def calcular_cantidad_negativas(self):
        pass

    @abstractmethod
    def asignar_calificacion_proveedor(self): #aqui debo evaluar si 
        #necesito enviar proveedor o no
        pass
    
#  Qué es cantidad calculo? Referirse al lucid de diseño

# el promedio se halla como
# (a1+ a2 + an)/n bueno cantidad calculo es n. Aunque un proveedor tenga solo 10 ordenes 
# de compra debido a que consideramos las entregas de items podria facilmente tener un n
# de 150 es decir que nos entrego 150 items (entre iguales y diferentes) en esas 10 ordenes 
# de compra, recodardando que cada item tiene una cantidad pedida que definitivamente es mayor a 150

class EvaluacionCumplimientoPlazoEntrega(EvaluacionRendimiento, db.Model):
    """
    idProveedor: int
    idEvaluacionPlazo: int
    cantidadCalculo: int este es el unico que no tiene CCP
    promedioDiasRetraso: float

    calcularCantidadPositivas()    SAME
    calcularCantidadNegativas()    SAME
    calcularPromedioDias()
    asignarCalificacion(Proveedor p)     SAME
    entregaParcialFueCompleta() retorna boolean
    entregaFinalFueCompleta() retorna boolean
    """

    id_proveedor = db.Column(db.Integer, primary_key=True)
    id_evaluacion_plazo = db.Column(db.Integer, primary_key=True)
    cantidad_calculo = db.Column(db.Integer)
    promedio_dias_retraso = db.Column(db.Float)


class EvaluacionCumplimientoCondicionesPago(EvaluacionRendimiento, db.Model):
    id_proveedor = db.Column(db.Integer, primary_key=True)
    id_evaluacion_ccp = db.Column(db.Integer, primary_key=True)
    cantidad_calculo = db.Column(db.Integer)
    promedio_dias_retraso = db.Column(db.Float)

    def calcular_cantidad_positivas():
        pass
    def calcular_cantidad_negativas():
        pass
    def asignar_calificacion_proveedor():
        pass
