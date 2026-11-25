import { useState, useEffect } from "react";
import { obtenerConvocatorias } from "../api/convocatorias.js";
import {
  marcarSolicitud,
  obtenerSolicitudes,
  retirarSolicitud,
} from "../api/solicitudes.js";
import { obtenerViviendas } from "../api/viviendas.js";
import { sePuedeModificar } from "../reglas/plazo.js";
import { buscarPorId, mismoId } from "../utils/ids.js";

// Pide las solicitudes, las convocatorias y las viviendas elegidas, y lo junta
// todo en una sola lista, indicando cuáles se pueden modificar.
// Une cada solicitud con sus viviendas: _embed no funciona con estos datos.
async function cargar(signal) {
  const [solicitudes, convocatorias] = await Promise.all([
    obtenerSolicitudes(signal),
    obtenerConvocatorias(signal),
  ]);
  const ids = solicitudes.flatMap((s) => s.viviendas ?? []);
  const viviendas = await obtenerViviendas(ids, signal);

  return solicitudes.map((solicitud) => {
    const suyas = solicitud.viviendas ?? [];
    return {
      solicitud,
      id: solicitud.id,
      elegidas: suyas.map((id) => ({
        id,
        vivienda: buscarPorId(viviendas, id),
      })),
      modificable: sePuedeModificar(suyas, viviendas, convocatorias),
    };
  });
}

// Hook de la página Mis solicitudes. Devuelve la lista, el estado (cargando,
// ok, vacio o error) y las funciones para retirar y marcar.
export default function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [estado, setEstado] = useState("cargando");

  // Carga los datos una vez, al entrar ([] = no depende de nada).
  useEffect(() => {
    const controller = new AbortController();

    cargar(controller.signal)
      .then((datos) => {
        setSolicitudes(datos);
        setEstado("ok");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, []);

  // Retira una solicitud: la borra del servidor y después de la pantalla.
  // retirar y marcar lanzan el error del servidor: quien las llama decide qué
  // mostrar.
  async function retirar(id) {
    try {
      await retirarSolicitud(id);
    } catch (error) {
      // 404: ya estaba retirada, que es lo que se quería.
      if (error.estado !== 404) throw error;
    }
    setSolicitudes((actuales) => actuales.filter((s) => !mismoId(s.id, id)));
  }

  // Marca una solicitud como revisada o sin revisar, y actualiza la pantalla.
  async function marcar(id, revisada) {
    const solicitud = await marcarSolicitud(id, revisada);
    setSolicitudes((actuales) =>
      actuales.map((s) => (mismoId(s.id, id) ? { ...s, solicitud } : s)),
    );
  }

  const vacia = estado === "ok" && solicitudes.length === 0;
  return {
    solicitudes,
    estado: vacia ? "vacio" : estado,
    retirar,
    marcar,
  };
}
