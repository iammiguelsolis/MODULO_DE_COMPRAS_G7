import sys
import os
import json
import io

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from app import create_app, db

def verify_full_lifecycle():
    app = create_app()
    client = app.test_client()
    
    with app.app_context():
        # Elimina datos previos
        db.drop_all()
        db.create_all()
        
        print("=" * 80)
        print("VERIFICACIÓN COMPLETA DEL CICLO DE VIDA - LICITACIONES")
        print("=" * 80)
        
        # Crear solicitud (SIMULACIÓN)
        print("\n[0/10] CREAR SOLICITUD (SIMULACIÓN)...")
        from app.models.licitaciones.solicitud import Solicitud
        from app.enums.licitaciones.estado_solicitud import EstadoSolicitud
        from app.enums.licitaciones.tipo_compra import TipoCompra
        
        solicitud = Solicitud(
            titulo="Solicitud de Laptops",
            comprador_id=1,
            comentarios="Urgentemente requeridas"
        )
        
        # Simular items para superar el umbral de 10,000
        # Item 1: Material (10 * 1000 = 10000)
        solicitud.agregar_item({
            "tipo": "MATERIAL",
            "codigo": "MAT001",
            "nombre": "Laptop Gamer",
            "cantidad": 10, 
            "precio_unitario": 1000,
            "comentario": "Alta gama",
            "fecha_entrega": "2025-01-01"
        }) 
        # Item 2: Servicio (5 * 200 = 1000)
        solicitud.agregar_item({
            "tipo": "SERVICIO",
            "codigo": "SERV001",
            "nombre": "Instalación de Software",
            "horas": 5, 
            "tarifa_hora": 200,
            "comentario": "Instalación remota",
            "fecha_entrega": "2025-01-05"
        })
        
        # Total = 11,000 > 10,000 -> LICITACION
        
        # Verificar lógica de TipoCompra
        tipo = solicitud.evaluar_tipo_compra(umbral=10000)
        print(f"   -> Total calculado: {solicitud.calcular_total()}")
        print(f"   -> Tipo de Compra evaluado: {tipo.value}")
        assert tipo == TipoCompra.LICITACION, "El tipo debería ser LICITACION"
        
        # Cambiar estado a EN_LICITACION (Simulando flujo de aprobación)
        solicitud.set_estado(EstadoSolicitud.EN_LICITACION)
        
        db.session.add(solicitud)
        db.session.commit()
        print(f"   ✓ Solicitud creada. ID: {solicitud.id_solicitud}, Estado: {solicitud.estado.value}")

        # 1. CREAR LICITACIÓN (→ BORRADOR)
        print("\n[1/10] CREAR LICITACIÓN (→ BORRADOR)...")
        data_licitacion = {
            "limiteMonto": 15000,
            "fecha_limite": "2025-12-31",
            "solicitud_id": solicitud.id_solicitud,
            "items": solicitud._items_simulados # Pasamos los mismos items simulados
        }
        res = client.post('/api/licitaciones', json=data_licitacion)
        assert res.status_code == 201, f"Failed: {res.data}"
        id_licitacion = res.json['id_licitacion']
        print(f"   ✓ Licitación creada. ID: {id_licitacion}, Estado: BORRADOR")
        
        # 1.1 VERIFICAR DOCUMENTOS REQUERIDOS
        print("   -> Verificando documentos requeridos por defecto...")
        res_docs = client.get(f'/api/licitaciones/{id_licitacion}/documentos-requeridos')
        assert res_docs.status_code == 200, f"Failed getting docs: {res_docs.data}"
        
        # 2. APROBAR (BORRADOR → NUEVA)
        print("\n[2/10] APROBAR LICITACIÓN (BORRADOR → NUEVA)...")
        from app.services.licitaciones.licitacion_service import LicitacionService
        from app.services.licitaciones.aprobacion_service import AprobacionService
        
        service = LicitacionService()
        aprobacion_service = AprobacionService()
        
        licitacion = service.obtener_por_id(id_licitacion)
        print(f"   ✓ Estado inicial: {licitacion.estado_actual.get_nombre()}")
        
        aprobacion_service.aprobar_licitacion(id_licitacion, id_supervisor=1, comentarios="Aprobado para simulación")
        
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "NUEVA"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 3. ENVIAR INVITACIONES (NUEVA → EN_INVITACION)
        print("\n[3/10] ENVIAR INVITACIONES (NUEVA → EN_INVITACION)...")
        licitacion.invitaciones_enviadas = True
        db.session.commit()
        
        service.avanzar_estado(id_licitacion)
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "EN_INVITACION"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 4. CREAR PROVEEDORES (necesarios para las propuestas)
        print("\n[4/10] CREAR PROVEEDORES...")
        from app.models.licitaciones.proveedor import Proveedor
        
        proveedor1 = Proveedor(
            nombre="TechSupply S.A.C.",
            ruc="20123456789",
            direccion="Av. Tecnología 123",
            telefono="987654321",
            email="contacto@techsupply.com"
        )
        proveedor2 = Proveedor(
            nombre="InnoSolutions E.I.R.L.",
            ruc="20987654321",
            direccion="Jr. Innovación 456",
            telefono="912345678",
            email="ventas@innosolutions.com"
        )
        
        db.session.add(proveedor1)
        db.session.add(proveedor2)
        db.session.commit()
        
        print(f"   ✓ Proveedor 1: {proveedor1.nombre} (ID: {proveedor1.id_proveedor})")
        print(f"   ✓ Proveedor 2: {proveedor2.nombre} (ID: {proveedor2.id_proveedor})")
        
        # 5. REGISTRAR PROPUESTAS
        print("\n[5/10] REGISTRAR PROPUESTAS (EN_INVITACION)...")
        
        # Registrar 2 propuestas
        for i, prov_id in enumerate([proveedor1.id_proveedor, proveedor2.id_proveedor], 1):
            data_propuesta = {
                'proveedorId': prov_id,
                'items': json.dumps([{"codigo": f"IT0{i}", "cantidad": 10, "precio": 4500}])
            }
            
            data_files = {
                'documentosEconomicos': (io.BytesIO(b"dummy eco"), f'eco_{i}.pdf')
            }
            
            data_post = {**data_propuesta, **data_files}
            
            res = client.post(f'/api/licitaciones/{id_licitacion}/propuestas', 
                            data=data_post, 
                            content_type='multipart/form-data')
            assert res.status_code == 201, f"Failed propuesta {i}: {res.data}"
            print(f"   ✓ Propuesta {i} registrada. ID: {res.json['id_propuesta']}")
        
        # 5. FINALIZAR REGISTRO (EN_INVITACION → CON_PROPUESTAS)
        print("\n[5/10] FINALIZAR REGISTRO (EN_INVITACION → CON_PROPUESTAS)...")
        res = client.put(f'/api/licitaciones/{id_licitacion}/finalizarRegistro')
        assert res.status_code == 200, f"Failed: {res.data}"
        
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "CON_PROPUESTAS"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 6. ENVIAR A EVALUACIÓN TÉCNICA (CON_PROPUESTAS → EVALUACION_TECNICA)
        print("\n[6/10] ENVIAR A EVALUACIÓN TÉCNICA (CON_PROPUESTAS → EVALUACION_TECNICA)...")
        service.avanzar_estado(id_licitacion)
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "EVALUACION_TECNICA"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 7. EVALUAR TÉCNICAMENTE (EVALUACION_TECNICA → EVALUACION_ECONOMIA)
        print("\n[7/10] EVALUAR TÉCNICAMENTE (EVALUACION_TECNICA → EVALUACION_ECONOMIA)...")
        
        # Aprobar ambas propuestas técnicamente
        data_eval_tec = {
            "supervisor_id": 2,
            "evaluaciones": [
                {"propuesta_id": 1, "aprobada": True, "motivo_rechazo": None},
                {"propuesta_id": 2, "aprobada": True, "motivo_rechazo": None}
            ]
        }
        
        res = client.post(f'/api/licitaciones/{id_licitacion}/evaluacion-tecnica', 
                        json=data_eval_tec)
        
        print(f"   DEBUG: Response status: {res.status_code}")
        print(f"   DEBUG: Response body: {res.data}")
        assert res.status_code == 200, f"Failed: status={res.status_code}, body={res.data}"
        
        licitacion = service.obtener_por_id(id_licitacion)
        print(f"   DEBUG: Estado después de eval técnica: {licitacion.estado_actual.get_nombre()}")
        assert licitacion.estado_actual.get_nombre() == "EVALUACION_ECONOMIA", \
            f"Expected EVALUACION_ECONOMIA but got {licitacion.estado_actual.get_nombre()}"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        print(f"   ✓ Propuestas aprobadas técnicamente: 2")
        
        # 8. EVALUAR ECONÓMICAMENTE (EVALUACION_ECONOMIA → ADJUDICADA)
        print("\n[8/10] EVALUAR ECONÓMICAMENTE (EVALUACION_ECONOMIA → ADJUDICADA)...")
        
        data_eval_eco = {
            "supervisor_id": 3,
            "evaluaciones": [
                {"propuesta_id": 1, "puntuacion": 95, "justificacion": "Mejor oferta técnica y económica"},
                {"propuesta_id": 2, "puntuacion": 85, "justificacion": "Buena oferta pero segunda mejor"}
            ]
        }
        
        res = client.post(f'/api/licitaciones/{id_licitacion}/evaluacion-economica', 
                        json=data_eval_eco)
        assert res.status_code == 200, f"Failed: {res.data}"
        
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "ADJUDICADA"
        assert licitacion.propuesta_ganadora is not None
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        print(f"   ✓ Ganador: Proveedor ID {licitacion.propuesta_ganadora.proveedor_id}")
        
        print("\n[9/10] GESTIÓN DE CONTRATO (→ CON_CONTRATO)...")
        
        # Paso 1: Generar Plantilla
        print("   -> Generando plantilla de contrato...")
        data_plantilla = {"supervisorId": 1}
        res_plantilla = client.post(f'/api/licitaciones/{id_licitacion}/contrato/plantilla', json=data_plantilla)
        assert res_plantilla.status_code == 201, f"Failed Template: {res_plantilla.data}"
        print(f"   ✓ Plantilla generada: {res_plantilla.json.get('url_plantilla')}")
        
        # Paso 2: Cargar Firmado
        print("   -> Cargando contrato firmado...")
        data_contrato = {
            "archivoContrato": (io.BytesIO(b"%PDF-1.4 content"), 'contrato_firmado.pdf')
        }
        res = client.post(f'/api/licitaciones/{id_licitacion}/contrato', 
                        data=data_contrato, 
                        content_type='multipart/form-data')
        assert res.status_code == 201, f"Failed Upload: {res.data}"
        
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "CON_CONTRATO", f"Estado esperado CON_CONTRATO, actual {licitacion.estado_actual.get_nombre()}"
        assert licitacion.contrato.estado.value == "FIRMADO_CARGADO", "El contrato debería estar en estado FIRMADO_CARGADO"
        print(f"   ✓ Contrato firmado cargado. Estado: {licitacion.estado_actual.get_nombre()}")
        
        # 10. ENVIAR A ORDEN DE COMPRA (CON_CONTRATO → FINALIZADA)
        print("\n[10/10] ENVIAR A ORDEN DE COMPRA (CON_CONTRATO → FINALIZADA)...")
        
        res = client.post(f'/api/licitaciones/{id_licitacion}/orden-compra')
        assert res.status_code == 201, f"Failed: {res.data}"
        
        licitacion = service.obtener_por_id(id_licitacion)
        assert licitacion.estado_actual.get_nombre() == "FINALIZADA"
        print(f"   ✓ Estado: {licitacion.estado_actual.get_nombre()}")
        
        print("\n" + "=" * 80)
        print("CICLO COMPLETO VERIFICADO EXITOSAMENTE")
        print("=" * 80)
        print(f"\nEstados recorridos:")
        print("  1. BORRADOR")
        print("  2. NUEVA")
        print("  3. EN_INVITACION")
        print("  4. CON_PROPUESTAS")
        print("  5. EVALUACION_TECNICA")
        print("  6. EVALUACION_ECONOMIA")
        print("  7. ADJUDICADA")
        print("  8. CON_CONTRATO")
        print("  9. FINALIZADA")
        print("\nTODAS LAS TRANSICIONES EXITOSAS")

if __name__ == '__main__':
    try:
        verify_full_lifecycle()
    except AssertionError as e:
        print(f"\nASSERTION ERROR: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
