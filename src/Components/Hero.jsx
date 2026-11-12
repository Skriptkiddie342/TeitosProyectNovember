import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.titulo}>Bienvenido al portal de viviendas</h1>
      <p>Encuentra tu nuevo hogar entre nuestras opciones disponibles.</p>
      <p className={styles.dato}>Viviendas disponibles: 1200</p>
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
