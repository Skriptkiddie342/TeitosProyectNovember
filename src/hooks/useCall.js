import { useState, useEffect } from "react";
import { API } from "../api/api.js";

export default function useCall(id) {
  const [convocatoria, setConvocatoria] = useState(null);
  const [estado, setEstado] = useState("cargando");

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

    return () => controller.abort();
  }, [id]);

  return { convocatoria, estado };
}
