import Campo from "./Campo.jsx";
import styles from "./SolicitudForm.module.css";

function PasoPersonales({ personales, errores, tocados, onCambiar, onTocar }) {
  function error(campo) {
    return tocados[campo] ? errores[campo] : undefined;
  }

  function control(campo) {
    return {
      value: personales[campo],
      onChange: (e) => onCambiar(campo, e.target.value),
      onBlur: () => onTocar(campo),
    };
  }

  return (
    <div className={styles.campos}>
      <Campo
        nombre="nombre"
        etiqueta="Nombre completo"
        error={error("nombre")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("nombre")}
            type="text"
            autoComplete="name"
            required
          />
        )}
      </Campo>

      <Campo
        nombre="dni"
        etiqueta="DNI"
        ayuda="8 números y una letra, sin espacios ni guiones."
        error={error("dni")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("dni")}
            type="text"
            autoComplete="off"
            required
          />
        )}
      </Campo>

      <Campo
        nombre="telefono"
        etiqueta="Teléfono"
        ayuda="9 cifras, sin espacios ni prefijo."
        error={error("telefono")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("telefono")}
            type="tel"
            autoComplete="tel-national"
            required
          />
        )}
      </Campo>

      <Campo
        nombre="correo"
        etiqueta="Correo electrónico"
        error={error("correo")}
      >
        {(atributos) => (
          <input
            {...atributos}
            {...control("correo")}
            type="email"
            autoComplete="email"
            required
          />
        )}
      </Campo>
    </div>
  );
}

export default PasoPersonales;
