// Limpia lo que se escribe en el campo de ingresos: quita los céntimos y todo
// lo que no sean cifras, y deja 9 como mucho.
// "25.000,50 €" -> "25000"
export function soloEuros(texto) {
  return texto.replace(/,.*$/, "").replace(/\D/g, "").slice(0, 9);
}

// Da formato a una cantidad: 24000 -> "24.000 €".
// Espacio duro: el € no se separa de su cifra al saltar de línea.
export function euros(cantidad) {
  return `${cantidad.toLocaleString("es-ES")}\u00a0€`;
}
