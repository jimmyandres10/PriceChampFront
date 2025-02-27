/* function Home() {
    return (
        <div>
            HOLA ANGELICAAAAAAA
            COMO ESTAAAS?
        </div>
    )
}

export default Home; */

import ListaProductos from "../../../components/ListaProductos";

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a PriceChamp</h1>
            <ListaProductos />
        </div>
    );
};

export default Home;
