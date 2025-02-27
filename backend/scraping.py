#python -m pip install requests beautifulsoup4 transformers
#python -m pip install torch torchvision torchaudio
#torch → El núcleo de PyTorch (necesario para BERT).
#torchvision → Librería de visión (no la necesitas, pero se instala con torch).
#torchaudio → Librería de audio (también opcional).

#Esto instalará:

#requests (para hacer solicitudes HTTP)
#beautifulsoup4 (para extraer datos de HTML)
#transformers (para usar BERT)

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0"}

def obtener_productos(url, tienda):
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    productos = []
    
    for item in soup.select(".ui-search-result__content-wrapper"):
        titulo = item.select_one(".ui-search-item__title").text.strip()
        precio = item.select_one(".price-tag-fraction").text.strip()
        productos.append({"titulo": titulo, "precio": precio, "tienda": tienda})
    
    return productos
