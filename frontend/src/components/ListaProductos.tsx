import { useEffect, useState } from "react";
import { obtenerProductos } from "../api/productos";

interface Producto {
    titulo: string;
    precio: string;
}

const ListaProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const fetchProductos = async () => {
            const productosObtenidos = await obtenerProductos();
            setProductos(productosObtenidos);
        };
        fetchProductos();
    }, []);

    return (
        <div>
            <h2>Lista de Productos</h2>
            <ul>
                {productos.map((producto, index) => (
                    <li key={index}>
                        <strong>{producto.titulo}</strong> - ${producto.precio}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaProductos;

