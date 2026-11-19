#!/usr/bin/env node
// Servidor MCP de los solucionarios de unzip.mat (stdio).
// Le da a una IA (Claude Code, Claude Desktop u otro cliente MCP) herramientas para:
//  - leer el formato de las soluciones,
//  - validar, listar, leer y guardar archivos solucion.json de este repositorio,
//  - dibujarlos en la pizarra abierta y ver cómo quedaron las hojas A4.
// Para lo último hace falta la pizarra con su servidor local (node servidor.js, o
// «Iniciar pizarra.bat») abierta en el navegador. La dirección se cambia con la
// variable de entorno PIZARRA_URL (por defecto http://127.0.0.1:3000).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { revisar, buscar, revisarCuadernillo, completarCuadernillo } from "../herramientas/validar.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CARPETA = path.join(RAIZ, "solucionarios");
const PIZARRA = (process.env.PIZARRA_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

// ------------------------------------------------------------ utilidades
const texto = (t) => ({ content: [{ type: "text", text: t }] });
const error = (t) => ({ content: [{ type: "text", text: t }], isError: true });

// ruta relativa a solucionarios/ → ruta absoluta del solucion.json (sin salirse de la carpeta)
function rutaSolucion(rel) {
  let r = String(rel || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/^solucionarios\//, "");
  // un cuadernillo se pide por su archivo (…/cuadernillo.json)
  if (!r.endsWith("solucion.json") && !r.endsWith("cuadernillo.json")) r = r.replace(/\/+$/, "") + "/solucion.json";
  const abs = path.resolve(CARPETA, r);
  if (!abs.startsWith(CARPETA + path.sep)) throw new Error(`La ruta «${rel}» se sale de solucionarios/`);
  return abs;
}
const relativa = (abs) => path.relative(CARPETA, abs).replace(/\\/g, "/");

// la solución puede llegar como objeto, como texto JSON o como ruta
function obtenerSolucion({ solucion, ruta }) {
  if (solucion !== undefined) {
    if (typeof solucion === "string") {
      try { return JSON.parse(solucion); } catch (e) { throw new Error("«solucion» no es un JSON válido: " + e.message); }
    }
    return solucion;
  }
  if (ruta) {
    const abs = rutaSolucion(ruta);
    if (!fs.existsSync(abs)) throw new Error(`No existe ${relativa(abs)}`);
    const sol = JSON.parse(fs.readFileSync(abs, "utf8"));
    // un cuadernillo trae sus trabajos prácticos por ruta: se copian adentro
    return Array.isArray(sol.partes) ? completarCuadernillo(sol, path.dirname(abs)) : sol;
  }
  throw new Error("Pasá «solucion» (el JSON) o «ruta» (la carpeta dentro de solucionarios/)");
}

// valida una solución o un cuadernillo
const validar = (sol) => (Array.isArray(sol && sol.partes) ? revisarCuadernillo(sol) : revisar(sol));

function informe({ errores, avisos }) {
  const l = [];
  l.push(errores.length ? `✗ ${errores.length} errores (la pizarra no lo puede importar)` : "✓ Sin errores");
  errores.forEach((e) => l.push("  error: " + e));
  if (avisos.length) l.push(`${avisos.length} avisos de estilo:`);
  avisos.forEach((a) => l.push("  aviso: " + a));
  return l.join("\n");
}

async function pedirAPizarra(accion, datos) {
  let r;
  try {
    r = await fetch(PIZARRA + "/puente/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, datos }),
    });
  } catch (e) {
    throw new Error(`No se pudo conectar con la pizarra en ${PIZARRA}. ¿Está abierto su servidor (node servidor.js o «Iniciar pizarra.bat»)? Se cambia con PIZARRA_URL.`);
  }
  let cuerpo;
  try { cuerpo = await r.json(); } catch (e) { throw new Error(`La pizarra contestó algo inesperado (HTTP ${r.status}). ¿Está actualizada?`); }
  if (!r.ok) throw new Error(cuerpo.error || `HTTP ${r.status}`);
  return cuerpo;
}

function conImagenes(lineas, imagenes) {
  const content = [{ type: "text", text: lineas.join("\n") }];
  (imagenes || []).forEach((im) => {
    content.push({ type: "text", text: `Hoja ${im.n}:` });
    content.push({ type: "image", data: im.png, mimeType: "image/png" });
  });
  return { content };
}

// --------------------------------------------------------------- servidor
const server = new McpServer({ name: "unzip-mat-solucionarios", version: "1.0.0" });

const SolucionArg = z.union([z.string(), z.record(z.string(), z.unknown())])
  .describe("La solución en formato unzip.mat/solucion@1, o un cuadernillo unzip.mat/cuadernillo@1 (objeto o texto JSON)");
const RutaArg = z.string()
  .describe("Carpeta dentro de solucionarios/, por ejemplo «matematica-1/utn-frba/2026/tp-03» (o la ruta a su solucion.json, o a un cuadernillo.json)");

server.registerTool("formato_solucion", {
  title: "Formato de las soluciones",
  description: "Devuelve FORMATO.md: cómo se escribe un solucion.json (ejercicios, bloques, renglones de pasos, items, colores, generadores) y el estilo de los desarrollos. Leerlo antes de escribir una solución.",
  annotations: { readOnlyHint: true },
}, async () => {
  const formato = fs.readFileSync(path.join(RAIZ, "FORMATO.md"), "utf8");
  const ejemplo = path.join(CARPETA, "_ejemplo", "tp-ejemplo", "solucion.json");
  const ej = fs.existsSync(ejemplo) ? "\n\n## Ejemplo completo\n\n```json\n" + fs.readFileSync(ejemplo, "utf8") + "\n```\n" : "";
  return texto(formato + ej);
});

server.registerTool("validar_solucion", {
  title: "Validar una solución",
  description: "Revisa una solución sin dibujarla: errores (lo que la pizarra no puede importar) y avisos de estilo (signo − y no -, · y no *, superíndices y no ^, marcas dibujadas y no ✓/✗, meta incompleta).",
  inputSchema: { solucion: SolucionArg.optional(), ruta: RutaArg.optional() },
  annotations: { readOnlyHint: true },
}, async (args) => {
  try { return texto(informe(validar(obtenerSolucion(args)))); }
  catch (e) { return error(e.message); }
});

server.registerTool("listar_solucionarios", {
  title: "Listar solucionarios",
  description: "Lista los solucion.json del repositorio con su materia, institución, año, TP y estado. Con «filtro», solo los que lo contienen (en la ruta o en los datos).",
  inputSchema: { filtro: z.string().optional().describe("Texto a buscar, por ejemplo «factorización» o «2026»") },
  annotations: { readOnlyHint: true },
}, async ({ filtro }) => {
  const f = (filtro || "").toLowerCase();
  const filas = buscar(CARPETA).map((abs) => {
    let m = {}, titulo = "";
    try { const s = JSON.parse(fs.readFileSync(abs, "utf8")); m = s.meta || {}; titulo = s.titulo || ""; } catch (e) { titulo = "(JSON inválido)"; }
    return { ruta: path.dirname(relativa(abs)), titulo, ...m };
  }).filter((x) => !f || JSON.stringify(x).toLowerCase().includes(f));
  if (!filas.length) return texto(f ? `No hay solucionarios que contengan «${filtro}».` : "Todavía no hay solucionarios.");
  return texto(filas.map((x) => `- ${x.ruta}: ${x.titulo} [${x.estado || "sin estado"}]` +
    ([x.materia, x.institucion, x.anio, x.tp].filter(Boolean).length ? ` (${[x.materia, x.institucion, x.anio, x.tp].filter(Boolean).join(" · ")})` : "")).join("\n"));
});

server.registerTool("leer_solucion", {
  title: "Leer una solución",
  description: "Devuelve el solucion.json de una carpeta de solucionarios/.",
  inputSchema: { ruta: RutaArg },
  annotations: { readOnlyHint: true },
}, async ({ ruta }) => {
  try {
    const abs = rutaSolucion(ruta);
    if (!fs.existsSync(abs)) return error(`No existe ${relativa(abs)}`);
    return texto(fs.readFileSync(abs, "utf8"));
  } catch (e) { return error(e.message); }
});

server.registerTool("guardar_solucion", {
  title: "Guardar una solución",
  description: "Valida la solución y la guarda como solucionarios/<ruta>/solucion.json. No guarda si tiene errores. Para reemplazar un archivo que ya existe hay que pasar sobrescribir: true. No hace commit.",
  inputSchema: {
    ruta: RutaArg,
    solucion: SolucionArg,
    sobrescribir: z.boolean().optional().describe("true para reemplazar un solucion.json que ya existe"),
  },
  annotations: { destructiveHint: true },
}, async ({ ruta, solucion, sobrescribir }) => {
  try {
    const sol = obtenerSolucion({ solucion });
    const abs = rutaSolucion(ruta);
    const r = revisar(sol);
    if (r.errores.length) return error("No se guardó.\n" + informe(r));
    if (fs.existsSync(abs) && !sobrescribir) return error(`Ya existe ${relativa(abs)}. Para reemplazarlo, pasá sobrescribir: true.`);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, JSON.stringify(sol, null, 2) + "\n", "utf8");
    return texto(`Guardado en solucionarios/${relativa(abs)}.\n` + informe(r));
  } catch (e) { return error(e.message); }
});

