from flask import Blueprint, jsonify
from app.services.licitaciones.licitacion_service import LicitacionService
from app.models.licitaciones.documentos import DocumentoRequerido

documentos_bp = Blueprint('documentos_licitacion', __name__, url_prefix='/api/licitaciones')
service = LicitacionService()

@documentos_bp.route('/<int:id>/documentos-requeridos', methods=['GET'])
def listar_documentos_requeridos(id):
    """
    GET /api/licitaciones/{id}/documentos-requeridos
    Obtiene la lista de documentos requeridos y sus plantillas.
    """
    try:
        licitacion = service.obtener_por_id(id)
        if not licitacion:
            return jsonify({'error': 'Licitación no encontrada'}), 404
            
        docs = []
        for doc in licitacion.documentos_requeridos:
            docs.append({
                'id': doc.id_requerido,
                'tipo': doc.tipo.name,
                'obligatorio': doc.obligatorio,
                'nombre_plantilla': doc.nombre_plantilla,
                'ruta_plantilla': doc.ruta_plantilla
            })
            
        return jsonify(docs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
