import { pedir } from "./api.js";

// Pide todas las convocatorias (GET). signal sirve para cancelar la petición.
export function obtenerConvocatorias(signal) {
  return pedir("/convocatorias", { signal });
}
