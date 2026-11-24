export const PASOS = ["Datos del hogar", "Viviendas elegidas", "Revisión"];

export const INICIAL = {
  paso: 1,
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

// Los datos del servidor (personas: 2) pasan a los del formulario ("2").
function hogarDe(solicitud) {
  const campos = Object.entries(INICIAL.hogar).map(([campo, inicial]) => {
    const valor = solicitud[campo] ?? inicial;
    const esCasilla = typeof inicial === "boolean";
    return [campo, esCasilla ? Boolean(valor) : String(valor)];
  });
  return Object.fromEntries(campos);
}

function mover(lista, id, salto) {
  const desde = lista.indexOf(id);
  const hasta = desde + salto;
  if (desde === -1 || hasta < 0 || hasta >= lista.length) return lista;

  const nueva = [...lista];
  [nueva[desde], nueva[hasta]] = [nueva[hasta], nueva[desde]];
  return nueva;
}

export function borradorReducer(estado, accion) {
  const { hogar, viviendas, tocados } = estado;

  switch (accion.type) {
    case "cambiar":
      return {
        ...estado,
        hogar: { ...hogar, [accion.campo]: accion.valor },
        tocados: { ...tocados, [accion.campo]: true },
      };
    case "tocar": {
      const nuevos = accion.campos.map((campo) => [campo, true]);
      return {
        ...estado,
        tocados: { ...tocados, ...Object.fromEntries(nuevos) },
      };
    }
    case "ir":
      return { ...estado, paso: accion.paso };
    case "anadir": {
      const id = String(accion.id);
      if (viviendas.includes(id)) return estado;
      return { ...estado, viviendas: [...viviendas, id] };
    }
    case "quitar":
      return {
        ...estado,
        viviendas: viviendas.filter((id) => id !== String(accion.id)),
      };
    case "subir":
      return { ...estado, viviendas: mover(viviendas, accion.id, -1) };
    case "bajar":
      return { ...estado, viviendas: mover(viviendas, accion.id, 1) };
    case "editar":
      return {
        ...INICIAL,
        hogar: hogarDe(accion.solicitud),
        viviendas: accion.solicitud.viviendas.map(String),
        editando: String(accion.solicitud.id),
        previo: estado.editando === null ? estado : estado.previo,
      };
    // Tras enviar, guardar o cancelar: vuelve el borrador que había, si había.
    case "terminar":
      return estado.previo ?? INICIAL;
    case "retirada":
      return estado.editando === String(accion.id)
        ? (estado.previo ?? INICIAL)
        : estado;
    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}

function esObjeto(valor) {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Lo guardado puede estar roto o ser de otra versión: solo se acepta lo que
// encaja con la forma del borrador.
export function restaurar(texto) {
  try {
    return reconstruir(JSON.parse(texto));
  } catch {
    return INICIAL;
  }
}

function reconstruir(guardado) {
  if (!esObjeto(guardado)) return INICIAL;

  const hogar = { ...INICIAL.hogar };
  if (esObjeto(guardado.hogar)) {
    for (const campo of Object.keys(hogar)) {
      if (typeof guardado.hogar[campo] === typeof hogar[campo]) {
        hogar[campo] = guardado.hogar[campo];
      }
    }
  }

  const ids = Array.isArray(guardado.viviendas) ? guardado.viviendas : [];
  const validos = ids.filter((id) => ["string", "number"].includes(typeof id));

  return {
    paso: [1, 2, 3].includes(guardado.paso) ? guardado.paso : 1,
    hogar,
    viviendas: [...new Set(validos.map(String))],
    tocados: esObjeto(guardado.tocados) ? guardado.tocados : {},
    editando: typeof guardado.editando === "string" ? guardado.editando : null,
    previo: esObjeto(guardado.previo) ? reconstruir(guardado.previo) : null,
  };
}
