import {
  PERSONAS_MAXIMO,
  ingresosAdmitidos,
  limitesIngresos,
  rentaMaxima,
} from "./acceso.js";
import { convocatoriaDe, plazoAbierto } from "./plazo.js";
import { euros } from "../utils/euros.js";

const TEXTO_MAXIMO = 300;
const NOMBRE_MINIMO = 3;
const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

// Fecha local en formato AAAA-MM-DD, el mismo que usa <input type="date">.
export function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function leerPersonas(texto) {
  const numero = Number(texto);
  const valido =
    Number.isInteger(numero) && numero >= 1 && numero <= PERSONAS_MAXIMO;
  return valido ? numero : null;
}

function leerIngresos(texto) {
  return /^\d+$/.test(texto) ? Number(texto) : null;
}

function errorIngresos(texto, personas) {
  const ingresos = leerIngresos(texto);
  if (ingresos === null) {
    return "Indica los ingresos netos anuales del hogar, en euros.";
  }
  if (ingresosAdmitidos(ingresos, personas)) return null;

  const { minimo, maximo } = limitesIngresos(personas);
  const hogar = personas === null ? "" : " para tu hogar";
  return `Los ingresos admitidos${hogar} van de ${euros(minimo)} a ${euros(maximo)} al año.`;
}

function errorFecha(fecha, hoy) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return "Indica la fecha de entrada deseada.";
  }
  return fecha < hoy ? "La fecha no puede ser anterior a hoy." : null;
}

function errorTexto(texto) {
  if (texto.length <= TEXTO_MAXIMO) return null;
  return `Como máximo ${TEXTO_MAXIMO} caracteres: llevas ${texto.length}.`;
}

function soloErrores(errores) {
  return Object.fromEntries(
    Object.entries(errores).filter(([, texto]) => texto !== null),
  );
}

export function normalizarPersonales({ nombre, dni, telefono, correo }) {
  return {
    nombre: nombre.trim(),
    dni: dni.trim().toUpperCase(),
    telefono: telefono.trim(),
    correo: correo.trim(),
  };
}

function errorNombre(nombre) {
  if (nombre === "") return "Indica tu nombre completo.";
  return nombre.length < NOMBRE_MINIMO
    ? `El nombre debe tener al menos ${NOMBRE_MINIMO} caracteres.`
    : null;
}

function errorDni(dni) {
  if (dni === "") return "Indica tu DNI.";
  if (!/^\d{8}[A-Z]$/.test(dni)) {
    return "El DNI debe tener 8 números y una letra.";
  }
  const letra = LETRAS_DNI[Number(dni.slice(0, 8)) % LETRAS_DNI.length];
  return dni[8] === letra ? null : "La letra del DNI no es correcta.";
}

function errorTelefono(telefono) {
  if (telefono === "") return "Indica tu teléfono.";
  return /^[6-9]\d{8}$/.test(telefono)
    ? null
    : "El teléfono debe tener 9 cifras y empezar por 6, 7, 8 o 9.";
}

function errorCorreo(correo) {
  if (correo === "") return "Indica tu correo electrónico.";
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(correo)
    ? null
    : "El correo no es válido: escríbelo como nombre@dominio.es.";
}

export function validarPersonales(personales) {
  const { nombre, dni, telefono, correo } = normalizarPersonales(personales);
  return soloErrores({
    nombre: errorNombre(nombre),
    dni: errorDni(dni),
    telefono: errorTelefono(telefono),
    correo: errorCorreo(correo),
  });
}

// Devuelve solo los campos con error: { campo: "texto del error" }
export function validarHogar(hogar, hoy = fechaDeHoy()) {
  const personas = leerPersonas(hogar.personas);
  return soloErrores({
    personas:
      personas === null
        ? "Indica cuántas personas vivirán en la vivienda."
        : null,
    ingresos: errorIngresos(hogar.ingresos, personas),
    fecha: errorFecha(hogar.fecha, hoy),
    necesidades: errorTexto(hogar.necesidades),
    observaciones: errorTexto(hogar.observaciones),
  });
}

// Una vivienda undefined es que ya no está entre las libres.
export function errorVivienda(vivienda, hogar, convocatorias) {
  if (!vivienda) return "Ya no está disponible. Quítala para continuar.";
  if (!plazoAbierto(vivienda, convocatorias)) {
    const codigo = convocatoriaDe(vivienda, convocatorias)?.codigo;
    return `El plazo de su convocatoria${codigo ? ` (${codigo})` : ""} está cerrado.`;
  }

  const ingresos = leerIngresos(hogar.ingresos);
  if (ingresos === null || vivienda.renta <= rentaMaxima(ingresos)) return null;
  return `Su renta (${euros(vivienda.renta)}) supera el 30 % de tus ingresos mensuales (${euros(rentaMaxima(ingresos))}).`;
}
