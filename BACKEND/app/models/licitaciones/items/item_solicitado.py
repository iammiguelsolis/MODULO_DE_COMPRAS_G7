from app.bdd import db

class ItemSolicitado(db.Model):
    """
    Clase base para ítems solicitados en una licitación.
    Usa herencia polimórfica para distinguir entre Materiales y Servicios.
    """
    __tablename__ = 'items_solicitados'
    
    id_item = db.Column(db.Integer, primary_key=True)
    licitacion_id = db.Column(db.Integer, db.ForeignKey('licitaciones.id_licitacion'))
    tipo = db.Column(db.String(50))  # Discriminador para polimorfismo
    
    # Atributos comunes según diagrama (Abstracto)
    comentario = db.Column(db.Text)
    fecha_entrega = db.Column(db.Date)
    
    # Aquí guardamos los datos básicos del objeto referenciado
    codigo = db.Column(db.String(50))
    nombre = db.Column(db.String(255))
    
    __mapper_args__ = {
        'polymorphic_identity': 'item_solicitado',
        'polymorphic_on': tipo
    }
