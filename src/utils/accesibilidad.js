// null es "no se sabe", que no es lo mismo que "sin adaptar".
const SIN_DATOS = "sin_datos";

// Opciones del filtro de accesibilidad: valor es el dato y texto, lo que se ve.
export const MEDIDAS = [
  { valor: "adaptada", texto: "Adaptada" },
  { valor: "practicable", texto: "Practicable" },
  { valor: "sin_adaptar", texto: "Sin adaptar" },
  { valor: SIN_DATOS, texto: "Sin datos" },
];

// Devuelve la accesibilidad de una vivienda; si es null, "sin_datos".
export function medidaDe(vivienda) {
  return vivienda.accesibilidad ?? SIN_DATOS;
}

// Devuelve el texto que se muestra, en minúsculas: "sin_adaptar" -> "sin
// adaptar".
export function textoMedida(accesibilidad) {
  const medida = accesibilidad ?? SIN_DATOS;
  const opcion = MEDIDAS.find((m) => m.valor === medida);
  return (opcion?.texto ?? medida).toLowerCase();
}
