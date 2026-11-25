import { Link, useParams } from "react-router-dom";
import useDwelling from "../hooks/useDwelling.js";
import DwellingDetail from "../components/DwellingDetail.jsx";
import styles from "./Pagina.module.css";

// Página de una vivienda. El id sale de la URL (/viviendas/773). Según el
// estado muestra cargando, que no existe, el error o el detalle.
export default function DwellingPage() {
  const { id } = useParams();
  const { vivienda, estado } = useDwelling(id);

  if (estado === "cargando") {
    return (
      <>
        <title>Cargando vivienda | Teitos</title>
        <p className={styles.estado}>Cargando...</p>
      </>
    );
  }

  if (estado === "noexiste") {
    return (
      <div className={styles.aviso}>
        <title>Vivienda no encontrada | Teitos</title>
        <h1 className={styles.titulo}>Esta vivienda no existe</h1>
        <p>No hay ninguna vivienda con el identificador {id}.</p>
        <Link to="/viviendas" className={styles.volver}>
          Volver al buscador
        </Link>
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div className={styles.aviso}>
        <title>Error | Teitos</title>
        <h1 className={`${styles.titulo} ${styles.error}`}>
          No se ha podido cargar la vivienda
        </h1>
        <Link to="/viviendas" className={styles.volver}>
          Volver al buscador
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detalle}>
      <title>{`${vivienda.referencia} | Teitos`}</title>
      <p>
        <Link to="/viviendas" className={styles.volver}>
          ← Volver al buscador
        </Link>
      </p>
      <DwellingDetail vivienda={vivienda} />
    </div>
  );
}
