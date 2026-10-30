import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <title>No encontrado | Teitos</title>
      <h1>Esta página no existe</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}
