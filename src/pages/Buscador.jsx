import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import DwellingList from "../components/DwellingList.jsx";
import datos from "../../db.json";
import styles from "./Buscador.module.css";

const RENTA_MIN = 140;
const RENTA_MAX = 1570;

const libres = datos.viviendas.filter((v) => !v.adjudicada);
const provincias = [...new Set(libres.map((v) => v.provincia))].sort((a, b) =>
  a.localeCompare(b),
);

function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ordenar(lista, orden) {
  if (orden === "asc") return [...lista].sort((a, b) => a.renta - b.renta);
  if (orden === "desc") return [...lista].sort((a, b) => b.renta - a.renta);
  return lista;
}

export default function Buscador() {
  const [params, setParams] = useSearchParams();

  const busqueda = params.get("q") ?? "";
  const orden = params.get("orden") ?? "ninguno";
  const vista = params.get("vista") ?? "rejilla";
  const marcadas = params.getAll("provincia");
  const rentaMax = Number(params.get("rentaMax") ?? RENTA_MAX);

  function actualizar(clave, valor, porDefecto) {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        if (valor === porDefecto) siguiente.delete(clave);
        else siguiente.set(clave, valor);
        return siguiente;
      },
      { replace: true },
    );
  }

  function alternarProvincia(provincia) {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        const actuales = siguiente.getAll("provincia");
        const nuevas = actuales.includes(provincia)
          ? actuales.filter((p) => p !== provincia)
          : [...actuales, provincia];
        siguiente.delete("provincia");
        nuevas.forEach((p) => siguiente.append("provincia", p));
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
        siguiente.delete("rentaMax");
        return siguiente;
      },
      { replace: true },
    );
  }

  const q = normalizar(busqueda.trim());
  const filtradas = ordenar(libres, orden).filter(
    (v) =>
      [v.municipio, v.provincia, v.referencia].some((c) =>
        normalizar(c).includes(q),
      ) &&
      (marcadas.length === 0 || marcadas.includes(v.provincia)) &&
      v.renta <= rentaMax,
  );

  return (
    <>
      <title>Buscar vivienda | Teitos</title>
      <h1 className={styles.titulo}>Viviendas</h1>

      <div className={styles.pagina}>
        <FilterPanel
          provincias={provincias}
          marcadas={marcadas}
          onProvincia={alternarProvincia}
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
          <DwellingList viviendas={filtradas} vista={vista} />
        </div>
      </div>
    </>
  );
}
