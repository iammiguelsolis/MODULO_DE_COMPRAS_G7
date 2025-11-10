# app/utils.py

from functools import wraps
from flask import session, redirect, url_for, flash

def login_requerido(f):
    @wraps(f)
    def decorada(*args, **kwargs):
        if 'id_usuario' not in session:
            flash("Debes iniciar sesión para acceder a esta página.", "warning")
            return redirect(url_for('auth_bp.login'))  # Asegúrate de usar el nombre correcto del blueprint de login
        return f(*args, **kwargs)
    return decorada

