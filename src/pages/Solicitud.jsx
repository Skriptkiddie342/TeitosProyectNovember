import SolicitudForm from "../components/SolicitudForm.jsx";
import styles from "./Pagina.module.css";

export default function Solicitud() {
  return (
    <>
      <title>Solicitud | Teitos</title>
      <h1 className={styles.titulo}>Solicitud de vivienda</h1>
      <SolicitudForm />
    </>
  );
}
