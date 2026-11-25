import { useState, useEffect } from "react";
import { API } from "../api/api.js";

// Hook que carga las viviendas de una convocatoria. Devuelve la lista y el
// estado: cargando, ok o error. Si no hay libres, avisa la página CallPage.
export default function useCallDwelling(id) {
  const [viviendas, setViviendas] = useState([]);
  const [estado, setEstado] = useState("cargando");

  // Hace la petición al entrar y cada vez que cambia el id.
  useEffect(() => {
    const controller = new AbortController();
    setEstado("cargando");

    fetch(`${API}/viviendas?convocatoriaId=${id}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error del servidor");
        return res.json();
      })
      .then((data) => {
        setViviendas(data);
        setEstado("ok");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    // Al salir de la pantalla se cancela la petición.
    return () => controller.abort();
  }, [id]);

  return { viviendas, estado };
}
