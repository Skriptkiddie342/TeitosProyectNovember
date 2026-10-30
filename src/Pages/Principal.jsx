import { Link } from "react-router-dom";
import Hero from "../Components/Hero.jsx";
import CallCard from "../Components/CallCard.jsx";
import useCalls from "../Hooks/useCall.js";

const pasos = [
  "Busca una vivienda que se ajuste a lo que necesitas",
  "Consulta la convocatoria abierta de tu provincia",
  "Presenta tu solicitud dentro del plazo",
  "Espera al sorteo y a la adjudicación",
];

export default function Principal() {
  const { convocatorias, estado } = useCalls("?estado=abierta");

  return (
    <>
      <title>Teitos</title>
      <Hero />

      <section>
        <h2>¿Qué quieres hacer?</h2>
        <p>
          <Link to="/viviendas" className="btn-principal">
            Buscar vivienda
          </Link>
        </p>
        <p>
          <Link to="/convocatorias" className="btn-secundario">
            Ver convocatorias
          </Link>
        </p>
      </section>

      <section>
        <h2>Cómo funciona</h2>
        <ol>
          {pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Convocatorias abiertas</h2>
        {estado === "cargando" && <p>Cargando...</p>}
        {estado === "error" && (
          <p>No se han podido cargar las convocatorias.</p>
        )}
        {estado === "ok" && (
          <div className="viviendas">
            {convocatorias.map((c) => (
              <CallCard key={c.id} convocatoria={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
