from app.models import Cliente
from app.bdd import db


"""
from app.bdd import db
class Cliente(db.Model):
    __tablename__ = "clientes"

    id_cliente = db.Column(db.Integer, primary_key=True)
    telefono = db.Column(db.String(12), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    contraseña = db.Column(db.String(128), nullable=False)
    direccion = db.Column(db.String(50), nullable=True)
    recibir_promos = db.Column(db.Boolean, default=False)
    fecha_nacimiento = db.Column(db.Date, nullable=True)

    # Relación con Ordenes (un cliente puede hacer muchas órdenes)
    ordenes = db.relationship("Orden", backref="cliente", lazy=True)
"""
class ClienteService:
    def obtener_cliente_por_cel(self, telefono):
        cliente = Cliente.query.filter_by(telefono=telefono).one_or_none()
        return cliente

    def obtener_cliente_por_id(self, id_cliente):
        return Usuario.query.get(id_cliente)

    def crear_cliente(self, cliente):
        if cliente.contraseña is None:
            print("El cliente no tiene contraseña")
            return False
        if cliente.telefono is None:
            print("El cliente no agrego un telefono")
            return False
        else:
            try:
                db.session.add(cliente)
                db.session.commit()
                return True
            except Exception as e:
                print(f"Error al crear usuario: {e}")
                db.session.rollback()
                return False

    def actualizar_usuario(self, nombre, apellido, telefono, contraseña, recibir_promos,fecha_nacimiento, genero):
        try:
            cliente = Cliente.query.get(id_cliente)
            if cliente:
                cliente.nombre = nombre
                cliente.apellido = apellido
                cliente.telefono = telefono
                cliente.contraseña = contraseña
                cliente.recibir_promos = recibir_promos
                cliente.fecha_nacimiento = fecha_nacimiento
                cliente.genero = genero
                db.session.commit()
                return True
            return False
        except Exception as e:
            print(f"Error al actualizar usuario: {e}")
            db.session.rollback()
            return False
"""
    def eliminar_usuario(self, id_usuario):
        try:
            usuario = Usuario.query.get(id_usuario)
            if usuario:
                db.session.delete(usuario)
                db.session.commit()
                return True
            return False
        except Exception as e:
            print(f"Error al eliminar usuario: {e}")
            db.session.rollback()
            return False
"""
