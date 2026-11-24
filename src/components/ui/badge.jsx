import { textoMedida } from "../../utils/accesibilidad.js";

function Badge({ accesibilidad }) {
  return <p>Accesibilidad: {textoMedida(accesibilidad)}</p>;
}

export default Badge;
