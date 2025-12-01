from flask import Blueprint, request, jsonify
from app.services.licitaciones.propuesta_service import PropuestaService
from app.dtos.licitaciones.propuesta_dto import PropuestaResponseDTO

propuestas_bp = Blueprint('propuestas', __name__, url_prefix='/api/licitaciones')
service = PropuestaService()

@propuestas_bp.route('/<int:id>/propuestas', methods=['GET'])
def listar_propuestas(id):
    """
    GET /api/licitaciones/{id}/propuestas
    Lista las propuestas de una licitación.
    """
    try:
        # Obtener licitación para verificar existencia (opcional pero recomendado)
        # O simplemente buscar propuestas por licitacion_id
        
        # Aquí asumimos que el servicio tiene un método para listar o usamos el modelo directo
        # Para mantener capas, deberíamos agregar listar_por_licitacion en PropuestaService
        propuestas = service.listar_por_licitacion(id)
        
        response = [PropuestaResponseDTO.from_model(p) for p in propuestas]
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/<int:id>/propuestas', methods=['POST'])
def registrar_propuesta(id):
    """
    POST /api/licitaciones/{id}/propuestas
    Registra una propuesta de proveedor (Metadata).
    Body: { "proveedor_id": int }
    """
    try:
        data = request.get_json()
        proveedor_id = data.get('proveedor_id')

        if not proveedor_id:
             return jsonify({'error': 'Falta proveedor_id'}), 400

        # Datos básicos para crear la propuesta
        propuesta_data = {'proveedor_id': proveedor_id}
        # Documentos se suben en endpoint separado, pasamos lista vacía inicial
        documentos_data = [] 

        propuesta = service.registrar_propuesta(id, propuesta_data, documentos_data)
        
        return jsonify({
            "success": True, 
            "id_propuesta": propuesta.id_propuesta,
            "mensaje": "Propuesta creada. Ahora suba los documentos."
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/<int:id>/propuestas/<int:propuesta_id>/documentos', methods=['POST'])
def subir_documento_propuesta(id, propuesta_id):
    """
    POST /api/licitaciones/{id}/propuestas/{propuesta_id}/documentos
    Sube un documento a la propuesta.
    Body: { "nombre": str, "url_archivo": str, "tipo": str, "documento_requerido_id": int }
    """
    try:
        data = request.get_json()
        # Validar datos mínimos
        if not all(k in data for k in ("nombre", "url_archivo", "tipo")):
            return jsonify({'error': 'Faltan datos (nombre, url_archivo, tipo)'}), 400
            
        # Llamar a servicio para agregar documento (necesitamos un método específico en service o usar el de registro)
        # Por ahora, asumimos que el servicio tiene un método para agregar documento a propuesta existente
        # O instanciamos el modelo directamente aquí si el servicio no lo expone
        from app.models.licitaciones.documentos import Documento
        from app.enums.licitaciones.tipo_documento import TipoDocumento
        from app.bdd import db
        
        nuevo_doc = Documento(
            propuesta_id=propuesta_id,
            documento_requerido_id=data.get('documento_requerido_id'),
            nombre=data.get('nombre'),
            url_archivo=data.get('url_archivo'),
            tipo=TipoDocumento(data.get('tipo')),
            validado=False
        )
        db.session.add(nuevo_doc)
        db.session.commit()
        
        return jsonify({"id_documento": nuevo_doc.id_documento}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@propuestas_bp.route('/<int:id>/finalizarRegistro', methods=['PUT'])
def finalizar_registro(id):
    """
    PUT /api/licitaciones/{id}/finalizarRegistro
    Finaliza el periodo de registro de propuestas.
    """
    try:
        result = service.finalizar_registro_propuestas(id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
