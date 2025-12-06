from flask import Blueprint, request, jsonify
from app.bdd import db
from .orden_compra import OrdenCompra, LineaOC
from .oc_enums import EstadoOC, TipoPago, Moneda

oc_bp = Blueprint('ordenes_compra', __name__, url_prefix='/api/ordenes-compra')


def serialize_linea(linea: LineaOC):
    return {
        "id_linea_oc": linea.id_linea_oc,
        "producto_id": getattr(linea, "id_item", None),
        "cantidad": linea.cantidad,
        "precio_unitario": linea.precio_unitario,
        "subtotal": linea.precio_unitario * linea.cantidad,
        "estado": linea.estado.value if linea.estado else None,
    }

def serialize_orden(oc: OrdenCompra):
    return {
        "id_orden_compra": oc.id_orden_compra,
        "numero_referencia": oc.numero_referencia,
        "fecha_creacion": oc.fecha_creacion.isoformat() if oc.fecha_creacion else None,
        "estado": oc.estado.value if oc.estado else None,
        
        "tipo_origen": oc.tipo_origen.value if oc.tipo_origen else None,
        
        "id_proveedor": oc.id_proveedor,
        "id_solicitud": oc.id_solicitud,
        "id_notificacion_inventario": oc.id_notificacion_inventario,
        "moneda": oc.moneda.value if hasattr(oc.moneda, 'value') else oc.moneda,
        "condiciones_pago_dias_plazo": oc.condiciones_pago_dias_plazo,
        "condiciones_pago_modalidad": oc.condiciones_pago_modalidad.value if oc.condiciones_pago_modalidad else None,
        "terminos_entrega": oc.terminos_entrega,
        "fecha_entrega_esperada": oc.fecha_entrega_esperada.isoformat() if oc.fecha_entrega_esperada else None,
        "titulo": oc.titulo,
        "observaciones": oc.observaciones,
        "total": oc.calcular_total(),
        "lineas": [serialize_linea(l) for l in oc.lineas]
    }


# ---------- Rutas ----------

@oc_bp.route('/', methods=['GET'])
def listar_ordenes():
    estado_param = request.args.get('estado')       
    tipo_origen_param = request.args.get('tipo_origen')

    query = OrdenCompra.query

    if estado_param:
        try:
            estado_enum = EstadoOC[estado_param]
            query = query.filter(OrdenCompra.estado == estado_enum)
        except KeyError:
            return jsonify({"error": f"Estado inválido: {estado_param}"}), 400

    if tipo_origen_param:
        query = query.filter(OrdenCompra.tipo_origen == tipo_origen_param.upper())

    ordenes = query.order_by(OrdenCompra.fecha_creacion.desc()).all()

    resultado = []
    for oc in ordenes:
        resultado.append({
            "id": oc.id_orden_compra,
            "numero_referencia": oc.numero_referencia,
            "titulo": oc.titulo,
            "tipo_origen": oc.tipo_origen.value if oc.tipo_origen else None,
            
            "proveedor": oc.proveedor.razon_social if hasattr(oc.proveedor, 'razon_social') else getattr(oc.proveedor, 'nombre', None),
            "fecha_creacion": oc.fecha_creacion.isoformat() if oc.fecha_creacion else None,
            "estado": oc.estado.value if oc.estado else None,
            "moneda": oc.moneda.value if hasattr(oc.moneda, 'value') else oc.moneda,
            "total": oc.calcular_total()
        })

    return jsonify(resultado), 200


@oc_bp.route('/<int:id_orden>', methods=['GET'])
def obtener_orden(id_orden):
    """Obtiene una orden específica."""
    oc = OrdenCompra.query.get_or_404(id_orden)
    return jsonify(serialize_orden(oc)), 200


@oc_bp.route('/', methods=['POST'])
def crear_orden():
    """
    Crea una orden de compra desde el payload unificado del frontend.
    Espera algo como:

    {
      "tipoOrigen": "RFQ" | "LICITACION" | "DIRECTA",
      "proveedorId": 1,
      "solicitudId": 123,              # opcional
      "notificacionInventarioId": 99,  # opcional
      "moneda": "USD" | "PEN",
      "fechaEntregaEsperada": "2025-01-10",
      "condicionesPago": {
        "diasPlazo": 30,
        "modalidad": "CREDITO"
      },
      "terminosEntrega": "Entrega en almacén central",
      "observaciones": "texto",
      "titulo": "Compra de laptops",
      "lineas": [
        {
          "productId": "PRD-001",
          "name": "Laptop X",
          "quantity": 10,
          "unitPrice": 3500.5,
          "description": "i7, 16GB RAM"
        }
      ]
    }
    """
    data = request.get_json() or {}

    try:
        # Usar el servicio para crear la orden
        from .oc_services import OrdenCompraService
        
        nueva_oc = OrdenCompraService.crear_desde_frontend(data)

        return jsonify({
            "message": "Orden creada correctamente",
            "data": serialize_orden(nueva_oc)
        }), 201

    except Exception as e:
        # db.session.rollback() # El servicio ya hace commit, y si falla levanta excepcion.
        # Si el servicio falla antes del commit, el rollback global de flask o del servicio maneja.
        # Pero por seguridad en la ruta podemos hacer rollback si algo queda 'dangling', 
        # aunque el servicio debería ser atómico.
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@oc_bp.route('/<int:id_orden>/cerrar', methods=['PUT'])
def cerrar_orden(id_orden):
    """Cierra una orden si es posible."""
    oc = OrdenCompra.query.get_or_404(id_orden)

    try:
        oc.cambiar_estado(EstadoOC.CERRADA)
        db.session.commit()
        return jsonify({
            "message": "Orden cerrada",
            "data": serialize_orden(oc)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
