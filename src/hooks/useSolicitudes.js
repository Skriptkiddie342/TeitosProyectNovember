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

export default function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [estado, setEstado] = useState("cargando");

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

    return () => controller.abort();
  }, []);

  // Las dos lanzan el error del servidor: quien las llama decide qué mostrar.
  async function retirar(id) {
    try {
      await retirarSolicitud(id);
    } catch (error) {
      // 404: ya estaba retirada, que es lo que se quería.
      if (error.estado !== 404) throw error;
    }
    setSolicitudes((actuales) => actuales.filter((s) => !mismoId(s.id, id)));
  }

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
