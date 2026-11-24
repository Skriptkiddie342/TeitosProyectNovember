import styles from "./SolicitudForm.module.css";

function EstadoViviendas({ estado }) {
  if (estado === "cargando") {
    return <p role="status">Cargando viviendas...</p>;
  }
  if (estado === "error") {
    return (
      <p className={styles.error} role="alert">
        No se han podido cargar las viviendas. Tu selección está guardada:
        recarga la página para volver a intentarlo.
      </p>
    );
  }
  return null;
}

export default EstadoViviendas;
