import { useState } from "react";
import { Link } from "react-router-dom";
import formatLocation from "../utils/formatLocation.jsx";
import Specs from "./ui/Specs.jsx";
import Rent from "./ui/Rent.jsx";
import Badge from "./ui/badge.jsx";
import Modal from "./Modal.jsx";
import SolicitudForm from "./SolicitudForm.jsx";
import { useSolicitudes } from "../context/SolicitudesContext.jsx";
import styles from "./DwellingCard.module.css";

function DwellingCard({ vivienda, variante = "rejilla" }) {
  const [solicitando, setSolicitando] = useState(false);
  const { agregar } = useSolicitudes();

  const {
    id,
    adjudicada,
    referencia,
    provincia,
    municipio,
    tipologia,
    superficie,
    planta,
    ascensor,
    accesibilidad,
    renta,
  } = vivienda;

  return (
    <article className={`${styles.card} ${styles[variante]}`}>
      <header className={styles.cabecera}>
        <div>
          <h3 className={styles.referencia}>
            <Link to={`/viviendas/${id}`}>{referencia}</Link>
          </h3>
          <p className={styles.lugar}>
            {formatLocation({ provincia, municipio })}
          </p>
        </div>
        <p className={styles.estado}>
          {adjudicada ? "Adjudicada" : "Disponible"}
        </p>
      </header>

      <div className={styles.cuerpo}>
        <div className={styles.renta}>
          <Rent renta={renta} />
        </div>
        <p>
          {tipologia} · {superficie} m² · Planta {planta}
        </p>
        <Specs ascensor={ascensor} />
        <Badge accesibilidad={accesibilidad} />
      </div>

      <div className={styles.acciones}>
        <Link to={`/viviendas/${id}`} className={styles.secundario}>
          Ver detalle
        </Link>
        <button
          type="button"
          className={styles.primario}
          onClick={() => setSolicitando(true)}
        >
          Solicitar
        </button>
      </div>

      {solicitando && (
        <Modal titulo="Solicitud" onCerrar={() => setSolicitando(false)}>
          <SolicitudForm
            vivienda={vivienda}
            onEnviar={(datos) => {
              agregar({ ...datos, vivienda });
              setSolicitando(false);
            }}
            onCancelar={() => setSolicitando(false)}
          />
        </Modal>
      )}
    </article>
  );
}

export default DwellingCard;
