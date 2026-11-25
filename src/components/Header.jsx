import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useBorrador } from "../context/BorradorContext.jsx";
import styles from "./Header.module.css";

// Enlaces del menú.
const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/viviendas", texto: "Buscar vivienda" },
  { to: "/convocatorias", texto: "Convocatorias" },
  { to: "/solicitud", texto: "Solicitud" },
  { to: "/mi-solicitud", texto: "Mis solicitudes" },
];

// Cabecera con el logo y el menú. El botón ☰ abre el menú desplegable.
export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { borrador } = useBorrador();
  const elegidas = borrador.viviendas.length;

  // Texto de cada enlace.
  // Junto a "Solicitud", cuántas viviendas hay elegidas.
  function texto(enlace) {
    const conNumero = enlace.to === "/solicitud" && elegidas > 0;
    return conNumero ? `${enlace.texto} (${elegidas})` : enlace.texto;
  }

  return (
    <header className={styles.header}>
      <div>
        <p className={styles.logo}>Teitos</p>
        <p className={styles.lema}>Portal de alquiler público asequible</p>
      </div>

      <nav className={styles.nav} aria-label="Principal">
        {enlaces.map((enlace) => (
          <NavLink key={enlace.to} to={enlace.to} end={enlace.to === "/"}>
            {texto(enlace)}
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
              {texto(enlace)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
