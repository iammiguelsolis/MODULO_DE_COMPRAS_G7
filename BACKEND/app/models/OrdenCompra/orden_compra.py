from datetime import datetime, date

from app.bdd import db
from sqlalchemy.orm import relationship

from .oc_enums import EstadoOC, EstadoLineaOC, TipoPago, TipoOrigen, Moneda


class OrdenCompra(db.Model):
    __tablename__ = "ordenes_compra"

    id_orden_compra = db.Column(db.Integer, primary_key=True)
    numero_referencia = db.Column(db.String(50), unique=True, nullable=True)

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    estado = db.Column(
        db.Enum(EstadoOC, values_callable=lambda x: [e.value for e in x]),
        default=EstadoOC.BORRADOR,
        nullable=False,
    )

    # Proveedor (deben tener tabla proveedores)
    id_proveedor = db.Column(db.Integer, db.ForeignKey("proveedor.id_proveedor"), nullable=False)
    proveedor = relationship("Proveedor", backref="ordenes_compra")

    # Origen (RFQ / LICITACION / DIRECTA)
    tipo_origen = db.Column(
        db.Enum(TipoOrigen, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    id_origen = db.Column(db.Integer, nullable=False)  # id de RFQ o Licitación o notificación
    id_solicitud = db.Column(db.Integer, db.ForeignKey("solicitudes.id_solicitud"), nullable=True)
    solicitud = relationship("Solicitud", backref="ordenes_compra")

    # Para orden directa desde inventario
    id_notificacion_inventario = db.Column(db.Integer, nullable=True)

    # Datos financieros
    moneda = db.Column(
        db.Enum(Moneda, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )

    condiciones_pago_dias_plazo = db.Column(db.Integer, default=0, nullable=False)
    condiciones_pago_modalidad = db.Column(
        db.Enum(TipoPago, values_callable=lambda x: [e.value for e in x]),
        default=TipoPago.CONTADO,
        nullable=False,
    )

    terminos_entrega = db.Column(db.Text, nullable=True)
    fecha_entrega_esperada = db.Column(db.Date, nullable=False)

    titulo = db.Column(db.String(200), nullable=False)
    observaciones = db.Column(db.Text, nullable=True)

    # Relación con líneas
    lineas = relationship(
        "LineaOC",
        back_populates="orden_compra",
        cascade="all, delete-orphan",
    )

    # ----------------- Métodos de dominio -----------------

    def calcular_total(self) -> float:
        if not self.lineas:
            return 0.0
        return float(sum(l.calcular_subtotal() for l in self.lineas))

    def generar_numero_referencia(self):
        """Genera número OC-YYYYMM-### si aún no tiene."""
        if self.numero_referencia:
            return

        mes_actual = datetime.now().strftime("%Y%m")
        prefijo = f"OC-{mes_actual}-"

        ultima_oc = (
            OrdenCompra.query.filter(OrdenCompra.numero_referencia.like(f"{prefijo}%"))
            .order_by(OrdenCompra.id_orden_compra.desc())
            .first()
        )

        if ultima_oc and ultima_oc.numero_referencia:
            try:
                ultimo_num = int(ultima_oc.numero_referencia.split("-")[-1])
            except ValueError:
                ultimo_num = 0
            nuevo_num = ultimo_num + 1
        else:
            nuevo_num = 1

        self.numero_referencia = f"{prefijo}{nuevo_num:03d}"

    def validar_estado_transicion(self, nuevo_estado: EstadoOC):
        transiciones = {
            EstadoOC.BORRADOR: [EstadoOC.EN_PROCESO, EstadoOC.CANCELADA],
            EstadoOC.EN_PROCESO: [EstadoOC.ENVIADA, EstadoOC.CANCELADA],
            EstadoOC.ENVIADA: [EstadoOC.CERRADA, EstadoOC.CANCELADA],
            EstadoOC.CERRADA: [],
            EstadoOC.CANCELADA: [],
        }
        permitidos = transiciones.get(self.estado, [])
        if nuevo_estado not in permitidos:
            raise ValueError(
                f"No se puede pasar de {self.estado.value} a {nuevo_estado.value}. "
                f"Permitidos: {[e.value for e in permitidos]}"
            )

    def cambiar_estado(self, nuevo_estado: EstadoOC):
        self.validar_estado_transicion(nuevo_estado)
        self.estado = nuevo_estado

    def es_editable(self) -> bool:
        return self.estado in [EstadoOC.BORRADOR, EstadoOC.EN_PROCESO]

    def __repr__(self) -> str:
        return f"<OrdenCompra {self.numero_referencia or self.id_orden_compra}>"


class LineaOC(db.Model):
    __tablename__ = "lineas_oc"

    id_linea_oc = db.Column(db.Integer, primary_key=True)

    id_orden_compra = db.Column(
        db.Integer, db.ForeignKey("ordenes_compra.id_orden_compra"), nullable=False
    )
    orden_compra = relationship("OrdenCompra", back_populates="lineas")

    # Producto / ítem (referencia a otro módulo)
    id_item = db.Column(db.String(50), nullable=False)  # producto_id (texto) para no complicar FK ahora
    descripcion = db.Column(db.String(255), nullable=False)

    precio_unitario = db.Column(db.Float, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)

    # Estado logístico
    estado = db.Column(
        db.Enum(EstadoLineaOC, values_callable=lambda x: [e.value for e in x]),
        default=EstadoLineaOC.Todavia_no_cp,
        nullable=False,
    )

    # Entregas parciales (simplificado)
    permite_entrega_parcial = db.Column(db.Boolean, default=False)
    cantidad_esperada_entrega_parcial = db.Column(db.Integer, nullable=True)
    fecha_limite_entrega_parcial = db.Column(db.Date, nullable=True)
    fecha_limite_entrega_final = db.Column(db.Date, nullable=True)

    cantidad_recibida_entrega_parcial = db.Column(db.Integer, nullable=True)
    fecha_efectiva_entrega_parcial = db.Column(db.Date, nullable=True)
    fecha_efectiva_entrega_final = db.Column(db.Date, nullable=True)

    def calcular_subtotal(self) -> float:
        return float(self.precio_unitario * self.cantidad)

    def __repr__(self) -> str:
        return f"<LineaOC {self.id_linea_oc} - {self.descripcion}>"
