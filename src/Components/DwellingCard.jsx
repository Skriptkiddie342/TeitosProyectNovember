import { Link } from "react-router-dom";
import formatLocation from "./formatLocation.jsx";
import Specs from "./ui/Specs.jsx";
import Rent from "./ui/Rent.jsx";
import Badge from "./ui/badge.jsx";

function DwellingCard({ vivienda, variante = "rejilla" }) {
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
    <article className={`Data ${variante}`}>
      <p>{adjudicada ? "Adjudicada" : "Disponible"}</p>
      <h3>
        <Link to={`/viviendas/${id}`}>{referencia}</Link>
      </h3>
      <p>{formatLocation({ provincia, municipio })}</p>
      <p>Tipologia: {tipologia}</p>
      <p>Superficie: {superficie} m²</p>
      <p>Planta: {planta}</p>
      <Specs ascensor={ascensor} />
      <Badge accesibilidad={accesibilidad} />
      <Rent renta={renta} />
    </article>
  );
}

export default DwellingCard;
