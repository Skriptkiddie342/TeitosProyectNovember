import { Link, useParams } from "react-router-dom";
import useCall from "../hooks/useCall.js";
import useCallDwellings from "../hooks/useCallDwellings.js";
import DwellingList from "../components/DwellingList.jsx";
import styles from "./Pagina.module.css";

// Página de una convocatoria: muestra sus datos y sus viviendas libres. El id
// sale de la URL (/convocatorias/9).
export default function CallPage() {
  const { id } = useParams();
  const { convocatoria, estado } = useCall(id);
  const { viviendas, estado: estadoViviendas } = useCallDwellings(id);
  // Solo se enseñan las viviendas que no están adjudicadas.
  const libres = viviendas.filter((v) => !v.adjudicada);

  if (estado === "cargando") {
    return (
      <>
        <title>Cargando convocatoria | Teitos</title>
        <p className={styles.estado}>Cargando...</p>
      </>
    );
  }

  if (estado === "noexiste") {
    return (
      <div className={styles.aviso}>
        <title>Convocatoria no encontrada | Teitos</title>
        <h1 className={styles.titulo}>Esta convocatoria no existe</h1>
        <Link to="/convocatorias" className={styles.volver}>
          Volver a las convocatorias
        </Link>
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div className={styles.aviso}>
        <title>Error | Teitos</title>
        <h1 className={`${styles.titulo} ${styles.error}`}>
          No se ha podido cargar la convocatoria
        </h1>
        <Link to="/convocatorias" className={styles.volver}>
          Volver a las convocatorias
        </Link>
      </div>
    );
  }

  const {
    codigo,
    provincia,
    fechaApertura,
    fechaCierre,
    sorteo,
    unidades,
    rentaDesde,
  } = convocatoria;

  return (
    <>
      <title>{`${codigo} | Teitos`}</title>
      <h1 className={styles.titulo}>{codigo}</h1>

      <dl className={styles.ficha}>
        <div>
          <dt>Provincia</dt>
          <dd>{provincia}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{convocatoria.estado}</dd>
        </div>
        <div>
          <dt>Apertura</dt>
          <dd>{fechaApertura}</dd>
        </div>
        <div>
          <dt>Cierre</dt>
          <dd>{fechaCierre}</dd>
        </div>
        <div>
          <dt>Sorteo</dt>
          <dd>{sorteo ?? "Pendiente"}</dd>
        </div>
        <div>
          <dt>Unidades</dt>
          <dd>{unidades}</dd>
        </div>
        <div>
          <dt>Renta desde</dt>
          <dd>
            {rentaDesde === null ? "Sin viviendas libres" : `${rentaDesde} €`}
          </dd>
        </div>
      </dl>

      <h2 className={styles.subtitulo}>Viviendas libres</h2>
      {estadoViviendas === "cargando" && (
        <p className={styles.estado}>Cargando viviendas...</p>
      )}
      {estadoViviendas === "error" && (
        <p className={`${styles.estado} ${styles.error}`}>
          No se han podido cargar las viviendas.
        </p>
      )}
      {estadoViviendas === "ok" && libres.length === 0 && (
        <div className={styles.aviso}>
          <p>
            Esta convocatoria no tiene viviendas libres: ya se ha resuelto o
            todas sus viviendas están adjudicadas.
          </p>
          <div className={styles.acciones}>
            <Link to="/convocatorias" className={styles.volver}>
              Ver otras convocatorias
            </Link>
            <Link to="/viviendas" className={styles.volver}>
              Buscar vivienda
            </Link>
          </div>
        </div>
      )}
      {estadoViviendas === "ok" && libres.length > 0 && (
        <DwellingList viviendas={libres} vista="rejilla" />
      )}
    </>
  );
}
