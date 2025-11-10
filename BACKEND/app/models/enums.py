from enum import Enum

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