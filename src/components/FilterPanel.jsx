import RentaPesca from "./RentaPesca.jsx";
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

      <RentaPesca valor={rentaMax} onCambio={onRentaMax} min={min} max={max} />
    </aside>
  );
}

export default FilterPanel;
