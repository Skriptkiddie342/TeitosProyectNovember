import formatLocation from "../utils/formatLocation.jsx";
import Specs from "./ui/Specs.jsx";
import Rent from "./ui/Rent.jsx";
import Badge from "./ui/badge.jsx";
import SolicitarButton from "./SolicitarButton.jsx";
import styles from "./DwellingDetail.module.css";

// Ficha completa de una vivienda, con el botón para solicitarla si está libre.
function DwellingDetail({ vivienda }) {
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
          <SolicitarButton
            vivienda={vivienda}
            className={styles.primario}
            texto="Solicitar esta vivienda"
          />
        </div>
      )}
    </article>
  );
}

export default DwellingDetail;
