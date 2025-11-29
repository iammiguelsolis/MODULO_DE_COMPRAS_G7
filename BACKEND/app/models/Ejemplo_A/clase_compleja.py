"""
from app.bdd import db
from .enums import Dias_Semana
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

class Usuario(db.Model):
    __tablename__ = 'usuario'  
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(9), nullable=True)
    dni = db.Column(db.Integer, nullable=False)
    contraseña = db.Column(db.String(128), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    sexo = db.Column(db.Enum("M", "F", name="sexo"), nullable=False)
    tipo_usuario = db.Column(db.Enum("a", "Colaborador", "Terapeuta"), nullable=False)

    # RELACIÓN EXPLÍCITA PARA BORRADO EN CASCADA
    horarios = db.relationship(
        "HorarioTerapeuta",
        backref="terapeuta",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def set_password(self, password):
        from app import bcrypt
        self.contraseña = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        from app import bcrypt
        return bcrypt.check_password_hash(self.contraseña, password)
"""