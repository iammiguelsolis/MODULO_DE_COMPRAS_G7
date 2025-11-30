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
    Registra una propuesta de proveedor.
    Body (Multipart): 
      - proveedorId: int
      - montoOfertado: float
      - plazoEntrega: int
      - garantiaMeses: int
      - items: json string
      - documentosLegales: files[]
      - documentosTecnicos: files[]
      - documentosEconomicos: files[]
    """
    try:
        # 1. Extraer datos del formulario
        proveedor_id = request.form.get('proveedorId', type=int)
        items_json = request.form.get('items')

        if not all([proveedor_id, items_json]):
             return jsonify({'error': 'Faltan datos obligatorios (proveedorId, items)'}), 400

        import json
        items_data = json.loads(items_json)

        # 2. Construir diccionario de datos para el servicio
        data = {
            'proveedor_id': proveedor_id,
            'items': items_data
        }

        # 3. Manejar archivos (Simulado por ahora, el servicio debería recibir los objetos file storage o sus rutas)
        # En una implementación real, aquí se guardarían los archivos y se pasarían las rutas/metadata
        # Por ahora, pasamos los nombres de archivos para simular el registro
        
        documentos = []
        
        # Helper para procesar listas de archivos
        def procesar_archivos(key, tipo):
            files = request.files.getlist(key)
            for file in files:
                if file and file.filename:
                    # Aquí se guardaría el archivo
                    documentos.append({
                        'tipo': tipo,
                        'nombre': file.filename,
                        'archivo': file # Opcional: pasar el objeto file si el servicio lo maneja
                    })

        procesar_archivos('documentosLegales', 'LEGAL')
        procesar_archivos('documentosTecnicos', 'TECNICO')
        procesar_archivos('documentosEconomicos', 'ECONOMICO')

        # 4. Llamar al servicio
        propuesta = service.registrar_propuesta(id, data, documentos)
        
        # Retornar ID de propuesta creada
        return jsonify({
            "success": True, 
            "id_propuesta": propuesta.id_propuesta,
            "mensaje": "Propuesta registrada exitosamente"
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
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
