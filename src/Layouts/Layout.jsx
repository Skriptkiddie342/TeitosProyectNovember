import { Outlet } from "react-router-dom";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";

export default function Layout() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <p className="aviso-aula">Ejercicio de Routing</p>
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
