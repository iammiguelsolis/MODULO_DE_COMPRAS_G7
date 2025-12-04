from app.services.facturasProveedor.interfaces.creador_obligacion import CreadorObligacion
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.obligacion_pago import ObligacionPago
from app.models.facturasProveedor.enums import EstadoPago

class IntegracionCxP(CreadorObligacion):
    
    def crear_obligacion_pago(self, factura: FacturaProveedor) -> ObligacionPago:
        print(f"Generando obligación de pago para factura {factura.numero_factura}...")
        
        # Mapeo de datos (Mapping)
        obligacion = ObligacionPago()
        obligacion.factura_id = factura.id
        obligacion.numero_factura = factura.numero_factura
        obligacion.proveedor_id = factura.proveedor_id
        obligacion.fecha_emision = factura.fecha_emision
        obligacion.fecha_vencimiento = factura.fecha_vencimiento
        obligacion.moneda = factura.moneda
        obligacion.subtotal = factura.subtotal
        obligacion.impuestos = factura.impuestos
        obligacion.estado_pago = EstadoPago.PENDIENTE
        
        return obligacion

    def enviar_obligacion_cxp(self, obligacion: ObligacionPago) -> dict:
        # Aquí iría la llamada HTTP o SOAP al sistema ERP (SAP, Oracle, etc.)
        print(f"Enviando Obligación {obligacion.id} al sistema de Cuentas por Pagar (CxP)...")
        
        # Simulación de éxito
        return {
            "status": "exito",
            "mensaje": "Obligación enviada correctamente a CxP",
            "sistema_destino": "ERP_SAP_MOCK",
            "obligacion_generada": obligacion.to_dict()
        }