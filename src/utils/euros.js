// "25.000,50 €" -> "25000"
export function soloEuros(texto) {
  return texto.replace(/,.*$/, "").replace(/\D/g, "").slice(0, 9);
}

// Espacio duro: el € no se separa de su cifra al saltar de línea.
export function euros(cantidad) {
  return `${cantidad.toLocaleString("es-ES")}\u00a0€`;
}