server.registerTool("dibujar_en_pizarra", {
  title: "Dibujar en la pizarra",
  description: "Manda la solución (o un cuadernillo completo: carátula, índice y los trabajos prácticos, con una cabecera por parte) a la pizarra abierta (la ventana que se usó por última vez), que la dibuja en hojas A4 nuevas. Por defecto reemplaza lo que se haya dibujado antes de la misma solución (misma meta) y devuelve una imagen de cada hoja, para revisar cómo quedó: renglones que se salen, notas que se pisan, saltos de hoja. Los avisos de la respuesta dicen qué renglones son más anchos que la hoja.",
  inputSchema: {
    solucion: SolucionArg.optional(),
    ruta: RutaArg.optional(),
    reemplazar: z.boolean().optional().describe("Borrar lo que se dibujó antes de esta misma solución (por defecto true)"),
    ver: z.boolean().optional().describe("Devolver una imagen de cada hoja (por defecto true)"),
    ancho: z.number().int().min(300).max(1600).optional().describe("Ancho de las imágenes en píxeles (por defecto 800)"),
  },
}, async (args) => {
  try {
    const sol = obtenerSolucion(args);
    const v = validar(sol);
    if (v.errores.length) return error("No se dibujó: la solución tiene errores.\n" + informe(v));
    const r = await pedirAPizarra("importar", {
      solucion: sol, reemplazar: args.reemplazar !== false, ver: args.ver !== false, ancho: args.ancho || 800,
    });
    if (!r.ok) return error("La pizarra no la pudo importar:\n" + (r.errores || []).map((e) => "  error: " + e).join("\n"));
    const l = [`Dibujada en ${r.hojas} ${r.hojas === 1 ? "hoja" : "hojas"} (${(r.numeros || []).join(", ")}).` +
      (r.reemplazados ? ` Se reemplazó lo dibujado antes (${r.reemplazados} elementos).` : "")];
    if (r.avisos && r.avisos.length) { l.push("Avisos de la pizarra:"); r.avisos.forEach((a) => l.push("  " + a)); }
    if (v.avisos.length) { l.push("Avisos de estilo:"); v.avisos.forEach((a) => l.push("  " + a)); }
    return conImagenes(l, r.imagenes);
  } catch (e) { return error(e.message); }
});

