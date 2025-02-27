from fastapi import FastAPI
from scraping import obtener_productos  # Importa la función de scraping
import uvicorn

app = FastAPI()

@app.get("/productos")
async def obtener_productos_api():
    productos = obtener_productos("https://listado.mercadolibre.com.co/laptops")
    return {"productos": productos}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
