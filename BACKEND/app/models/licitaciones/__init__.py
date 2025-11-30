# Importar todos los modelos para que SQLAlchemy los registre correctamente
# Esto evita problemas de "name not found" en las relaciones

from app.models.licitaciones.proveedor import Proveedor
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor
from app.models.licitaciones.contrato import Contrato
from app.models.licitaciones.documentos import Documento, DocumentoRequerido
from app.models.licitaciones.items.item_solicitado import ItemSolicitado
from app.models.licitaciones.items.material_solicitado import MaterialSolicitado
from app.models.licitaciones.items.servicio_solicitado import ServicioSolicitado

__all__ = [
    'Proveedor',
    'Licitacion',
    'PropuestaProveedor',
    'Contrato',
    'Documento',
    'DocumentoRequerido',
    'ItemSolicitado',
    'MaterialSolicitado',
    'ServicioSolicitado'
]
