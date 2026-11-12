import Hero from "../Components/Hero.jsx";
import CallCard from "../Components/CallCard.jsx";
import useCalls from "../Hooks/useCall.js";
import styles from "./Principal.module.css";

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

      <section className={styles.seccion}>
        <h2>Convocatorias abiertas</h2>
        {estado === "cargando" && <p>Cargando...</p>}
        {estado === "error" && (
          <p className={styles.error}>
            No se han podido cargar las convocatorias.
          </p>
        )}
        {estado === "ok" && (
          <div className={styles.rejilla}>
            {convocatorias.map((c) => (
              <CallCard key={c.id} convocatoria={c} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.seccion}>
        <h2>Cómo funciona</h2>
        <ol className={styles.pasos}>
          {pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
