import { useState, useEffect } from "react";
import { API } from "../api.js";

export default function useCalls(query = "") {
  const [convocatorias, setConvocatorias] = useState([]);
  const [estado, setEstado] = useState("cargando");

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
        setEstado("ok");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado("error");
      });

    return () => controller.abort();
  }, [query]);

  return { convocatorias, estado };
}
