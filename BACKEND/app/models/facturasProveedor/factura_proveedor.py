from app import db
from abc import ABCMeta
from datetime import datetime
from .enums import EstadoFactura, Moneda, MotivoObservacion
from app.services.facturasProveedor.interfaces.factura_observable import FacturaObservable

SQLAlchemyMeta = type(db.Model)

class ModelABC(SQLAlchemyMeta, ABCMeta):
    pass

class FacturaProveedor(db.Model, FacturaObservable, metaclass=ModelABC):
    __bind_key__ = 'facturas_db'
    __tablename__ = 'facturas_proveedor'

    id = db.Column(db.Integer, primary_key=True)
    numero_factura = db.Column(db.String(50), nullable=False)
    fecha_emision = db.Column(db.Date, nullable=False)
    fecha_vencimiento = db.Column(db.Date)
    
    # Uso de Enum para moneda
    moneda = db.Column(db.Enum(Moneda), nullable=False)
    
    # Valores monetarios
    subtotal = db.Column(db.Float, default=0.0)
    impuestos = db.Column(db.Float, default=0.0)
    total = db.Column(db.Float, default=0.0)
    
    # Estado y Observaciones
    estado = db.Column(db.Enum(EstadoFactura), default=EstadoFactura.BORRADOR)
    ha_sido_observada = db.Column(db.Boolean, default=False)
    motivo_observacion = db.Column(db.Enum(MotivoObservacion), nullable=True)
    version = db.Column(db.Integer, default=1)

    # Relación con Proveedor (Asumiendo que existe un modelo Proveedor, 
    # aunque no detallado en diagrama, se referencia en [cite: 72])
    proveedor_id = db.Column(db.Integer)
    #proveedor_id = db.Column(db.Integer, db.ForeignKey('proveedores.id'))
    
    # Relaciones (Composición)
    lineas = db.relationship('LineaFactura', backref='factura', lazy=True, cascade="all, delete-orphan")
    documentos_adjuntos = db.relationship('DocumentoAdjunto', backref='factura', lazy=True)
    trazabilidad = db.relationship('FacturaTrazabilidad', backref='factura', lazy=True)
    resultados_conciliacion = db.relationship('ResultadoConciliacion', backref='factura', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        FacturaObservable.__init__(self)

    # SQLAlchemy a veces no llama a __init__ cuando carga de la DB, 
    # usamos este decorador para asegurar que la lista de observers exista siempre.
    @db.orm.reconstructor
    def init_on_load(self):
        FacturaObservable.__init__(self)

    def to_dict(self):
        return {
            "id": self.id,
            "numero_factura": self.numero_factura,
            "subtotal": self.subtotal,
            "impuestos": self.impuestos,
            "total": self.total,
            "estado": self.estado.value,
            "lineas": [l.to_dict() for l in self.lineas],
            "moneda": self.moneda.name,
            "fecha_emision": self.fecha_emision,
            "fecha_vencimiento": self.fecha_vencimiento,
            "proveedor_id": self.proveedor_id,
            "ha_sido_observada": self.ha_sido_observada,
            "motivo_observacion": self.motivo_observacion.name if self.motivo_observacion else None,
            "version": self.version
        }
    
    def notify(self, factura=None):
        """
        Recorre la lista de suscriptores (Observers) y les avisa del cambio.
        """
        # Si no pasaron argumento, el objetivo es 'self' (esta misma factura)
        objetivo = factura if factura else self

        # Validación de seguridad por si la lista no existe
        if not hasattr(self, '_observers') or not self._observers:
            print("DEBUG: No hay observadores suscritos.")
            return

        print(f"DEBUG: Notificando a {len(self._observers)} observadores...")
        
        for observer in self._observers:
            # Llamamos al método 'actualizar' de la interfaz FacturaObserver
            observer.actualizar(objetivo)