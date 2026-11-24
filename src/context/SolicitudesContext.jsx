import { createContext, useContext, useEffect, useState } from "react";

const SolicitudesContext = createContext(null);
const CLAVE = "teitos-solicitudes";

export function SolicitudesProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState(
    () => JSON.parse(localStorage.getItem(CLAVE)) ?? [],
  );

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(solicitudes));
  }, [solicitudes]);

  function agregar(solicitud) {
    setSolicitudes((actuales) => [
      ...actuales,
      { ...solicitud, id: Date.now(), revisada: false },
    ]);
  }

  function retirar(id) {
    setSolicitudes((actuales) => actuales.filter((s) => s.id !== id));
  }

  function alternarRevisada(id) {
    setSolicitudes((actuales) =>
      actuales.map((s) => (s.id === id ? { ...s, revisada: !s.revisada } : s)),
    );
  }

  return (
    <SolicitudesContext.Provider
      value={{ solicitudes, agregar, retirar, alternarRevisada }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  return useContext(SolicitudesContext);
}
