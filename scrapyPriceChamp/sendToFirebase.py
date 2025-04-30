import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Inicializar Firebase usando el archivo de configuración JSON
def inicializar_firebase():
    ruta_credenciales = "serviceAccountKey"  # Asegúrate que el archivo esté en esta ruta
    if not os.path.exists(ruta_credenciales):
        raise FileNotFoundError(f"No se encontró el archivo: {ruta_credenciales}")
    
    cred = credentials.Certificate(ruta_credenciales)
    firebase_admin.initialize_app(cred)
    print("Firebase inicializado correctamente.")


# 2. Leer el archivo JSON
def leer_json(ruta_archivo):
    with open(ruta_archivo, "r", encoding="utf-8") as f:
        return json.load(f)

# 3. Enviar datos a Firebase en un único documento dentro de la colección "productos".
def enviar_a_firebase(ruta_archivo, datos):
    db = firestore.client()
    coleccion = db.collection("productos")
    nombre_documento = os.path.splitext(os.path.basename(ruta_archivo))[0]
    doc_ref = coleccion.document(nombre_documento)
    doc_ref.set({
        "productos": datos,
        "fecha_actualizacion": firestore.SERVER_TIMESTAMP
    })
    print(f"Datos enviados a Firebase en la colección 'productos', documento '{nombre_documento}'.")

# 4. Ejecución del proceso
if __name__ == "__main__":
    inicializar_firebase()
    
    ruta_archivo = "scrapyPriceChamp/spiders/productos_mercadolibre.json"
    
    datos = leer_json(ruta_archivo)
    
    enviar_a_firebase(ruta_archivo, datos)
