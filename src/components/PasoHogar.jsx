import Campo from "./Campo.jsx";
import { PERSONAS_MAXIMO, limitesIngresos } from "../reglas/acceso.js";
import { fechaDeHoy } from "../reglas/solicitud.js";
import { euros, soloEuros } from "../utils/euros.js";
import styles from "./SolicitudForm.module.css";

// Lista [1, 2, 3, 4, 5, 6] para el desplegable.
const OPCIONES_PERSONAS = Array.from(
  { length: PERSONAS_MAXIMO },
  (_, i) => i + 1,
);

// Paso 2 del formulario: los datos del hogar.
function PasoHogar({ hogar, errores, tocados, onCambiar, onTocar }) {
  const { minimo, maximo } = limitesIngresos(
    hogar.personas === "" ? null : Number(hogar.personas),
  );

  // Devuelve el error de un campo, solo si el usuario ya ha pasado por él.
  function error(campo) {
    return tocados[campo] ? errores[campo] : undefined;
  }

  // Propiedades comunes de un campo: su valor y qué hacer al escribir y al
  // salir.
  // El error aparece al escribir y también al salir del campo sin rellenarlo.
  function control(campo) {
    return {
      value: hogar[campo],
      onChange: (e) => onCambiar(campo, e.target.value),
      onBlur: () => onTocar(campo),
    };
  }

  // Pinta una casilla de sí o no con su texto.
  function casilla(campo, texto) {
    return (
      <label className={styles.casilla}>
        <input
          type="checkbox"
          name={campo}
          checked={hogar[campo]}
          onChange={(e) => onCambiar(campo, e.target.checked)}
        />
        {texto}
      </label>
    );
  }

  return (
    <div className={styles.campos}>
      <Campo
        nombre="personas"
        etiqueta="Personas en la vivienda"
        error={error("personas")}
      >
        {(atributos) => (
          <select {...atributos} {...control("personas")} required>
            <option value="">Elige una opción</option>
            {OPCIONES_PERSONAS.map((n) => (
              <option key={n} value={n}>
                {n === PERSONAS_MAXIMO ? `${n} o más` : n}
              </option>
            ))}
          </select>
        )}
      </Campo>

      <Campo
        nombre="ingresos"
        etiqueta="Ingresos netos anuales del hogar (€)"
        ayuda={`Entre ${euros(minimo)} y ${euros(maximo)}, sin céntimos.`}
        error={error("ingresos")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("ingresos")}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            onChange={(e) => onCambiar("ingresos", soloEuros(e.target.value))}
          />
        )}
      </Campo>

      <Campo
        nombre="fecha"
        etiqueta="Fecha de entrada deseada"
        error={error("fecha")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("fecha")}
            type="date"
            min={fechaDeHoy()}
            required
          />
        )}
      </Campo>

      {casilla("movilidadReducida", "Movilidad reducida")}
      {casilla("mascotas", "Mascota/s")}

      <Campo
        nombre="necesidades"
        etiqueta="Necesidades especiales (opcional)"
        error={error("necesidades")}
      >
        {(atributos) => (
          <textarea {...atributos} {...control("necesidades")} rows="3" />
        )}
      </Campo>

      <Campo
        nombre="observaciones"
        etiqueta="Observaciones (opcional)"
        error={error("observaciones")}
      >
        {(atributos) => (
          <textarea {...atributos} {...control("observaciones")} rows="4" />
        )}
      </Campo>
    </div>
  );
}

export default PasoHogar;
