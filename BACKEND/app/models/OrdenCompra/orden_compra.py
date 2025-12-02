from app.bdd import db
from sqlalchemy.orm import relationship
from datetime import datetime
from Evaluacion.evaluacion_enums import EstadoOC, TipoPago
from enums.ordenCompra.orden_compra_enums import TipoOrigen, Moneda

class OrdenCompra(db.Model):
    __tablename__ = 'ordenes_compra'
    
    id_orden_compra = db.Column(db.Integer, primary_key=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(
        db.Enum(EstadoOC, values_callable=lambda x: [e.value for e in x]),
        default=EstadoOC.Borrador,
        nullable=False
    )
    
    # Relación con Proveedor (FK)
    id_proveedor = db.Column(db.Integer, db.ForeignKey('proveedores.id_proveedor'))
    proveedor = relationship('Proveedor', backref='ordenes_compra')
    
    # Tipo de origen
    tipo_origen = db.Column(db.String(50), nullable=False)  # 'RFQ', 'LICITACION', 'DIRECTA'
    numero_referencia = db.Column(db.String(100), unique=True)
    
    # Relación con Solicitud (opcional, solo para RFQ/Licitación)
    id_solicitud = db.Column(db.Integer, db.ForeignKey('solicitudes.id_solicitud'), nullable=True)
    solicitud = relationship('Solicitud', backref='ordenes_compra')
    
    # Para orden directa desde inventario
    id_notificacion_inventario = db.Column(db.Integer, nullable=True)
    
    # Datos financieros
    moneda = db.Column(
        db.Enum(Moneda, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    # Condiciones de pago
    condiciones_pago_dias_plazo = db.Column(db.Integer, default=0)
    condiciones_pago_modalidad = db.Column(
        db.Enum(TipoPago, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    # Términos de entrega
    terminos_entrega = db.Column(db.Text, nullable=True)
    fecha_entrega_esperada = db.Column(db.Date, nullable=False)
    
    # Información adicional
    titulo = db.Column(db.String(200), nullable=False)
    observaciones = db.Column(db.Text, nullable=True)
    
    # Relación con líneas de orden
    lineas = relationship('LineaOC', backref='orden_compra', cascade='all, delete-orphan')
    
    # Campos calculados
    def calcular_total(self):
        """Calcula el total sumando todas las líneas"""
        if not self.lineas:
            return 0.0
        return sum(linea.precio_unitario * linea.cantidad for linea in self.lineas)
    
    def generar_numero_referencia(self):
        """Genera número automático: OC-YYYYMM-001"""
        if self.numero_referencia:
            return
            
        from datetime import datetime
        from app.models import OrdenCompra
        
        # Formato: OC-202412-001
        mes_actual = datetime.now().strftime('%Y%m')
        prefijo = f"OC-{mes_actual}-"
        
        # Buscar último número del mes
        ultima_oc = OrdenCompra.query.filter(
            OrdenCompra.numero_referencia.like(f'{prefijo}%')
        ).order_by(OrdenCompra.id_orden_compra.desc()).first()
        
        if ultima_oc:
            ultimo_num = int(ultima_oc.numero_referencia.split('-')[-1])
            nuevo_num = ultimo_num + 1
        else:
            nuevo_num = 1
        
        self.numero_referencia = f"{prefijo}{nuevo_num:03d}"
    
    def validar_estado_transicion(self, nuevo_estado: EstadoOC):
        """Valida si la transición de estado es permitida"""
        transiciones = {
            EstadoOC.Borrador: [EstadoOC.En_Proceso, EstadoOC.Cancelada],
            EstadoOC.En_Proceso: [EstadoOC.Enviada, EstadoOC.Cancelada],
            EstadoOC.Enviada: [EstadoOC.Cerrada, EstadoOC.Cancelada],
            EstadoOC.Cerrada: [],
            EstadoOC.Cancelada: []
        }
        
        estados_permitidos = transiciones.get(self.estado, [])
        if nuevo_estado not in estados_permitidos:
            raise ValueError(
                f"No se puede cambiar de {self.estado.value} a {nuevo_estado.value}. "
                f"Transiciones permitidas: {[e.value for e in estados_permitidos]}"
            )
            
    def cambiar_estado(self, nuevo_estado: EstadoOC):
        """Cambia el estado validando la transición"""
        self.validar_estado_transicion(nuevo_estado)
        self.estado = nuevo_estado
    
    def es_editable(self):
        """Determina si la orden puede ser editada"""
        return self.estado in [EstadoOC.Borrador, EstadoOC.En_Proceso]
    
    def __repr__(self):
        return f'<OrdenCompra {self.numero_referencia}: {self.titulo}>'