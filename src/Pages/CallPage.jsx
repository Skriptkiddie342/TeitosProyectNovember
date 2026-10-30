import { Link, useParams } from "react-router-dom";
import useCall from "../Hooks/useCall.js";
import useCallDwellings from "../Hooks/useCallDwellings.js";
import DwellingList from "../Components/DwellingList.jsx";

export default function CallPage() {
  const { id } = useParams();
  const { convocatoria, estado } = useCall(id);
  const { viviendas, estado: estadoViviendas } = useCallDwellings(id);

  if (estado === "cargando") {
    return (
      <>
        <title>Cargando convocatoria | Teitos</title>
        <p>Cargando...</p>
      </>
    );
  }

  if (estado === "noexiste") {
    return (
      <>
        <title>Convocatoria no encontrada | Teitos</title>
        <h1>Esta convocatoria no existe</h1>
        <Link to="/convocatorias">Volver a las convocatorias</Link>
      </>
    );
  }

  if (estado === "error") {
    return (
      <>
        <title>Error | Teitos</title>
        <h1>No se ha podido cargar la convocatoria</h1>
        <Link to="/convocatorias">Volver a las convocatorias</Link>
      </>
    );
  }

  const {
    codigo,
    provincia,
    fechaApertura,
    fechaCierre,
    sorteo,
    unidades,
    rentaDesde,
  } = convocatoria;

  return (
    <>
      <title>{codigo} | Teitos</title>
      <h1>{codigo}</h1>
      <p>Provincia: {provincia}</p>
      <p>Estado: {convocatoria.estado}</p>
      <p>Apertura: {fechaApertura}</p>
      <p>Cierre: {fechaCierre}</p>
      <p>Sorteo: {sorteo ?? "Pendiente"}</p>
      <p>Unidades: {unidades}</p>
      <p>Renta desde {rentaDesde} €</p>

      <h2>Viviendas libres</h2>
      {estadoViviendas === "cargando" && <p>Cargando viviendas...</p>}
      {estadoViviendas === "error" && (
        <p>No se han podido cargar las viviendas.</p>
      )}
      {estadoViviendas === "ok" && viviendas.length === 0 && (
        <>
          <p>
            Esta convocatoria no tiene viviendas libres: ya se ha resuelto o
            todas sus viviendas están adjudicadas.
          </p>
          <p>
            <Link to="/convocatorias">Ver otras convocatorias</Link>
          </p>
          <p>
            <Link to="/viviendas">Buscar vivienda</Link>
          </p>
        </>
      )}
      {estadoViviendas === "ok" && viviendas.length > 0 && (
        <DwellingList viviendas={viviendas} vista="rejilla" />
      )}
    </>
  );
}
