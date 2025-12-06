from app.bdd import db
from app.models.licitaciones.estados.estado_nueva import EstadoNueva
from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
from app.models.adquisiciones.proceso import ProcesoAdquisicion

class Licitacion(ProcesoAdquisicion):
    __tablename__ = 'licitaciones'
    
    id = db.Column(db.Integer, db.ForeignKey('procesos_adquisicion.id'), primary_key=True)
    
    __mapper_args__ = {
        'polymorphic_identity': 'LICITACION',
    }

    presupuesto_max = db.Column(db.Numeric(10, 2))
    fecha_limite = db.Column(db.DateTime)
    
    _estado_nombre = db.Column('estado_licitacion', db.String(50), nullable=False, default='NUEVA')
    
    supervisor_id = db.Column(db.Integer, nullable=True) 
    aprobada_por_supervisor = db.Column(db.Boolean, default=False)
    invitaciones_enviadas = db.Column(db.Boolean, default=False)
    motivo_rechazo = db.Column(db.Text, nullable=True)

    # Relación con todas las propuestas
    propuestas = db.relationship('PropuestaProveedor', backref='licitacion', lazy=True)

    propuesta_ganadora = db.relationship(
        'PropuestaProveedor', 
        primaryjoin="and_(Licitacion.id==PropuestaProveedor.licitacion_id, PropuestaProveedor.es_ganadora==True)",
        uselist=False, 
        viewonly=True
    )
    
    # ---------------------------
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._estado_actual = EstadoNueva(self)
        self._estado_nombre = self._estado_actual.get_nombre()
    
    @property
    def estado_actual(self):
        if not hasattr(self, '_estado_actual') or self._estado_actual is None:
            self._estado_actual = self._reconstruir_estado()
        return self._estado_actual
    
    def cambiar_estado(self, nuevo_estado):
        self._estado_actual = nuevo_estado
        self._estado_nombre = nuevo_estado.get_nombre()
    
    def siguiente_estado(self):
        # Hacemos flush para que la BD sepa que 'es_ganadora' cambió 
        db.session.flush() 
        nuevo_estado = self.estado_actual.siguiente()
        self.cambiar_estado(nuevo_estado)
    
    def cancelar(self):
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        self.cambiar_estado(EstadoCancelada(self))
        
    def _reconstruir_estado(self):

        nombre = self._estado_nombre
        
        # Imports locales para evitar ciclos
        from app.models.licitaciones.estados.estado_nueva import EstadoNueva
        from app.models.licitaciones.estados.estado_en_invitacion import EstadoEnInvitacion
        from app.models.licitaciones.estados.estado_con_propuestas import EstadoConPropuestas
        from app.models.licitaciones.estados.estado_en_evaluacion import EstadoEnEvaluacion
        from app.models.licitaciones.estados.estado_evaluacion_economia import EstadoEvaluacionEconomia
        from app.models.licitaciones.estados.estado_adjudicada import EstadoAdjudicada
        from app.models.licitaciones.estados.estado_con_contrato import EstadoConContrato
        from app.models.licitaciones.estados.estado_finalizada import EstadoFinalizada
        from app.models.licitaciones.estados.estado_cancelada import EstadoCancelada
        
        estados_map = {
            "NUEVA": EstadoNueva,
            "EN_INVITACION": EstadoEnInvitacion,
            "CON_PROPUESTAS": EstadoConPropuestas,
            "EVALUACION_TECNICA": EstadoEnEvaluacion,
            "EVALUACION_ECONOMIA": EstadoEvaluacionEconomia,
            "ADJUDICADA": EstadoAdjudicada,
            "CON_CONTRATO": EstadoConContrato,
            "FINALIZADA": EstadoFinalizada,
            "CANCELADA": EstadoCancelada
        }
        
        clase_estado = estados_map.get(nombre, EstadoNueva)
        return clase_estado(self)