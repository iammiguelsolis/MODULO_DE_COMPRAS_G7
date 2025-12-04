from app.services.facturasProveedor.interfaces.validador_factura import ValidadorFactura
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor

class ValidadorTotales(ValidadorFactura):
    
    def validar_totales(self, factura: FacturaProveedor):
        # Lógica interna específica de esta clase
        calculado = sum(linea.total_linea for linea in factura.lineas)
        diferencia = abs(factura.total - calculado)
        
        # Permitimos una diferencia de 0.01 por redondeo
        if diferencia > 0.01:
            raise ValueError(f"Error en totales: Cabecera={factura.total}, SumaLineas={calculado}")
        print("Validación de totales: OK")

    def validar_factura_proveedor(self, factura: FacturaProveedor) -> None:
        print("Iniciando ValidadorTotales...")
        
        try:
            self.validar_totales(factura)
            
            # Si todo está bien, pasamos al siguiente eslabón de la cadena
            if self._siguiente:
                self._siguiente.validar_factura_proveedor(factura)
                
        except ValueError as e:
            print(f"Validación fallida en Totales: {e}")
            # Aquí podrías actualizar el estado de la factura a 'OBSERVADA'
            raise e