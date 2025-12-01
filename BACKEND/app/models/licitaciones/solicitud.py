from app.bdd import db
from datetime import datetime

from app.enums.licitaciones.estado_solicitud import EstadoSolicitud
from app.enums.licitaciones.tipo_compra import TipoCompra

class Solicitud(db.Model):
    """
    Modelo de simulación para Solicitud <T extends ItemSolicitado>.
    """
    __tablename__ = 'solicitudes'
    
    id_solicitud = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    comprador_id = db.Column(db.Integer, nullable=False)
    comentarios = db.Column(db.Text, nullable=True)
    
    # Uso de Enum para estado
    estado = db.Column(db.Enum(EstadoSolicitud), default=EstadoSolicitud.PENDIENTE)
    
    # Simulación de items (para cálculo de total)
    # En producción esto sería una relación real. Aquí usaremos un campo temporal o método.
    # Para la simulación, asumiremos que se pueden asignar items.
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._items_simulados = [] # Lista temporal para simulación

    def agregar_item(self, item_data):
        """Simula agregar items para calcular total"""
        self._items_simulados.append(item_data)

    def calcular_total(self):
        """Calcula el total de los items simulados"""
        total = 0.0
        for item in self._items_simulados:
            # Lógica para Material
            if 'cantidad' in item and 'precio_unitario' in item:
                total += item['cantidad'] * item['precio_unitario']
            # Lógica para Servicio
            elif 'horas' in item and 'tarifa_hora' in item:
                total += item['horas'] * item['tarifa_hora']
        return total

    def evaluar_tipo_compra(self, umbral=10000):
        """Determina si es COMPRA o LICITACION basado en el total"""
        total = self.calcular_total()
        if total > umbral:
            return TipoCompra.LICITACION
        return TipoCompra.COMPRA
        
    def set_estado(self, nuevo_estado):
        self.estado = nuevo_estado
