from app.bdd import db
from flask import Blueprint, request, jsonify
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from app.services.facturasProveedor.editor_factura import EditorFactura
from app.services.facturasProveedor.conciliador import Conciliador
from app.services.facturasProveedor.integracion_cxp import IntegracionCxP
from app.services.facturasProveedor.validador_totales import ValidadorTotales
from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.linea_factura import LineaFactura
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.models.facturasProveedor.enums import DocTipo, EstadoFactura, Moneda
from app.services.facturasProveedor.factura_proveedor_service import FacturaProveedorService
from app.services.facturasProveedor.adjuntador_documento import AdjuntadorDocumento
from app.services.facturasProveedor.extractor_ocr import ExtractorOCR
from app.services.facturasProveedor.rellenador_automatico import RellenadorAutomatico
from app.services.facturasProveedor.extractor_xml import ExtractorXML
from app.services.facturasProveedor.integracion_cxp import IntegracionCxP


facturas_bp = Blueprint('facturas_proveedor', __name__)

# --------------- 1. Listar facturas (GET /facturas-proveedor) -----------------
@facturas_bp.route('/', methods=['GET'])
def listar_facturas():
    filtros = request.args.to_dict()
    service = FacturaProveedorService.get_instance()
    facturas = service.buscar(filtros)
    
    return jsonify([f.to_dict() for f in facturas]), 200


