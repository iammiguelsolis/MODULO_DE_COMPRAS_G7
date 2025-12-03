from datetime import date
from app.bdd import db
from .inventario_enums import *
from sqlalchemy import Enum as SQLEnum


class Proveedor(db.Model):
    __tablename__ = "proveedor"

    id_proveedor = db.Column(db.Integer, primary_key=True)
    razon_social = db.Column(db.String(100), nullable=False)
    ruc = db.Column(db.String(20), nullable=False)
    pais = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    domicilio_legal = db.Column(db.String(100), nullable=False)
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

    # === Campos embebidos ===
    numero_trabajadores = db.Column(db.Integer)
    tiene_sindicato = db.Column(db.Boolean, default=False, nullable=False)
    ha_tomado_represalias_contra_sindicato = db.Column(
        db.Enum(PosiblesValores, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    denuncias_incumplimiento_contrato = db.Column(db.Integer)
    indice_denuncias = db.Column(db.Float)
    tiene_procesos_de_mejora_de_condiciones_laborales = db.Column(db.Boolean, default=False, nullable=False)

    # -------------------------------------------------------------------------
    # 🔹 1. CALCULAR ÍNDICE DE DENUNCIAS (automatic field)
    # -------------------------------------------------------------------------
    def calcular_indice_denuncias(self):
        """Calcula el índice de denuncias según días transcurridos (n - 1)."""

        if not self.fecha_registro or self.denuncias_incumplimiento_contrato is None:
            return None

        hoy = date.today()
        dias_transcurridos = (hoy - self.fecha_registro).days

        # Excluir el día de registro → n - 1
        dias_utiles = max(dias_transcurridos - 1, 1)  # evitar división entre cero

        indice = self.denuncias_incumplimiento_contrato / dias_utiles
        self.indice_denuncias = round(indice, 4)

        return self.indice_denuncias

    # -------------------------------------------------------------------------
    # 🔹 2. EVALUAR RIESGO LABORAL (según denuncias, tamaño empresa, etc.)
    # -------------------------------------------------------------------------
    def evaluar_riesgo_denuncias(self):
        """Evalúa el riesgo laboral basado en denuncias por mes y número de trabajadores."""

        if self.indice_denuncias is None or not self.numero_trabajadores:
            return "Desconocido"

        # Convertimos a denuncias por mes (30 días)
        denuncias_por_mes = self.indice_denuncias * 30

        # Normalización por tamaño de empresa
        factor_tamano = max(self.numero_trabajadores / 50, 1)
        valor_ajustado = denuncias_por_mes / factor_tamano

        # Clasificación
        if valor_ajustado <= 0.3:
            return "Bajo"
        elif valor_ajustado <= 1:
            return "Medio"
        elif valor_ajustado <= 2.5:
            return "Alto"
        return "Crítico"

    # -------------------------------------------------------------------------
    # 🔹 3. to_dict() con campos nuevos
    # -------------------------------------------------------------------------
    def to_dict(self):
        """Convierte el proveedor a un dict serializable."""

        # Actualiza el índice en tiempo real antes de exportarlo
        self.calcular_indice_denuncias()

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

            # === Campos embebidos ===
            "numero_trabajadores": self.numero_trabajadores,
            "tiene_sindicato": self.tiene_sindicato,
            "ha_tomado_represalias_contra_sindicato": self.ha_tomado_represalias_contra_sindicato.value if self.ha_tomado_represalias_contra_sindicato else None,
            "denuncias_incumplimiento_contrato": self.denuncias_incumplimiento_contrato,

            # Campos calculados
            "indice_denuncias": self.indice_denuncias,
            "riesgo_laboral": self.evaluar_riesgo_denuncias(),

            "tiene_procesos_de_mejora_de_condiciones_laborales": self.tiene_procesos_de_mejora_de_condiciones_laborales
        }
