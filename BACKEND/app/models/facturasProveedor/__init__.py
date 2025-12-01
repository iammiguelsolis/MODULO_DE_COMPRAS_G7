# app/models/facturasProveedor/__init__.py

from .factura_proveedor import FacturaProveedor
from .linea_factura import LineaFactura
from .documento_adjunto import DocumentoAdjunto
from .obligacion_pago import ObligacionPago
# 👇 AGREGA ESTAS LÍNEAS IMPORTANTES:
from .factura_trazabilidad import FacturaTrazabilidad 
from .resultado_conciliacion import ResultadoConciliacion 
# (Y cualquier otro modelo que tengas en esa carpeta)