# ---------------- 2. Registrar nueva factura (POST /facturas-proveedor) -----------------
@facturas_bp.route('/', methods=['POST'])
def registrar_factura():
    data = request.get_json()
    
    # Validación básica: Verificar campos obligatorios
    if not data.get('fechaEmision') or not data.get('numeroFactura'):
        return jsonify({"error": "Faltan campos obligatorios (fechaEmision, numeroFactura)"}), 400

    nueva_factura = FacturaProveedor()
    
    # MAPEO: JSON (CamelCase) -> MODELO (SnakeCase)
    nueva_factura.numero_factura = data.get('numeroFactura')
    nueva_factura.proveedor_id = data.get('proveedorId')
    
    # Manejo de Fechas (String -> Date Object)
    try:
        if data.get('fechaEmision'):
            nueva_factura.fecha_emision = datetime.strptime(data.get('fechaEmision'), '%Y-%m-%d').date()
        
        if data.get('fechaVencimiento'):
            nueva_factura.fecha_vencimiento = datetime.strptime(data.get('fechaVencimiento'), '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

    # Manejo de Moneda
    moneda_str = data.get('moneda')
    if moneda_str:
        nueva_factura.moneda = Moneda[moneda_str]
    
    # Manejo de Estado
    estado_envio = data.get('estado')
    nueva_factura.estado = EstadoFactura[estado_envio] if estado_envio else EstadoFactura.BORRADOR

    # Procesar Líneas
    lineas_json = data.get('lineas', [])
    subtotal_acumulado = 0.0
    impuestos_acumulados = 0.0
    total_acumulado = 0.0
    
    for item in lineas_json:
        linea = LineaFactura()
        linea.descripcion = item.get('descripcion')
        linea.cantidad = item.get('cantidad')
        linea.precio_unitario = item.get('precioUnitario')
        linea.impuestos_linea = item.get('impuestosLinea', 0)
        linea.total_linea = item.get('totalLinea')
        
        subtotal_acumulado += float(linea.precio_unitario * linea.cantidad)
        impuestos_acumulados += float(linea.impuestos_linea)
        total_acumulado += float(linea.total_linea)
        nueva_factura.lineas.append(linea)
    
    nueva_factura.total = total_acumulado
    nueva_factura.subtotal = subtotal_acumulado
    nueva_factura.impuestos = impuestos_acumulados

    # Guardar
    try:
        editor = EditorFactura.get_instance()
        editor.registrar(nueva_factura)
        return jsonify(nueva_factura.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#--------------------- 2.1 Registrar Factura con Prellenado ------------------
@facturas_bp.route('/prellenado', methods=['POST'])
def crear_factura_con_prellenado():
    # 1. Validar Archivo
    if 'archivo' not in request.files:
        return jsonify({"error": "No se envió archivo"}), 400
    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({"error": "Nombre vacío"}), 400

    temp_path = None
    try:
        # 2. Guardar archivo temporalmente (Necesario para los extractores)
        filename = secure_filename(archivo.filename)
        temp_path = os.path.join("/tmp", filename)
        if os.name == 'nt': 
            temp_path = os.path.join(os.getcwd(), "temp", filename)
            os.makedirs(os.path.dirname(temp_path), exist_ok=True)
            
        archivo.save(temp_path)
        
        # Leemos los bytes para el adjuntador (Supabase)
        archivo.seek(0)
        contenido_bytes = archivo.read()

        # 3. Crear Instancia Inicial de Factura (Para tener ID)
        nueva_factura = FacturaProveedor()
        nueva_factura.estado = EstadoFactura.BORRADOR

        nueva_factura.numero_factura = f"TEMP-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        nueva_factura.proveedor_id = 0 
        # Usamos 0 o 1 como "Proveedor Desconocido" (Al no tener FK física, esto funciona)
        #TODO: ESto de proveedor se debe modificar

        nueva_factura.moneda = Moneda.PEN

        nueva_factura.fecha_emision = datetime.now().date()
        
        # Debemos guardar primero para obtener el ID, necesario para la carpeta en Supabase
        db.session.add(nueva_factura)
        db.session.commit()

        # 4. Preparar Documento Adjunto (Modelo)
        documento = DocumentoAdjunto()
        documento.nombre_archivo = filename
        documento.ruta = temp_path # Ruta local temporal para el extractor
        documento.factura_id = nueva_factura.id # Vinculamos
        
        # Seleccionar Estrategia
        extractor = None
        if filename.lower().endswith('.pdf'):
            documento.tipo = DocTipo.PDF
            extractor = ExtractorOCR()
        elif filename.lower().endswith('.xml'):
            documento.tipo = DocTipo.XML
            extractor = ExtractorXML()
        else:
            return jsonify({"error": "Formato no soportado"}), 400

        # 5. EJECUTAR EL RELLENADOR (Patrón Strategy + Facade implícito)
        rellenador = RellenadorAutomatico()
        adjuntador = AdjuntadorDocumento()
        
        rellenador.rellenar_automaticamente(
            factura=nueva_factura,
            documento=documento,
            adjuntador_tool=adjuntador,
            extractor=extractor,
            file_content=contenido_bytes
        )

        # 6. Guardar cambios finales (Datos extraídos + Info del adjunto)
        db.session.add(documento)
        db.session.add(nueva_factura)
        db.session.commit()

        return jsonify({
            "mensaje": "Factura creada y prellenada exitosamente",
            "factura": nueva_factura.to_dict(),
            "datos_extraidos_origen": "OCR/XML"
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error en prellenado: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # 7. Limpieza: Borrar archivo temporal
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
            print("🧹 Archivo temporal eliminado.")


# -------------- 3. Obtener detalle (GET /facturas-proveedor/{id}) -----------------
@facturas_bp.route('/<int:id_factura>', methods=['GET'])
def obtener_factura(id_factura):
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404
    return jsonify(factura.to_dict()), 200


#-------------------- 4.0 OBTENER ADJUNTOS (GET /facturas-proveedor/{id}/adjuntos) -----------------
@facturas_bp.route('/<int:id_factura>/adjuntos', methods=['GET'])
def listar_adjuntos(id_factura):
    # 1. Buscar si la factura existe
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404

    # 2. Obtener los adjuntos relacionados
    lista_adjuntos = []
    for doc in factura.documentos_adjuntos:
        lista_adjuntos.append({
            "id": doc.id,
            "nombre_archivo": doc.nombre_archivo,
            "tipo": doc.tipo.name if doc.tipo else "DESCONOCIDO",
            "url": doc.ruta,
            "fecha_carga": doc.fecha_carga.isoformat() if doc.fecha_carga else None
        })

    return jsonify(lista_adjuntos), 200

# ---------------- 4. Subir Adjunto (POST /facturas-proveedor/{id}/adjuntos) ----------------
@facturas_bp.route('/<int:id_factura>/adjuntos', methods=['POST'])
def subir_adjunto(id_factura):
    # 1. Buscar Factura
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404

    # 2. Validar archivo
    if 'archivo' not in request.files:
        return jsonify({"error": "No se envió el archivo"}), 400
    
    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({"error": "Nombre vacío"}), 400

    try:
        # 3. Preparar objeto (En memoria)
        nuevo_adjunto = DocumentoAdjunto()
        nuevo_adjunto.nombre_archivo = archivo.filename
        # Aseguramos el vínculo manual por si acaso
        nuevo_adjunto.factura_id = factura.id 
        
        # Detectar tipo
        if archivo.filename.lower().endswith('.pdf'):
            nuevo_adjunto.tipo = DocTipo.PDF
        elif archivo.filename.lower().endswith('.xml'):
            nuevo_adjunto.tipo = DocTipo.XML
        else:
            return jsonify({"error": "Formato no soportado"}), 400

        # 4. Leer bytes y subir a Supabase
        contenido_bytes = archivo.read()
        
        adjuntador = AdjuntadorDocumento()
        # Este método sube el archivo y actualiza 'nuevo_adjunto.ruta'
        adjuntador.adjuntar_documento(factura, nuevo_adjunto, contenido_bytes)

        print(f"Guardando adjunto en DB: {nuevo_adjunto.nombre_archivo} - Ruta: {nuevo_adjunto.ruta}")
        
        db.session.add(nuevo_adjunto)
        db.session.commit()
        
        return jsonify(nuevo_adjunto.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error en subida: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ------------- 5. Conciliar (POST /facturas-proveedor/{id}/conciliacion) ------------#
@facturas_bp.route('/<int:id_factura>/conciliacion', methods=['POST'])
def conciliar_factura(id_factura):
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404
        
    data = request.get_json()
    orden_compra_id = data.get('ordenCompraId')

    try:
        conciliador = Conciliador.get_instance()
        # La magia ocurre aquí dentro (Observer + Clonación)
        resultado = conciliador.conciliar(factura, orden_compra_id)
        
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------ 5.1 Obtener Resultados Conciliación (GET) ------------#
@facturas_bp.route('/<int:id_factura>/resultados-conciliacion', methods=['GET'])
def obtener_resultados_conciliacion(id_factura):
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404
    
    # Usando la relación que acabamos de crear
    resultados = [r.to_dict() for r in factura.resultados_conciliacion]
    return jsonify(resultados), 200


# ----------- 6. Trazabilidad (GET /facturas-proveedor/{id}/trazabilidad) ------------#
@facturas_bp.route('/<int:id_factura>/trazabilidad', methods=['GET'])
def ver_trazabilidad(id_factura):
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404
    
    # Asumiendo que configuraste la relación en el modelo:
    trazabilidad = [t.to_dict() for t in factura.trazabilidad]
    return jsonify(trazabilidad), 200


# --- 7. Crear Obligación Pago (POST /facturas-proveedor/{id}/obligacion-pago) ---
#
@facturas_bp.route('/<int:id_factura>/obligacion-pago', methods=['POST'])
def crear_obligacion(id_factura):
    factura = FacturaProveedor.query.get(id_factura)
    if not factura:
        return jsonify({"error": "Factura no encontrada"}), 404


    if factura.estado.name != 'APROBADA':
         return jsonify({"error": "La factura no está aprobada"}), 400

    integrador = IntegracionCxP()
    obligacion = integrador.crear_obligacion_pago(factura)
    integrador.enviar_obligacion_cxp(obligacion)

    return jsonify(obligacion.to_dict()), 201