import { Link } from "react-router-dom";
import styles from "./Pagina.module.css";

// Página 404: se muestra cuando la dirección no existe.
export default function NotFound() {
  return (
    <div className={styles.aviso}>
      <title>No encontrado | Teitos</title>
      <p className={styles.codigo}>404</p>
      <h1 className={styles.titulo}>Esta página no existe</h1>
      <Link to="/" className={styles.volver}>
        Volver al inicio
      </Link>
    </div>
  );
}
