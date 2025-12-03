class OrdenCompraService:
    _instance = None

    @staticmethod
    def get_instance():
        if OrdenCompraService._instance is None:
            OrdenCompraService._instance = OrdenCompraService()
        return OrdenCompraService._instance

    def obtener_orden_compra(self, orden_id: str):
        """
        Simula la obtención de una orden de compra desde otro módulo o servicio externo.
        Retorna un diccionario con los datos relevantes para la conciliación.
        """
        # Simulación de datos basada en el ID
        # Si el ID termina en '999', simulamos una discrepancia
        
        if orden_id == "OC-FAIL":
            # Caso de prueba para discrepancia
            return {
                "id": orden_id,
                "total": 500.00, # Valor diferente para forzar error
                "moneda": "USD",
                "estado": "APROBADA"
            }
        
        # Caso por defecto (éxito)
        # Asumimos que devuelve datos que coincidirán con la factura de prueba
        # Ojo: Para que coincida dinámicamente, en un caso real consultaríamos DB.
        # Aquí retornamos valores genéricos, el conciliador deberá manejarlo.
        return {
            "id": orden_id,
            "total": 3068.0, # Valor ejemplo
            "moneda": "PEN",
            "estado": "APROBADA"
        }
