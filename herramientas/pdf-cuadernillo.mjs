#!/usr/bin/env node
// Genera el PDF de un cuadernillo sin abrir el diálogo de impresión:
//   node herramientas/pdf-cuadernillo.mjs ruta/cuadernillo.json [salida.pdf]
// Abre Chrome (o Edge) sin ventana con un perfil temporal, carga la pizarra
// local (tiene que estar corriendo: node servidor.js o «Iniciar pizarra.bat»),
// importa el cuadernillo, imprime todas las hojas a PDF (como «Imprimir / PDF»)
// y le agrega los marcadores y los enlaces del índice y de los QR (como
// «Agregar marcadores y enlaces a un PDF…»). Las hojas se arman con la escala de
// estilo.escala del cuadernillo (0.8 = 80 %; por defecto 1, o sea 100 %).
// No toca los tableros guardados del navegador de siempre.
// Variables: PIZARRA_URL (por defecto http://127.0.0.1:3000) y CHROME (ruta del navegador).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { revisarCuadernillo, completarCuadernillo } from "./validar.mjs";

const PIZARRA = (process.env.PIZARRA_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");
const NAVEGADORES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const [entrada, salidaArg] = process.argv.slice(2);
if (!entrada) { console.log("Uso: node herramientas/pdf-cuadernillo.mjs ruta/cuadernillo.json [salida.pdf]"); process.exit(1); }
const abs = path.resolve(entrada), carpeta = path.dirname(abs);
const crudo = JSON.parse(fs.readFileSync(abs, "utf8"));
const v = revisarCuadernillo(crudo, carpeta);
if (v.errores.length) { v.errores.forEach((e) => console.log("error: " + e)); process.exit(1); }
const cuadernillo = completarCuadernillo(crudo, carpeta);
const salida = path.resolve(salidaArg || path.join(carpeta, "cuadernillo.pdf"));

const nav = NAVEGADORES.find((p) => fs.existsSync(p));
if (!nav) { console.log("No encontré Chrome ni Edge. Indicá la ruta con la variable CHROME."); process.exit(1); }
try { await fetch(PIZARRA + "/"); } catch (e) {
  console.log(`La pizarra no responde en ${PIZARRA}. Abrí su servidor (node servidor.js o «Iniciar pizarra.bat»).`); process.exit(1);
}

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "unzip-pdf-"));
const puerto = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(nav, ["--headless=new", `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`,
  "--no-first-run", "--no-default-browser-check", "--window-size=1400,1000", "about:blank"], { stdio: "ignore" });
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
function cerrar() { try { chrome.kill(); } catch (e) {} setTimeout(() => { try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {} }, 1500); }

try {
  // la pestaña de Chrome, por el protocolo de depuración
  let destino;
  for (let i = 0; i < 50 && !destino; i++) {
    await esperar(200);
    try { destino = (await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json()).find((t) => t.type === "page"); } catch (e) {}
  }
  if (!destino) throw new Error("Chrome no arrancó");
  const ws = new WebSocket(destino.webSocketDebuggerUrl);
  await new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = () => mal(new Error("no se pudo conectar con Chrome")); });
  let id = 0; const pend = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.mal(new Error(m.error.message)) : p.ok(m.result); }
  };
  const cdp = (method, params = {}) => new Promise((ok, mal) => { const n = ++id; pend.set(n, { ok, mal }); ws.send(JSON.stringify({ id: n, method, params })); });
  async function js(expr) {
    const r = await cdp("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async function cargar() {
    for (let i = 0; i < 150; i++) {
      await esperar(200);
      try { if (await js("!!(window.__pizarraAPI && window.__pizarraSolucionario && window.__pizarraHojas && window.__pizarraSvg)")) return; } catch (e) {}
    }
    throw new Error("la pizarra no terminó de cargar");
  }

  console.log("Abriendo la pizarra…");
  await cdp("Page.enable");
  await cdp("Page.navigate", { url: PIZARRA + "/" });
  await cargar();
  // hojas con la escala del cuadernillo (por defecto 100 %), y sin el puente del servidor MCP
  const escala = (cuadernillo.estilo && cuadernillo.estilo.escala) || 1;
  await js(`localStorage.setItem("pizarra-hojas", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("pizarra-hojas") || "{}"), { impresion: ${escala} }))); true`);
  await cdp("Page.navigate", { url: PIZARRA + "/" });
  await cargar();

  console.log("Importando el cuadernillo…");
  const r = await js(`window.__pizarraSolucionario.importar(${JSON.stringify(JSON.stringify(cuadernillo))}).then(r => ({ ok: r.ok, hojas: r.hojas, errores: r.errores, avisos: r.avisos }))`);
  if (!r.ok) throw new Error("la pizarra no lo pudo importar:\n  " + r.errores.join("\n  "));
  (r.avisos || []).forEach((a) => console.log("  aviso: " + a));
  await esperar(500);

  console.log(`Preparando ${r.hojas} hojas…`);
  const n = await js("window.__pizarraHojas.prepararImpresion()");
  console.log(`Imprimiendo ${n} páginas a PDF…`);
  const pdf = await cdp("Page.printToPDF", { preferCSSPageSize: true, printBackground: true, transferMode: "ReturnAsStream" });
  const trozos = [];
  for (;;) {
    const t = await cdp("IO.read", { handle: pdf.stream, size: 4 * 1024 * 1024 });
    trozos.push(Buffer.from(t.data, t.base64Encoded ? "base64" : "binary"));
    if (t.eof) break;
  }
  await cdp("IO.close", { handle: pdf.stream });
  const crudoPdf = Buffer.concat(trozos);

  console.log("Agregando marcadores y enlaces…");
  await js("window.__trozosPdf = []; true");
  const b64 = crudoPdf.toString("base64"), PASO = 4 * 1024 * 1024;
  for (let i = 0; i < b64.length; i += PASO) await js(`window.__trozosPdf.push(${JSON.stringify(b64.slice(i, i + PASO))}); true`);
  const largo = await js(`(async () => {
    const bin = atob(window.__trozosPdf.join("")), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const out = await window.__pizarraHojas.marcarBytes(bytes, ${JSON.stringify(cuadernillo.titulo || "")});
    let s = ""; for (let i = 0; i < out.length; i += 0x8000) s += String.fromCharCode.apply(null, out.subarray(i, i + 0x8000));
    window.__salidaPdf = btoa(s); window.__trozosPdf = null;
    return window.__salidaPdf.length;
  })()`);
  let final = "";
  for (let i = 0; i < largo; i += PASO) final += await js(`window.__salidaPdf.slice(${i}, ${i + PASO})`);
  fs.writeFileSync(salida, Buffer.from(final, "base64"));
  console.log(`✓ ${path.relative(process.cwd(), salida)} (${n} páginas, ${(fs.statSync(salida).size / 1048576).toFixed(1)} MB)`);
  ws.close();
} catch (e) {
  console.log("✗ " + (e && e.message || e));
  process.exitCode = 1;
} finally {
  cerrar();
}
