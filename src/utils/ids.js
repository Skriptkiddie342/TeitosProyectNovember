// Compara dos ids como texto, para que "8" y 8 se consideren iguales.
// json-server da el id como texto ("8") y convocatoriaId es un número (8).
export function mismoId(a, b) {
  return String(a) === String(b);
}

// Busca en una lista el elemento con ese id. Si no está, devuelve undefined.
export function buscarPorId(lista, id) {
  return lista.find((elemento) => mismoId(elemento.id, id));
}
