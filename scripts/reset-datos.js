// Regenera db.json a partir de db.original.json, con solicitudes vacía.
import { readFileSync, writeFileSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const original = JSON.parse(
  readFileSync(new URL("db.original.json", raiz), "utf8"),
);
const datos = { ...original, solicitudes: [] };

writeFileSync(new URL("db.json", raiz), JSON.stringify(datos, null, 2) + "\n");

for (const [coleccion, lista] of Object.entries(datos)) {
  console.log(`${coleccion}: ${lista.length}`);
}
