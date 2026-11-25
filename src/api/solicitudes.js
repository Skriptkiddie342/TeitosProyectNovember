import { pedir } from "./api.js";

// Envía datos al servidor en formato JSON. method dice qué se hace: POST crea,
// PUT sustituye y PATCH cambia solo una parte.
function enviar(method, ruta, datos) {
  return pedir(ruta, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

// Construye la ruta de una solicitud: "abc" -> "/solicitudes/abc".
// encodeURIComponent protege la ruta si el id lleva caracteres raros.
function rutaDe(id) {
  return `/solicitudes/${encodeURIComponent(id)}`;
}

// Pide todas las solicitudes enviadas (GET).
export function obtenerSolicitudes(signal) {
  return pedir("/solicitudes", { signal });
}

// Pide una sola solicitud por su id (GET).
export function obtenerSolicitud(id) {
  return pedir(rutaDe(id));
}

// Registra una solicitud nueva (POST). El id lo pone el servidor.
export function crearSolicitud(datos) {
  return enviar("POST", "/solicitudes", datos);
}

// Guarda los cambios de una solicitud ya enviada (PUT).
// PUT sustituye la solicitud entera: datos tiene que llevar todos los campos.
export function modificarSolicitud(id, datos) {
  return enviar("PUT", rutaDe(id), datos);
}

// Cambia solo el campo revisada (PATCH); el resto de la solicitud no se toca.
export function marcarSolicitud(id, revisada) {
  return enviar("PATCH", rutaDe(id), { revisada });
}

// Borra una solicitud del servidor (DELETE).
export function retirarSolicitud(id) {
  return pedir(rutaDe(id), { method: "DELETE" });
}
