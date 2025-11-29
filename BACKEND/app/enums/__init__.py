"""
 Si estoy fuera de la carpeta model se hace
            -> from app.modulos.models import Cliente

            Pero si estoy dentro de models se hace
            -> from .cliente import Cliente
            -> from .carro import Carro
            etc
"""
# Esto es un importador automatico de clases
# Si el archivo.py tiene un all definido lo utiliza
# en caso contrario trae todo lo que no es privado
# -----------------EZ-------------------- 
from importlib import import_module

__all__ = []

for module_name in ["inventario_enums", "evaluacion_enums"]:
    module = import_module(f".{module_name}", package=__name__)

    # Si el módulo no define __all__, usar todos los nombres públicos
    exported_names = getattr(
        module,
        "__all__",
        [name for name in dir(module) if not name.startswith("_")]
    )

    # Exponer los nombres en el namespace del paquete
    globals().update({name: getattr(module, name) for name in exported_names})
    __all__.extend(exported_names)