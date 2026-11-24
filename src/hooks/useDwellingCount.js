import { useState, useEffect } from "react";
import { contarViviendasLibres } from "../api/viviendas.js";

export default function useDwellingCount() {
  const [total, setTotal] = useState(null);
  const [estado, setEstado] = useState("cargando");

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

    return () => controller.abort();
  }, []);

  return { total, estado };
}