server.registerTool("ver_pizarra", {
  title: "Ver hojas de la pizarra",
  description: "Devuelve una imagen de hojas A4 de la pizarra abierta: las indicadas por número o, si no se indica, las de la última solución dibujada (o todas). Sirve para ver las correcciones que hizo el docente a mano.",
  inputSchema: {
    hojas: z.array(z.number().int().min(1)).optional().describe("Números de hoja, por ejemplo [1, 2]"),
    ancho: z.number().int().min(300).max(1600).optional().describe("Ancho de las imágenes en píxeles (por defecto 800)"),
  },
  annotations: { readOnlyHint: true },
}, async ({ hojas, ancho }) => {
  try {
    const r = await pedirAPizarra("ver", { hojas, ancho: ancho || 800 });
    if (!r.ok) return error((r.errores || []).join("\n"));
    if (!r.imagenes.length) return texto("No hay hojas para mostrar.");
    return conImagenes([`${r.imagenes.length} ${r.imagenes.length === 1 ? "hoja" : "hojas"}:`], r.imagenes);
  } catch (e) { return error(e.message); }
});

server.registerTool("estado_pizarra", {
  title: "Estado de la pizarra",
  description: "Dice si hay una pizarra abierta y qué hojas A4 tiene (y de qué solución es cada una).",
  annotations: { readOnlyHint: true },
}, async () => {
  try {
    const r = await pedirAPizarra("estado", {});
    if (!r.hojas.length) return texto(`Pizarra abierta${r.titulo ? ` («${r.titulo}»)` : ""}, sin hojas A4.`);
    return texto(`Pizarra abierta${r.titulo ? ` («${r.titulo}»)` : ""}. Hojas:\n` +
      r.hojas.map((h) => `- Hoja ${h.n}${h.solucion ? `: ${h.solucion}` : ""}`).join("\n"));
  } catch (e) { return error(e.message); }
});

await server.connect(new StdioServerTransport());
