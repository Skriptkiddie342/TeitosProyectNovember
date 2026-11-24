import { useState, useEffect } from "react";
import { obtenerViviendasLibres } from "../api/viviendas.js";

// Última respuesta: al volver del detalle la lista sale al instante y el
// navegador recupera la posición. Aun así se vuelve a pedir siempre.
let ultimas = null;

function estadoDe(lista) {
  return lista.length === 0 ? "vacio" : "ok";
}

export default function useDwellings() {
  const [viviendas, setViviendas] = useState(ultimas ?? []);
  const [estado, setEstado] = useState(
    ultimas ? estadoDe(ultimas) : "cargando",
  );

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

    return () => controller.abort();
  }, []);

  return { viviendas, estado };
}
