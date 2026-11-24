import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

function Modal({ titulo, onCerrar, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      aria-labelledby="modal-titulo"
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
          onClick={onCerrar}
        >
          ✕
        </button>
      </header>
      <div className={styles.contenido}>{children}</div>
    </dialog>
  );
}

export default Modal;
