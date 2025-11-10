
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
        #necesito enviar proveedor como parametro o no
        pass

class EvaluacionCumplimientoPlazoEntrega(EvaluacionRendimiento, db.Model):

    id_proveedor = db.Column(db.Integer, primary_key=True)
    id_evaluacion_plazo = db.Column(db.Integer, primary_key=True)
    cantidad_calculo = db.Column(db.Integer)
    promedio_dias_retraso = db.Column(db.Float)


    def calcular_cantidad_positivas():
        pass

    def calcular_cantidad_negativas():
        pass

    def calcular_promedio_dias():
        pass

    def asignar_calificacion_proveedor(self):
        pass
