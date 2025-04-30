import json
import os
import random
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0)...",
    # otros...
]

def iniciar_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument(f"user-agent={random.choice(USER_AGENTS)}")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def guardar(productos):
    ruta_archivo = os.path.join(os.getcwd(), "productos_falabella.json")
    with open(ruta_archivo, "w", encoding="utf-8") as f:
        json.dump(productos, f, ensure_ascii=False, indent=4)
    print(f"Datos guardados en {ruta_archivo}")

def scrapear():
    driver = iniciar_driver()
    url = "https://www.falabella.com.co/falabella-co/category/cat8560959/Tops"
    driver.get(url)
    time.sleep(5)  # Esperar que cargue JS

    productos = []

    while True:
        # Espera y scroll para asegurarse de que se cargue el contenido
        time.sleep(3)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        # Ajusta el selector según la estructura actual; en este ejemplo uso un selector genérico
        contenedores = driver.find_elements(By.XPATH, "//div[contains(@class, 'grid-pod')]")
        print(f"[INFO] Productos encontrados en esta página: {len(contenedores)}")
        
        for cont in contenedores:
            try:
                name = cont.find_element(By.XPATH, ".//b[contains(@class, 'pod-subTitle')]").text.strip()
            except NoSuchElementException:
                name = None
            try:
                price = cont.find_element(By.XPATH, ".//span[contains(@class, 'copy10') and contains(text(), '$')]").text.strip()
            except NoSuchElementException:
                price = None
            try:
                image_url = cont.find_element(By.XPATH, ".//img").get_attribute("src")
            except NoSuchElementException:
                image_url = None
            try:
                link = cont.find_element(By.XPATH, ".//a").get_attribute("href")
            except NoSuchElementException:
                link = None

            producto = {
                "name": name,
                "price": price,
                "image_url": image_url,
                "product_url": link,
                "fecha_actualizacion": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            productos.append(producto)
        
        # Paginar: buscar el botón siguiente por ID (asegúrate que este selector es correcto)
        try:
            siguiente = driver.find_element(By.ID, "testId-pagination-bottom-arrow-right")
            if siguiente.is_enabled() and siguiente.is_displayed():
                driver.execute_script("arguments[0].click();", siguiente)
                print("[INFO] Clic en el botón Siguiente. Esperando nueva página...")
                time.sleep(5)
            else:
                print("[INFO] Botón siguiente no disponible (deshabilitado o escondido).")
                break
        except NoSuchElementException:
            print("[INFO] Fin de la paginación o no se encontró el botón de siguiente.")
            break

    driver.quit()
    guardar(productos)

if __name__ == "__main__":
    scrapear()
