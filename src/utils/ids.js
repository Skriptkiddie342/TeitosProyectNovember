// json-server da el id como texto ("8") y convocatoriaId es un número (8).
export function mismoId(a, b) {
  return String(a) === String(b);
}

export function buscarPorId(lista, id) {
  return lista.find((elemento) => mismoId(elemento.id, id));
}
