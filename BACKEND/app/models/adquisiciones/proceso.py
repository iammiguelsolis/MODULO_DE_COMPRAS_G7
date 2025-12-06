from app.bdd import db
from datetime import datetime

class EstadoProceso:
    NUEVO = "NUEVO"
    INVITANDO = "INVITANDO_PROVEEDORES"
    EVALUANDO = "EVALUANDO_OFERTAS"
    CERRADO = "CERRADO"
