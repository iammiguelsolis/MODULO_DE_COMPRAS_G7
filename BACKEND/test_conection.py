# test_connection.py
import mysql.connector
from mysql.connector import Error

def test_direct_connection():
    """Prueba conexión directa sin SQLAlchemy"""
    try:
        print("🔄 Probando conexión directa a MySQL...")
        
        connection = mysql.connector.connect(
            host='compras.cjme8uwesdzz.us-east-2.rds.amazonaws.com',
            port=3306,
            database='test',  # ← Schema correcto
            user='admin',
            password='myservergod',
            connection_timeout=10
        )
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Conectado a MySQL Server version {db_info}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"✅ Schema activo: {record[0]}")
            
            # Listar tablas existentes
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            if tables:
                print(f"\n📋 Tablas existentes en 'test':")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print("\n📋 No hay tablas en el schema 'test' (está vacío)")
            
            cursor.close()
            connection.close()
            print("\n✅ Conexión cerrada correctamente")
            return True
            
    except Error as e:
        print(f"\n❌ Error al conectar a MySQL")
        print(f"📝 Código de error: {e.errno if hasattr(e, 'errno') else 'N/A'}")
        print(f"📝 SQL State: {e.sqlstate if hasattr(e, 'sqlstate') else 'N/A'}")
        print(f"📝 Mensaje: {e.msg if hasattr(e, 'msg') else str(e)}")
        
        error_str = str(e)
        
        if "1045" in error_str or "Access denied" in error_str:
            print("\n💡 Error: Credenciales incorrectas")
            print("   → Verifica usuario 'admin' y password 'myservergod'")
            
        elif "2003" in error_str or "Can't connect" in error_str:
            print("\n💡 Error: No se puede alcanzar el servidor")
            print("   → Verifica Security Group de RDS")
            print("   → Asegúrate que tu IP esté permitida en puerto 3306")
            
        elif "1049" in error_str or "Unknown database" in error_str:
            print("\n💡 Error: El schema 'test' no existe")
            print("   → Conéctate a RDS y crea el schema:")
            print("      CREATE SCHEMA test;")
            
        elif "timeout" in error_str.lower():
            print("\n💡 Error: Timeout de conexión")
            print("   → Verifica que la instancia RDS esté 'Available'")
            print("   → Verifica Security Group")
            
        else:
            print(f"\n💡 Error desconocido: {error_str}")
            
        return False

if __name__ == "__main__":
    print("=" * 70)
    print("🔍 DIAGNÓSTICO DE CONEXIÓN A AWS RDS")
    print("=" * 70)
    print(f"🌍 Host: compras.cjme8uwesdzz.us-east-2.rds.amazonaws.com")
    print(f"📂 Schema: test")
    print(f"👤 Usuario: admin")
    print("=" * 70)
    print()
    
    test_direct_connection()
    
    print("\n" + "=" * 70)