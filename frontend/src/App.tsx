/* import { useEffect } from "react";
import AppRoutes from "./app/router/AppRoutes"
import useAuth from "./shared/store/useAuth"



function App() {

  const { getToken } = useAuth();

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AppRoutes />
  )
}

export default App  */


import { useEffect, useState } from "react";
import { fetchProducts } from "./api";

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProductos);
  }, []);

  return (
    <div>
      <h1>Productos Scrapeados</h1>
      <ul>
        {productos.map((p: any, index) => (
          <li key={index}>
            {p.titulo} - ${p.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


































