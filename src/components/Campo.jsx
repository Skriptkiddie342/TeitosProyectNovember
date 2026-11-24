import styles from "./SolicitudForm.module.css";

// children recibe los atributos que enlazan el control con su etiqueta,
// su ayuda y su error.
function Campo({ nombre, etiqueta, ayuda, error, children }) {
  const descripcion = [
    ayuda && `${nombre}-ayuda`,
    error && `${nombre}-error`,
  ].filter(Boolean);

  return (
    <div className={styles.campo}>
      <label htmlFor={nombre}>{etiqueta}</label>
      {children({
        id: nombre,
        name: nombre,
        "data-foco": nombre,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": descripcion.join(" ") || undefined,
      })}
      {ayuda && (
        <p id={`${nombre}-ayuda`} className={styles.ayuda}>
          {ayuda}
        </p>
      )}
      <p id={`${nombre}-error`} className={styles.error} aria-live="polite">
        {error && `Error: ${error}`}
      </p>
    </div>
  );
}

export default Campo;
