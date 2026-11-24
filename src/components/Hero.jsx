import { Link } from "react-router-dom";
import useDwellingCount from "../hooks/useDwellingCount.js";
import styles from "./Hero.module.css";

function Hero() {
  const { total, estado } = useDwellingCount();

  return (
    <section className={styles.hero}>
      <h1 className={styles.titulo}>Bienvenido al portal de viviendas</h1>
      <p>Encuentra tu nuevo hogar entre nuestras opciones disponibles.</p>
      <p className={styles.dato} role="status">
        {estado === "cargando" && "Contando viviendas disponibles..."}
        {estado === "error" &&
          "No se ha podido consultar el número de viviendas disponibles."}
        {estado === "vacio" && "Ahora mismo no hay viviendas disponibles."}
        {estado === "ok" && `Viviendas disponibles: ${total}`}
      </p>
      <div className={styles.acciones}>
        <Link to="/viviendas" className={styles.primario}>
          Buscar vivienda
        </Link>
        <Link to="/convocatorias" className={styles.secundario}>
          Ver convocatorias
        </Link>
      </div>
    </section>
  );
}

export default Hero;
