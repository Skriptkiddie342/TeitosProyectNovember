import { pedir } from "./api.js";

function enviar(method, ruta, datos) {
  return pedir(ruta, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

function rutaDe(id) {
  return `/solicitudes/${encodeURIComponent(id)}`;
}

export function obtenerSolicitudes(signal) {
  return pedir("/solicitudes", { signal });
}

export function obtenerSolicitud(id) {
  return pedir(rutaDe(id));
}

export function crearSolicitud(datos) {
  return enviar("POST", "/solicitudes", datos);
}

// PUT sustituye la solicitud entera: datos tiene que llevar todos los campos.
export function modificarSolicitud(id, datos) {
  return enviar("PUT", rutaDe(id), datos);
}

export function marcarSolicitud(id, revisada) {
  return enviar("PATCH", rutaDe(id), { revisada });
}

export function retirarSolicitud(id) {
  return pedir(rutaDe(id), { method: "DELETE" });
}
