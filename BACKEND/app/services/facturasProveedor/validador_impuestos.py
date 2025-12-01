from app.services.facturasProveedor.interfaces.validador_factura import ValidadorFactura
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor

class ValidadorImpuestos(ValidadorFactura):
    
    def validar_impuestos(self, factura: FacturaProveedor):
        """
        Lógica para validar que los impuestos calculados coincidan
        con las reglas tributarias configuradas.
        """
        print("Validando impuestos de la factura...")
        
        # 1. Validar consistencia entre líneas y cabecera
        impuestos_calculados = sum(linea.impuestos_linea for linea in factura.lineas)
        diferencia = abs(factura.impuestos - impuestos_calculados)
        
        if diferencia > 0.01:
            raise ValueError(f"Error en impuestos: Cabecera={factura.impuestos}, SumaLineas={impuestos_calculados}")
            
        # 2. Validar consistencia aritmética (Subtotal + Impuestos = Total)
        suma_aritmetica = factura.subtotal + factura.impuestos
        diferencia_total = abs(factura.total - suma_aritmetica)
        
        if diferencia_total > 0.01:
             raise ValueError(f"Inconsistencia aritmética: Subtotal({factura.subtotal}) + Impuestos({factura.impuestos}) != Total({factura.total})")
             
        print("Validación de impuestos: OK")

    def validar_factura_proveedor(self, factura: FacturaProveedor) -> None:
        print("Iniciando ValidadorImpuestos...")
        
        try:
            self.validar_impuestos(factura)
            
            # Si todo está bien, pasamos al siguiente eslabón de la cadena
            if self._siguiente:
                self._siguiente.validar_factura_proveedor(factura)
                
        except ValueError as e:
            print(f"Validación fallida en Impuestos: {e}")
            raise e