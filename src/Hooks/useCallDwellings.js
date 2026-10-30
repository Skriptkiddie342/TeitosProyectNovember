import { useState, useEffect } from "react";
import { API } from "../api.js";

export default function useCallDwelling(id) {
  const [viviendas, setViviendas] = useState([]);
  const [estado, setEstado] = useState("cargando");

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

    return () => controller.abort();
  }, [id]);

  return { viviendas, estado };
}
