from app.bdd import db
from app.models.solicitudes.solicitud import Solicitud
from app.models.adquisiciones.proceso import Compra, ProcesoAdquisicion, EstadoProceso
from app.models.adquisiciones.oferta import OfertaProveedor, MaterialOfertado, ServicioOfertado
from app.patrones.notificadores import WhatsappFactory, CorreoFactory
from app.patrones.clasificadores import ClasificadorPor10000
from app.models.proveedor_inventario.dominio_proveedor import Proveedor 
from app.services.licitaciones.licitacion_service import LicitacionService
from app.models.OrdenCompra.oc_services import OrdenCompraService

class AdquisicionService:
    
    def __init__(self):
        self.clasificador = ClasificadorPor10000()
        # Instanciamos el servicio de licitaciones
        self.licitacion_service = LicitacionService() 

    def generar_proceso_compra(self, id_solicitud):
        solicitud = Solicitud.query.get(id_solicitud)
        if not solicitud:
            raise Exception("Solicitud no encontrada")

        proceso_existente = ProcesoAdquisicion.query.filter_by(solicitud_id=id_solicitud).first()
        if proceso_existente:
             return {
                  "tipo": proceso_existente.tipo_proceso,
                  "mensaje": "La solicitud ya tiene un proceso asociado.",
                  "data": proceso_existente
             }

        tipo_proceso = self.clasificador.determinar_tipo(solicitud)

        if tipo_proceso == "LICITACION":

            data_para_licitacion = {
                'solicitud_id': solicitud.id,
                'presupuesto_max': solicitud.calcular_total(),
                'fecha_limite': None
            }
            
            nueva_licitacion = self.licitacion_service.crear_licitacion(data_para_licitacion)
            
            return {
                "tipo": "LICITACION",
                "mensaje": "Se ha generado una Licitación en estado NUEVA con documentos por defecto.",
                "data": nueva_licitacion
            }

        else:
            nueva_compra = Compra(
                solicitud_id=solicitud.id,
                estado=EstadoProceso.NUEVO
            )
            db.session.add(nueva_compra)
            db.session.commit()
            
            return {
                "tipo": "COMPRA",
                "mensaje": "Proceso de Compra iniciado exitosamente.",
                "data": nueva_compra
            }

    def invitar_proveedores(self, id_compra, lista_ids_proveedores, tipo_canal='EMAIL'):
        """
        Recibe una lista de IDs de proveedores (integers), busca sus correos en la BD
        y envía las invitaciones.
        """
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        # 1. Resolver los IDs a Emails reales
        lista_destinatarios = []
        
        for id_prov in lista_ids_proveedores:
            proveedor = Proveedor.query.get(id_prov)
            
            if proveedor:
                if proveedor.email:
                    lista_destinatarios.append(proveedor.email)
                else:
                    print(f"Advertencia: El proveedor ID {id_prov} no tiene email registrado.")
            else:
                print(f"Advertencia: El proveedor ID {id_prov} no existe en la BD.")

        if not lista_destinatarios:
            raise Exception("No se encontraron destinatarios válidos (con email) para los IDs proporcionados.")

        # 2. Configurar la factoría según el canal
        if tipo_canal == 'WHATSAPP':
            factory = WhatsappFactory()
        else:
            factory = CorreoFactory()
            
        notificador = factory.crear_notificador()

        # 3. Delegar al modelo (que envía a la lista de strings/emails)
        compra.invitar_proveedores(lista_destinatarios, notificador)
        db.session.commit()
        
        return compra
    def registrar_oferta(self, id_compra, data_json):
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        if compra.estado == EstadoProceso.CERRADO:
            raise Exception("La compra está cerrada. No se pueden registrar más ofertas.")

        from app.models.proveedor_inventario.dominio_proveedor import Proveedor

        id_proveedor = data_json.get('id_proveedor')
        nombre_proveedor_texto = data_json.get('proveedor')

        if not id_proveedor:
            raise Exception("Debe enviarse el ID del proveedor")

        proveedor_obj = Proveedor.query.get(id_proveedor)
        if not proveedor_obj:
            raise Exception(f"No existe un proveedor con el ID {id_proveedor}")

        nombre_proveedor_texto = proveedor_obj.razon_social

        oferta_existente = OfertaProveedor.query.filter_by(
            proceso_id=compra.id,
            proveedor_id=id_proveedor
        ).first()

        if oferta_existente:
            raise Exception("Este proveedor ya registró una oferta en este proceso.")

        oferta = OfertaProveedor(
            proceso_id=compra.id,
            proveedor_id=id_proveedor,
            nombre_proveedor=nombre_proveedor_texto,
            monto_total=data_json['monto_total'],
            comentarios=data_json.get('comentarios', '')
        )

        items_data = data_json.get('items', [])

        for item in items_data:
            tipo = item.get('tipo')

            if tipo == 'MATERIAL':
                nuevo_item = MaterialOfertado(
                    precio_oferta=item['precio'],
                    descripcion=item['descripcion'],
                    marca=item.get('marca'),
                    cantidad_disponible=item.get('cantidad')
                )
            elif tipo == 'SERVICIO':
                nuevo_item = ServicioOfertado(
                    precio_oferta=item['precio'],
                    descripcion=item['descripcion'],
                    dias_ejecucion=item.get('dias'),
                    experiencia_tecnico=item.get('experiencia')
                )
            else:
                continue

            oferta.items.append(nuevo_item)

        if compra.estado == EstadoProceso.INVITANDO:
            compra.estado = EstadoProceso.EVALUANDO

        db.session.add(oferta)
        db.session.commit()

        return oferta
    def elegir_ganador(self, id_compra, id_oferta_ganadora):
        import traceback
        # Importamos datetime para calcular una fecha por defecto
        from datetime import datetime, timedelta

        # 1. Validaciones iniciales
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        oferta = OfertaProveedor.query.get(id_oferta_ganadora)
        if not oferta:
            raise Exception("Oferta no encontrada")
        
        if oferta.proceso_id != compra.id:
            raise Exception("La oferta seleccionada no pertenece a esta compra.")
            
        try:
            compra.seleccionar_ganador(oferta)
            db.session.flush() 
            print(f"--- [DEBUG] Iniciando integración OC para Compra #{id_compra} ---")

            from app.models.OrdenCompra.oc_services import OrdenCompraService
            from app.models.OrdenCompra.oc_enums import TipoOrigen, Moneda, TipoPago

            items_payload = []
            for item in oferta.items:
                cantidad = 1
                if hasattr(item, 'cantidad_disponible') and item.cantidad_disponible is not None:
                    cantidad = item.cantidad_disponible
                
                desc = getattr(item, 'descripcion', 'Item sin descripción')

                items_payload.append({
                    "id_item": str(item.id), 
                    "descripcion": desc,
                    "cantidad": cantidad,
                    "precio_unitario": float(item.precio_oferta)
                })

            tipo_origen_enum = TipoOrigen.RFQ
            if getattr(compra, 'tipo_proceso', '') == 'LICITACION':
                tipo_origen_enum = TipoOrigen.LICITACION

            fecha_default = datetime.now().date() + timedelta(days=90)

            payload_oc = {
                "tipo_origen": tipo_origen_enum,
                "id_origen": compra.id,
                "id_solicitud": compra.solicitud_id,
                "proveedor_id": oferta.proveedor_id,
                "moneda": Moneda.PEN,
                
                "fecha_entrega_esperada": fecha_default, 
                
                "titulo": f"Orden de Compra - Ref. Solicitud #{compra.solicitud_id}",
                "observaciones": f"Generado desde oferta #{oferta.id}",
                "condiciones_pago": {
                    "modalidad": TipoPago.CONTADO,
                    "dias_plazo": 0
                },
                "items": items_payload,
                "terminos_entrega": "A tratar",
                "id_notificacion_inventario": None
            }

            oc_service = OrdenCompraService()
            nueva_oc = oc_service._crear_oc_desde_payload(payload_oc)
            
            print(f"--- [DEBUG] OC Creada Exitosamente: {nueva_oc.numero_referencia} ---")

            db.session.commit()
            return compra

        except Exception as e:
            db.session.rollback()
            print("\n" + "="*50)
            print(" ERROR CRÍTICO AL INTEGRAR OC ")
            traceback.print_exc()
            print("="*50 + "\n")
            raise Exception(f"Error interno: {str(e)}")
          
    def listar_procesos(self):

        procesos = ProcesoAdquisicion.query.all()

        resultado = []
        for p in procesos:

            ofertas = OfertaProveedor.query.filter_by(proceso_id=p.id).all()

            resultado.append({
                "id": p.id,
                "solicitud_id": p.solicitud_id,
                "tipo_proceso": p.tipo_proceso,
                "estado": p.estado,
                "fecha_creacion": p.fecha_creacion,
                "ganador_id": p.oferta_ganadora_id,
                "ofertas": [o.to_dict() for o in ofertas]
            })

        return resultado

    def obtener_proceso(self, id_proceso):

        p = ProcesoAdquisicion.query.get(id_proceso)
        if not p:
            raise Exception("Proceso no encontrado")

        ofertas = OfertaProveedor.query.filter_by(proceso_id=p.id).all()

        return {
            "id": p.id,
            "solicitud_id": p.solicitud_id,
            "tipo_proceso": p.tipo_proceso,
            "estado": p.estado,
            "fecha_creacion": p.fecha_creacion,
            "ganador_id": p.oferta_ganadora_id,
            "ofertas": [o.to_dict() for o in ofertas]   # ✅ USAMOS to_dict()
        }

    def obtener_oferta_por_adquisicion(self, id_compra, id_oferta):
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        oferta = OfertaProveedor.query.get(id_oferta)
        if not oferta:
            raise Exception("Oferta no encontrada")

        # ✅ VALIDACIÓN DE SEGURIDAD: que pertenezca a la compra
        if oferta.proceso_id != compra.id:
            raise Exception("Esta oferta no pertenece a esta adquisición")

        return oferta.to_dict()
      
    def obtener_ofertas_por_adquisicion(self, id_compra):
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        ofertas = OfertaProveedor.query.filter_by(proceso_id=id_compra).all()

        return [oferta.to_dict() for oferta in ofertas]

