import { useState } from "react";
import RentaPesca from "./RentaPesca.jsx";
import {
  PERSONAS_MAXIMO,
  ingresosAdmitidos,
  limitesIngresos,
} from "../reglas/acceso.js";
import { MEDIDAS } from "../utils/accesibilidad.js";
import { euros, soloEuros } from "../utils/euros.js";
import styles from "./FilterPanel.module.css";

const OPCIONES_PERSONAS = Array.from(
  { length: PERSONAS_MAXIMO },
  (_, i) => i + 1,
);

function FilterPanel({
  provincias,
  marcadas,
  onProvincia,
  personas,
  onPersonas,
  ingresos,
  onIngresos,
  medidas,
  onMedida,
  rentaMax,
  onRentaMax,
  min,
  max,
}) {
  const { minimo, maximo } = limitesIngresos(personas);
  const fueraDeMargen =
    ingresos !== null && !ingresosAdmitidos(ingresos, personas);

  // Si el enlace ya trae ingresos no admitidos se abre, para que se vea por qué
  // no hay resultados.
  const [abierto, setAbierto] = useState(fueraDeMargen);
  const activos =
    marcadas.length +
    medidas.length +
    (personas !== null ? 1 : 0) +
    (ingresos !== null ? 1 : 0) +
    (rentaMax < max ? 1 : 0);

  return (
    <aside className={styles.panel} aria-label="Filtros">
      {/* Solo se ve en móvil: en escritorio los filtros están siempre. */}
      <button
        type="button"
        className={styles.plegar}
        aria-expanded={abierto}
        aria-controls="filtros"
        onClick={() => setAbierto(!abierto)}
      >
        {activos > 0 ? `Filtros (${activos})` : "Filtros"}
        <span aria-hidden="true">{abierto ? "▴" : "▾"}</span>
      </button>

      <div
        id="filtros"
        className={abierto ? styles.contenido : styles.plegado}
      >
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

        <fieldset className={styles.grupo}>
          <legend className={styles.leyenda}>Tu hogar</legend>
          <div className={styles.campos}>
            <label className={styles.campo}>
              Personas en la vivienda
              <select
                value={personas ?? ""}
                onChange={(e) => onPersonas(e.target.value)}
              >
                <option value="">Sin indicar</option>
                {OPCIONES_PERSONAS.map((n) => (
                  <option key={n} value={n}>
                    {n === PERSONAS_MAXIMO ? `${n} o más` : n}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.campo}>
              Ingresos netos anuales del hogar (€)
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ingresos ?? ""}
                aria-describedby="ingresos-margen"
                onChange={(e) => onIngresos(soloEuros(e.target.value))}
              />
            </label>

            <p id="ingresos-margen" className={styles.ayuda} role="status">
              {fueraDeMargen && (
                <strong className={styles.error}>
                  Tus ingresos están fuera del margen admitido.{" "}
                </strong>
              )}
              {personas === null ? "Según las personas" : "Para tu hogar"}: entre{" "}
              {euros(minimo)} y {euros(maximo)} al año.
            </p>
          </div>
        </fieldset>

        <fieldset className={styles.grupo}>
          <legend className={styles.leyenda}>Accesibilidad</legend>
          <div className={styles.lista}>
            {MEDIDAS.map(({ valor, texto }) => (
              <label key={valor} className={styles.opcion}>
                {texto}
                <input
                  type="checkbox"
                  checked={medidas.includes(valor)}
                  onChange={() => onMedida(valor)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <RentaPesca valor={rentaMax} onCambio={onRentaMax} min={min} max={max} />
      </div>
    </aside>
  );
}

export default FilterPanel;
