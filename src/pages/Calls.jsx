import CallCard from "../components/CallCard.jsx";
import useCalls from "../hooks/useCalls.js";
import styles from "./Pagina.module.css";

export default function Calls() {
  const { convocatorias, estado } = useCalls();

  return (
    <>
      <title>Convocatorias | Teitos</title>
      <h1 className={styles.titulo}>Convocatorias</h1>
      {estado === "cargando" && <p className={styles.estado}>Cargando...</p>}
      {estado === "error" && (
        <p className={`${styles.estado} ${styles.error}`}>
          No se han podido cargar las convocatorias.
        </p>
      )}
      {estado === "vacio" && (
        <p className={styles.estado}>No hay ninguna convocatoria.</p>
      )}
      {estado === "ok" && (
        <div className={styles.rejilla}>
          {convocatorias.map((c) => (
            <CallCard key={c.id} convocatoria={c} />
          ))}
        </div>
      )}
    </>
  );
}
