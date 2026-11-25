import { useState, useEffect } from "react";
import { contarViviendasLibres } from "../api/viviendas.js";

// Hook que carga cuántas viviendas libres hay, para la portada. Devuelve el
// total y el estado: cargando, ok, vacio o error.
export default function useDwellingCount() {
  const [total, setTotal] = useState(null);
  const [estado, setEstado] = useState("cargando");

  // Hace la petición una vez, al entrar ([] = no depende de nada).
  useEffect(() => {
    const controller = new AbortController();

    contarViviendasLibres(controller.signal)
      .then((numero) => {
        setTotal(numero);
        setEstado(numero === 0 ? "vacio" : "ok");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, []);

  return { total, estado };
}
