// Regla de acceso del caso (simplificación de la real).
const IPREM_ANUAL = 8400;
const VECES_MINIMO = 2;
const VECES_MAXIMO = 7.5;
const ESFUERZO_MAXIMO = 30; // % del ingreso mensual

// En centésimas (1,15 -> 115): con decimales, 8400 * 1.15 no da 9660 exacto.
const PONDERACION = [100, 115, 130, 145, 160, 175];

// El último tramo vale para "6 o más" personas.
export const PERSONAS_MAXIMO = PONDERACION.length;

export function ipremPonderado(personas) {
  const tramo = Math.min(personas, PERSONAS_MAXIMO) - 1;
  return (IPREM_ANUAL * PONDERACION[tramo]) / 100;
}

// Sin personas devuelve el margen más amplio: del hogar menor al mayor.
export function limitesIngresos(personas = null) {
  return {
    minimo: ipremPonderado(personas ?? 1) * VECES_MINIMO,
    maximo: ipremPonderado(personas ?? PERSONAS_MAXIMO) * VECES_MAXIMO,
  };
}

export function ingresosAdmitidos(ingresos, personas = null) {
  const { minimo, maximo } = limitesIngresos(personas);
  return ingresos >= minimo && ingresos <= maximo;
}

export function rentaMaxima(ingresos) {
  return (ingresos * ESFUERZO_MAXIMO) / (12 * 100);
}

// Un dato sin indicar (null) no excluye viviendas: sin ingresos se toma el
// máximo admitido, y sin personas vale cualquier tamaño de hogar.
export function cumpleAcceso({ renta, personas = null, ingresos = null }) {
  if (personas === null && ingresos === null) return true;
  if (ingresos === null) {
    return renta <= rentaMaxima(limitesIngresos(personas).maximo);
  }
  return ingresosAdmitidos(ingresos, personas) && renta <= rentaMaxima(ingresos);
}
