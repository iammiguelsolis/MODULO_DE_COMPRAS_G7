from typing import Dict, Any, List

from app.bdd import db

from .orden_compra import OrdenCompra, LineaOC
from .oc_enums import EstadoOC
from .schemas import (
    parse_rfq_payload,
    parse_licitacion_payload,
    parse_directa_notificacion_payload,
    parse_frontend_orden_payload,
)


class OrdenCompraService:

    # ------------- helpers internos -------------

    @staticmethod
    def _crear_oc_desde_payload(payload: Dict[str, Any]) -> OrdenCompra:
        oc = OrdenCompra(
            tipo_origen=payload["tipo_origen"],
            id_origen=payload["id_origen"],
            id_solicitud=payload["id_solicitud"],
            id_notificacion_inventario=payload.get("id_notificacion_inventario"),
            id_proveedor=payload["proveedor_id"],
            moneda=payload["moneda"],
            fecha_entrega_esperada=payload["fecha_entrega_esperada"],
            titulo=payload["titulo"],
            observaciones=payload.get("observaciones"),
            condiciones_pago_modalidad=payload["condiciones_pago"]["modalidad"],
            condiciones_pago_dias_plazo=payload["condiciones_pago"]["dias_plazo"],
            terminos_entrega=payload.get("terminos_entrega", ""),
            estado=EstadoOC.BORRADOR,
        )

        # Crear líneas
        for item in payload["items"]:
            linea = LineaOC(
                id_item=item["id_item"],
                descripcion=item["descripcion"],
                cantidad=item["cantidad"],
                precio_unitario=item["precio_unitario"],
            )
            oc.lineas.append(linea)

        # Generar número referencia y guardar
        oc.generar_numero_referencia()
        db.session.add(oc)
        db.session.commit()

        return oc

    # ------------- métodos públicos -------------

    @staticmethod
    def crear_desde_rfq(data: Dict[str, Any]) -> OrdenCompra:
        payload = parse_rfq_payload(data)
        return OrdenCompraService._crear_oc_desde_payload(payload)

    @staticmethod
    def crear_desde_licitacion(data: Dict[str, Any]) -> OrdenCompra:
        payload = parse_licitacion_payload(data)
        return OrdenCompraService._crear_oc_desde_payload(payload)

    @staticmethod
    def crear_desde_notificacion_directa(data: Dict[str, Any]) -> OrdenCompra:
        payload = parse_directa_notificacion_payload(data)
        return OrdenCompraService._crear_oc_desde_payload(payload)

    @staticmethod
    def crear_desde_frontend(data: Dict[str, Any]) -> OrdenCompra:
        payload = parse_frontend_orden_payload(data)
        return OrdenCompraService._crear_oc_desde_payload(payload)

    @staticmethod
    def listar_todas() -> List[OrdenCompra]:
        return OrdenCompra.query.order_by(OrdenCompra.fecha_creacion.desc()).all()

    @staticmethod
    def obtener_por_id(id_oc: int) -> OrdenCompra | None:
        return OrdenCompra.query.get(id_oc)

    @staticmethod
    def cerrar_orden(id_oc: int) -> OrdenCompra:
        oc = OrdenCompra.query.get_or_404(id_oc)
        oc.cambiar_estado(EstadoOC.CERRADA)
        db.session.commit()
        return oc
