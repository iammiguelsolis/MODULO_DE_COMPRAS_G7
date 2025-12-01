from app.bdd import db
from datetime import datetime
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.factura_trazabilidad import FacturaTrazabilidad
from app.models.facturasProveedor.enums import EstadoFactura, MotivoObservacion
from app.services.facturasProveedor.orden_compra_service import OrdenCompraService
from app.models.facturasProveedor.resultado_conciliacion import ResultadoConciliacion
from app.models.facturasProveedor.enums import EstadoConciliacion
from app.services.facturasProveedor.interfaces.i_conciliador import IConciliador

class Conciliador(IConciliador):
    _instance = None

    def __init__(self):
        if Conciliador._instance is not None:
            raise Exception("Singleton activo. Usa get_instance().")

    @staticmethod
    def get_instance():
        if Conciliador._instance is None:
            Conciliador._instance = Conciliador()
        return Conciliador._instance

    def conciliar(self, factura: FacturaProveedor, orden_compra_id: str):
        print(f"⚖️ Conciliando Factura {factura.id} vs OC {orden_compra_id}...")
        
        # 0. Validación de Estado: No permitir conciliar si ya fue observada/conciliada
        if factura.estado in [EstadoFactura.EN_CONCILIACION, EstadoFactura.APROBADA, EstadoFactura.ENVIADA_CXP]:
             return {
                "resultado": "ERROR_ESTADO",
                "mensaje": f"La factura {factura.id} ya se encuentra en estado {factura.estado.name} y no puede ser conciliada nuevamente."
            }

        # 1. Obtener datos de Orden de Compra (Simulado)
        oc_service = OrdenCompraService.get_instance()
        orden_compra = oc_service.obtener_orden_compra(orden_compra_id)
        
        # 2. Comparar datos
        discrepancias = []
        
        # Comparación de Moneda
        if factura.moneda and orden_compra.get('moneda') != factura.moneda.name:
            print(f"Moneda no coincide: Factura {factura.moneda.name} vs OC {orden_compra.get('moneda')}")
            discrepancias.append(f"Moneda no coincide: Factura {factura.moneda.name} vs OC {orden_compra.get('moneda')}")
            
        # Comparación de Totales (con tolerancia pequeña por decimales)
        total_oc = float(orden_compra.get('total', 0))
        total_factura = float(factura.total)
        diferencia = abs(total_oc - total_factura)
        
        if diferencia > 0.01:
            print(f"Total no coincide: Factura {total_factura} vs OC {total_oc}")
            discrepancias.append(f"Total no coincide: Factura {total_factura} vs OC {total_oc}")

        # 3. Registrar Resultado
        resultado = ResultadoConciliacion()
        resultado.factura_proveedor_id = factura.id
        resultado.fecha = datetime.utcnow().date()
        
        if discrepancias:
            resultado.resultado = EstadoConciliacion.CON_DISCREPANCIA
            resultado.nota = "; ".join(discrepancias)
            
            # Lógica de Discrepancia
            factura.estado = EstadoFactura.EN_CONCILIACION
            factura.motivo_observacion = MotivoObservacion.PRECIOS_INCORRECTOS # O determinar según el tipo de error
            factura.ha_sido_observada = True
            
            # Notificar (Trazabilidad)
            observador_trazabilidad = FacturaTrazabilidad()
            factura.add_observer(observador_trazabilidad)
            print("Observador agregado")
            factura.notify(factura)
            
            db.session.add(resultado)
            db.session.commit()
            
            # Clonación para corrección
            print("   🔄 Generando nueva versión (clon) para corrección...")
            nueva_version = self._crear_clon_factura(factura)
            db.session.add(nueva_version)
            db.session.commit()
            
            return {
                "resultado": "CON_DISCREPANCIA",
                "mensaje": f"Discrepancias encontradas: {resultado.nota}",
                "nueva_version_id": nueva_version.id
            }
            
        else:
            # Camino Feliz
            resultado.resultado = EstadoConciliacion.CONCILIADA
            resultado.nota = "Conciliación exitosa"
            
            factura.estado = EstadoFactura.APROBADA # O ENVIADA_CXP según flujo
            
            # Notificar (Trazabilidad)
            observador_trazabilidad = FacturaTrazabilidad()
            factura.add_observer(observador_trazabilidad)
            factura.notify(factura)
            
            db.session.add(resultado)
            db.session.commit()
            
            return {"resultado": "CONCILIADA", "mensaje": "Factura conciliada correctamente"}

    def _crear_clon_factura(self, original: FacturaProveedor):
        """Método auxiliar para copiar datos a una nueva instancia (Versión N+1)"""
        clon = FacturaProveedor()
        # Copiamos datos básicos
        clon.numero_factura = original.numero_factura
        clon.proveedor_id = original.proveedor_id
        clon.fecha_emision = original.fecha_emision
        clon.fecha_vencimiento = original.fecha_vencimiento
        clon.moneda = original.moneda
        clon.total = original.total
        
        # Lógica de versión
        clon.version = (original.version or 1) + 1
        clon.estado = EstadoFactura.BORRADOR # Nace limpia para ser corregida
        clon.ha_sido_observada = False # La nueva nace limpia
        
        # Clonamos líneas (Deep Copy)
        for linea_orig in original.lineas:
            nueva_linea = LineaFactura()
            nueva_linea.descripcion = linea_orig.descripcion
            nueva_linea.cantidad = linea_orig.cantidad
            nueva_linea.precio_unitario = linea_orig.precio_unitario
            nueva_linea.total_linea = linea_orig.total_linea
            clon.lineas.append(nueva_linea)
            
        return clon