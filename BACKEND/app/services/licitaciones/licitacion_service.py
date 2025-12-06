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
            db.session.flush() 

            from app.models.licitaciones.documentos import DocumentoRequerido
            from app.enums.licitaciones.tipo_documento import TipoDocumento
            
            # La propuesta es siempre obligatoria
            docs_default = [
                {
                    'tipo': TipoDocumento.ECONOMICO,
                    'nombre': 'Propuesta Económica',
                    'ruta': 'propuesta-economica',
                    'obligatorio': True
                }
            ]

            for doc in docs_default:
                nuevo_doc = DocumentoRequerido(
                    licitacion_id=licitacion.id, 
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
        Retorna dict con 'items' y 'total'.
        """
        query = Licitacion.query
        
        if filtros:
            if 'estado' in filtros:
                query = query.filter(Licitacion._estado_nombre == filtros['estado'])
            
            if 'titulo' in filtros:
                query = query.filter(Licitacion.titulo.ilike(f"%{filtros['titulo']}%"))

            if 'id' in filtros:
                query = query.filter(Licitacion.id == filtros['id'])
                
            if 'fechaDesde' in filtros:
                query = query.filter(Licitacion.fecha_creacion >= filtros['fechaDesde'])
                
            if 'fechaHasta' in filtros:
                query = query.filter(Licitacion.fecha_creacion <= filtros['fechaHasta'])
                
            if 'limiteMontoMin' in filtros:
                query = query.filter(Licitacion.presupuesto_max >= filtros['limiteMontoMin'])
                
            if 'limiteMontoMax' in filtros:
                query = query.filter(Licitacion.presupuesto_max <= filtros['limiteMontoMax'])
        
        query = query.order_by(Licitacion.fecha_creacion.desc())
        
        # Paginación
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        return {
            'items': pagination.items,
            'total': pagination.total
        }

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
    
    def actualizar_detalles(self, id_licitacion, data):
        """
        Actualiza los detalles de una licitación en estado NUEVA.
        """
        from datetime import datetime
        from app.models.licitaciones.documentos import DocumentoRequerido
        from app.enums.licitaciones.tipo_documento import TipoDocumento
        
        licitacion = self.obtener_por_id(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
        
        if licitacion._estado_nombre != 'NUEVA':
            raise ValueError(f"Solo se pueden actualizar licitaciones en estado NUEVA. Estado actual: {licitacion._estado_nombre}")
        
        try:
            if 'presupuesto_max' in data and data['presupuesto_max']:
                licitacion.presupuesto_max = data['presupuesto_max']
            
            if 'fecha_limite' in data and data['fecha_limite']:
                fecha_limite = data['fecha_limite']
                if isinstance(fecha_limite, str):
                    fecha_limite = datetime.strptime(fecha_limite, '%Y-%m-%d')
                licitacion.fecha_limite = fecha_limite
            
            documentos_adicionales = data.get('documentos_requeridos', [])
            
            tipo_map = {
                # Legales
                'acta-constitucion': (TipoDocumento.LEGAL, 'Acta de Constitución'),
                'vigencia-poder': (TipoDocumento.LEGAL, 'Certificado de Vigencia de Poder'),
                'ruc': (TipoDocumento.LEGAL, 'RUC y Ficha RUC'),
                'dni-representante': (TipoDocumento.LEGAL, 'DNI del Representante Legal'),
                'poder-representacion': (TipoDocumento.LEGAL, 'Poder de Representación'),
                'no-impedimento': (TipoDocumento.LEGAL, 'Declaración Jurada de No Impedimento'),
                'estatutos-empresa': (TipoDocumento.LEGAL, 'Estatutos de la Empresa'),
                'buena-pro-anterior': (TipoDocumento.LEGAL, 'Certificado de Buena Pro Anterior'),
                'licencia-funcionamiento': (TipoDocumento.LEGAL, 'Licencia de Funcionamiento'),
                # Técnicos
                'cert-calidad-iso': (TipoDocumento.TECNICO, 'Certificaciones de Calidad (ISO)'),
                'ficha-tecnica': (TipoDocumento.TECNICO, 'Ficha Técnica del ProductoServicio'),
                'cert-homologacion': (TipoDocumento.TECNICO, 'Certificados de Homologación'),
                'catalogos-brochures': (TipoDocumento.TECNICO, 'Catálogos y Brochures'),
                'especificaciones-tecnicas': (TipoDocumento.TECNICO, 'Especificaciones Técnicas'),
                'muestras-prototipos': (TipoDocumento.TECNICO, 'Muestras o Prototipos'),
                'cert-origen': (TipoDocumento.TECNICO, 'Certificado de Origen'),
                'cert-garantia': (TipoDocumento.TECNICO, 'Certificado de Garantía'),
                'plan-implementacion': (TipoDocumento.TECNICO, 'Plan de implementación'),
                'metodologia-trabajo': (TipoDocumento.TECNICO, 'Metodología de Trabajo'),
                'ordenes-compra-pasadas': (TipoDocumento.TECNICO, 'Órdenes de Compra Pasadas'),
                # Económicos/Financieros
                'estados-financieros-auditados': (TipoDocumento.ECONOMICO, 'Estados Financieros Auditados'),
                'linea-credito-aprobada': (TipoDocumento.ECONOMICO, 'Línea de Crédito Aprobada'),
                'carta-fianza': (TipoDocumento.ECONOMICO, 'Carta de Fianza'),
                'poliza-fianza': (TipoDocumento.ECONOMICO, 'Póliza de Fianza'),
                'cert-no-adeudo-tributario': (TipoDocumento.ECONOMICO, 'Certificado de No Adeudo Tributario'),
                'cert-no-adeudo-essalud': (TipoDocumento.ECONOMICO, 'Certificado de No Adeudo a ESSALUD'),
                'balance-general': (TipoDocumento.ECONOMICO, 'Balance General'),
                'estado-resultados': (TipoDocumento.ECONOMICO, 'Estado de Resultados'),
                'flujo-caja-proyectado': (TipoDocumento.ECONOMICO, 'Flujo de Caja Proyectado'),
                'referencia-bancaria': (TipoDocumento.ECONOMICO, 'Referencia Bancaria'),
                'constancia-inscripcion-registro': (TipoDocumento.ECONOMICO, 'Constancia de Inscripción en Registro'),
            }
            
            for doc_id in documentos_adicionales:
                existe = DocumentoRequerido.query.filter_by(
                    licitacion_id=id_licitacion,
                    ruta_plantilla=doc_id
                ).first()
                
                if not existe and doc_id in tipo_map:
                    tipo, nombre = tipo_map[doc_id]
                    nuevo_doc = DocumentoRequerido(
                        licitacion_id=id_licitacion,
                        tipo=tipo,
                        nombre=nombre,
                        ruta_plantilla=doc_id,
                        obligatorio=False
                    )
                    db.session.add(nuevo_doc)
            
            db.session.commit()
            return licitacion
            
        except Exception as e:
            db.session.rollback()
            raise e