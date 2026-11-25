import { useState, useEffect } from "react";
import { API } from "../api/api.js";

// Hook que carga las convocatorias. Con query se filtran en el servidor, por
// ejemplo "?estado=abierta". Devuelve la lista y el estado: cargando, ok, vacio
// o error.
export default function useCalls(query = "") {
  const [convocatorias, setConvocatorias] = useState([]);
  const [estado, setEstado] = useState("cargando");

  // Hace la petición al entrar y cada vez que cambia query.
  useEffect(() => {
    const controller = new AbortController();
    setEstado("cargando");

    fetch(`${API}/convocatorias${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor");
        return res.json();
      })
      .then((data) => {
        setConvocatorias(data);
        setEstado(data.length === 0 ? "vacio" : "ok");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, [query]);

  return { convocatorias, estado };
}
