import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import styles from "./Layout.module.css";

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
