import { useState } from "react";
import { Link } from "react-router-dom";
import EstadoViviendas from "./EstadoViviendas.jsx";
import formatLocation from "../utils/formatLocation.jsx";
import { euros } from "../utils/euros.js";
import styles from "./SolicitudForm.module.css";

function PasoViviendas({ elegidas, estado, error, onMover, onQuitar }) {
  const [mensaje, setMensaje] = useState("");
  const cargadas = estado === "ok" || estado === "vacio";

  function nombre({ id, vivienda }) {
    return vivienda?.referencia ?? `Vivienda ${id}`;
  }

  function mover(type, elegida, posicion) {
    if (posicion < 1 || posicion > elegidas.length) return;
    onMover(type, elegida.id);
    setMensaje(`${nombre(elegida)} pasa a la preferencia ${posicion}.`);
  }

  function quitar(elegida) {
    onQuitar(elegida.id);
    setMensaje(`${nombre(elegida)} se ha quitado de la solicitud.`);
  }

  return (
    <div className={styles.campos}>
      <p>
        Ordénalas de más a menos preferida. Para añadir otra, pulsa «Solicitar»
        en el <Link to="/viviendas">buscador de viviendas</Link>.
      </p>

      <p
        className={styles.error}
        data-foco="error-viviendas"
        tabIndex={-1}
        hidden={!error}
      >
        {error && `Error: ${error}`}
      </p>

      <p className={styles.ayuda} role="status">
        {mensaje}
      </p>

      {elegidas.length === 0 ? (
        <p>Todavía no has elegido ninguna vivienda.</p>
      ) : (
        <EstadoViviendas estado={estado} />
      )}

      {cargadas && (
        <ol className={styles.elegidas}>
          {elegidas.map((elegida, i) => (
            <li key={elegida.id} className={styles.elegida}>
              <div className={styles.datos}>
                <p>
                  <strong>
                    {i + 1}. {nombre(elegida)}
                  </strong>
                </p>
                {elegida.vivienda && (
                  <p className={styles.ayuda}>
                    {formatLocation(elegida.vivienda)} ·{" "}
                    {elegida.vivienda.tipologia} ·{" "}
                    {euros(elegida.vivienda.renta)}/mes
                  </p>
                )}
                {elegida.error && (
                  <p className={styles.error}>Error: {elegida.error}</p>
                )}
              </div>

              {/* aria-disabled y no disabled: el botón no pierde el foco al
                  llegar al extremo. */}
              <div className={styles.orden}>
                <button
                  type="button"
                  className={styles.secundario}
                  data-foco={`subir-${elegida.id}`}
                  aria-label={`Subir ${nombre(elegida)}`}
                  aria-disabled={i === 0}
                  onClick={() => mover("subir", elegida, i)}
                >
                  Subir
                </button>
                <button
                  type="button"
                  className={styles.secundario}
                  data-foco={`bajar-${elegida.id}`}
                  aria-label={`Bajar ${nombre(elegida)}`}
                  aria-disabled={i === elegidas.length - 1}
                  onClick={() => mover("bajar", elegida, i + 2)}
                >
                  Bajar
                </button>
                <button
                  type="button"
                  className={styles.secundario}
                  aria-label={`Quitar ${nombre(elegida)}`}
                  onClick={() => quitar(elegida)}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default PasoViviendas;
