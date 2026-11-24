import styles from "./Pagination.module.css";

const HUECO = "…";

// Primera, última, la actual y sus vecinas: 1 … 4 5 6 … 82
function numeros(actual, total) {
  const visibles = [1, actual - 1, actual, actual + 1, total].filter(
    (n, i, lista) => n >= 1 && n <= total && lista.indexOf(n) === i,
  );

  return visibles.flatMap((n, i) => {
    const salto = n - (visibles[i - 1] ?? 0);
    if (salto === 1) return [n];
    // Si solo falta una página, se muestra en vez de los puntos.
    return salto === 2 ? [n - 1, n] : [HUECO, n];
  });
}

function Pagination({ actual, total, onCambio }) {
  if (total <= 1) return null;

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      <button
        type="button"
        className={styles.boton}
        disabled={actual === 1}
        onClick={() => onCambio(actual - 1)}
      >
        Anterior
      </button>

      <ul className={styles.numeros}>
        {numeros(actual, total).map((n, i) =>
          n === HUECO ? (
            <li key={`hueco-${i}`} className={styles.hueco} aria-hidden="true">
              {HUECO}
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                className={n === actual ? styles.activo : styles.boton}
                aria-label={`Página ${n}`}
                aria-current={n === actual ? "page" : undefined}
                onClick={() => onCambio(n)}
              >
                {n}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={styles.boton}
        disabled={actual === total}
        onClick={() => onCambio(actual + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}

export default Pagination;
