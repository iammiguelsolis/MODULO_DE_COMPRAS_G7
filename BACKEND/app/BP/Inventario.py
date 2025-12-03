from flask import Blueprint, request, jsonify
from app import db
from app.models.proveedor_inventario.conexion_alamacen import Material

inventario_bp = Blueprint('inventario_bp', __name__)

# Crear un material / item
@inventario_bp.route('/crear', methods=['POST'])
def registrar_material():
    data = request.get_json()
    
    try:
        nuevo_item = Material(
            nombre=data['nombre'],
            descripcion=data['descripcion'],
            unidad=data.get('unidad')
        )
        
        db.session.add(nuevo_item)
        db.session.commit()
        return jsonify({"message": "Material creado exitosamente", "id": nuevo_item.id_item}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# Listar todos los materiales
@inventario_bp.route('/', methods=['GET'])
def listar_materiales():
    materiales = Material.query.all()
    return jsonify([material.to_dict() for material in materiales]), 200

# Obtener material / item por ID
@inventario_bp.route('/<int:id>', methods=['GET'])
def obtener_material(id):
    material = Material.query.get(id)
    if not material:
        return jsonify({"message": "Material no encontrado"}), 404
    
    return jsonify(material.to_dict()), 200

# Actualizar datos de un material / item
@inventario_bp.route('/<int:id>', methods=['PUT'])
def actualizar_material(id):
    material = Material.query.get(id)
    if not material:
        return jsonify({"message": "Material no encontrado"}), 404
    
    data = request.get_json()
    
    # Actualizar los campos
    material.nombre = data.get('nombre', material.nombre)
    material.descripcion = data.get('descripcion', material.descripcion)
    material.unidad = data.get('unidad', material.unidad)
    
    try:
        db.session.commit()
        return jsonify({"message": "Material actualizado exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400