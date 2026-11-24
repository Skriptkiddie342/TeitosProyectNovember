import { Link } from "react-router-dom";
import styles from "./CallCard.module.css";

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
      <p className={styles.renta}>Renta desde {rentaDesde} €</p>
      {estado === "abierta" && (
        <Link to={`/convocatorias/${id}`} className={styles.boton}>
          Presentar solicitud
        </Link>
      )}
    </article>
  );
}

export default CallCard;
