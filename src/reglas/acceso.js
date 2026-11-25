// Regla de acceso del caso (simplificación de la real).
const IPREM_ANUAL = 8400;
const VECES_MINIMO = 2;
const VECES_MAXIMO = 7.5;
const ESFUERZO_MAXIMO = 30; // % del ingreso mensual

// En centésimas (1,15 -> 115): se calcula con enteros y se divide al final,
// para no depender del redondeo de los decimales.
const PONDERACION = [100, 115, 130, 145, 160, 175];

// El último tramo vale para "6 o más" personas.
export const PERSONAS_MAXIMO = PONDERACION.length;

// Devuelve el IPREM anual según el tamaño del hogar: 8.400 € por el peso que le
// toca. Con 2 personas, 9.660 €.
export function ipremPonderado(personas) {
  const tramo = Math.min(personas, PERSONAS_MAXIMO) - 1;
  return (IPREM_ANUAL * PONDERACION[tramo]) / 100;
}

// Devuelve los ingresos mínimos (2 veces el IPREM ponderado) y máximos (7,5
// veces) que se admiten para ese número de personas.
// Sin personas devuelve el margen más amplio: del hogar menor al mayor.
export function limitesIngresos(personas = null) {
  return {
    minimo: ipremPonderado(personas ?? 1) * VECES_MINIMO,
    maximo: ipremPonderado(personas ?? PERSONAS_MAXIMO) * VECES_MAXIMO,
  };
}

// Dice si los ingresos están entre el mínimo y el máximo, los dos incluidos.
// Devuelve true o false.
export function ingresosAdmitidos(ingresos, personas = null) {
  const { minimo, maximo } = limitesIngresos(personas);
  return ingresos >= minimo && ingresos <= maximo;
}

// Devuelve la renta más alta que se puede pagar: el 30 % del ingreso mensual.
// Con 24.000 € al año, 600 € al mes.
export function rentaMaxima(ingresos) {
  return (ingresos * ESFUERZO_MAXIMO) / (12 * 100);
}

// Regla de acceso completa: dice si un hogar puede optar a una vivienda con esa
// renta. Es lo que usa el buscador para filtrar. Devuelve true o false.
// Un dato sin indicar (null) no excluye viviendas: sin ingresos se toma el
// máximo admitido, y sin personas vale cualquier tamaño de hogar.
export function cumpleAcceso({ renta, personas = null, ingresos = null }) {
  if (personas === null && ingresos === null) return true;
  if (ingresos === null) {
    return renta <= rentaMaxima(limitesIngresos(personas).maximo);
  }
  return ingresosAdmitidos(ingresos, personas) && renta <= rentaMaxima(ingresos);
}
