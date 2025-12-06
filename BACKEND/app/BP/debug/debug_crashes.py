from flask import Blueprint
from app.errors.custom_errors import EvaluacionProveedorError

debug_crashes_bp = Blueprint("debug_crashes", __name__)

# --- CRASH 1: ZeroDivisionError ---
@debug_crashes_bp.route("/crash-zero")
def crash_zero():
    return 1 / 0


# --- CRASH 2: NameError ---
@debug_crashes_bp.route("/crash-name")
def crash_name():
    return undefined_variable


# --- CRASH 3: ValueError ---
@debug_crashes_bp.route("/crash-int")
def crash_int():
    return int("no-es-numero")


# --- CRASH 4: IndexError ---
@debug_crashes_bp.route("/crash-index")
def crash_index():
    arr = [1, 2, 3]
    return arr[10]


# --- CRASH 5: Custom Python Exception ---
class SimpleCrashException(Exception):
    pass

@debug_crashes_bp.route("/crash-custom")
def crash_custom():
    raise SimpleCrashException("Error personalizado básico para pruebas.")


# --- CRASH 6: Personalizado coherente (Evaluación de Proveedores) ---
@debug_crashes_bp.route("/crash-evaluacion")
def crash_evaluacion():
    proveedor_id = 123  # ID ficticio para el log
    raise EvaluacionProveedorError(
        mensaje="Inconsistencia detectada en los datos del proveedor durante la evaluación.",
        proveedor_id=proveedor_id
    )
