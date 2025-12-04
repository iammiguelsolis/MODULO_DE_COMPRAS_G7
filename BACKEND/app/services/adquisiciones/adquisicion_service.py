from app.bdd import db
from app.models.solicitudes.solicitud import Solicitud
from app.models.adquisiciones.proceso import Compra, ProcesoAdquisicion, EstadoProceso
from app.models.adquisiciones.oferta import OfertaProveedor, MaterialOfertado, ServicioOfertado
from app.patrones.notificadores import WhatsappFactory, CorreoFactory
from app.patrones.clasificadores import ClasificadorPorMonto
from app.models.proveedor_inventario.dominio_proveedor import Proveedor 
from app.services.licitaciones.licitacion_service import LicitacionService

class AdquisicionService:
    
    def __init__(self):
        self.clasificador = ClasificadorPorMonto()
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
            raise Exception("La compra está cerrada.")

        # --- MODIFICACIÓN: Obtener Proveedor Real por ID ---
        # Importamos aquí para evitar ciclos o asegurarnos que el modelo está disponible
        from app.models.proveedor_inventario.dominio_proveedor import Proveedor
        
        id_proveedor = data_json.get('id_proveedor')
        nombre_proveedor_texto = data_json.get('proveedor') # Respaldo si no mandan ID (opcional)

        # Validamos que el proveedor exista si mandan el ID
        if id_proveedor:
            proveedor_obj = Proveedor.query.get(id_proveedor)
            if not proveedor_obj:
                raise Exception(f"No existe un proveedor con el ID {id_proveedor}")
            # Actualizamos el nombre con la razón social real de la BD
            nombre_proveedor_texto = proveedor_obj.razon_social
        # --------------------------------------------------

        oferta = OfertaProveedor(
            proceso_id=compra.id,
            proveedor_id=id_proveedor,          # Guardamos la relación (FK)
            nombre_proveedor=nombre_proveedor_texto, # Guardamos el nombre como histórico
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

        compra.estado = EstadoProceso.EVALUANDO 
        db.session.add(oferta)
        db.session.commit()
        return oferta

    def elegir_ganador(self, id_compra, id_oferta_ganadora):
        compra = Compra.query.get(id_compra)
        if not compra:
            raise Exception("Proceso de compra no encontrado")

        oferta = OfertaProveedor.query.get(id_oferta_ganadora)
        if not oferta:
            raise Exception("Oferta no encontrada")
        
        if oferta.proceso_id != compra.id:
            raise Exception("La oferta seleccionada no pertenece a esta compra.")
            
        # Al seleccionar ganador, el estado pasa a CERRADO
        compra.seleccionar_ganador(oferta)
        
        db.session.commit()
        
        return compra
      
    def listar_procesos(self):

        procesos = ProcesoAdquisicion.query.all()

        resultado = []
        for p in procesos:


            ofertas = OfertaProveedor.query.filter_by(proceso_id=p.id).all()

            ofertas_serializadas = []
            for o in ofertas:
                items = []
                for item in o.items:
                    items.append({
                        "id": item.id,
                        "tipo": item.__class__.__name__,
                        "precio": item.precio_oferta,
                        "descripcion": item.descripcion,
                        "extra": {
                            "marca": getattr(item, "marca", None),
                            "cantidad_disponible": getattr(item, "cantidad_disponible", None),
                            "dias_ejecucion": getattr(item, "dias_ejecucion", None),
                            "experiencia_tecnico": getattr(item, "experiencia_tecnico", None),
                        }
                    })

                ofertas_serializadas.append({
                    "id": o.id,
                    "proveedor": o.nombre_proveedor,
                    "monto_total": o.monto_total,
                    "comentarios": o.comentarios,
                    "items": items
                })

            resultado.append({
                "id": p.id,
                "solicitud_id": p.solicitud_id,
                "tipo_proceso": p.tipo_proceso,
                "estado": p.estado,
                "fecha_creacion": p.fecha_creacion,
                "ganador_id": p.oferta_ganadora_id,
                "ofertas": ofertas_serializadas
            })

        return resultado


    def obtener_proceso(self, id_proceso):

        p = ProcesoAdquisicion.query.get(id_proceso)
        if not p:
            raise Exception("Proceso no encontrado")

        ofertas = OfertaProveedor.query.filter_by(proceso_id=p.id).all()

        ofertas_serializadas = []
        for o in ofertas:
            items = []
            for item in o.items:
                items.append({
                    "id": item.id,
                    "tipo": item.__class__.__name__,
                    "precio": item.precio_oferta,
                    "descripcion": item.descripcion,
                    "extra": {
                        "marca": getattr(item, "marca", None),
                        "cantidad_disponible": getattr(item, "cantidad_disponible", None),
                        "dias_ejecucion": getattr(item, "dias_ejecucion", None),
                        "experiencia_tecnico": getattr(item, "experiencia_tecnico", None),
                    }
                })

            ofertas_serializadas.append({
                "id": o.id,
                "proveedor": o.nombre_proveedor,
                "monto_total": o.monto_total,
                "comentarios": o.comentarios,
                "items": items
            })

        return {
            "id": p.id,
            "solicitud_id": p.solicitud_id,
            "tipo_proceso": p.tipo_proceso,
            "estado": p.estado,
            "fecha_creacion": p.fecha_creacion,
            "ganador_id": p.oferta_ganadora_id,
            "ofertas": ofertas_serializadas
        }
