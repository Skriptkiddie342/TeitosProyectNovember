import CallCard from "../Components/CallCard.jsx";
import useCalls from "../Hooks/useCall.js";

export default function Calls() {
  const { convocatorias, estado } = useCalls();

  return (
    <>
      <title>Convocatorias | Teitos</title>
      <h1>Convocatorias</h1>
      {estado === "cargando" && <p>Cargando...</p>}
      {estado === "error" && <p>No se han podido cargar las convocatorias.</p>}
      {estado === "ok" && (
        <div className="viviendas">
          {convocatorias.map((c) => (
            <CallCard key={c.id} convocatoria={c} />
          ))}
        </div>
      )}
    </>
  );
}
