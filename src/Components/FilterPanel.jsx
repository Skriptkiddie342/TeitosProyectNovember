import styles from "./FilterPanel.module.css";

function FilterPanel({
  provincias,
  marcadas,
  onProvincia,
  rentaMax,
  onRentaMax,
  min,
  max,
}) {
  return (
    <aside className={styles.panel} aria-label="Filtros">
      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>Provincia</legend>
        <div className={styles.lista}>
          {provincias.map((provincia) => (
            <label key={provincia} className={styles.opcion}>
              {provincia}
              <input
                type="checkbox"
                checked={marcadas.includes(provincia)}
                onChange={() => onProvincia(provincia)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.rango}>
        <span className={styles.rangoTexto}>
          <span>Renta máxima</span>
          <span>{rentaMax} €</span>
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step="10"
          value={rentaMax}
          onChange={(e) => onRentaMax(Number(e.target.value))}
        />
      </label>
    </aside>
  );
}

export default FilterPanel;
