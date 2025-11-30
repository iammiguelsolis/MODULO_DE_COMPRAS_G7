from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.supervisores.supervisor_compra import SupervisorCompra
from app.models.licitaciones.supervisores.supervisor_tecnico import SupervisorTecnico
from app.models.licitaciones.supervisores.supervisor_economico import SupervisorEconomico

class EvaluacionService:
    """
    Servicio encargado de orquestar el proceso de evaluación de licitaciones.
    Configura y ejecuta la Cadena de Responsabilidad (Chain of Responsibility) de supervisores.
    """
    
    def configurar_cadena(self, id_sup_compra, id_sup_tecnico, id_sup_economico):
        """
        Construye la cadena de aprobación:
        SupervisorCompra -> SupervisorTecnico -> SupervisorEconomico
        
        Retorna el primer eslabón de la cadena.
        """
        sup_compra = SupervisorCompra(id_sup_compra)
        sup_tecnico = SupervisorTecnico(id_sup_tecnico)
        sup_economico = SupervisorEconomico(id_sup_economico)
        
        # Encadenamiento fluido
        sup_compra.set_siguiente(sup_tecnico).set_siguiente(sup_economico)
        
        return sup_compra
    
    def evaluar_licitacion(self, id_licitacion, ids_supervisores):
        """
        Ejecuta la evaluación completa de la licitación pasando por toda la cadena.
        
        Args:
            id_licitacion: ID de la licitación a evaluar.
            ids_supervisores: Dict con IDs {'compra': 1, 'tecnico': 2, 'economico': 3}
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Configurar la cadena con los supervisores asignados
        cadena = self.configurar_cadena(
            id_sup_compra=ids_supervisores.get('compra'),
            id_sup_tecnico=ids_supervisores.get('tecnico'),
            id_sup_economico=ids_supervisores.get('economico')
        )
        
        try:
            # Iniciar el proceso de evaluación desde el primer eslabón
            resultado = cadena.procesar(licitacion)
            
            if resultado:
                # Si la cadena retorna True, significa que todos aprobaron
                # y el estado ya debería haber avanzado a ADJUDICADA (por el Sup. Económico)
                db.session.commit()
                return {
                    "success": True, 
                    "mensaje": "Evaluación completada exitosamente. Licitación adjudicada.",
                    "estado_final": licitacion.estado_actual.get_nombre()
                }
            else:
                # Si retorna False, algún supervisor rechazó y la licitación se canceló
                db.session.commit() # Commit para guardar el estado CANCELADA y motivos
                return {
                    "success": False, 
                    "mensaje": "Evaluación rechazada por uno de los comités.",
                    "estado_final": licitacion.estado_actual.get_nombre()
                }
                
        except Exception as e:
            db.session.rollback()
            raise e
            
    def registrar_evaluacion_tecnica(self, id_licitacion, id_supervisor, evaluaciones_data):
        """
        Registra la evaluación técnica de las propuestas (Paso previo a la cadena completa).
        Actualiza el estado de 'aprobada_tecnicamente' de cada propuesta.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        # Validar estado correcto
        if licitacion.estado_actual.get_nombre() != "EVALUACION_TECNICA":
            raise ValueError("La licitación no está en etapa de evaluación técnica")
            
        supervisor = SupervisorTecnico(id_supervisor)
        
        try:
            # Procesar cada evaluación recibida
            for eval_item in evaluaciones_data:
                propuesta_id = eval_item.get('propuesta_id')
                aprobada = eval_item.get('aprobada')
                motivo = eval_item.get('motivo_rechazo')
                
                # Buscar propuesta en la licitación
                propuesta = next((p for p in licitacion.propuestas if p.id_propuesta == propuesta_id), None)
                
                if propuesta:
                    if aprobada:
                        # En un caso real, aquí validaríamos documentos individuales
                        supervisor.aprobar_propuesta(propuesta) # Esto solo lee, necesitamos setear
                        propuesta.aprobada_tecnicamente = True
                    else:
                        supervisor.rechazar_propuesta(propuesta, motivo)
            
            # Asegurar que los cambios estén en la sesión antes de verificar
            db.session.flush()
            
            # Intentar avanzar estado (Si hay aprobadas -> EVALUACION_ECONOMIA)
            # El método siguiente() del estado EVALUACION_TECNICA hace esta validación
            licitacion.siguiente_estado()
            
            db.session.commit()
            return {"success": True, "mensaje": "Evaluación técnica registrada", "nuevo_estado": licitacion.estado_actual.get_nombre()}
            
        except Exception as e:
            db.session.rollback()
            raise e

    def registrar_evaluacion_economica(self, id_licitacion, id_supervisor, evaluaciones_data):
        """
        Registra puntuaciones económicas y selecciona ganador.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
            
        if licitacion.estado_actual.get_nombre() != "EVALUACION_ECONOMIA":
            raise ValueError("La licitación no está en etapa de evaluación económica")
            
        supervisor = SupervisorEconomico(id_supervisor)
        
        try:
            # Registrar puntuaciones
            for eval_item in evaluaciones_data:
                propuesta_id = eval_item.get('propuesta_id')
                puntuacion = eval_item.get('puntuacion')
                justificacion = eval_item.get('justificacion')
                
                propuesta = next((p for p in licitacion.propuestas if p.id_propuesta == propuesta_id), None)
                if propuesta:
                    supervisor.aprobar(propuesta, puntuacion, justificacion)
            
            # El supervisor económico valida (selecciona ganador) y avanza
            resultado = supervisor.validar(licitacion)
            
            if resultado:
                db.session.commit()
                return {"success": True, "mensaje": "Ganador seleccionado y licitación adjudicada"}
            else:
                # Si no hay ganador viable
                licitacion.cancelar()
                db.session.commit()
                return {"success": False, "mensaje": "No se seleccionó ganador. Licitación cancelada."}
                
        except Exception as e:
            db.session.rollback()
            raise e
