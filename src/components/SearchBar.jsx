import styles from "./SearchBar.module.css";

function SearchBar({
  busqueda,
  onBusqueda,
  orden,
  onOrden,
  vista,
  onVista,
  onLimpiar,
  total,
}) {
  return (
    <div className={styles.barra}>
      <label className={styles.campo}>
        Municipio, provincia o referencia
        <input
          type="search"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
        />
      </label>

      <label className={styles.campo}>
        Ordenar
        <select value={orden} onChange={(e) => onOrden(e.target.value)}>
          <option value="ninguno">Sin ordenar</option>
          <option value="asc">Renta de menor a mayor</option>
          <option value="desc">Renta de mayor a menor</option>
          <option value="superficie-asc">Superficie de menor a mayor</option>
          <option value="superficie-desc">Superficie de mayor a menor</option>
        </select>
      </label>

      <div className={styles.botones}>
        <button
          type="button"
          className={vista === "rejilla" ? styles.activo : styles.boton}
          aria-pressed={vista === "rejilla"}
          onClick={() => onVista("rejilla")}
        >
          {vista === "rejilla" && "✓ "}Rejilla
        </button>
        <button
          type="button"
          className={vista === "lista" ? styles.activo : styles.boton}
          aria-pressed={vista === "lista"}
          onClick={() => onVista("lista")}
        >
          {vista === "lista" && "✓ "}Lista
        </button>
        <button type="button" className={styles.boton} onClick={onLimpiar}>
          Limpiar
        </button>
      </div>

      <p className={styles.contador}>
        {total} {total === 1 ? "vivienda" : "viviendas"}
      </p>
    </div>
  );
}

export default SearchBar;
