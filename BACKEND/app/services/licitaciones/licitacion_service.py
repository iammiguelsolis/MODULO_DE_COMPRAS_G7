from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.items.material_solicitado import MaterialSolicitado
from app.models.licitaciones.items.servicio_solicitado import ServicioSolicitado
from app.enums.licitaciones.tipo_item import TipoItem

class LicitacionService:
    """
    Servicio para la gestión del ciclo de vida de las licitaciones.
    Utiliza el patrón State implementado en el modelo Licitacion.
    """
    
    def crear_licitacion(self, data):
        """
        Crea una nueva licitación en estado BORRADOR.
        """
        try:
            from datetime import datetime
            
            fecha_limite = data.get('fecha_limite')
            if isinstance(fecha_limite, str):
                fecha_limite = datetime.strptime(fecha_limite, '%Y-%m-%d')

            # Crear instancia base
            licitacion = Licitacion(
                nombre=data.get('nombre'),
                presupuesto_maximo=data.get('presupuesto_maximo'),
                fecha_limite=fecha_limite,
                solicitud_id=data.get('solicitud_id'),
                comprador_id=data.get('comprador_id')
            )
            
            # Agregar items si existen
            items_data = data.get('items', [])
            for item in items_data:
                if item.get('tipo') == TipoItem.MATERIAL.value:
                    nuevo_item = MaterialSolicitado(
                        codigo=item.get('codigo'),
                        nombre=item.get('nombre'),
                        cantidad=item.get('cantidad'),
                        unidad_medida=item.get('unidad_medida'),
                        comentario=item.get('comentario'),
                        fecha_entrega=item.get('fecha_entrega')
                    )
                else:
                    nuevo_item = ServicioSolicitado(
                        codigo=item.get('codigo'),
                        nombre=item.get('nombre'),
                        cantidad=item.get('cantidad'),
                        unidad_medida=item.get('unidad_medida'),
                        comentario=item.get('comentario'),
                        fecha_entrega=item.get('fecha_entrega')
                    )
                # Relacionar item con licitación (asumiendo relación definida)
                # nuevo_item.licitacion = licitacion
                db.session.add(nuevo_item)
            
            db.session.add(licitacion)
            db.session.commit()
            return licitacion
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    def obtener_por_id(self, id_licitacion):
        """
        Obtiene una licitación por su ID.
        """
        return Licitacion.query.get(id_licitacion)
    
    def listar_todas(self, filters=None):
        """
        Lista todas las licitaciones con filtros opcionales.
        """
        query = Licitacion.query
        
        if filters:
            if filters.get('estado'):
                query = query.filter(Licitacion._estado_nombre == filters['estado'])
            if filters.get('fechaDesde'):
                query = query.filter(Licitacion.fecha_creacion >= filters['fechaDesde'])
            if filters.get('fechaHasta'):
                query = query.filter(Licitacion.fecha_creacion <= filters['fechaHasta'])
            if filters.get('limiteMontoMin'):
                query = query.filter(Licitacion.presupuesto_maximo >= filters['limiteMontoMin'])
            if filters.get('limiteMontoMax'):
                query = query.filter(Licitacion.presupuesto_maximo <= filters['limiteMontoMax'])
                
        return query.all()
    
    def avanzar_estado(self, id_licitacion):
        """
        Intenta avanzar al siguiente estado de la licitación.
        """
        licitacion = self.obtener_por_id(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        try:
            licitacion.siguiente_estado()
            db.session.commit()
            return licitacion
        except Exception as e:
            db.session.rollback()
            raise e
    
    def cancelar_licitacion(self, id_licitacion, motivo=None):
        """
        Cancela una licitación.
        """
        licitacion = self.obtener_por_id(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        try:
            if motivo:
                licitacion.motivo_rechazo = motivo
            
            licitacion.cancelar()
            db.session.commit()
            return licitacion
        except Exception as e:
            db.session.rollback()
            raise e
