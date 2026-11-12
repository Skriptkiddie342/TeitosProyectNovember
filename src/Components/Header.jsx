import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/viviendas", texto: "Buscar vivienda" },
  { to: "/convocatorias", texto: "Convocatorias" },
  { to: "/mi-solicitud", texto: "Mis solicitudes" },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className={styles.header}>
      <div>
        <p className={styles.logo}>Teitos</p>
        <p className={styles.lema}>Portal de alquiler público asequible</p>
      </div>

      <nav className={styles.nav} aria-label="Principal">
        {enlaces.map((enlace) => (
          <NavLink key={enlace.to} to={enlace.to} end={enlace.to === "/"}>
            {enlace.texto}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className={styles.botonMenu}
        aria-label="Menú"
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      {menuAbierto && (
        <nav className={styles.menu} aria-label="Menú desplegable">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.to === "/"}
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.texto}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
