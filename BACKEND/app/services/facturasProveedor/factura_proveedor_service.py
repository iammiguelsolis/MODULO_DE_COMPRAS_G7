from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.enums import EstadoFactura, Moneda
from datetime import datetime

class FacturaProveedorService:
    _instance = None

    @staticmethod
    def get_instance():
        if FacturaProveedorService._instance is None:
            FacturaProveedorService._instance = FacturaProveedorService()
        return FacturaProveedorService._instance

    def buscar(self, filtros: dict):
        """
        Busca facturas aplicando los filtros proporcionados.
        filtros: diccionario con claves opcionales:
            - estado: str (nombre del Enum EstadoFactura)
            - proveedor_id: int
            - fecha_inicio: str (YYYY-MM-DD)
            - fecha_fin: str (YYYY-MM-DD)
            - numero_factura: str (búsqueda parcial)
        """
        query = FacturaProveedor.query

        # Filtro por Estado
        if filtros.get('estado'):
            try:
                estado_enum = EstadoFactura[filtros.get('estado')]
                query = query.filter(FacturaProveedor.estado == estado_enum)
            except KeyError:
                pass 

        # Filtro por Proveedor
        if filtros.get('proveedor_id'):
            query = query.filter(FacturaProveedor.proveedor_id == filtros.get('proveedor_id'))

        # Filtro por Rango de Fechas (Emisión)
        if filtros.get('fecha_inicio'):
            try:
                f_inicio = datetime.strptime(filtros.get('fecha_inicio'), '%Y-%m-%d').date()
                query = query.filter(FacturaProveedor.fecha_emision >= f_inicio)
            except ValueError:
                pass

        if filtros.get('fecha_fin'):
            try:
                f_fin = datetime.strptime(filtros.get('fecha_fin'), '%Y-%m-%d').date()
                query = query.filter(FacturaProveedor.fecha_emision <= f_fin)
            except ValueError:
                pass

        # Filtro por Número de Factura (Like)
        if filtros.get('numero_factura'):
            query = query.filter(FacturaProveedor.numero_factura.ilike(f"%{filtros.get('numero_factura')}%"))
        
        if filtros.get('moneda'):
            try:
                moneda_enum = Moneda[filtros.get('moneda')]
                query = query.filter(FacturaProveedor.moneda == moneda_enum)
            except KeyError:
                pass

        return query.all()
