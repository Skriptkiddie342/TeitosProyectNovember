import { Link } from "react-router-dom";

function CallCard({ convocatoria }) {
  const { id, codigo, provincia, estado, fechaCierre, unidades, rentaDesde } =
    convocatoria;

  return (
    <article className="tarjeta">
      <h3>
        <Link to={`/convocatorias/${id}`}>{codigo}</Link>
      </h3>
      <p>{provincia}</p>
      <p>Estado: {estado}</p>
      <p>Cierre: {fechaCierre}</p>
      <p>Unidades: {unidades}</p>
      <p>Renta desde {rentaDesde} €</p>
      {estado === "abierta" && (
        <button type="button" className="btn-secundario">
          Presentar solicitud
        </button>
      )}
    </article>
  );
}

export default CallCard;
