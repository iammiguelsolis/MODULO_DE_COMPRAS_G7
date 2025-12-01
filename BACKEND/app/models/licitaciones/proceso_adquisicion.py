from app.bdd import db

class ProcesoAdquisicion(db.Model):
    """
    Clase abstracta que representa un proceso de adquisición genérico.

    """
    __abstract__ = True
    
    # Atributos definidos en diagrama
    # estado: EstadoProceso (Manejado por las clases hijas como Licitacion.estado)
    # solicitudOrigen: Solicitud (Relación)
    # ofertasRecibidas: List<OfertaProveedor> (Manejado por hijas como Licitacion.propuestas)
    # propuestaGanadora: OfertaProveedor (Manejado por hijas)
    # notificador: NotificadorProveedor (Simplificado como tipo string por ahora)
    
    notificador_tipo = db.Column(db.String(50), nullable=True)
    
    # Relación con Solicitud (Origen)
    # Se define aquí para que Licitacion y Compra la hereden
    @property
    def solicitud_origen(self):
        raise NotImplementedError("Las subclases deben implementar la relación con Solicitud")
