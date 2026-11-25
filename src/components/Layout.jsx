import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import styles from "./Layout.module.css";

// Estructura común de todas las páginas: cabecera, contenido y pie. Outlet es
// el hueco donde React Router pone la página de cada ruta.
export default function Layout() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
