// Escribe "municipio, provincia". Si los dos se llaman igual o falta uno, lo
// pone una sola vez.
function formatLocation({ provincia, municipio }) {
  if (!provincia || municipio === provincia) return municipio ?? provincia;
  if (!municipio) return provincia;
  return `${municipio}, ${provincia}`;
}

export default formatLocation;
