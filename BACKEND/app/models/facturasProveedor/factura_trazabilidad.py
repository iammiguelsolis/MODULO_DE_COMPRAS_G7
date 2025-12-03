from app import db
from abc import ABCMeta
from datetime import datetime
from .enums import MotivoObservacion, EstadoFactura
from app.services.facturasProveedor.interfaces.factura_observer import FacturaObserver

SQLAlchemyMeta = type(db.Model)

class ModelABC(SQLAlchemyMeta, ABCMeta):
    pass

class FacturaTrazabilidad(db.Model, FacturaObserver, metaclass=ModelABC):
    __bind_key__ = 'facturas_db'
    __tablename__ = 'factura_trazabilidad'

    id = db.Column(db.Integer, primary_key=True)
    factura_id = db.Column(db.Integer, db.ForeignKey('facturas_proveedor.id'), nullable=False)
    proveedor_id = db.Column(db.Integer, nullable=True)
    
    # Atributos de fecha y motivo
    fecha_deteccion_error = db.Column(db.Date, default=datetime.utcnow) # 
    motivo = db.Column(db.Enum(MotivoObservacion), nullable=False) # 
    fecha_correccion = db.Column(db.Date, nullable=True) # 
    observacion_texto = db.Column(db.String(255), nullable=True)

    # --- IMPLEMENTACIÓN DE LA INTERFAZ OBSERVER ---
    def actualizar(self, factura):
        """
        Este método se ejecuta automáticamente cuando la factura notifica un cambio importante.
        """
        print(f"👁️ [Trazabilidad] Detectando evento en Factura {factura.numero_factura} (Estado: {factura.estado.name})")

        # CASO 1: ERROR EN CONCILIACIÓN (Tu norma)
        # Si la factura tiene un motivo de observación, registramos el error.
        if factura.motivo_observacion and factura.estado != EstadoFactura.ENVIADA_CXP:
            nueva_traza = FacturaTrazabilidad()
            nueva_traza.factura_id = factura.id
            nueva_traza.proveedor_id = factura.proveedor_id
            nueva_traza.fecha_deteccion_error = datetime.now()
            nueva_traza.motivo = factura.motivo_observacion
            nueva_traza.observacion_texto = f"Error detectado en versión {factura.version}. Estado: {factura.estado.name}"
            
            db.session.add(nueva_traza)
            # Nota: No hacemos commit aquí, aprovechamos la transacción del servicio principal.
            print("   ✅ Registro de Trazabilidad (Error) generado en memoria.")

        # CASO 2: HAPPY ENDING (Enviada a CxP)
        elif factura.estado == EstadoFactura.ENVIADA_CXP:
            nueva_traza = FacturaTrazabilidad()
            nueva_traza.factura_id = factura.id
            nueva_traza.proveedor_id = factura.proveedor_id
            nueva_traza.fecha_deteccion_error = datetime.now()
            nueva_traza.motivo = MotivoObservacion.NO_FUE_OBSERVADA # Asumiendo que tienes este enum o null
            nueva_traza.observacion_texto = "Proceso finalizado correctamente. Enviada a CxP."
            
            db.session.add(nueva_traza)
            print("   ✅ Registro de Trazabilidad (Éxito) generado en memoria.")

    def to_dict(self):
        return {
            "id": self.id,
            "factura_id": self.factura_id,
            "motivo": self.motivo.value,
            "fecha_deteccion": self.fecha_deteccion_error.isoformat() if self.fecha_deteccion_error else None
        }