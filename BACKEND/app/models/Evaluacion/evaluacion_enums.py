from enum import Enum

class EstadoOC(Enum):
    Borrador = "BORRADOR"
    En_Proceso = "EN_PROCESO"
    Enviada = "ENVIADA"
    Cerrada = "CERRADA"
    Cancelada = "CANCELADA"



class EstadoLineaOC(Enum):
    Todavia_no_cp = "TODAVIA_NO_CULMINA_PLAZO"
    Entrega_parcial_en_p = "ENTREGA_PARCIAL_EN_PLAZO"
    Entrega_parcial_pp = "ENTREGA_PARCIAL_POSTERIOR_AL_PLAZO" 
    Entrega_final_en_p = "ENTREGA_FINAL_EN_PLAZO"
    Entrega_final_pp = "ENTREGA_FINAL_POSTERIOR_AL_PLAZO"
    No_permite_entrega_parcial = "NO_PERMITE_ENTREGA_PARCIAL"

class TipoPago(Enum):
    contado = "AL_CONTADO"
    transferencia = "TRANSFERENCIA"
    credito = "CREDITO"



















class Dias_Semana(Enum):
    lunes = "Lunes"
    martes = "Martes"
    miercoles = "Miércoles"
    jueves = "Jueves"
    viernes = "Viernes"
    sabado = "Sábado"
    domingo = "Domingo"

# Aunque en este enum simple no se usen, les quiero dejar un ejemplo de como validar si
# un registro existe o no en el enum, esto sobretodo para la parte del front porque desde el
# cliente se puede enviar cualquier cosa


def in_enum_dia_semana(cadena):
    for d in (Dias_Semana):
        if d.value == cadena:
            return d
    return False #validación extra por si acaso