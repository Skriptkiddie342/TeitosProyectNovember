import { useSearchParams } from "react-router-dom";
import SearchBar from "../Components/SearchBar.jsx";
import DwellingList from "../Components/DwellingList.jsx";
import viviendas from "../../db.json";

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

  function limpiar() {
    setParams(
      (anterior) => {
        const siguiente = new URLSearchParams(anterior);
        siguiente.delete("q");
        siguiente.delete("orden");
        return siguiente;
      },
      { replace: true },
    );
  }

  const ordenadas = ordenar(viviendas.viviendas, orden);
  const q = normalizar(busqueda.trim());
  const filtradas = ordenadas.filter((v) =>
    [v.municipio, v.provincia, v.referencia].some((c) =>
      normalizar(c).includes(q),
    ),
  );

  return (
    <div className="contenedor">
      <title>Buscar vivienda | Teitos</title>
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
  );
}
