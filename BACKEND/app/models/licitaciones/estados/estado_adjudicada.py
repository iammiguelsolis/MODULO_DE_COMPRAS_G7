from app.licitaciones.models.estados.estado_licitacion_state import EstadoLicitacionState

class EstadoAdjudicada(EstadoLicitacionState):
    """
    Estado ADJUDICADA: Proveedor ganador seleccionado.
    Espera la subida del contrato firmado para pasar a CON_CONTRATO.
    """
    
    def get_nombre(self):
        return "ADJUDICADA"
    
    def siguiente(self):
        """
        Transición a CON_CONTRATO cuando se sube el contrato.
        """
        # Verificar que existe un contrato asociado
        if not self.licitacion.contrato_generado:
            raise ValueError("No se puede avanzar sin subir el contrato firmado")
        
        from app.licitaciones.models.estados.estado_con_contrato import EstadoConContrato
        return EstadoConContrato(self.licitacion)
    
    def subir_contrato(self, documento_url):
        """
        Acción específica de este estado: subir contrato firmado.
        """
        # El servicio creará el registro Contrato en BD
        # y marcará el flag contrato_generado
        self.licitacion.contrato_generado = True
        return True
