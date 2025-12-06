class EvaluacionProveedorError(Exception):
    """Error lanzado cuando ocurre una falla en la vinculación de proveedores por falla de integridad referencial de la FK"""
    def __init__(self, mensaje, proveedor_id=None):
        self.mensaje = mensaje
        self.proveedor_id = proveedor_id
        super().__init__(mensaje)
