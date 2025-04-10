import json
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Cargar las variables de entorno del archivo .env
load_dotenv()

# 1. Inicializar Firebase usando credenciales desde la variable de entorno FIREBASE_CONFIG
def inicializar_firebase():
    firebase_config_str = os.getenv("FIREBASE_CONFIG")
    if not firebase_config_str:
        raise ValueError("No se encontró la variable FIREBASE_CONFIG en el entorno.")
    # Convertir el string JSON en un diccionario
    firebase_config = json.loads(firebase_config_str)
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)

# 2. Leer el archivo JSON
def leer_json(ruta_archivo):
    with open(ruta_archivo, "r", encoding="utf-8") as f:
        return json.load(f)

# 3. Enviar datos a Firebase en un único documento dentro de la colección "productos".
#    El ID del documento será el nombre del archivo (sin la extensión).
def enviar_a_firebase(ruta_archivo, datos):
    # Inicializa Firestore
    db = firestore.client()
    # Obtiene la colección "productos"
    coleccion = db.collection("productos")
    # Extrae el nombre base del archivo sin extensión, por ejemplo "productos_falabella"
    nombre_documento = os.path.splitext(os.path.basename(ruta_archivo))[0]
    # Obtiene la referencia al documento dentro de la colección "productos"
    doc_ref = coleccion.document(nombre_documento)
    # Guarda o actualiza el documento
    doc_ref.set({
        "productos": datos,
        "fecha_actualizacion": firestore.SERVER_TIMESTAMP
    })
    print(f"Datos enviados a Firebase en la colección 'productos', documento '{nombre_documento}'.")

# 4. Ejecución del proceso
if __name__ == "__main__":
    # Inicializar Firebase usando las credenciales del entorno (.env)
    inicializar_firebase()
    
    # Define la ruta al archivo JSON; ajusta la ruta según la estructura de tu proyecto.
    ruta_archivo = "scrapyPriceChamp/scrapyPriceChamp/spiders/productos_falabella.json"
    
    # Leer el archivo JSON y obtener los datos
    datos = leer_json(ruta_archivo)
    
    # Enviar los datos a Firebase
    enviar_a_firebase(ruta_archivo, datos)
