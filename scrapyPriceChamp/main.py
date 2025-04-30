from fastapi import FastAPI, HTTPException
from firebase_admin import credentials, firestore, initialize_app
import firebase_admin

# Inicializar Firebase
cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred)
db = firestore.client()

# Inicializar FastAPI
app = FastAPI(title="Web Scraping API")

@app.get("/data")
async def get_data(field: str = None, value: str = None, limit: int = 10):
    try:
        # Consultar Firestore
        collection_ref = db.collection("scraped_data")
        
        # Si se proporcionan field y value, filtrar
        if field and value:
            query_ref = collection_ref.where(field, "==", value).limit(limit)
        else:
            query_ref = collection_ref.limit(limit)
        
        docs = query_ref.stream()

        # Procesar resultados
        results = [doc.to_dict() for doc in docs]
        if not results:
            raise HTTPException(status_code=404, detail="No se encontraron datos")

        return {"data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)