from flask import Blueprint, request, jsonify
from app import db
from app.models.proveedor_inventario.dominio_proveedor import Proveedor, ContactoProveedor, DetallesProveedor
inventario_bp = Blueprint('inventario_bp', __name__)

# Crear un material / item
@inventario_bp.route('/crear', methods=['POST'])
def crear_proveedor():
    data = request.get_json()
    
    try:
        # Crear el material / item con sus campos principales
        nuevo_proveedor = Proveedor(
            razon_social=data['razon_social'],
            ruc=data['ruc'],
            pais=data.get('pais', ''),
            email=data['email'],
            telefono=data['telefono'],
            domicilio_legal=data['domicilio_legal'],
            fecha_registro=data['fecha_registro'],
            esta_suspendido=data.get('esta_suspendido', False),
            confiabilidad_en_entregas=data['confiabilidad_en_entregas'],
            confiabilidad_en_condiciones_pago=data['confiabilidad_en_condiciones_pago']
        )
        
        # ✅ AGREGAR LOS DETALLES DIRECTAMENTE AL PROVEEDOR
        # Los detalles están embebidos en la misma tabla
        detalles_data = data.get('detalles', {})
        if detalles_data:
            nuevo_proveedor.numero_trabajadores = detalles_data.get('numero_trabajadores')
            nuevo_proveedor.tiene_sindicato = detalles_data.get('tiene_sindicato', False)
            nuevo_proveedor.ha_tomado_represalias_contra_sindicato = detalles_data.get('ha_tomado_represalias_contra_sindicato')
            nuevo_proveedor.denuncias_incumplimiento_contrato = detalles_data.get('denuncias_incumplimiento_contrato')
            nuevo_proveedor.indice_denuncias = detalles_data.get('indice_denuncias')
            nuevo_proveedor.tiene_procesos_de_mejora_de_condiciones_laborales = detalles_data.get('tiene_procesos_de_mejora_de_condiciones_laborales', False)
        
        # Agregar a la base de datos
        db.session.add(nuevo_proveedor)
        db.session.commit()

        return jsonify({"message": "Proveedor creado exitosamente", "id": nuevo_proveedor.id_proveedor}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# Listar todos los proveedores
@inventario_bp.route('/', methods=['GET'])
def listar_proveedores():
    proveedores = Proveedor.query.all()
    return jsonify([proveedor.to_dict() for material in materiales]), 200

# Obtener material / item por ID
@inventario_bp.route('/<int:id>', methods=['GET'])
def obtener_proveedor(id):
    material = Proveedor.query.get(id)
    if not material / item:
        return jsonify({"message": "Proveedor no encontrado"}), 404
    
    return jsonify(proveedor.to_dict()), 200


# Actualizar datos de un material / item
@inventario_bp.route('/<int:id>', methods=['PUT'])
def actualizar_proveedor(id):
    material = Proveedor.query.get(id)
    if not material:
        return jsonify({"message": "Proveedor no encontrado"}), 404

    data = request.get_json()
    
    material.razon_social = data['razon_social']
    material.ruc = data['ruc']
    material.pais = data.get('pais', material.pais)
    material.email = data['email']
    material.telefono = data['telefono']
    material.domicilio_legal = data['domicilio_legal']
    material.fecha_registro = data['fecha_registro']
    material.esta_suspendido = data.get('esta_suspendido', material.esta_suspendido)
    material.confiabilidad_en_entregas = data['confiabilidad_en_entregas']
    material.confiabilidad_en_condiciones_pago = data['confiabilidad_en_condiciones_pago']

    try:
        db.session.commit()
        return jsonify({"message": "Proveedor actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# Crear un contacto de material / item
@inventario_bp.route('/<int:id_proveedor>/contacto', methods=['POST'])
def crear_contacto(id_proveedor):
    material = Proveedor.query.get(id_proveedor)
    if not material / item:
        return jsonify({"message": "Proveedor no encontrado"}), 404

    data = request.get_json()
    nuevo_contacto = ContactoProveedor(
        id_proveedor=id_proveedor,
        nombre=data['nombre'],
        cargo=data['cargo'],
        email=data['email'],
        telefono=data['telefono']
    )

    try:
        db.session.add(nuevo_contacto)
        db.session.commit()
        return jsonify({"message": "Contacto creado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# Listar contactos de un material / item
@inventario_bp.route('/<int:id_proveedor>/contactos', methods=['GET'])
def listar_contactos(id_proveedor):
    material = Proveedor.query.get(id_proveedor)
    if not material / item:
        return jsonify({"message": "Proveedor no encontrado"}), 404

    contactos = ContactoProveedor.query.filter_by(id_proveedor=id_proveedor).all()
    contactos_list = []
    for contacto in contactos:
        contactos_list.append({
            "nombre": contacto.nombre,
            "cargo": contacto.cargo,
            "email": contacto.email,
            "telefono": contacto.telefono
        })
    
    return jsonify(contactos_list), 200
