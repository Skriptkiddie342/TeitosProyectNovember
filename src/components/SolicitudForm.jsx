import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal.jsx";
import PasoHogar from "./PasoHogar.jsx";
import PasoViviendas from "./PasoViviendas.jsx";
import PasoRevision from "./PasoRevision.jsx";
import { useBorrador } from "../context/BorradorContext.jsx";
import { PASOS } from "../context/borradorReducer.js";
import useCalls from "../hooks/useCalls.js";
import useDwellings from "../hooks/useDwellings.js";
import useEnviarSolicitud from "../hooks/useEnviarSolicitud.js";
import { errorVivienda, validarHogar } from "../reglas/solicitud.js";
import { buscarPorId } from "../utils/ids.js";
import styles from "./SolicitudForm.module.css";

// Hacen falta las dos colecciones para validar las viviendas.
function unirEstados(viviendas, convocatorias) {
  const estados = [viviendas, convocatorias];
  if (estados.includes("error")) return "error";
  if (estados.includes("cargando")) return "cargando";
  return viviendas;
}

function errorDeSeleccion(elegidas, estado) {
  if (elegidas.length === 0) return "Añade al menos una vivienda.";
  if (estado === "cargando") return "Espera a que se carguen las viviendas.";
  if (estado === "error") return "No se han podido comprobar las viviendas.";
  return elegidas.some((e) => e.error)
    ? "Quita las viviendas que tienen un error para continuar."
    : null;
}

function SolicitudForm() {
  const { borrador, dispatch } = useBorrador();
  const { viviendas: libres, estado: estadoViviendas } = useDwellings();
  const { convocatorias, estado: estadoConvocatorias } = useCalls();
  const { enviar, enviando, error, limpiarError } = useEnviarSolicitud();
  const [confirmando, setConfirmando] = useState(false);
  const navegar = useNavigate();

  const formulario = useRef(null);
  const foco = useRef(null);

  const { paso, hogar, tocados, editando } = borrador;
  const estado = unirEstados(estadoViviendas, estadoConvocatorias);
  const modificando = editando !== null;
  const accionFinal = modificando ? "Guardar cambios" : "Enviar solicitud";
  const ultimo = paso === PASOS.length;

  const elegidas = borrador.viviendas.map((id) => {
    const vivienda = buscarPorId(libres, id);
    const error = errorVivienda(vivienda, hogar, convocatorias);
    return { id, vivienda, error };
  });
  const erroresHogar = validarHogar(hogar);
  const errorViviendas = errorDeSeleccion(elegidas, estado);

  // El destino del foco puede no existir hasta que se pinta el nuevo estado.
  useEffect(() => {
    if (!foco.current) return;
    const destino = `[data-foco="${foco.current}"]`;
    foco.current = null;
    formulario.current.querySelector(destino)?.focus();
  });

  function irA(numero) {
    foco.current = "titulo";
    dispatch({ type: "ir", paso: numero });
  }

  function mostrarErrores(numero, campos, destino) {
    foco.current = destino;
    dispatch({ type: "tocar", campos });
    dispatch({ type: "ir", paso: numero });
  }

  function continuar(e) {
    e.preventDefault();

    const [primero] = Object.keys(erroresHogar);
    if (primero) return mostrarErrores(1, Object.keys(hogar), primero);
    if (paso >= 2 && errorViviendas) {
      return mostrarErrores(2, ["viviendas"], "error-viviendas");
    }
    if (!ultimo) return irA(paso + 1);

    limpiarError();
    setConfirmando(true);
  }

  async function confirmar() {
    const datos = {
      ...hogar,
      personas: Number(hogar.personas),
      ingresos: Number(hogar.ingresos),
      viviendas: borrador.viviendas,
    };
    if (!(await enviar(datos, editando))) return;

    dispatch({ type: "terminar" });
    const aviso = modificando ? "Solicitud modificada." : "Solicitud enviada.";
    navegar("/mi-solicitud", { state: { aviso } });
  }

  function cancelarModificacion() {
    dispatch({ type: "terminar" });
    navegar("/mi-solicitud");
  }

  function mover(type, id) {
    foco.current = `${type}-${id}`;
    dispatch({ type, id });
  }

  function quitar(id) {
    foco.current = "titulo";
    dispatch({ type: "quitar", id });
  }

  return (
    <>
      <form
        ref={formulario}
        className={styles.formulario}
        noValidate
        onSubmit={continuar}
      >
        {modificando && (
          <div className={styles.bloque}>
            <p>
              Estás modificando una solicitud ya enviada. Tu borrador sin enviar,
              si tenías uno, volverá al terminar.
            </p>
            <button
              type="button"
              className={styles.secundario}
              onClick={cancelarModificacion}
            >
              Cancelar modificación
            </button>
          </div>
        )}

        <ol className={styles.pasos} aria-label="Pasos de la solicitud">
          {PASOS.map((nombre, i) => (
            <li
              key={nombre}
              className={i + 1 === paso ? styles.pasoActual : styles.paso}
              aria-current={i + 1 === paso ? "step" : undefined}
            >
              {i + 1}. {nombre}
              {i + 1 < paso && " ✓"}
            </li>
          ))}
        </ol>

        <h2 className={styles.titulo} data-foco="titulo" tabIndex={-1}>
          Paso {paso} de {PASOS.length}: {PASOS[paso - 1]}
        </h2>

        {paso === 1 && (
          <PasoHogar
            hogar={hogar}
            errores={erroresHogar}
            tocados={tocados}
            onCambiar={(campo, valor) =>
              dispatch({ type: "cambiar", campo, valor })
            }
            onTocar={(campo) => dispatch({ type: "tocar", campos: [campo] })}
          />
        )}
        {paso === 2 && (
          <PasoViviendas
            elegidas={elegidas}
            estado={estado}
            error={tocados.viviendas ? errorViviendas : null}
            onMover={mover}
            onQuitar={quitar}
          />
        )}
        {paso === 3 && (
          <PasoRevision
            hogar={hogar}
            elegidas={elegidas}
            estado={estado}
            onEditar={irA}
          />
        )}

        <div className={styles.acciones}>
          {paso > 1 && (
            <button
              type="button"
              className={styles.secundario}
              onClick={() => irA(paso - 1)}
            >
              Anterior
            </button>
          )}
          {/* El segundo clic de un doble clic no debe saltarse la revisión. */}
          <button
            type="submit"
            className={styles.primario}
            onClick={(e) => e.detail > 1 && e.preventDefault()}
          >
            {ultimo ? accionFinal : "Siguiente"}
          </button>
        </div>
      </form>

      {/* Fuera del <form>: el modal tiene el suyo. */}
      {confirmando && (
        <ConfirmModal
          titulo={accionFinal}
          accion={modificando ? "Sí, guardar" : "Sí, enviar"}
          enviando={enviando}
          error={error}
          onConfirmar={confirmar}
          onCerrar={() => setConfirmando(false)}
        >
          <p>
            {modificando
              ? "La solicitud enviada se sustituirá por esta, con "
              : "Vas a enviar tu solicitud con "}
            <strong>
              {elegidas.length === 1
                ? "1 vivienda"
                : `${elegidas.length} viviendas`}
            </strong>
            . Tu primera preferencia es{" "}
            <strong>{elegidas[0]?.vivienda?.referencia}</strong>.
          </p>
        </ConfirmModal>
      )}
    </>
  );
}

export default SolicitudForm;
