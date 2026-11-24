import { useBorrador } from "../context/BorradorContext.jsx";

function SolicitarButton({ vivienda, className, texto = "Solicitar" }) {
  const { borrador, dispatch } = useBorrador();

  if (vivienda.adjudicada) return null;

  const id = String(vivienda.id);
  const anadida = borrador.viviendas.includes(id);

  return (
    <button
      type="button"
      className={className}
      onClick={() => dispatch({ type: anadida ? "quitar" : "anadir", id })}
    >
      {anadida ? "✓ Añadida (quitar)" : texto}
    </button>
  );
}

export default SolicitarButton;
