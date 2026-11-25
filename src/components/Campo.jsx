import styles from "./SolicitudForm.module.css";

// Campo de formulario reutilizable: junta la etiqueta, el control, la ayuda y
// el error.
// children recibe los atributos que enlazan el control con su etiqueta,
// su ayuda y su error.
function Campo({ nombre, etiqueta, ayuda, error, children }) {
  // Ids de la ayuda y del error, para que los lea el lector de pantalla.
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
