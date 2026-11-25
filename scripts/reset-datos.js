// Regenera db.json a partir de db.original.json, con solicitudes vacía.
import { readFileSync, writeFileSync } from "node:fs";

// Carpeta del proyecto: la que está encima de scripts/.
const raiz = new URL("../", import.meta.url);
const original = JSON.parse(
  readFileSync(new URL("db.original.json", raiz), "utf8"),
);
// Copia los datos originales y añade la colección de solicitudes vacía.
const datos = { ...original, solicitudes: [] };

// Guarda el resultado en db.json, machacando lo que hubiera.
writeFileSync(new URL("db.json", raiz), JSON.stringify(datos, null, 2) + "\n");

// Muestra cuántos elementos tiene cada colección, para comprobarlo.
for (const [coleccion, lista] of Object.entries(datos)) {
  console.log(`${coleccion}: ${lista.length}`);
}
