def register_licitaciones_blueprints(app):
    """
    Registra todos los blueprints del módulo de licitaciones en la aplicación Flask.
    """
    from .licitaciones import licitaciones_bp
    from .aprobacion import aprobacion_bp
    from .invitaciones import invitaciones_bp
    from .propuestas import propuestas_bp
    from .evaluaciones import evaluaciones_bp
    from .contrato import contrato_bp
    from .orden_compra import orden_compra_bp
    
    app.register_blueprint(licitaciones_bp)
    app.register_blueprint(aprobacion_bp)
    app.register_blueprint(invitaciones_bp)
    app.register_blueprint(propuestas_bp)
    app.register_blueprint(evaluaciones_bp)
    app.register_blueprint(contrato_bp)
    app.register_blueprint(orden_compra_bp)
    
    from .documentos import documentos_bp
    app.register_blueprint(documentos_bp)
