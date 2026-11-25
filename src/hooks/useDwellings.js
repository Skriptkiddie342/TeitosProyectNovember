import { useState, useEffect } from "react";
import { obtenerViviendasLibres } from "../api/viviendas.js";

// Última respuesta: al volver del detalle la lista sale al instante y el
// navegador recupera la posición. Aun así se vuelve a pedir siempre.
let ultimas = null;

// Dice si una lista cargada está vacía ("vacio") o tiene datos ("ok").
function estadoDe(lista) {
  return lista.length === 0 ? "vacio" : "ok";
}

// Hook que carga las viviendas libres. Devuelve la lista y el estado: cargando,
// ok, vacio o error.
export default function useDwellings() {
  const [viviendas, setViviendas] = useState(ultimas ?? []);
  const [estado, setEstado] = useState(
    ultimas ? estadoDe(ultimas) : "cargando",
  );

  // Hace la petición una vez, al entrar ([] = no depende de nada).
  useEffect(() => {
    const controller = new AbortController();

    obtenerViviendasLibres(controller.signal)
      .then((data) => {
        ultimas = data;
        setViviendas(data);
        setEstado(estadoDe(data));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, []);

  return { viviendas, estado };
}
