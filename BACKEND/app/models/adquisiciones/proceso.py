from app.bdd import db
from datetime import datetime

class EstadoProceso:
    NUEVO = "NUEVO"
    INVITANDO = "INVITANDO_PROVEEDORES"
    EVALUANDO = "EVALUANDO_OFERTAS"
    CERRADO = "CERRADO"


class ProcesoAdquisicion(db.Model):
    __tablename__ = 'procesos_adquisicion'
    
    id = db.Column(db.Integer, primary_key=True)
    solicitud_id = db.Column(db.Integer, db.ForeignKey('solicitudes.id'), unique=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.now)
    estado = db.Column(db.String(50), default=EstadoProceso.NUEVO)
    

    solicitud_origen = db.relationship('Solicitud', backref=db.backref('proceso_adquisicion', uselist=False))
    
    tipo_proceso = db.Column(db.String(50))

    # Oferta Ganadora (ID)
    oferta_ganadora_id = db.Column(db.Integer, db.ForeignKey('ofertas_proveedor.id'), nullable=True)
    

    ofertas = db.relationship(
        'OfertaProveedor', 
        foreign_keys='OfertaProveedor.proceso_id', 
        backref='proceso', 
        lazy=True
    )

    ganador = db.relationship(
        'OfertaProveedor',
        foreign_keys=[oferta_ganadora_id],
        post_update=True 
    )

    __mapper_args__ = {
        'polymorphic_identity': 'GENERICO',
        'polymorphic_on': tipo_proceso
    }

    def invitar_proveedores(self, lista_contactos, notificador):
        for contacto in lista_contactos:
            mensaje = f"Hola, te invitamos a cotizar para el proceso #{self.id}."
            notificador.enviar(contacto, mensaje)
        
        self.estado = EstadoProceso.INVITANDO

    def seleccionar_ganador(self, oferta):
        self.oferta_ganadora_id = oferta.id
        self.estado = EstadoProceso.CERRADO
        
    def to_dict(self):
        return {
            'id': self.id,
            'solicitud_id': self.solicitud_id,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'estado': self.estado,
            'oferta_ganadora_id': self.oferta_ganadora_id
        }


class Compra(ProcesoAdquisicion):
    __tablename__ = 'compras'
    id = db.Column(db.Integer, db.ForeignKey('procesos_adquisicion.id'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'COMPRA',
    }

    def iniciar_comparacion_simple(self):
        if not self.ofertas:
            raise Exception("No hay ofertas para comparar.")
        self.estado = EstadoProceso.EVALUANDO

    def to_dict(self):
        d = super().to_dict()
        d['ofertas'] = [o.to_dict() for o in self.ofertas]
        return d