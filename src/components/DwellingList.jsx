import DwellingCard from "./DwellingCard.jsx";
import styles from "./DwellingList.module.css";

// Lista de tarjetas de vivienda. Si no hay ninguna, muestra un mensaje.
function DwellingList({ viviendas, vista }) {
  if (viviendas.length === 0) {
    return <p>No hay viviendas que coincidan con tu búsqueda.</p>;
  }

  return (
    <div className={vista === "lista" ? styles.lista : styles.rejilla}>
      {viviendas.map((vivienda) => (
        <DwellingCard key={vivienda.id} vivienda={vivienda} variante={vista} />
      ))}
    </div>
  );
}

export default DwellingList;
