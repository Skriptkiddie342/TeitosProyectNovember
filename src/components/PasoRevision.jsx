import EstadoViviendas from "./EstadoViviendas.jsx";
import formatLocation from "../utils/formatLocation.jsx";
import { PERSONAS_MAXIMO } from "../reglas/acceso.js";
import { euros } from "../utils/euros.js";
import styles from "./SolicitudForm.module.css";

// Paso 4 del formulario: resumen de todo antes de enviar, con botones para
// editar.
function PasoRevision({ personales, hogar, elegidas, estado, onEditar }) {
  const cargadas = estado === "ok" || estado === "vacio";
  const personas = Number(hogar.personas);

  const datosPersonales = [
    ["Nombre completo", personales.nombre],
    ["DNI", personales.dni],
    ["Teléfono", personales.telefono],
    ["Correo electrónico", personales.correo],
  ];

  // Lista de [título, valor] que se muestra en el resumen.
  const datos = [
    [
      "Personas en la vivienda",
      personas === PERSONAS_MAXIMO ? `${personas} o más` : hogar.personas,
    ],
    ["Ingresos netos anuales", euros(Number(hogar.ingresos))],
    ["Fecha de entrada", hogar.fecha.split("-").reverse().join("/")],
    ["Movilidad reducida", hogar.movilidadReducida ? "Sí" : "No"],
    ["Mascotas", hogar.mascotas ? "Sí" : "No"],
    ["Necesidades especiales", hogar.necesidades || "Ninguna"],
    ["Observaciones", hogar.observaciones || "Ninguna"],
  ];

  return (
    <div className={styles.campos}>
      <section className={styles.bloque}>
        <h3>Datos personales</h3>
        <dl className={styles.resumen}>
          {datosPersonales.map(([termino, valor]) => (
            <div key={termino}>
              <dt>{termino}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className={styles.secundario}
          aria-label="Editar datos personales"
          onClick={() => onEditar(1)}
        >
          Editar
        </button>
      </section>

      <section className={styles.bloque}>
        <h3>Datos del hogar</h3>
        <dl className={styles.resumen}>
          {datos.map(([termino, valor]) => (
            <div key={termino}>
              <dt>{termino}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className={styles.secundario}
          aria-label="Editar datos del hogar"
          onClick={() => onEditar(2)}
        >
          Editar
        </button>
      </section>

      <section className={styles.bloque}>
        <h3>Viviendas por orden de preferencia</h3>
        <EstadoViviendas estado={estado} />
        {cargadas && (
          <ol className={styles.repaso}>
            {elegidas.map(({ id, vivienda, error }) => (
              <li key={id}>
                {vivienda
                  ? `${vivienda.referencia} · ${formatLocation(vivienda)} · ${euros(vivienda.renta)}/mes`
                  : `Vivienda ${id}`}
                {error && <p className={styles.error}>Error: {error}</p>}
              </li>
            ))}
          </ol>
        )}
        <button
          type="button"
          className={styles.secundario}
          aria-label="Editar viviendas elegidas"
          onClick={() => onEditar(3)}
        >
          Editar
        </button>
      </section>
    </div>
  );
}

export default PasoRevision;
