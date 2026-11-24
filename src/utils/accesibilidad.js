// null es "no se sabe", que no es lo mismo que "sin adaptar".
const SIN_DATOS = "sin_datos";

export const MEDIDAS = [
  { valor: "adaptada", texto: "Adaptada" },
  { valor: "practicable", texto: "Practicable" },
  { valor: "sin_adaptar", texto: "Sin adaptar" },
  { valor: SIN_DATOS, texto: "Sin datos" },
];

export function medidaDe(vivienda) {
  return vivienda.accesibilidad ?? SIN_DATOS;
}

export function textoMedida(accesibilidad) {
  const medida = accesibilidad ?? SIN_DATOS;
  const opcion = MEDIDAS.find((m) => m.valor === medida);
  return (opcion?.texto ?? medida).toLowerCase();
}
