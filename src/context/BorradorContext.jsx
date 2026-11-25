import { createContext, useContext, useEffect, useReducer } from "react";
import { borradorReducer, restaurar } from "./borradorReducer.js";

// Caja compartida donde se guarda el borrador.
const BorradorContext = createContext(null);
// Nombre con el que se guarda en localStorage.
const CLAVE = "teitos-borrador";

// Lee el borrador guardado en el navegador. Si no hay o falla, empieza uno
// vacío.
// localStorage puede no estar disponible (navegación privada, bloqueado...).
function leer() {
  try {
    return restaurar(localStorage.getItem(CLAVE));
  } catch {
    return restaurar(null);
  }
}

// Guarda el borrador en el navegador, para que siga ahí al recargar la página.
function guardar(borrador) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(borrador));
  } catch {
    // Sin almacenamiento la solicitud sigue funcionando en memoria.
  }
}

// Crea el borrador con useReducer y lo reparte a todos los componentes que
// tiene dentro (children).
export function BorradorProvider({ children }) {
  const [borrador, dispatch] = useReducer(borradorReducer, null, leer);

  // Cada vez que cambia el borrador, se guarda.
  useEffect(() => guardar(borrador), [borrador]);

  return (
    <BorradorContext.Provider value={{ borrador, dispatch }}>
      {children}
    </BorradorContext.Provider>
  );
}

// Atajo para usar el borrador desde cualquier componente: devuelve { borrador,
// dispatch }.
export function useBorrador() {
  return useContext(BorradorContext);
}
