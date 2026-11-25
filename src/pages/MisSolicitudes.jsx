import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { useBorrador } from "../context/BorradorContext.jsx";
import useSolicitudes from "../hooks/useSolicitudes.js";
import { euros } from "../utils/euros.js";
import { mismoId } from "../utils/ids.js";
import styles from "./MisSolicitudes.module.css";
import pagina from "./Pagina.module.css";

const SIN_SERVIDOR =
  "El servidor no responde. Comprueba que está en marcha y vuelve a intentarlo.";

// Nombre de una solicitud: la referencia de su primera vivienda y cuántas más
// tiene.
function nombreDe({ elegidas }) {
  if (elegidas.length === 0) return "Solicitud sin viviendas";
  const [{ id, vivienda }, ...otras] = elegidas;
  const primera = vivienda?.referencia ?? `Vivienda ${id}`;
  return otras.length === 0 ? primera : `${primera} y ${otras.length} más`;
}

// Texto con los lugares de sus viviendas, sin repetir.
function lugaresDe({ elegidas }) {
  const lugares = elegidas
    .filter(({ vivienda }) => vivienda)
    .map(({ vivienda }) => `${vivienda.municipio}, ${vivienda.provincia}`);
  return [...new Set(lugares)].join(" · ");
}

// Página de las solicitudes enviadas: lista con filtros a un lado y detalle de
// la elegida al otro.
export default function MisSolicitudes() {
  const { solicitudes, estado, retirar, marcar } = useSolicitudes();
  const { dispatch } = useBorrador();
  const navegar = useNavigate();
  const { state, pathname } = useLocation();

  const [ubicacion, setUbicacion] = useState("");
  const [verRevisadas, setVerRevisadas] = useState(true);
  const [verSinRevisar, setVerSinRevisar] = useState(true);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [aviso, setAviso] = useState(state?.aviso ?? null);
  const [error, setError] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const parrafoAviso = useRef(null);

  // El aviso llega desde el formulario y no debe repetirse al recargar.
  useEffect(() => {
    if (state?.aviso) navegar(pathname, { replace: true, state: null });
  }, [state, pathname, navegar]);

  // Cuando aparece un aviso, se le da el foco para que se lea.
  useEffect(() => {
    if (aviso) parrafoAviso.current.focus();
  }, [aviso]);

  const texto = ubicacion.toLowerCase();
  // Solicitudes que cumplen los filtros de ubicación y de revisadas.
  const visibles = solicitudes.filter(
    (s) =>
      lugaresDe(s).toLowerCase().includes(texto) &&
      (s.solicitud.revisada ? verRevisadas : verSinRevisar),
  );
  const seleccionada = visibles.find((s) => mismoId(s.id, seleccionadaId));
  const datos = seleccionada?.solicitud;

  // Selecciona una solicitud de la lista y borra los mensajes anteriores.
  function elegir(id) {
    setSeleccionadaId(id);
    setError(null);
    setAviso(null);
  }

  // Carga la solicitud en el borrador y lleva al formulario para modificarla.
  function editar() {
    dispatch({ type: "editar", solicitud: datos });
    navegar("/solicitud");
  }

  // Abre el modal que pregunta si se quiere retirar.
  function pedirConfirmacion() {
    setError(null);
    setAviso(null);
    setConfirmando(true);
  }

  // Retira la solicitud después de confirmarlo en el modal. Si falla, muestra
  // el error.
  async function confirmarRetirada() {
    setEnviando(true);
    setError(null);
    try {
      await retirar(seleccionada.id);
      // Si se estaba modificando, ya no hay nada que modificar.
      dispatch({ type: "retirada", id: seleccionada.id });
      setConfirmando(false);
      setAviso("Solicitud retirada.");
    } catch {
      setError(SIN_SERVIDOR);
    } finally {
      setEnviando(false);
    }
  }

  // Cambia la solicitud entre revisada y sin revisar.
  async function alternarRevisada() {
    setError(null);
    try {
      await marcar(seleccionada.id, !datos.revisada);
    } catch {
      setError(SIN_SERVIDOR);
    }
  }

  return (
    <>
      <title>Mis solicitudes | Teitos</title>
      <h1 className={styles.titulo}>Mis solicitudes</h1>

      <p
        ref={parrafoAviso}
        className={styles.aviso}
        role="status"
        tabIndex={-1}
        hidden={!aviso}
      >
        {aviso && `✓ ${aviso}`}
      </p>

      {estado === "cargando" && (
        <p className={pagina.estado} role="status">
          Cargando solicitudes...
        </p>
      )}
      {estado === "error" && (
        <p className={`${pagina.estado} ${pagina.error}`} role="alert">
          No se han podido cargar las solicitudes.
        </p>
      )}
      {estado === "vacio" && (
        <p>
          Todavía no has enviado ninguna solicitud.{" "}
          <Link to="/viviendas">Buscar vivienda</Link>
        </p>
      )}

      {estado === "ok" && (
        <div className={styles.pagina}>
          <aside className={styles.panel}>
            <label className={styles.campo}>
              Ubicación
              <input
                type="search"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />
            </label>

            <label className={styles.casilla}>
              <input
                type="checkbox"
                checked={verRevisadas}
                onChange={(e) => setVerRevisadas(e.target.checked)}
              />
              Revisadas
            </label>

            <label className={styles.casilla}>
              <input
                type="checkbox"
                checked={verSinRevisar}
                onChange={(e) => setVerSinRevisar(e.target.checked)}
              />
              Sin revisar
            </label>

            <h2 className={styles.subtitulo}>Resultados</h2>
            {visibles.length === 0 && (
              <p>No hay solicitudes con esos filtros.</p>
            )}
            <ul className={styles.lista}>
              {visibles.map((s) => {
                const elegida = mismoId(s.id, seleccionadaId);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={elegida ? styles.activa : styles.item}
                      aria-pressed={elegida}
                      onClick={() => elegir(s.id)}
                    >
                      <strong>
                        {elegida && "✓ "}
                        {nombreDe(s)}
                      </strong>
                      <span className={styles.suave}>{lugaresDe(s)}</span>
                      <span className={styles.suave}>
                        {s.solicitud.revisada ? "Revisada" : "Sin revisar"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {seleccionada ? (
            <article className={styles.detalle}>
              <div className={styles.imagen} aria-hidden="true"></div>
              <div className={styles.datos}>
                <h2>{nombreDe(seleccionada)}</h2>
                <ol className={styles.viviendas}>
                  {seleccionada.elegidas.map(({ id, vivienda }) => (
                    <li key={id}>
                      {vivienda ? (
                        <>
                          <strong>{vivienda.referencia}</strong>
                          <p className={styles.suave}>
                            {vivienda.municipio}, {vivienda.provincia}
                          </p>
                          <p>
                            {vivienda.tipologia} de {vivienda.superficie} m²,
                            planta {vivienda.planta}. Renta: {vivienda.renta}{" "}
                            €/mes.
                          </p>
                        </>
                      ) : (
                        <p>La vivienda {id} ya no existe.</p>
                      )}
                    </li>
                  ))}
                </ol>
                {datos.nombre && <p>Nombre completo: {datos.nombre}</p>}
                {datos.dni && <p>DNI: {datos.dni}</p>}
                {datos.telefono && <p>Teléfono: {datos.telefono}</p>}
                {datos.correo && <p>Correo electrónico: {datos.correo}</p>}
                <p>Personas: {datos.personas}</p>
                {datos.ingresos && (
                  <p>Ingresos anuales: {euros(datos.ingresos)}</p>
                )}
                <p>Fecha de entrada: {datos.fecha}</p>
                <p>Movilidad reducida: {datos.movilidadReducida ? "Sí" : "No"}</p>
                <p>Mascotas: {datos.mascotas ? "Sí" : "No"}</p>
                {datos.necesidades && (
                  <p>Necesidades especiales: {datos.necesidades}</p>
                )}
                {datos.observaciones && (
                  <p>Observaciones: {datos.observaciones}</p>
                )}

                {!seleccionada.modificable && (
                  <p>
                    <strong>
                      El plazo de alguna de sus convocatorias está cerrado: ya
                      no se puede modificar.
                    </strong>
                  </p>
                )}
                {error && !confirmando && (
                  <p className={pagina.error} role="alert">
                    Error: {error}
                  </p>
                )}

                <div className={styles.acciones}>
                  {seleccionada.modificable && (
                    <button
                      type="button"
                      className={styles.secundario}
                      onClick={editar}
                    >
                      Modificar solicitud
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.secundario}
                    onClick={alternarRevisada}
                  >
                    {datos.revisada
                      ? "Marcar sin revisar"
                      : "Marcar como revisada"}
                  </button>
                  <button
                    type="button"
                    className={styles.retirar}
                    onClick={pedirConfirmacion}
                  >
                    Retirar solicitud
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <p>Elige una solicitud de la lista para ver su detalle.</p>
          )}
        </div>
      )}

      {confirmando && seleccionada && (
        <ConfirmModal
          titulo="Retirar solicitud"
          accion="Sí, retirar"
          peligro
          enviando={enviando}
          error={error}
          onConfirmar={confirmarRetirada}
          onCerrar={() => setConfirmando(false)}
        >
          <p>
            Vas a retirar la solicitud <strong>{nombreDe(seleccionada)}</strong>
            . Se borrará del servidor y no se puede deshacer.
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
