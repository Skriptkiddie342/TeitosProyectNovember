import SolicitudForm from "../components/SolicitudForm.jsx";
import styles from "./Pagina.module.css";

// Página de la solicitud: el título y el formulario por pasos.
export default function Solicitud() {
  return (
    <>
      <title>Solicitud | Teitos</title>
      <h1 className={styles.titulo}>Solicitud de vivienda</h1>
      <SolicitudForm />
    </>
  );
}
