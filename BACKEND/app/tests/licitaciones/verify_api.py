import sys
import os
import json
import io

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from app import create_app, db

def verify_api():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    client = app.test_client()
    
    with app.app_context():
        db.create_all()
        
        print("--- INICIANDO VERIFICACIÓN DE API ---")
        
        # 1. Crear Licitación (POST /api/licitaciones)
        print("\n[TEST] Crear Licitación...")
        data_licitacion = {
            "nombre": "Licitación API Test",
            "limiteMonto": 50000,
            "fecha_limite": "2025-12-31",
            "solicitud_id": 100,
            "comprador_id": 1,
            "items": []
        }
        res = client.post('/api/licitaciones', json=data_licitacion)
        if res.status_code == 201:
            print(f"[OK] Licitación creada. ID: {res.json['id_licitacion']}")
            id_licitacion = res.json['id_licitacion']
        else:
            print(f"[ERROR] Falló creación: {res.status_code} - {res.data}")
            return

        # 2. Listar Licitaciones con filtros (GET /api/licitaciones)
        print("\n[TEST] Listar Licitaciones con filtros...")
        res = client.get('/api/licitaciones?estado=BORRADOR&limiteMontoMin=1000')
        if res.status_code == 200:
            print(f"[OK] Listado exitoso. Total: {len(res.json)}")
        else:
            print(f"[ERROR] Falló listado: {res.status_code} - {res.data}")

        # 3. Registrar Propuesta (Multipart) (POST /api/licitaciones/{id}/propuestas)
        # Primero avanzamos estado a EN_INVITACION (simulado via servicio directo para rapidez)
        from app.services.licitaciones.licitacion_service import LicitacionService
        service = LicitacionService()
        
        print("\n[DEBUG] Avanzando estado de licitación...")
        licitacion = service.obtener_por_id(id_licitacion)
        print(f"[DEBUG] Estado actual: {licitacion.estado_actual.get_nombre()}")
        
        # Aprobar la licitación antes de avanzar (BORRADOR -> NUEVA requiere aprobación)
        licitacion.aprobada_por_supervisor = True
        db.session.commit()
        
        service.avanzar_estado(id_licitacion) # BORRADOR -> NUEVA
        licitacion = service.obtener_por_id(id_licitacion)
        print(f"[DEBUG] Después de 1er avance: {licitacion.estado_actual.get_nombre()}")
        
        # Marcar invitaciones como enviadas para permitir NUEVA -> EN_INVITACION
        licitacion.invitaciones_enviadas = True
        db.session.commit()
        
        service.avanzar_estado(id_licitacion) # NUEVA -> EN_INVITACION
        licitacion = service.obtener_por_id(id_licitacion)
        print(f"[DEBUG] Después de 2do avance: {licitacion.estado_actual.get_nombre()}")
        
        print("\n[TEST] Registrar Propuesta (Multipart)...")
        data_propuesta = {
            'proveedorId': 1,
            'items': json.dumps([{"codigo": "IT01", "cantidad": 10, "precio": 4500}])
        }
        
        data_files = {
            'documentosLegales': (io.BytesIO(b"dummy content"), 'legal.pdf'),
            'documentosTecnicos': (io.BytesIO(b"dummy content"), 'tecnico.pdf')
        }
        
        # Merge dicts for test client
        data_post = {**data_propuesta, **data_files}
        
        res = client.post(f'/api/licitaciones/{id_licitacion}/propuestas', 
                          data=data_post, 
                          content_type='multipart/form-data')
                          
        if res.status_code == 201:
            print(f"[OK] Propuesta registrada. ID: {res.json['id_propuesta']}")
        else:
            print(f"[ERROR] Falló registro propuesta: {res.status_code} - {res.data}")

        print("\n--- VERIFICACIÓN FINALIZADA ---")

if __name__ == '__main__':
    verify_api()
