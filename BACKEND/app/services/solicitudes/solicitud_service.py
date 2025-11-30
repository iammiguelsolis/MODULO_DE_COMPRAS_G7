from app.bdd import db
from app.models.solicitudes.solicitud import Solicitud
from app.models.solicitudes.items import MaterialSolicitado, ServicioSolicitado

class SolicitudService:
  
  def crear_solicitud(self, data_json: dict):
    
    titulo = data_json.get('titulo', 'Solicitud Sin Título')
    notas_adicionales = data_json.get('notas_adicionales', '')
    lista_items = data_json.get('items', [])
    nueva_solicitud = Solicitud(titulo, notas_adicionales)
    
    try:
      items_objetos = self._construir_items_desde_json(lista_items)
      nueva_solicitud.agregar_items(items_objetos)
      db.session.add(nueva_solicitud)
      db.session.commit()
      return nueva_solicitud
    except Exception as e:  
      db.session.rollback()
      raise e
    
  def _construir_items_desde_json(self, data_items: list):
    objetos_items = []
    for item_json in data_items:
      tipo = item_json.get('tipo', '').upper()
      
      if tipo == 'MATERIAL':
        nuevo_item = MaterialSolicitado(
          nombre_material=item_json.get('nombre'),
          cantidad=item_json.get('cantidad'),
          precio_unitario=item_json.get('precio_unitario'),
          comentario=item_json.get('comentario')
        )
      elif tipo == 'SERVICIO':
        nuevo_item = ServicioSolicitado(
          nombre_servicio=item_json.get('nombre'),
          tarifa_hora=item_json.get('tarifa_hora'),
          horas_estimadas=item_json.get('horas_estimadas'),
          comentario=item_json.get('comentario')
        )
      else:
        raise ValueError(f"Tipo de item desconocido: {tipo}")
      
      objetos_items.append(nuevo_item)
    return objetos_items
  
  def obtener_por_id(self, id_solicitud):
    return Solicitud.query.get(id_solicitud)
  
  def obtener_todas(self):
    return Solicitud.query.all()
  
  def procesar_aprobacion(self, id_solicitud):
    solicitud = self.obtener_por_id(id_solicitud)
    
    try:
      solicitud.aprobar()
      db.session.commit()
      return solicitud
    except Exception as e:
      db.session.rollback()
      raise e