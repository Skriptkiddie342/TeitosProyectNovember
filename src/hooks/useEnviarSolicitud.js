import { useState } from "react";
import { obtenerConvocatorias } from "../api/convocatorias.js";
import {
  crearSolicitud,
  modificarSolicitud,
  obtenerSolicitud,
} from "../api/solicitudes.js";
import { obtenerViviendas } from "../api/viviendas.js";
import { sePuedeModificar } from "../reglas/plazo.js";

const PLAZO_CERRADO =
  "El plazo de alguna convocatoria ya se ha cerrado: no se puede enviar ni modificar.";

// Comprueba que todas las convocatorias de esas viviendas siguen abiertas. Si
// alguna está cerrada, lanza un error y no se guarda nada.
// Se vuelve a mirar el plazo justo antes de escribir: puede haberse cerrado
// con el formulario abierto.
async function comprobarPlazo(ids) {
  const [viviendas, convocatorias] = await Promise.all([
    obtenerViviendas(ids),
    obtenerConvocatorias(),
  ]);
  if (!sePuedeModificar(ids, viviendas, convocatorias)) {
    throw new Error(PLAZO_CERRADO);
  }
}

// Envía una solicitud nueva: comprueba el plazo y hace el POST, añadiendo la
// fecha de creación.
async function crear(datos) {
  await comprobarPlazo(datos.viviendas);
  await crearSolicitud({
    ...datos,
    revisada: false,
    creada: new Date().toISOString(),
  });
}

// Guarda los cambios de una solicitud enviada: pide la actual, comprueba el
// plazo y hace el PUT con los datos viejos y los nuevos encima.
// Cuenta el plazo de las viviendas que tenía y el de las que va a tener.
async function modificar(id, datos) {
  const actual = await obtenerSolicitud(id);
  await comprobarPlazo([...(actual.viviendas ?? []), ...datos.viviendas]);
  await modificarSolicitud(id, { ...actual, ...datos });
}

// Elige el mensaje que ve el usuario según el error que haya ocurrido.
function mensajeDe(error, editando) {
  if (error.message === PLAZO_CERRADO) return PLAZO_CERRADO;
  if (error.estado === 404) {
    return editando === null
      ? "El servidor no tiene la colección solicitudes. Ejecuta npm run reset-datos y vuelve a intentarlo."
      : "Esta solicitud ya no existe: se ha retirado.";
  }
  return "No se ha podido guardar. Comprueba que el servidor está en marcha y vuelve a intentarlo. Tu borrador sigue guardado.";
}

// Hook para enviar el formulario. Devuelve la función enviar, si se está
// enviando, el error que haya y limpiarError, para borrarlo.
export default function useEnviarSolicitud() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Envía la solicitud: si editando es null es nueva (POST); si tiene un id, se
  // modifica esa (PUT).
  // Devuelve true si se ha guardado.
  async function enviar(datos, editando) {
    setEnviando(true);
    setError(null);
    try {
      if (editando === null) await crear(datos);
      else await modificar(editando, datos);
      return true;
    } catch (fallo) {
      setError(mensajeDe(fallo, editando));
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return { enviar, enviando, error, limpiarError: () => setError(null) };
}
