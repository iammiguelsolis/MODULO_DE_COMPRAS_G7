from enum import Enum

class EscalaCalificacion(Enum):
    muy_alto = "MUY_ALTO"
    alto = "ALTO"
    mediano = "MEDIANO"
    bajo = "BAJO"
    muy_bajo = "MUY_BAJO"

class PosiblesValores(Enum):
    si = "SI"
    no = "NO"
    no_aplica = "NO_APLICA"

class UnidadMedidaAlmacen(Enum):
    # Unidades físicas
    UNIDAD = "Unidad"         
    METRO = "Metro"            
    KILOMETRO = "Kilómetro"    
