export const API = "http://localhost:3001";

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
