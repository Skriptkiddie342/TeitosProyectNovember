import { createContext, useContext, useEffect, useReducer } from "react";
import { borradorReducer, restaurar } from "./borradorReducer.js";

const BorradorContext = createContext(null);
const CLAVE = "teitos-borrador";

// localStorage puede no estar disponible (navegación privada, bloqueado...).
function leer() {
  try {
    return restaurar(localStorage.getItem(CLAVE));
  } catch {
    return restaurar(null);
  }
}

function guardar(borrador) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(borrador));
  } catch {
    // Sin almacenamiento la solicitud sigue funcionando en memoria.
  }
}

export function BorradorProvider({ children }) {
  const [borrador, dispatch] = useReducer(borradorReducer, null, leer);

  useEffect(() => guardar(borrador), [borrador]);

  return (
    <BorradorContext.Provider value={{ borrador, dispatch }}>
      {children}
    </BorradorContext.Provider>
  );
}

export function useBorrador() {
  return useContext(BorradorContext);
}
