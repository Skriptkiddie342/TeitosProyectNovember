import { useState } from "react";
import formatLocation from "../utils/formatLocation.jsx";
import Specs from "./ui/Specs.jsx";
import Rent from "./ui/Rent.jsx";
import Badge from "./ui/badge.jsx";
import Modal from "./Modal.jsx";
import SolicitudForm from "./SolicitudForm.jsx";
import { useSolicitudes } from "../context/SolicitudesContext.jsx";
import styles from "./DwellingDetail.module.css";

function DwellingDetail({ vivienda }) {
  const [solicitando, setSolicitando] = useState(false);
  const { agregar } = useSolicitudes();

  const {
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
    <article className={styles.detalle}>
      <header className={styles.cabecera}>
        <div>
          <h1 className={styles.titulo}>{referencia}</h1>
          <p className={styles.lugar}>
            {formatLocation({ provincia, municipio })}
          </p>
        </div>
        <p className={styles.estado}>
          {adjudicada ? "Adjudicada" : "Disponible"}
        </p>
      </header>

      <div className={styles.renta}>
        <Rent renta={renta} />
      </div>

      <dl className={styles.ficha}>
        <div>
          <dt>Tipología</dt>
          <dd>{tipologia}</dd>
        </div>
        <div>
          <dt>Superficie</dt>
          <dd>{superficie} m²</dd>
        </div>
        <div>
          <dt>Planta</dt>
          <dd>{planta}</dd>
        </div>
      </dl>

      <div className={styles.extras}>
        <Specs ascensor={ascensor} />
        <Badge accesibilidad={accesibilidad} />
      </div>

      {!adjudicada && (
        <div className={styles.acciones}>
          <button
            type="button"
            className={styles.primario}
            onClick={() => setSolicitando(true)}
          >
            Solicitar esta vivienda
          </button>
        </div>
      )}

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

export default DwellingDetail;
