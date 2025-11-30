import sys
import os
from datetime import datetime, timedelta

# Agregar el directorio raíz al path para importar app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from app import create_app, db
from app.models.licitaciones.proveedor import Proveedor
from app.services.licitaciones.licitacion_service import LicitacionService
from app.services.licitaciones.propuesta_service import PropuestaService
from app.services.licitaciones.evaluacion_service import EvaluacionService
from app.services.licitaciones.orden_compra_integration_service import OrdenCompraIntegrationService
from app.dtos.licitaciones.propuesta_dto import PropuestaResponseDTO
from app.enums.licitaciones.tipo_item import TipoItem

def run_verification():
    app = create_app()
    
    # Configurar para usar BD en memoria (no toca archivo ni MySQL)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        print("--- INICIANDO VERIFICACIÓN INTEGRAL ---")
        
        # 1. Setup DB
        db.create_all()
        
        # 2. Crear Proveedor (Mock)
        proveedor = Proveedor.query.filter_by(ruc="20123456789").first()
        if not proveedor:
            proveedor = Proveedor(
                nombre="Proveedor Test SAC",
                ruc="20123456789",
                email="contacto@proveedortest.com",
                direccion="Av. Test 123",
                telefono="999888777"
            )
            db.session.add(proveedor)
            db.session.commit()
            print(f"[OK] Proveedor creado: {proveedor.nombre} (ID: {proveedor.id_proveedor})")
        else:
            print(f"[OK] Proveedor existente: {proveedor.nombre}")
            
        # 3. Crear Licitación
        lic_service = LicitacionService()
        data_licitacion = {
            "nombre": f"Licitación Test {datetime.now().strftime('%H%M%S')}",
            "presupuesto_maximo": 10000.00,
            "fecha_limite": datetime.now() + timedelta(days=10),
            "solicitud_id": 1,
            "comprador_id": 1,
            "items": [
                {
                    "tipo": "MATERIAL",
                    "codigo": "MAT-001",
                    "nombre": "Cemento Sol",
                    "cantidad": 100,
                    "unidad_medida": "Bolsas",
                    "comentario": "Urgente",
                    "fecha_entrega": datetime.now() + timedelta(days=15)
                }
            ]
        }
        licitacion = lic_service.crear_licitacion(data_licitacion)
        print(f"[OK] Licitación creada: {licitacion.nombre} (ID: {licitacion.id_licitacion})")
        
        # 4. Avanzar a EN_INVITACION (Simulado)
        # Forzamos estado para saltar pasos previos si es necesario, o usamos flujo normal
        # Flujo normal: NUEVA -> (Invitar) -> EN_INVITACION
        licitacion.invitaciones_enviadas = True
        licitacion.siguiente_estado() # De Borrador a Nueva (si aplica) o lógica interna
        # Dependiendo de la implementación exacta de estados, forzamos para el test
        from app.models.licitaciones.estados.estado_en_invitacion import EstadoEnInvitacion
        licitacion.cambiar_estado(EstadoEnInvitacion(licitacion))
        db.session.commit()
        print(f"[OK] Estado avanzado a: {licitacion.estado_actual.get_nombre()}")
        
        # 5. Registrar Propuesta
        prop_service = PropuestaService()
        data_propuesta = {
            "proveedor_id": proveedor.id_proveedor,
            "monto_total": 9500.00,
            "plazo_entrega": 5,
            "garantia": 12,
            "comentarios": "Oferta especial"
        }
        docs = [{"nombre": "Propuesta Técnica", "url": "http://...", "tipo": "TECNICO"}]
        propuesta = prop_service.registrar_propuesta(licitacion.id_licitacion, data_propuesta, docs)
        print(f"[OK] Propuesta registrada ID: {propuesta.id_propuesta}")
        
        # 6. Verificar DTO de Propuesta (Endpoint GET simulado)
        # Aquí probamos que el DTO traiga los datos del proveedor
        dto = PropuestaResponseDTO.from_model(propuesta)
        if dto.proveedor and dto.proveedor.ruc == "20123456789":
            print(f"[OK] DTO Propuesta contiene datos de proveedor: {dto.proveedor.nombre}")
        else:
            print(f"[ERROR] DTO Propuesta NO contiene datos correctos de proveedor: {dto.proveedor}")
            
        # 7. Finalizar Registro y Evaluar
        prop_service.finalizar_registro_propuestas(licitacion.id_licitacion)
        print(f"[OK] Registro finalizado. Estado: {licitacion.estado_actual.get_nombre()}")
        
        # Avanzar al estado EVALUACION_TECNICA
        licitacion.siguiente_estado()
        db.session.commit()
        print(f"[OK] Estado avanzado a: {licitacion.estado_actual.get_nombre()}")
        
        # Eval Técnica
        eval_service = EvaluacionService()
        eval_service.registrar_evaluacion_tecnica(
            licitacion.id_licitacion, 
            1, 
            [{"propuesta_id": propuesta.id_propuesta, "aprobada": True}]
        )
        print(f"[OK] Evaluación Técnica registrada. Estado: {licitacion.estado_actual.get_nombre()}")
        
        # Eval Económica (Adjudicar)
        eval_service.registrar_evaluacion_economica(
            licitacion.id_licitacion,
            1,
            [{"propuesta_id": propuesta.id_propuesta, "puntuacion": 100, "justificacion": "Mejor precio"}]
        )
        print(f"[OK] Evaluación Económica registrada. Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 8. Generar Orden de Compra (Integración)
        oc_service = OrdenCompraIntegrationService()
        resultado = oc_service.notificar_generacion_orden_compra(licitacion.id_licitacion)
        
        if resultado['success']:
            payload = resultado['payload_enviado']
            print(f"[OK] Integración OC exitosa.")
            print(f"    Proveedor en Payload: {payload['proveedor']['nombre']}")
            print(f"    Monto en Payload: {payload['detalles']['monto_total']}")
        else:
            print(f"[ERROR] Falló integración OC: {resultado}")

if __name__ == "__main__":
    run_verification()
