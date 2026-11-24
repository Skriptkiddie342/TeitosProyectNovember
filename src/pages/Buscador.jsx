import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import DwellingList from "../components/DwellingList.jsx";
import Pagination from "../components/Pagination.jsx";
import useDwellings from "../hooks/useDwellings.js";
import { PERSONAS_MAXIMO, cumpleAcceso } from "../reglas/acceso.js";
import { medidaDe } from "../utils/accesibilidad.js";
import styles from "./Buscador.module.css";
import pagina from "./Pagina.module.css";

const RENTA_MIN = 140;
const RENTA_MAX = 1570;
const POR_PAGINA = 12;

function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ordenar(lista, orden) {
  if (orden === "asc") return [...lista].sort((a, b) => a.renta - b.renta);
  if (orden === "desc") return [...lista].sort((a, b) => b.renta - a.renta);
  if (orden === "superficie-asc") {
    return [...lista].sort((a, b) => a.superficie - b.superficie);
  }
  if (orden === "superficie-desc") {
    return [...lista].sort((a, b) => b.superficie - a.superficie);
  }
  return lista;
}

// null si el parámetro falta o no es un número entero.
function leerEntero(texto) {
  return /^\d+$/.test(texto ?? "") ? Number(texto) : null;
}

function leerPersonas(texto) {
  const personas = leerEntero(texto);
  return personas ? Math.min(personas, PERSONAS_MAXIMO) : null;
}

export default function Buscador() {
  const [params, setParams] = useSearchParams();
  const { viviendas, estado } = useDwellings();

  const busqueda = params.get("q") ?? "";
  const orden = params.get("orden") ?? "ninguno";
  const vista = params.get("vista") ?? "rejilla";
  const marcadas = params.getAll("provincia");
  const personas = leerPersonas(params.get("personas"));
  const ingresos = leerEntero(params.get("ingresos"));
  const medidas = params.getAll("accesibilidad");
  const rentaMax = Number(params.get("rentaMax") ?? RENTA_MAX);
  const paginaPedida = leerEntero(params.get("pagina")) ?? 1;

  const listado = useRef(null);
  const irAlListado = useRef(false);

  // Al paginar, el foco y la vista vuelven al principio de los resultados.
  useEffect(() => {
    if (!irAlListado.current) return;
    irAlListado.current = false;
    listado.current?.focus({ preventScroll: true });
    listado.current?.scrollIntoView();
  }, [paginaPedida]);

  function actualizar(clave, valor, porDefecto) {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        if (valor === porDefecto) siguiente.delete(clave);
        else siguiente.set(clave, valor);
        // Cambiar la vista no cambia los resultados: se queda en su página.
        if (clave !== "vista") siguiente.delete("pagina");
        return siguiente;
      },
      { replace: true },
    );
  }

  function alternar(clave, valor) {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        const actuales = siguiente.getAll(clave);
        const nuevos = actuales.includes(valor)
          ? actuales.filter((v) => v !== valor)
          : [...actuales, valor];
        siguiente.delete(clave);
        nuevos.forEach((v) => siguiente.append(clave, v));
        siguiente.delete("pagina");
        return siguiente;
      },
      { replace: true },
    );
  }

  function limpiar() {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        siguiente.delete("q");
        siguiente.delete("orden");
        siguiente.delete("provincia");
        siguiente.delete("personas");
        siguiente.delete("ingresos");
        siguiente.delete("accesibilidad");
        siguiente.delete("rentaMax");
        siguiente.delete("pagina");
        return siguiente;
      },
      { replace: true },
    );
  }

  if (estado !== "ok") {
    return (
      <>
        <title>Buscar vivienda | Teitos</title>
        <h1 className={styles.titulo}>Viviendas</h1>
        {estado === "cargando" && (
          <p className={pagina.estado} role="status">
            Cargando viviendas...
          </p>
        )}
        {estado === "error" && (
          <p className={`${pagina.estado} ${pagina.error}`} role="alert">
            No se han podido cargar las viviendas.
          </p>
        )}
        {estado === "vacio" && (
          <p className={pagina.estado} role="status">
            Ahora mismo no hay viviendas disponibles.
          </p>
        )}
      </>
    );
  }

  const provincias = [...new Set(viviendas.map((v) => v.provincia))].sort(
    (a, b) => a.localeCompare(b),
  );

  const q = normalizar(busqueda.trim());
  const filtradas = ordenar(viviendas, orden).filter(
    (v) =>
      [v.municipio, v.provincia, v.referencia].some((c) =>
        normalizar(c).includes(q),
      ) &&
      (marcadas.length === 0 || marcadas.includes(v.provincia)) &&
      cumpleAcceso({ renta: v.renta, personas, ingresos }) &&
      (medidas.length === 0 || medidas.includes(medidaDe(v))) &&
      v.renta <= rentaMax,
  );

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(Math.max(1, paginaPedida), totalPaginas);
  const visibles = filtradas.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  // Sin replace: el botón Atrás del navegador vuelve a la página anterior.
  function cambiarPagina(numero) {
    if (numero === paginaActual) return;
    irAlListado.current = true;
    setParams((anterior) => {
      const siguiente = new URLSearchParams(anterior);
      if (numero === 1) siguiente.delete("pagina");
      else siguiente.set("pagina", numero);
      return siguiente;
    });
  }

  return (
    <>
      <title>Buscar vivienda | Teitos</title>
      <h1 className={styles.titulo}>Viviendas</h1>

      <div className={styles.pagina}>
        <FilterPanel
          provincias={provincias}
          marcadas={marcadas}
          onProvincia={(valor) => alternar("provincia", valor)}
          personas={personas}
          onPersonas={(valor) => actualizar("personas", valor, "")}
          ingresos={ingresos}
          onIngresos={(valor) => actualizar("ingresos", valor, "")}
          medidas={medidas}
          onMedida={(valor) => alternar("accesibilidad", valor)}
          rentaMax={rentaMax}
          onRentaMax={(valor) =>
            actualizar("rentaMax", String(valor), String(RENTA_MAX))
          }
          min={RENTA_MIN}
          max={RENTA_MAX}
        />

        <div className={styles.resultados}>
          <SearchBar
            busqueda={busqueda}
            onBusqueda={(valor) => actualizar("q", valor, "")}
            orden={orden}
            onOrden={(valor) => actualizar("orden", valor, "ninguno")}
            vista={vista}
            onVista={(valor) => actualizar("vista", valor, "rejilla")}
            onLimpiar={limpiar}
            total={filtradas.length}
          />
          <section
            ref={listado}
            className={styles.listado}
            tabIndex={-1}
            aria-label={`Resultados, página ${paginaActual} de ${totalPaginas}`}
          >
            <DwellingList viviendas={visibles} vista={vista} />
            <Pagination
              actual={paginaActual}
              total={totalPaginas}
              onCambio={cambiarPagina}
            />
          </section>
        </div>
      </div>
    </>
  );
}
