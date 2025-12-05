from datetime import datetime
from typing import Any, Dict, List

from .oc_enums import TipoOrigen, Moneda, TipoPago


def parse_fecha(fecha_str: str):
    if not fecha_str:
        return None
    # Ajusta formato si tus fechas vienen distinto
    return datetime.strptime(fecha_str, "%Y-%m-%d").date()


def parse_items_from_origen(items: List[Dict[str, Any]]):
    """
    Convierte los ítems de RFQ/Licitación a algo que entienda LineaOC.
    Espera keys:
      - producto_id
      - descripcion
      - cantidad
      - precio_unitario
      - detalles (opcional)
    """
    resultado = []
    for item in items:
        resultado.append(
            {
                "id_item": item.get("producto_id"),
                "descripcion": item.get("descripcion"),
                "cantidad": item.get("cantidad", 0),
                "precio_unitario": item.get("precio_unitario", 0.0),
            }
        )
    return resultado


def parse_rfq_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "tipo_origen": TipoOrigen.RFQ,
        "id_origen": data["id_origen"],
        "id_solicitud": data.get("id_solicitud"),
        "proveedor_id": data["proveedor"]["id"],
        "moneda": Moneda[data.get("moneda", "PEN")],
        "fecha_entrega_esperada": parse_fecha(data.get("fecha_entrega_estimada")),
        "titulo": f"OC desde RFQ {data['id_origen']}",
        "observaciones": data.get("observaciones"),
        "items": parse_items_from_origen(data.get("items", [])),
        "condiciones_pago": {
            "modalidad": TipoPago.CONTADO,
            "dias_plazo": 0,
        },
        "terminos_entrega": "",
        "id_notificacion_inventario": None,
    }


def parse_licitacion_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "tipo_origen": TipoOrigen.LICITACION,
        "id_origen": data["id_origen"],
        "id_solicitud": data.get("id_solicitud"),
        "proveedor_id": data["proveedor"]["id"],
        "moneda": Moneda[data.get("moneda", "PEN")],
        "fecha_entrega_esperada": parse_fecha(
            data.get("fechaEntregaContrato") or data.get("contrato", {}).get("fecha_firmado")
        ),
        "titulo": f"OC desde Licitación {data['id_origen']}",
        "observaciones": data.get("observaciones"),
        "items": parse_items_from_origen(data.get("items", [])),
        "condiciones_pago": {
            "modalidad": TipoPago.CONTADO,
            "dias_plazo": 0,
        },
        "terminos_entrega": "",
        "id_notificacion_inventario": None,
    }


def parse_directa_notificacion_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    JSON esperado (pueden ajustarlo con tu equipo):
    {
      "origen": "DIRECTA",
      "id_origen": 999,          # id notificación
      "id_proveedor": 12,
      "producto_id": "PRD-001",
      "producto_nombre": "SSD 1TB",
      "cantidad_sugerida": 20,
      "moneda": "PEN"
    }
    """
    return {
        "tipo_origen": TipoOrigen.DIRECTA,
        "id_origen": data["id_origen"],
        "id_solicitud": None,
        "proveedor_id": data["id_proveedor"],
        "moneda": Moneda[data.get("moneda", "PEN")],
        "fecha_entrega_esperada": parse_fecha(data.get("fecha_entrega_esperada")),
        "titulo": f"OC Directa Notificación {data['id_origen']}",
        "observaciones": data.get("observaciones"),
        "items": [
            {
                "id_item": data.get("producto_id"),
                "descripcion": data.get("producto_nombre"),
                "cantidad": data.get("cantidad_sugerida", 0),
                "precio_unitario": data.get("precio_unitario", 0.0),
            }
        ],
        "condiciones_pago": {
            "modalidad": TipoPago.CONTADO,
            "dias_plazo": 0,
        },
        "terminos_entrega": "",
        "id_notificacion_inventario": data["id_origen"],
    }


def parse_frontend_orden_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convierte el body que manda tu frontend React a un formato estándar
    para crear OrdenCompra.
    Espera algo tipo:
    {
      "tipoOrigen": "RFQ" | "LICITACION" | "DIRECTA",
      "proveedorId": 1,
      "solicitudId": 123,
      "notificacionInventarioId": 9,
      "moneda": "USD",
      "fechaEntregaEsperada": "2025-01-10",
      "titulo": "..",
      "observaciones": "...",
      "condicionesPago": { "modalidad": "CONTADO", "diasPlazo": 0 },
      "terminosEntrega": "...",
      "lineas": [...]
    }
    """
    tipo = TipoOrigen[data["tipoOrigen"]]

    return {
        "tipo_origen": tipo,
        "id_origen": data.get("solicitudId") or data.get("notificacionInventarioId") or 0,
        "id_solicitud": data.get("solicitudId"),
        "proveedor_id": data["proveedorId"],
        "moneda": Moneda[data.get("moneda", "PEN")],
        "fecha_entrega_esperada": parse_fecha(data.get("fechaEntregaEsperada")),
        "titulo": data.get("titulo", "Orden de Compra"),
        "observaciones": data.get("observaciones"),
        "items": [
            {
                "id_item": linea.get("productId"),
                "descripcion": linea.get("name"),
                "cantidad": linea.get("quantity", 0),
                "precio_unitario": linea.get("unitPrice", 0.0),
            }
            for linea in data.get("lineas", [])
        ],
        "condiciones_pago": {
            "modalidad": TipoPago[data["condicionesPago"]["modalidad"]],
            "dias_plazo": data["condicionesPago"]["diasPlazo"],
        },
        "terminos_entrega": data.get("terminosEntrega", ""),
        "id_notificacion_inventario": data.get("notificacionInventarioId"),
    }


def parse_adquisicion_payload(compra, oferta_ganadora):

    items_payload = []
    
    for item in oferta_ganadora.items:
        descripcion = getattr(item, 'descripcion', 'Item sin descripción')
        
        items_payload.append({
            "id_item": str(item.id), 
            "descripcion": descripcion,
            "cantidad": item.cantidad_disponible if hasattr(item, 'cantidad_disponible') else 1,
            "precio_unitario": item.precio_oferta
        })

    tipo_origen = TipoOrigen.RFQ
    if getattr(compra, 'tipo_proceso', '') == 'LICITACION':
        tipo_origen = TipoOrigen.LICITACION

    return {
        "tipo_origen": tipo_origen,
        "id_origen": compra.id,               # ID del proceso de compra
        "id_solicitud": compra.solicitud_id,  # ID de la solicitud original
        "proveedor_id": oferta_ganadora.proveedor_id,
        "moneda": Moneda.PEN,                 # O determinar según oferta si tienes campo moneda
        "fecha_entrega_esperada": None,       # Se definirá en la edición de la OC
        "titulo": f"OC generada de Proceso #{compra.id}",
        "observaciones": f"Generado automáticamente desde oferta #{oferta_ganadora.id}. Comentarios: {oferta_ganadora.comentarios}",
        "condiciones_pago": {
            "modalidad": TipoPago.CONTADO,    # Default, editable luego
            "dias_plazo": 0
        },
        "items": items_payload,
        "terminos_entrega": "",
        "id_notificacion_inventario": None
    }