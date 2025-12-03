def register_licitaciones_blueprints(app):
    """
    Registra todos los blueprints del módulo de licitaciones en la aplicación Flask.
    """
    from app.controllers.licitaciones.licitaciones_controller import licitaciones_bp
    from app.controllers.licitaciones.aprobacion_controller import aprobacion_bp
    from app.controllers.licitaciones.invitaciones_controller import invitaciones_bp
    from app.controllers.licitaciones.propuestas_controller import propuestas_bp
    from app.controllers.licitaciones.evaluaciones_controller import evaluaciones_bp
    from app.controllers.licitaciones.contrato_controller import contrato_bp
    from app.controllers.licitaciones.orden_compra_controller import orden_compra_bp
    
    app.register_blueprint(licitaciones_bp)
    app.register_blueprint(aprobacion_bp)
    app.register_blueprint(invitaciones_bp)
    app.register_blueprint(propuestas_bp)
    app.register_blueprint(evaluaciones_bp)
    app.register_blueprint(contrato_bp)
    app.register_blueprint(orden_compra_bp)


