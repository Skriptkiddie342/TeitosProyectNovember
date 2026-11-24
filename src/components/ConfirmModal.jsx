import Modal from "./Modal.jsx";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({
  titulo,
  accion,
  peligro = false,
  enviando,
  error,
  onConfirmar,
  onCerrar,
  children,
}) {
  function cancelar(e) {
    if (enviando) e.preventDefault();
  }

  return (
    <Modal titulo={titulo} onCerrar={onCerrar} bloqueado={enviando}>
      <div className={styles.contenido}>
        {children}

        <p className={styles.error} role="alert">
          {error && `Error: ${error}`}
        </p>

        {/* method="dialog": el botón Cancelar cierra el diálogo. */}
        <form method="dialog" className={styles.acciones} onSubmit={cancelar}>
          <button
            type="submit"
            className={styles.secundario}
            aria-disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={peligro ? styles.peligro : styles.primario}
            aria-disabled={enviando}
            // El segundo clic de un doble clic en el botón que abre el modal
            // no cuenta como confirmación.
            onClick={(e) => !enviando && e.detail <= 1 && onConfirmar()}
          >
            {enviando ? "Un momento..." : accion}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
