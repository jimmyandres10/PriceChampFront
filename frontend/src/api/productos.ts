export const obtenerProductos = async () => {
  try {
      const response = await fetch("http://127.0.0.1:8000/productos");
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      return data.productos;
  } catch (error) {
      console.error("Error:", error);
      return [];
  }
};

