import { pedir } from "./api.js";

export function obtenerConvocatorias(signal) {
  return pedir("/convocatorias", { signal });
}
