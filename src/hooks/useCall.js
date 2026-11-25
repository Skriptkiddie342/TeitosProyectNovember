import { useState, useEffect } from "react";
import { API } from "../api/api.js";

// Hook que carga una convocatoria por su id. Devuelve la convocatoria y el
// estado: cargando, ok, noexiste o error.
export default function useCall(id) {
  const [convocatoria, setConvocatoria] = useState(null);
  const [estado, setEstado] = useState("cargando");

  // Hace la petición al entrar y cada vez que cambia el id.
  useEffect(() => {
    const controller = new AbortController();
    setEstado("cargando");

    fetch(`${API}/convocatorias/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setEstado("noexiste");
          return null;
        }
        if (!res.ok) throw new Error("Error del servidor");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setConvocatoria(data);
          setEstado("ok");
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, [id]);

  return { convocatoria, estado };
}
