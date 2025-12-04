from app import create_app, db
from datetime import datetime, timedelta

# Importamos todos tus Modelos y Enums correctamente desde tu estructura
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.factura_trazabilidad import FacturaTrazabilidad
from app.models.facturasProveedor.resultado_conciliacion import ResultadoConciliacion
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.models.facturasProveedor.enums import EstadoFactura, Moneda, MotivoObservacion, EstadoConciliacion, DocTipo

app = create_app()

def seed():
    with app.app_context():
        print("🌱 Iniciando semillado de datos...")

        # 1. LIMPIEZA (Reset total de la BD 'facturas')
        # Usamos bind_key porque tus tablas están en 'facturas_db'
        print("   🧹 Limpiando tablas antiguas...")
        try:
            db.drop_all(bind_key='facturas_db')
            db.create_all(bind_key='facturas_db')
        except TypeError:
            # Fallback para versiones antiguas de SQLAlchemy si 'bind_key' falla
            db.drop_all(bind='facturas_db')
            db.create_all(bind='facturas_db')

        # ==============================================================================
        # ESCENARIO 1: EL "CAMINO FELIZ" (Factura F001-100)
        # ==============================================================================
        # Esta factura corresponde a la Orden de Compra OC-2023-500
        # Llegó, se validó y está lista para pagar.
        
        factura_ok = FacturaProveedor(
            numero_factura="F001-100",
            proveedor_id=50,  # ID simulado de proveedor
            orden_compra_id="OC-2023-500",
            fecha_emision=datetime.now().date(),
            fecha_vencimiento=(datetime.now() + timedelta(days=30)).date(),
            moneda=Moneda.PEN,
            subtotal=1000.00,
            impuestos=180.00,
            total=1180.00,
            estado=EstadoFactura.APROBADA, # Ya pasó la conciliación
            version=1,
            ha_sido_observada=False
        )

        # Líneas de la factura OK
        linea_ok_1 = LineaFactura(descripcion="Laptop Dell Latitude", cantidad=1, precio_unitario=1000.00, total_linea=1180.00)
        factura_ok.lineas.append(linea_ok_1)
        
        # Adjunto simulado
        adjunto_ok = DocumentoAdjunto(
            tipo=DocTipo.PDF, 
            nombre_archivo="factura_dell.pdf", 
            ruta="https://fake-supabase-url.com/factura_dell.pdf",
            tamano_bytes=1024
        )
        factura_ok.documentos_adjuntos.append(adjunto_ok)

        db.session.add(factura_ok)
        db.session.commit() # Guardamos para tener ID

        # Resultado de Conciliación Exitosa
        conciliacion_ok = ResultadoConciliacion(
            factura_proveedor_id=factura_ok.id,
            fecha=datetime.now(),
            resultado=EstadoConciliacion.CONCILIADA,
            nota="Conciliación exitosa contra OC-2023-500. Montos coinciden."
        )
        db.session.add(conciliacion_ok)

        # Trazabilidad de éxito (Log final)
        # Simulamos que al aprobarse se generó un log de éxito
        traza_ok = FacturaTrazabilidad(
            factura_id=factura_ok.id,
            proveedor_id=50,
            fecha_deteccion_error=datetime.now(),
            motivo=MotivoObservacion.NO_FUE_OBSERVADA, # Usando tu enum NO_FUE_OBSERVADA
            observacion_texto="Proceso finalizado correctamente. Aprobada."
        )
        db.session.add(traza_ok)
        db.session.commit()

        print("   ✅ Escenario 1 creado: Factura F001-100 (Exitosa)")


        # ==============================================================================
        # ESCENARIO 2: EL ERROR Y LA VERSIÓN (Factura F001-999)
        # ==============================================================================
        # Esta factura intentó pasar contra la Orden de Compra OC-2023-900.
        # Pero el proveedor cobró de más. Se RECHAZÓ (V1) y se creó una corrección (V2).
        
        # --- VERSIÓN 1: LA FALLIDA ---
        factura_fail_v1 = FacturaProveedor(
            numero_factura="F001-999",
            proveedor_id=88,
            orden_compra_id="OC-2023-900",
            fecha_emision=(datetime.now() - timedelta(days=5)).date(), # Fue hace 5 días
            fecha_vencimiento=(datetime.now() + timedelta(days=25)).date(),
            moneda=Moneda.USD,
            subtotal=5000.00, # Precio inflado (error)
            impuestos=0.0,
            total=5000.00,
            estado=EstadoFactura.RECHAZADA, # Quedó marcada como rechazada/observada
            version=1,
            ha_sido_observada=True,
            motivo_observacion=MotivoObservacion.PRECIOS_INCORRECTOS
        )
        
        linea_fail_1 = LineaFactura(descripcion="Servidor Rack", cantidad=1, precio_unitario=5000.00, total_linea=5000.00)
        factura_fail_v1.lineas.append(linea_fail_1)
        
        db.session.add(factura_fail_v1)
        db.session.commit() # Guardar V1 para tener ID

        # Conciliación Fallida V1
        conciliacion_fail = ResultadoConciliacion(
            factura_proveedor_id=factura_fail_v1.id,
            fecha=datetime.now() - timedelta(days=5),
            resultado=EstadoConciliacion.CON_DISCREPANCIA,
            nota="El precio unitario en OC es 4500.00, factura dice 5000.00"
        )
        db.session.add(conciliacion_fail)

        # Trazabilidad del Error V1 (Aquí se guarda la evidencia)
        traza_fail = FacturaTrazabilidad(
            factura_id=factura_fail_v1.id,
            proveedor_id=88,
            fecha_deteccion_error=datetime.now() - timedelta(days=5),
            motivo=MotivoObservacion.PRECIOS_INCORRECTOS,
            observacion_texto="Error detectado en versión 1. Estado: RECHAZADA"
        )
        db.session.add(traza_fail)
        db.session.commit()

        # --- VERSIÓN 2: LA CORREGIDA (CLON) ---
        # Simula que el sistema o el usuario corrigió el error creando una V2
        factura_fix_v2 = FacturaProveedor(
            numero_factura="F001-999", # Mismo número físico
            proveedor_id=88,
            orden_compra_id="OC-2023-900",
            fecha_emision=factura_fail_v1.fecha_emision,
            fecha_vencimiento=factura_fail_v1.fecha_vencimiento,
            moneda=Moneda.USD,
            subtotal=4500.00, # Precio CORREGIDO
            impuestos=0.0,
            total=4500.00,
            estado=EstadoFactura.BORRADOR, # Nace como borrador lista para re-procesar
            version=2, # Versión incrementada
            ha_sido_observada=False # Esta nueva versión está limpia
        )

        linea_fix_1 = LineaFactura(descripcion="Servidor Rack", cantidad=1, precio_unitario=4500.00, total_linea=4500.00)
        factura_fix_v2.lineas.append(linea_fix_1)
        
        # Copiamos el adjunto de la V1 a la V2
        adjunto_v2 = DocumentoAdjunto(
            tipo=DocTipo.PDF, 
            nombre_archivo="factura_server_v2.pdf", 
            ruta="https://fake-supabase-url.com/factura_server_v2.pdf",
            tamano_bytes=2048
        )
        factura_fix_v2.documentos_adjuntos.append(adjunto_v2)

        db.session.add(factura_fix_v2)
        db.session.commit()

        print("   ✅ Escenario 2 creado: Factura F001-999 (V1 con error, V2 corregida)")

        # ==============================================================================
        # ESCENARIO 3: PENDIENTE DE CONCILIACIÓN (Factura F002-XML)
        # ==============================================================================
        factura_pendiente = FacturaProveedor(
            numero_factura="F002-XML",
            proveedor_id=10,
            fecha_emision=datetime.now().date(),
            moneda=Moneda.USD,
            total=250.50,
            estado=EstadoFactura.EN_CONCILIACION,
            version=1
        )
        db.session.add(factura_pendiente)
        db.session.commit()
        print("   ✅ Escenario 3 creado: Factura F002-XML (Pendiente)")

        print("🎉 Semillado completado.")

if __name__ == '__main__':
    seed()