import formatLocation from "./formatLocation.jsx";
import Specs from "./ui/Specs.jsx";
import Rent from "./ui/Rent.jsx";
import Badge from "./ui/badge.jsx";

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
    <article>
      <h1>{referencia}</h1>
      <p>{adjudicada ? "Adjudicada" : "Disponible"}</p>
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

export default DwellingDetail;
