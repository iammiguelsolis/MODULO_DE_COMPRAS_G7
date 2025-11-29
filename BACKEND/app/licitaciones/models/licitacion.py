from app.bdd import db
from app.licitaciones.models.estados.estado_borrador import EstadoBorrador
from app.licitaciones.models.estados.estado_nueva import EstadoNueva
from app.licitaciones.models.estados.estado_cancelada import EstadoCancelada
# Importar otros estados aquí a medida que se creen, o usar importación dinámica/local en _reconstruir_estado

class Licitacion(db.Model):
    """
    Modelo de Licitación que actúa como Contexto del patrón State.
    Almacena el estado actual y delega el comportamiento a la instancia del estado.
    """
    __tablename__ = 'licitaciones'
    
    id_licitacion = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    presupuesto_maximo = db.Column(db.Numeric(10, 2))
    fecha_limite = db.Column(db.DateTime)
    fecha_creacion = db.Column(db.DateTime)
    
    # Persistencia del nombre del estado en BD
    _estado_nombre = db.Column('estado', db.String(50), nullable=False, default='BORRADOR')
    
    # Relaciones (Foreign Keys)
    # Nota: Asumimos que existen las tablas 'solicitudes' y 'usuarios' o se crearán.
    # Si no existen aún, estas FKs podrían fallar al crear las tablas si no se definen los modelos.
    # Por ahora definimos las columnas como Integer simples si los modelos externos no están listos,
    # o ForeignKey si ya existen. Seguiremos el plan usando ForeignKey asumiendo que existirán.
    solicitud_id = db.Column(db.Integer, nullable=True) # db.ForeignKey('solicitudes.id_solicitud')
    comprador_id = db.Column(db.Integer, nullable=True) # db.ForeignKey('usuarios.id_usuario')
    supervisor_id = db.Column(db.Integer, nullable=True) # db.ForeignKey('usuarios.id_usuario')
    
    # Campos de control para lógica de estados
    aprobada_por_supervisor = db.Column(db.Boolean, default=False)
    invitaciones_enviadas = db.Column(db.Boolean, default=False)
    contrato_generado = db.Column(db.Boolean, default=False)
    comentarios_supervisor = db.Column(db.Text, nullable=True)
    motivo_rechazo = db.Column(db.Text, nullable=True)
    
    # Relaciones
    propuestas = db.relationship('PropuestaProveedor', backref='licitacion', lazy=True)
    propuesta_ganadora = db.relationship('PropuestaProveedor', 
                                       primaryjoin="and_(Licitacion.id_licitacion==PropuestaProveedor.licitacion_id, PropuestaProveedor.es_ganadora==True)",
                                       uselist=False, viewonly=True)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Inicializa el estado en memoria
        self._estado_actual = EstadoBorrador(self)
        self._estado_nombre = self._estado_actual.get_nombre()
    
    @property
    def estado_actual(self):
        """
        Retorna la instancia del estado actual (Objeto State).
        Si no está en memoria, lo reconstruye a partir del nombre guardado en BD.
        """
        if not hasattr(self, '_estado_actual') or self._estado_actual is None:
            self._estado_actual = self._reconstruir_estado()
        return self._estado_actual
    
    def cambiar_estado(self, nuevo_estado):
        """
        Cambia al nuevo estado y actualiza el nombre para persistencia.
        """
        self._estado_actual = nuevo_estado
        self._estado_nombre = nuevo_estado.get_nombre()
    
    def siguiente_estado(self):
        """
        Avanza al siguiente estado delegando la lógica al estado actual.
        """
        nuevo_estado = self.estado_actual.siguiente()
        self.cambiar_estado(nuevo_estado)
    
    def cancelar(self):
        """
        Fuerza la transición al estado CANCELADA.
        """
        self.cambiar_estado(EstadoCancelada(self))
        
    def _reconstruir_estado(self):
        """
        Factory method que instancia la clase de estado correcta según _estado_nombre.
        """
        nombre = self._estado_nombre
        
        # Importación local para evitar ciclos
        from app.licitaciones.models.estados.estado_borrador import EstadoBorrador
        from app.licitaciones.models.estados.estado_nueva import EstadoNueva
        from app.licitaciones.models.estados.estado_en_invitacion import EstadoEnInvitacion
        from app.licitaciones.models.estados.estado_con_propuestas import EstadoConPropuestas
        from app.licitaciones.models.estados.estado_en_evaluacion import EstadoEnEvaluacion
        from app.licitaciones.models.estados.estado_evaluacion_economia import EstadoEvaluacionEconomia
        from app.licitaciones.models.estados.estado_adjudicada import EstadoAdjudicada
        from app.licitaciones.models.estados.estado_con_contrato import EstadoConContrato
        from app.licitaciones.models.estados.estado_finalizada import EstadoFinalizada
        from app.licitaciones.models.estados.estado_cancelada import EstadoCancelada
        
        estados_map = {
            "BORRADOR": EstadoBorrador,
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
        
        clase_estado = estados_map.get(nombre, EstadoBorrador)
        return clase_estado(self)
