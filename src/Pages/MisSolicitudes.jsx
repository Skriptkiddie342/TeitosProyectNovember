import { useState } from "react";
import { Link } from "react-router-dom";
import { useSolicitudes } from "../Context/SolicitudesContext.jsx";
import styles from "./MisSolicitudes.module.css";

export default function MisSolicitudes() {
  const { solicitudes, retirar, alternarRevisada } = useSolicitudes();
  const [ubicacion, setUbicacion] = useState("");
  const [verRevisadas, setVerRevisadas] = useState(true);
  const [verSinRevisar, setVerSinRevisar] = useState(true);
  const [seleccionadaId, setSeleccionadaId] = useState(null);

  const texto = ubicacion.toLowerCase();
  const visibles = solicitudes.filter(
    (s) =>
      `${s.vivienda.municipio} ${s.vivienda.provincia}`
        .toLowerCase()
        .includes(texto) && (s.revisada ? verRevisadas : verSinRevisar),
  );
  const seleccionada = visibles.find((s) => s.id === seleccionadaId);

  return (
    <>
      <title>Mis solicitudes | Teitos</title>
      <h1 className={styles.titulo}>Mis solicitudes</h1>

      {solicitudes.length === 0 ? (
        <p>
          Todavía no has enviado ninguna solicitud.{" "}
          <Link to="/viviendas">Buscar vivienda</Link>
        </p>
      ) : (
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
              {visibles.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={
                      s.id === seleccionadaId ? styles.activa : styles.item
                    }
                    aria-pressed={s.id === seleccionadaId}
                    onClick={() => setSeleccionadaId(s.id)}
                  >
                    <strong>{s.vivienda.referencia}</strong>
                    <span className={styles.suave}>
                      {s.vivienda.municipio}, {s.vivienda.provincia}
                    </span>
                    <span className={styles.suave}>
                      {s.revisada ? "Revisada" : "Sin revisar"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {seleccionada ? (
            <article className={styles.detalle}>
              <div className={styles.imagen} aria-hidden="true"></div>
              <div className={styles.datos}>
                <h2>{seleccionada.vivienda.referencia}</h2>
                <p className={styles.suave}>
                  {seleccionada.vivienda.municipio},{" "}
                  {seleccionada.vivienda.provincia}
                </p>
                <p>
                  {seleccionada.vivienda.tipologia} de{" "}
                  {seleccionada.vivienda.superficie} m², planta{" "}
                  {seleccionada.vivienda.planta}. Renta:{" "}
                  {seleccionada.vivienda.renta} €/mes.
                </p>
                <p>Personas: {seleccionada.personas}</p>
                <p>Fecha de entrada: {seleccionada.fecha}</p>
                <p>
                  Movilidad reducida:{" "}
                  {seleccionada.movilidadReducida ? "Sí" : "No"}
                </p>
                <p>Mascotas: {seleccionada.mascotas ? "Sí" : "No"}</p>
                {seleccionada.necesidades && (
                  <p>Necesidades especiales: {seleccionada.necesidades}</p>
                )}
                {seleccionada.observaciones && (
                  <p>Observaciones: {seleccionada.observaciones}</p>
                )}

                <div className={styles.acciones}>
                  <button
                    type="button"
                    className={styles.secundario}
                    onClick={() => alternarRevisada(seleccionada.id)}
                  >
                    {seleccionada.revisada
                      ? "Marcar sin revisar"
                      : "Marcar como revisada"}
                  </button>
                  <button
                    type="button"
                    className={styles.retirar}
                    onClick={() => retirar(seleccionada.id)}
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
    </>
  );
}
