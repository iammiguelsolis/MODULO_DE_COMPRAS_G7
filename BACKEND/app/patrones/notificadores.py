from abc import ABC, abstractmethod

class NotificadorProveedor(ABC):
    @abstractmethod
    def enviar(self, destinatario: str, mensaje: str): pass

class NotificadorCorreo(NotificadorProveedor):
    def enviar(self, destinatario: str, mensaje: str):
        print(f"[EMAIL] Enviando a {destinatario}: {mensaje}")

class NotificadorWhatsapp(NotificadorProveedor):
    def enviar(self, destinatario: str, mensaje: str):
        print(f"[WHATSAPP] Enviando a {destinatario}: {mensaje}")

class NotificadorFactory(ABC):
    @abstractmethod
    def crear_notificador(self) -> NotificadorProveedor: pass

class CorreoFactory(NotificadorFactory):
    def crear_notificador(self): return NotificadorCorreo()

class WhatsappFactory(NotificadorFactory):
    def crear_notificador(self): return NotificadorWhatsapp()