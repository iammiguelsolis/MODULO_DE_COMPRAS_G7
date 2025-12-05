from enum import Enum

class EstadoOC(Enum):
    BORRADOR = "BORRADOR"
    EN_PROCESO = "EN_PROCESO"
    ENVIADA = "ENVIADA"
    CERRADA = "CERRADA"
    CANCELADA = "CANCELADA"

class EstadoLineaOC(Enum):
    Todavia_no_cp = "TODAVIA_NO_CULMINA_PLAZO"
    Entrega_parcial_en_p = "ENTREGA_PARCIAL_EN_PLAZO"
    Entrega_parcial_pp = "ENTREGA_PARCIAL_POSTERIOR_AL_PLAZO" 
    Entrega_final_en_p = "ENTREGA_FINAL_EN_PLAZO"
    Entrega_final_pp = "ENTREGA_FINAL_POSTERIOR_AL_PLAZO"
    No_permite_entrega_parcial = "NO_PERMITE_ENTREGA_PARCIAL"

class TipoPago(Enum):
    CONTADO = "AL_CONTADO"
    TRANSFERENCIA = "TRANSFERENCIA"
    CREDITO = "CREDITO"

class TipoOrigen(Enum):
    RFQ = "RFQ"
    LICITACION = "LICITACION"
    DIRECTA = "DIRECTA"

class Moneda(Enum):
    USD = "USD"
    PEN = "PEN"