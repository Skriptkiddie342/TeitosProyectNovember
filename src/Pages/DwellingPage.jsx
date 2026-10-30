import { Link, useParams } from "react-router-dom";
import useDwelling from "../Hooks/useDwelling.js";
import DwellingDetail from "../Components/DwellingDetail.jsx";

export default function DwellingPage() {
  const { id } = useParams();
  const { vivienda, estado } = useDwelling(id);

  if (estado === "cargando") {
    return (
      <>
        <title>Cargando vivienda | Teitos</title>
        <p>Cargando...</p>
      </>
    );
  }

  if (estado === "noexiste") {
    return (
      <>
        <title>Vivienda no encontrada | Teitos</title>
        <h1>Esta vivienda no existe</h1>
        <p>No hay ninguna vivienda con el identificador {id}.</p>
        <Link to="/viviendas">Volver al buscador</Link>
      </>
    );
  }

  if (estado === "error") {
    return (
      <>
        <title>Error | Teitos</title>
        <h1>No se ha podido cargar la vivienda</h1>
        <Link to="/viviendas">Volver al buscador</Link>
      </>
    );
  }

  return (
    <>
      <title>{vivienda.referencia} | Teitos</title>
      <DwellingDetail vivienda={vivienda} />
      <Link to="/viviendas">Volver al buscador</Link>
    </>
  );
}
