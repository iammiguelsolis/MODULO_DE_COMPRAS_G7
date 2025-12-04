# Importar todos los modelos para que SQLAlchemy los registre correctamente
# Esto evita problemas de "name not found" en las relaciones
from app.models.proveedor import Proveedor
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor
from app.models.licitaciones.contrato import Contrato
from app.models.licitaciones.documentos import Documento, DocumentoRequerido
from app.models.licitaciones.invitacion import InvitacionProveedor

__all__ = [
    'Licitacion',
    'PropuestaProveedor',
    'Contrato',
    'Documento',
    'DocumentoRequerido',
    'InvitacionProveedor',
    'Proveedor'
]
