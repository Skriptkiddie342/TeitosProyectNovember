// Dirección del servidor de datos. Solo se escribe aquí.
export const API = "http://localhost:3001";

// Hace una petición al servidor y devuelve los datos ya convertidos de JSON.
// fetch no falla con un 404 o un 500, por eso se mira respuesta.ok y se lanza
// el error a mano.
// El error lleva el código HTTP en estado, para distinguir el 404.
export async function pedir(ruta, opciones) {
  const respuesta = await fetch(`${API}${ruta}`, opciones);
  if (!respuesta.ok) {
    const error = new Error("Error del servidor");
    error.estado = respuesta.status;
    throw error;
  }
  return respuesta.json();
}
