# Importar todos los modelos para que SQLAlchemy los registre correctamente
# Esto evita problemas de "name not found" en las relaciones

from app.licitaciones.models.proveedor import Proveedor
from app.licitaciones.models.licitacion import Licitacion
from app.licitaciones.models.propuesta import PropuestaProveedor
from app.licitaciones.models.contrato import Contrato
from app.licitaciones.models.documentos import Documento
from app.licitaciones.models.items.item_solicitado import ItemSolicitado
from app.licitaciones.models.items.material_solicitado import MaterialSolicitado
from app.licitaciones.models.items.servicio_solicitado import ServicioSolicitado

__all__ = [
    'Proveedor',
    'Licitacion',
    'PropuestaProveedor',
    'Contrato',
    'Documento',
    'ItemSolicitado',
    'MaterialSolicitado',
    'ServicioSolicitado'
]
