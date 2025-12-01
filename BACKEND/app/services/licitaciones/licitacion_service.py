from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion

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
                presupuesto_max=data.get('presupuesto_max'),
                fecha_limite=fecha_limite,
                solicitud_id=data.get('solicitud_id')
            )
            db.session.add(licitacion)
            db.session.flush() # Obtener ID

            # Crear documento requerido por defecto (Propuesta Económica SIEMPRE es obligatoria)
            # Los demás documentos requeridos se agregarán dinámicamente según la selección del comprador
            from app.models.licitaciones.documentos import DocumentoRequerido
            from app.enums.licitaciones.tipo_documento import TipoDocumento
            
            docs_default = [
                {
                    'tipo': TipoDocumento.ECONOMICO,
                    'nombre': 'Propuesta Económica',
                    'ruta': 'https://xoghfokrptchamewjcrc.supabase.co/storage/v1/object/public/plantillas-licitaciones/financieros/Plantilla%20-%20Propuesta%20Economica.docx',
                    'obligatorio': True
                }
            ]

            for doc in docs_default:
                nuevo_doc = DocumentoRequerido(
                    licitacion_id=licitacion.id_licitacion,
                    tipo=doc['tipo'],
                    nombre=doc['nombre'],
                    ruta_plantilla=doc['ruta'],
                    obligatorio=doc['obligatorio']
                )
                db.session.add(nuevo_doc)

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

    def listar_todas(self, filtros=None, page=1, per_page=10):
        """
        Lista todas las licitaciones con filtros opcionales y paginación.
        """
        query = Licitacion.query
        
        if filtros:
            if 'estado' in filtros:
                query = query.filter(Licitacion._estado_nombre == filtros['estado'])
            
            if 'titulo' in filtros:
                query = query.filter(Licitacion.titulo.ilike(f"%{filtros['titulo']}%"))

            if 'id' in filtros:
                query = query.filter(Licitacion.id_licitacion == filtros['id'])
                
            if 'fechaDesde' in filtros:
                query = query.filter(Licitacion.fecha_creacion >= filtros['fechaDesde'])
                
            if 'fechaHasta' in filtros:
                query = query.filter(Licitacion.fecha_creacion <= filtros['fechaHasta'])
                
            if 'limiteMontoMin' in filtros:
                query = query.filter(Licitacion.presupuesto_max >= filtros['limiteMontoMin'])
                
            if 'limiteMontoMax' in filtros:
                query = query.filter(Licitacion.presupuesto_max <= filtros['limiteMontoMax'])
        
        # Ordenar por fecha de creación descendente
        query = query.order_by(Licitacion.fecha_creacion.desc())
        
        # Paginación
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        return pagination.items

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
