from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Configuration
user = 'pizarro'
password = 'TuPass123*'
host = 'compras.cjme8uwesdzz.us-east-2.rds.amazonaws.com'
port = '3306'
database = 'solicitud' # Trying one of the known schemas

connection_string = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"

print(f"=== Verifying Database Connection ===")
print(f"Host: {host}")
print(f"User: {user}")
print(f"Target DB: {database}")

try:
    engine = create_engine(connection_string)
    with engine.connect() as connection:
        print("\n✅ Connection successful!")
        
        print("\n--- Available Databases ---")
        try:
            result = connection.execute(text("SHOW DATABASES;"))
            for row in result:
                print(f" - {row[0]}")
        except Exception as e:
            print(f"Could not list databases: {e}")
            
        print("\n--- Current User ---")
        try:
            result = connection.execute(text("SELECT CURRENT_USER();"))
            for row in result:
                print(f"User: {row[0]}")
        except Exception as e:
            print(f"Could not get current user: {e}")

except SQLAlchemyError as e:
    print(f"\n❌ Connection failed: {e}")
