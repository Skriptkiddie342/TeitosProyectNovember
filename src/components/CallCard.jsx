import { Link } from "react-router-dom";
import styles from "./CallCard.module.css";

// Tarjeta de una convocatoria. El botón solo sale si está abierta y, si
// rentaDesde es null (como en 26-6-MAD), pone "Sin viviendas libres".
function CallCard({ convocatoria }) {
  const { id, codigo, provincia, estado, fechaCierre, unidades, rentaDesde } =
    convocatoria;

  return (
    <article className={styles.tarjeta}>
      <h3 className={styles.codigo}>
        <Link to={`/convocatorias/${id}`}>{codigo}</Link>
      </h3>
      <p className={styles.provincia}>{provincia}</p>
      <p className={styles.estado}>Estado: {estado}</p>
      <p>Cierre: {fechaCierre}</p>
      <p>Unidades: {unidades}</p>
      <p className={styles.renta}>
        {rentaDesde === null
          ? "Sin viviendas libres"
          : `Renta desde ${rentaDesde} €`}
      </p>
      {estado === "abierta" && (
        <Link to={`/convocatorias/${id}`} className={styles.boton}>
          Presentar solicitud
        </Link>
      )}
    </article>
  );
}

export default CallCard;
