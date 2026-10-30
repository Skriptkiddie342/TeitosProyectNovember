import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>Teitos</h1>
      <p>Portal de alquiler público asequible</p>
      <nav>
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/viviendas">Buscar vivienda</NavLink>
        <NavLink to="/convocatorias">Convocatorias</NavLink>
      </nav>
    </header>
  );
}
