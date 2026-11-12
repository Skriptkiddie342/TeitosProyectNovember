import { useState } from "react";
import styles from "./SolicitudForm.module.css";

function SolicitudForm({ vivienda, onEnviar, onCancelar }) {
  const [datos, setDatos] = useState({
    personas: "1",
    movilidadReducida: false,
    mascotas: false,
    necesidades: "",
    fecha: "",
    observaciones: "",
  });

  function cambiar(e) {
    const { name, type, checked, value } = e.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  }

  function enviar(e) {
    e.preventDefault();
    onEnviar({ viviendaId: vivienda.id, ...datos });
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <div className={styles.columna}>
        <div className={styles.imagen} aria-hidden="true"></div>
        <p className={styles.referencia}>
          {vivienda.referencia} · {vivienda.municipio}, {vivienda.provincia}
        </p>

        <label className={styles.campo}>
          Personas
          <select name="personas" value={datos.personas} onChange={cambiar}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6 o más</option>
          </select>
        </label>

        <label className={styles.casilla}>
          <input
            type="checkbox"
            name="movilidadReducida"
            checked={datos.movilidadReducida}
            onChange={cambiar}
          />
          Movilidad reducida
        </label>

        <label className={styles.casilla}>
          <input
            type="checkbox"
            name="mascotas"
            checked={datos.mascotas}
            onChange={cambiar}
          />
          Mascota/s
        </label>

        <label className={styles.campo}>
          Necesidades especiales
          <textarea
            name="necesidades"
            rows="3"
            value={datos.necesidades}
            onChange={cambiar}
          />
        </label>
      </div>

      <div className={styles.columna}>
        <label className={styles.campo}>
          Fecha de entrada deseada
          <input
            type="date"
            name="fecha"
            required
            value={datos.fecha}
            onChange={cambiar}
          />
        </label>

        <label className={styles.campo}>
          Observaciones
          <textarea
            name="observaciones"
            rows="5"
            value={datos.observaciones}
            onChange={cambiar}
          />
        </label>
      </div>

      <div className={styles.acciones}>
        <button type="submit" className={styles.enviar}>
          Enviar solicitud
        </button>
        <button type="button" className={styles.cancelar} onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default SolicitudForm;
