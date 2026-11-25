import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

// Ventana emergente hecha con <dialog>, la etiqueta propia de HTML.
// Se cierra siempre con dialog.close(): así el navegador devuelve el foco al
// botón que lo abrió. bloqueado impide cerrarlo mientras se guarda.
function Modal({ titulo, onCerrar, bloqueado = false, children }) {
  const ref = useRef(null);

  // Al aparecer, se abre. showModal impide usar lo que queda detrás.
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  // Evita que Escape cierre la ventana si está bloqueada.
  // Con cancel no basta: el navegador deja cerrar con un segundo Esc.
  function teclado(e) {
    if (bloqueado && e.key === "Escape") e.preventDefault();
  }

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      aria-labelledby="modal-titulo"
      onKeyDown={teclado}
      onCancel={(e) => bloqueado && e.preventDefault()}
      onClose={onCerrar}
    >
      <header className={styles.cabecera}>
        <h2 id="modal-titulo" className={styles.titulo}>
          {titulo}
        </h2>
        <button
          type="button"
          className={styles.cerrar}
          aria-label="Cerrar"
          aria-disabled={bloqueado}
          onClick={() => !bloqueado && ref.current.close()}
        >
          ✕
        </button>
      </header>
      <div className={styles.contenido}>{children}</div>
    </dialog>
  );
}

export default Modal;
