// Nombres de los cuatro pasos del formulario.
export const PASOS = [
  "Datos personales",
  "Datos del hogar",
  "Viviendas elegidas",
  "Revisión",
];

// Borrador vacío, con el que se empieza.
export const INICIAL = {
  paso: 1,
  personales: {
    nombre: "",
    dni: "",
    telefono: "",
    correo: "",
  },
  hogar: {
    personas: "",
    ingresos: "",
    fecha: "",
    movilidadReducida: false,
    mascotas: false,
    necesidades: "",
    observaciones: "",
  },
  // Ids como texto, en orden de preferencia.
  viviendas: [],
  // Campos cuyo error ya se puede mostrar.
  tocados: {},
  // Id de la solicitud enviada que se está modificando, o null si es nueva.
  editando: null,
  // Borrador sin enviar que había antes de empezar a modificar.
  previo: null,
};

// Prepara los datos de una solicitud enviada para poder editarlos en el
// formulario.
// Los datos del servidor (personas: 2) pasan a los del formulario ("2").
function datosDe(solicitud, iniciales) {
  const campos = Object.entries(iniciales).map(([campo, inicial]) => {
    const valor = solicitud[campo] ?? inicial;
    const esCasilla = typeof inicial === "boolean";
    return [campo, esCasilla ? Boolean(valor) : String(valor)];
  });
  return Object.fromEntries(campos);
}

// Cambia una vivienda de posición en la lista: salto -1 la sube y 1 la baja. Si
// ya está en el extremo, devuelve la lista igual.
function mover(lista, id, salto) {
  const desde = lista.indexOf(id);
  const hasta = desde + salto;
  if (desde === -1 || hasta < 0 || hasta >= lista.length) return lista;

  const nueva = [...lista];
  [nueva[desde], nueva[hasta]] = [nueva[hasta], nueva[desde]];
  return nueva;
}

// Reúne todos los cambios posibles del borrador. Recibe el estado actual y una
// acción, y devuelve un estado nuevo, sin modificar el anterior.
export function borradorReducer(estado, accion) {
  const { personales, hogar, viviendas, tocados } = estado;

  switch (accion.type) {
    case "cambiarPersonales":
      return {
        ...estado,
        personales: { ...personales, [accion.campo]: accion.valor },
        tocados: { ...tocados, [accion.campo]: true },
      };
    // Se escribe en un campo del hogar.
    case "cambiar":
      return {
        ...estado,
        hogar: { ...hogar, [accion.campo]: accion.valor },
        tocados: { ...tocados, [accion.campo]: true },
      };
    // Se marcan campos para que ya se vean sus errores.
    case "tocar": {
      const nuevos = accion.campos.map((campo) => [campo, true]);
      return {
        ...estado,
        tocados: { ...tocados, ...Object.fromEntries(nuevos) },
      };
    }
    // Se cambia de paso.
    case "ir":
      return { ...estado, paso: accion.paso };
    // Se añade una vivienda al final, si no estaba ya.
    case "anadir": {
      const id = String(accion.id);
      if (viviendas.includes(id)) return estado;
      return { ...estado, viviendas: [...viviendas, id] };
    }
    // Se quita una vivienda.
    case "quitar":
      return {
        ...estado,
        viviendas: viviendas.filter((id) => id !== String(accion.id)),
      };
    // Se sube o se baja una vivienda en el orden de preferencia.
    case "subir":
      return { ...estado, viviendas: mover(viviendas, accion.id, -1) };
    case "bajar":
      return { ...estado, viviendas: mover(viviendas, accion.id, 1) };
    // Se empieza a modificar una solicitud enviada, y se guarda en previo el
    // borrador que hubiera sin enviar.
    case "editar":
      return {
        ...INICIAL,
        personales: datosDe(accion.solicitud, INICIAL.personales),
        hogar: datosDe(accion.solicitud, INICIAL.hogar),
        viviendas: accion.solicitud.viviendas.map(String),
        editando: String(accion.solicitud.id),
        previo: estado.editando === null ? estado : estado.previo,
      };
    // Tras enviar, guardar o cancelar: vuelve el borrador que había, si había.
    case "terminar":
      return estado.previo ?? INICIAL;
    // Se ha retirado una solicitud: si era la que se estaba modificando, se
    // deja de modificar.
    case "retirada":
      return estado.editando === String(accion.id)
        ? (estado.previo ?? INICIAL)
        : estado;
    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}

// Dice si un valor es un objeto normal (ni null ni una lista).
function esObjeto(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Convierte el texto guardado en un borrador. Si está roto, devuelve uno vacío.
// Lo guardado puede estar roto o ser de otra versión: solo se acepta lo que
// encaja con la forma del borrador.
export function restaurar(texto) {
  try {
    return reconstruir(JSON.parse(texto));
  } catch {
    return INICIAL;
  }
}

function recuperar(guardados, iniciales) {
  const datos = { ...iniciales };
  if (esObjeto(guardados)) {
    for (const campo of Object.keys(datos)) {
      if (typeof guardados[campo] === typeof datos[campo]) {
        datos[campo] = guardados[campo];
      }
    }
  }
  return datos;
}

// Monta el borrador dato a dato, quedándose solo con los que son del tipo
// correcto. Se llama a sí misma para reconstruir también previo.
function reconstruir(guardado) {
  if (!esObjeto(guardado)) return INICIAL;

  const ids = Array.isArray(guardado.viviendas) ? guardado.viviendas : [];
  const validos = ids.filter((id) => ["string", "number"].includes(typeof id));
  const pasoValido =
    esObjeto(guardado.personales) && [1, 2, 3, 4].includes(guardado.paso);

  return {
    paso: pasoValido ? guardado.paso : 1,
    personales: recuperar(guardado.personales, INICIAL.personales),
    hogar: recuperar(guardado.hogar, INICIAL.hogar),
    viviendas: [...new Set(validos.map(String))],
    tocados: esObjeto(guardado.tocados) ? guardado.tocados : {},
    editando: typeof guardado.editando === "string" ? guardado.editando : null,
    previo: esObjeto(guardado.previo) ? reconstruir(guardado.previo) : null,
  };
}
