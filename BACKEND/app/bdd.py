from flask_sqlalchemy import SQLAlchemy
# la conexion de abajo es un ejemplo para una bd local
#coneccion="mysql+mysqlconnector://root:Karlo123%40@localhost:3306/tera-ia-v2" 
#OJO si tienen dudas le preguntan a gpt para que les explique el codigo de este archivo o sea bdd.py
# (://root:Karlo123%40@localhost:3306) <-- dir de edificio
# (/tera-ia-v2) <-- numero de departamento
#coneccion = "mysql+mysqlconnector://admin:Fisi2025@sadi.cla8usouypll.us-east-2.rds.amazonaws.com:3306/sadi"
#esta es la conexion para mi local 
#modifiquen esta linea para la suya o en todo caso cuando tengamos remoto pondremos el link fijo

coneccion="mysql+mysqlconnector://admin:myservergod@compras.cjme8uwesdzz.us-east-2.rds.amazonaws.com:3306/moduloCompras"

db = SQLAlchemy()
