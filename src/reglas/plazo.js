import { buscarPorId } from "../utils/ids.js";

export function convocatoriaDe(vivienda, convocatorias) {
  return buscarPorId(convocatorias, vivienda.convocatoriaId);
}

// Manda el campo estado y no la fecha de hoy: los datos son fijos y todas las
// fechas de cierre ya han pasado.
export function plazoAbierto(vivienda, convocatorias) {
  return convocatoriaDe(vivienda, convocatorias)?.estado === "abierta";
}

// Una solicitud puede tener viviendas de varias convocatorias: se modifica
// mientras todas sigan abiertas.
export function sePuedeModificar(ids, viviendas, convocatorias) {
  return ids.every((id) => {
    const vivienda = buscarPorId(viviendas, id);
    return vivienda !== undefined && plazoAbierto(vivienda, convocatorias);
  });
}
