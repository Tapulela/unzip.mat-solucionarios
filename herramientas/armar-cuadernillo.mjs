#!/usr/bin/env node
// Arma un cuadernillo para importarlo en la pizarra: valida el cuadernillo.json
// y escribe al lado cuadernillo.armado.json, con cada trabajo práctico («ruta»)
// copiado adentro. La pizarra no lee archivos del disco: importa ese archivo
// (Generadores → Impresión → «Importar solución (.json)»).
//   node herramientas/armar-cuadernillo.mjs ruta/cuadernillo.json
//   node herramientas/armar-cuadernillo.mjs            → todos los de solucionarios/
// El servidor MCP (dibujar_en_pizarra con la ruta del cuadernillo) hace lo mismo
// sin escribir el archivo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { revisarCuadernillo, completarCuadernillo, buscar } from "./validar.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rutas = process.argv.slice(2).length ? process.argv.slice(2)
  : buscar(path.join(raiz, "solucionarios")).filter((r) => path.basename(r) === "cuadernillo.json");
if (!rutas.length) { console.log("No hay archivos cuadernillo.json."); process.exit(0); }

let mal = false;
for (const ruta of rutas) {
  const abs = path.resolve(ruta), carpeta = path.dirname(abs);
  let c;
  try { c = JSON.parse(fs.readFileSync(abs, "utf8")); }
  catch (e) { console.log(`✗ ${ruta}: no es un JSON válido (${e.message})`); mal = true; continue; }
  const { errores, avisos } = revisarCuadernillo(c, carpeta);
  avisos.forEach((a) => console.log("    aviso: " + a));
  if (errores.length) {
    console.log(`✗ ${ruta}`);
    errores.forEach((e) => console.log("    error: " + e));
    mal = true;
    continue;
  }
  const armado = completarCuadernillo(c, carpeta);
  const salida = path.join(carpeta, "cuadernillo.armado.json");
  fs.writeFileSync(salida, JSON.stringify(armado) + "\n", "utf8");
  const tps = armado.partes.filter((p) => p.solucion).length;
  console.log(`✓ ${path.relative(process.cwd(), salida)} (${armado.partes.length} partes, ${tps} trabajos prácticos, ` +
    `${Math.round(fs.statSync(salida).size / 1024)} KB)`);
}
process.exit(mal ? 1 : 0);
