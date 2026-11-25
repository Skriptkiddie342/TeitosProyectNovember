import { textoMedida } from "../../utils/accesibilidad.js";

// Muestra la accesibilidad de la vivienda.
function Badge({ accesibilidad }) {
  return <p>Accesibilidad: {textoMedida(accesibilidad)}</p>;
}

export default Badge;
