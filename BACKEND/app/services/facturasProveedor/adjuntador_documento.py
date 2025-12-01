from app.models.facturasProveedor.factura_proveedor import FacturaProveedor
from app.models.facturasProveedor.documento_adjunto import DocumentoAdjunto
from app.services.supabase_client import SupabaseClient
from app.models.facturasProveedor.enums import DocTipo

class AdjuntadorDocumento:
    
    def adjuntar_documento(self, factura: FacturaProveedor, documento: DocumentoAdjunto, file_content: bytes = None):
        print(f"Vinculando archivo {documento.nombre_archivo} a la factura {factura.numero_factura}...")
        
        if file_content:
            try:
                supabase = SupabaseClient().get_client()
                bucket_name = "facturas-proveedores"
                
                # Definimos la ruta: ID_Factura/Nombre_Archivo
                # Asegúrate de que factura.id no sea None (debes haber guardado la factura antes)
                if not factura.id:
                    raise Exception("La factura debe tener ID antes de subir archivos")

                file_path = f"{factura.id}/{documento.nombre_archivo}"
                
                # 1. Determinar el Content-Type correcto
                content_type = "application/pdf"
                if documento.tipo.name == "XML": # Asumiendo que usas tu Enum DocTipo
                    content_type = "application/xml"
                elif documento.tipo.name == "PDF":
                    content_type = "application/pdf"
                
                # 2. Subir a Supabase con opciones (Metadata)
                # upsert=True reemplaza el archivo si ya existe
                response = supabase.storage.from_(bucket_name).upload(
                    path=file_path, 
                    file=file_content, 
                    file_options={"content-type": content_type, "upsert": "true"} 
                )
                
                # 3. Obtener URL Pública
                # Nota: supabase-py a veces devuelve la URL directa sin llamar a la API
                public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
                
                # 4. Actualizar el modelo
                documento.ruta = public_url # Guardamos la URL de Supabase en la BD
                
                print(f"✅ Archivo subido exitosamente: {public_url}")
                
            except Exception as e:
                print(f"❌ Error subiendo a Supabase: {e}")
                raise e # Relanzar error para que la ruta sepa que falló
        
        # Vinculación lógica (Lista en memoria)
        if not factura.documentos_adjuntos:
            factura.documentos_adjuntos = []
        factura.documentos_adjuntos.append(documento)