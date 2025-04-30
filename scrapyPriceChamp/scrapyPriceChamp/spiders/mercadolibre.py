import scrapy
import json

class MercadoLibreSpider(scrapy.Spider):
    name = "mercadolibre"
    start_urls = [
        "https://listado.mercadolibre.com.co/ropa-deportiva-mujer?sb=rb#D[A:ropa%20deportiva%20mujer]"
    ]

    # Cambia este número para definir cuántas páginas quieres recorrer
    max_pages = 5
    current_page = 1
    resultados = []

    def parse(self, response):
        productos = response.css("div.andes-card")

        for producto in productos:
            titulo = producto.css("h3.poly-component__title-wrapper a::text").get()
            precio = producto.css("div.poly-price__current span.andes-money-amount__fraction::text").get()
            enlace = producto.css("h3.poly-component__title-wrapper a::attr(href)").get()
            imagen = producto.css("div.poly-card__portada img::attr(src)").get()

            if titulo and precio:
                self.resultados.append({
                    "titulo": titulo.strip(),
                    "precio": precio.strip(),
                    "enlace": enlace,
                    "imagen": imagen
                })

        # Seguir a la siguiente página si no se ha alcanzado el límite
        if self.current_page < self.max_pages:
            next_page = response.css('a.andes-pagination__link[title="Siguiente"]::attr(href)').get()
            if next_page:
                self.current_page += 1
                yield response.follow(next_page, callback=self.parse)
            else:
                self.guardar_resultados()
        else:
            self.guardar_resultados()

    def guardar_resultados(self):
        with open("productos_mercadolibre.json", "w", encoding="utf-8") as f:
            json.dump(self.resultados, f, ensure_ascii=False, indent=2)
