import { pedir } from "./api.js";

const LIBRES = "/viviendas?adjudicada=false";

export function obtenerViviendasLibres(signal) {
  return pedir(LIBRES, { signal });
}

// Pide una página de una sola vivienda: el total llega en items.
export async function contarViviendasLibres(signal) {
  const pagina = await pedir(`${LIBRES}&_page=1&_per_page=1`, { signal });
  return pagina.items;
}

// Una a una: ?id=478 no encuentra nada, porque json-server lo busca como
// número y el id es texto. Las que no existen se omiten.
export async function obtenerViviendas(ids, signal) {
  const unicos = [...new Set(ids.map(String))];
  const viviendas = await Promise.all(
    unicos.map(async (id) => {
      try {
        return await pedir(`/viviendas/${encodeURIComponent(id)}`, { signal });
      } catch (error) {
        if (error.estado === 404) return null;
        throw error;
      }
    }),
  );
  return viviendas.filter((vivienda) => vivienda !== null);
}
