from app.bdd import db
from app.models.licitaciones.licitacion import Licitacion
from app.models.licitaciones.propuesta import PropuestaProveedor

class EvaluacionService:
    """
    Servicio encargado de la lógica de evaluación técnica y económica.
    Orquesta los cambios de estado y validaciones de ganadores.
    """

    def listar_propuestas_para_evaluacion(self, id_licitacion):
        """
        Lista las propuestas formateadas para la pantalla de evaluación.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")
        
        # Aquí podrías usar tu DTO si prefieres, por simplicidad devolvemos dicts
        from app.dtos.licitaciones.propuesta_dto import PropuestaResponseDTO
        return [PropuestaResponseDTO.from_model(p) for p in licitacion.propuestas]

    def iniciar_evaluacion_tecnica(self, id_licitacion):
        """
        Cambia el estado de CON_PROPUESTAS a EVALUACION_TECNICA.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")

        # Validar estado actual
        nombre_estado = licitacion.estado_actual.get_nombre()
        if nombre_estado not in ["CON_PROPUESTAS", "EN_INVITACION"]:
            # A veces se pasa directo de invitación si se cierra manual
            pass 
        
        # Forzamos avance al siguiente estado (EVALUACION_TECNICA)
        # Asumiendo que el estado actual tiene implementado siguiente() hacia allá
        # O usamos la lógica de transición manual si el State Pattern lo requiere
        try:
            # Si estamos en CON_PROPUESTAS, siguiente() lleva a EVALUACION_TECNICA
            licitacion.siguiente_estado()
            db.session.commit()
            return licitacion
        except Exception as e:
            db.session.rollback()
            raise e

    def registrar_evaluacion_tecnica(self, id_licitacion, id_propuesta, data):
        """
        Guarda el resultado técnico (Aprobado/Rechazado) de una propuesta.
        """
        propuesta = PropuestaProveedor.query.get(id_propuesta)
        if not propuesta or propuesta.licitacion_id != id_licitacion:
            raise ValueError("Propuesta no encontrada o no pertenece a la licitación")

        try:
            propuesta.aprobada_tecnicamente = data.get('aprobada_tecnicamente', False)
            propuesta.motivo_rechazo_tecnico = data.get('motivo_rechazo_tecnico')
            
            # (Opcional) Aquí podrías actualizar validación de documentos individuales
            
            db.session.commit()
            return {"mensaje": "Evaluación técnica guardada"}
        except Exception as e:
            db.session.rollback()
            raise e

    def finalizar_evaluacion_tecnica(self, id_licitacion):
        """
        Verifica si hay propuestas aptas y avanza a EVALUACION_ECONOMIA.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")

        # Verificar que al menos una propuesta haya sido aprobada técnicamente
        aprobadas = [p for p in licitacion.propuestas if p.aprobada_tecnicamente]
        
        if not aprobadas:
            # Si todas fallaron, la licitación debería cancelarse o declararse desierta
            licitacion.cancelar()
            db.session.commit()
            return {"mensaje": "Ninguna propuesta aprobó la técnica. Licitación CANCELADA."}
        
        try:
            # Avanzar estado: EVALUACION_TECNICA -> EVALUACION_ECONOMIA
            licitacion.siguiente_estado()
            db.session.commit()
            return {"mensaje": "Evaluación técnica finalizada. Pasando a Económica."}
        except Exception as e:
            db.session.rollback()
            raise e

    def registrar_evaluacion_economica(self, id_licitacion, id_propuesta, data):
        """
        Guarda el puntaje económico.
        """
        propuesta = PropuestaProveedor.query.get(id_propuesta)
        if not propuesta:
            raise ValueError("Propuesta no encontrada")

        try:
            propuesta.aprobada_economicamente = data.get('aprobada_economicamente', False)
            propuesta.puntuacion_economica = data.get('puntuacion_economica', 0.0)
            propuesta.justificacion_economica = data.get('justificacion_economica')
            
            db.session.commit()
            return {"mensaje": "Evaluación económica guardada"}
        except Exception as e:
            db.session.rollback()
            raise e

    def adjudicar_licitacion(self, id_licitacion):
        """
        Selecciona la propuesta ganadora (mayor puntaje) y cierra la licitación.
        """
        licitacion = Licitacion.query.get(id_licitacion)
        if not licitacion:
            raise ValueError("Licitación no encontrada")

        # 1. Filtrar solo las que aprobaron técnica y económica
        candidatos = [p for p in licitacion.propuestas if p.aprobada_tecnicamente and p.aprobada_economicamente]
        
        if not candidatos:
            return {"error": "No hay candidatos aprobados para adjudicar"}

        # 2. Elegir la de mayor puntaje
        ganador = max(candidatos, key=lambda p: p.puntuacion_economica or 0)
        
        try:
            # Marcar ganadora
            ganador.es_ganadora = True
            
            # Actualizar referencia en la licitación (opcional si usas la relación property)
            # licitacion.oferta_ganadora_id = ganador.id_propuesta 
            
            # Avanzar estado: EVALUACION_ECONOMIA -> ADJUDICADA
            licitacion.siguiente_estado()
            
            db.session.commit()
            return {
                "mensaje": f"Licitación adjudicada al proveedor {ganador.proveedor.nombre}",
                "ganador_id": ganador.id_propuesta
            }
        except Exception as e:
            db.session.rollback()
            raise e