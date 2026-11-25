import { buscarPorId } from "../utils/ids.js";

// Busca la convocatoria a la que pertenece una vivienda.
export function convocatoriaDe(vivienda, convocatorias) {
  return buscarPorId(convocatorias, vivienda.convocatoriaId);
}

// Dice si la convocatoria de una vivienda está abierta. El "?." evita un error
// si la convocatoria no se encuentra.
// Manda el campo estado y no la fecha de hoy: los datos son fijos y todas las
// fechas de cierre ya han pasado.
export function plazoAbierto(vivienda, convocatorias) {
  return convocatoriaDe(vivienda, convocatorias)?.estado === "abierta";
}

// Dice si una solicitud se puede modificar, mirando todas sus viviendas.
// Una solicitud puede tener viviendas de varias convocatorias: se modifica
// mientras todas sigan abiertas.
export function sePuedeModificar(ids, viviendas, convocatorias) {
  return ids.every((id) => {
    const vivienda = buscarPorId(viviendas, id);
    return vivienda !== undefined && plazoAbierto(vivienda, convocatorias);
  });
}
