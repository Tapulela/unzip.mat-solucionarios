#!/usr/bin/env node
// Revisa archivos solucion.json (formato unzip.mat/solucion@1) sin abrir la pizarra.
//   node herramientas/validar.mjs                     → todos los de solucionarios/
//   node herramientas/validar.mjs ruta/solucion.json  → solo esos
// Errores: lo que la pizarra no puede importar. Avisos: lo que se importa pero no
// sigue el estilo de los solucionarios (ver FORMATO.md).
// Sale con código 1 si hay errores.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FORMATO = "unzip.mat/solucion@1";
const GENERADORES = ["recta", "funcion", "tabla", "boole", "conjuntos", "venn", "relaciones", "estructuras", "combinatoria",
  "mcm", "valorAbsoluto", "inecuaciones2", "racionales", "factorizacion", "raicesC", "complejos", "razonamientos",
  "simpLogica", "simpBoole", "simpConjuntos", "plantillas"];
const COLORES = ["suma", "producto", "condicion", "caso", "a", "b", "c", "mal", "tinta", "azul", "rojo", "verde",
  "naranja", "violeta", "celeste", "gris"];
const ESTADOS = ["borrador", "revisado", "publicado"];

// opc.parte: es una parte de texto de un cuadernillo (no se pide «meta» ni «ejercicios»)
export function revisar(sol, opc = {}) {
  const errores = [], avisos = [];
  const err = (r, m) => errores.push(`${r}: ${m}`), av = (r, m) => avisos.push(`${r}: ${m}`);
  const color = (c, r) => {
    if (c === undefined || c === null) return;
    if (!(typeof c === "string" && (COLORES.includes(c.toLowerCase()) || /^#[0-9a-f]{3,8}$/i.test(c)))) av(r, `color desconocido «${c}» (se usa el de por defecto)`);
  };
  const texto = (s, r) => {
    if (/[✓✔✗✘]/.test(s)) av(r, "las marcas ✓/✗ se dibujan: usar { \"marca\": \"ok\" } o { \"marca\": \"mal\" }");
    if (/(^|[\s(=<>])-(?=\s*[\dA-Za-z(])/.test(s)) av(r, `«-» como signo menos: usar «−» (${JSON.stringify(s).slice(0, 50)})`);
    if (/\*/.test(s)) av(r, "«*» para multiplicar: usar «·»");
    if (/\^/.test(s)) av(r, "«^» para potencias: usar superíndices (x², x³, xⁿ)");
  };
  const items = (x, r) => {
    if (x === undefined || x === null) return [];
    return (Array.isArray(x) ? x : [x]).map((y, i) => item(y, Array.isArray(x) ? `${r}[${i}]` : r));
  };
  const item = (x, r) => {
    if (typeof x === "string" || typeof x === "number") { texto(String(x), r); return { t: String(x) }; }
    if (!x || typeof x !== "object") { err(r, "item inválido"); return {}; }
    color(x.color, r + ".color");
    if (typeof x.t === "string") { texto(x.t, r); return { t: x.t }; }
    if (x.frac !== undefined) {
      if (!Array.isArray(x.frac) || x.frac.length !== 2) { err(r, "«frac» tiene que ser [numerador, denominador]"); return {}; }
      items(x.frac[0], r + ".frac[0]"); items(x.frac[1], r + ".frac[1]"); return {};
    }
    if (x.raiz !== undefined) {
      items(x.raiz, r + ".raiz");
      if (x.indice !== undefined) texto(String(x.indice), r + ".indice");
      return {};
    }
    if (x.marca !== undefined) { if (!["ok", "mal"].includes(x.marca)) err(r, "«marca» es \"ok\" o \"mal\""); return {}; }
    if (x.sistema !== undefined) {
      if (!Array.isArray(x.sistema)) err(r, "«sistema» es una lista de filas");
      else x.sistema.forEach((f, i) => items(f, `${r}.sistema[${i}]`));
      return {};
    }
    if (x.tabla !== undefined) {
      if (!Array.isArray(x.tabla)) err(r, "«tabla» es una lista de filas");
      else x.tabla.forEach((f, i) => (Array.isArray(f) ? f : [f]).forEach((c, j) => items(c, `${r}.tabla[${i}][${j}]`)));
      const AL = ["izq", "centro", "der"];
      if (x.alinear !== undefined && !(Array.isArray(x.alinear) ? x.alinear : [x.alinear]).every((a) => AL.includes(a)))
        av(r + ".alinear", "tiene que ser \"izq\", \"centro\" o \"der\" (o una lista, una por columna)");
      if (x.columnasFijas !== undefined && !(Number.isInteger(x.columnasFijas) && x.columnasFijas >= 1))
        av(r + ".columnasFijas", "tiene que ser un número entero desde 1");
      return {};
    }
    err(r, `no se reconoce el item ${JSON.stringify(x).slice(0, 60)}`);
    return {};
  };
  const renglon = (l, r, i, lista) => {
    if (typeof l === "string" || Array.isArray(l)) l = { der: l };
    if (!l || typeof l !== "object") { err(r, "renglón inválido"); return; }
    for (const k of Object.keys(l)) {
      if (!["izq", "rel", "der", "nota", "notaColor", "color", "caja", "llave", "rama", "marcar", "seccion", "libre"].includes(k)) av(r, `campo desconocido «${k}» (se ignora)`);
    }
    const der = items(l.der, r + ".der");
    if (l.izq) typeof l.izq === "object" ? items(l.izq, r + ".izq") : texto(String(l.izq), r + ".izq");
    if (l.nota) (Array.isArray(l.nota) ? l.nota : [l.nota]).forEach((n) => texto(String(n), r + ".nota"));
    color(l.notaColor, r + ".notaColor"); color(l.color, r + ".color");
    if (l.caja && l.caja !== true) color(l.caja, r + ".caja");
    if (l.rama && !(i > 0 && lista.slice(0, i).reverse().find((x) => !(x && x.rama))?.llave)) {
      av(r, "un renglón «rama» tiene que venir después de un renglón con «llave»");
    }
    if (l.marcar) {
      const de = l.marcar.de | 0, a = l.marcar.a === undefined ? de : l.marcar.a | 0;
      if (!der[de] || !der[a] || der[de].t === undefined || der[a].t === undefined) err(r + ".marcar", "«de» y «a» tienen que ser índices de textos de «der»");
      color(l.marcar.color, r + ".marcar.color");
    }
  };
  // marcador del PDF: true, un texto (el título) o { titulo, nivel } con nivel 1 a 3
  const marcador = (m, r) => {
    if (m === undefined || m === false || m === true) return;
    if (typeof m === "string") { texto(m, r + ".marcador"); return; }
    if (!m || typeof m !== "object" || Array.isArray(m)) { err(r + ".marcador", "es true, un texto o { titulo, nivel }"); return; }
    if (m.titulo !== undefined) texto(String(m.titulo), r + ".marcador.titulo");
    if (m.nivel !== undefined && ![1, 2, 3].includes(m.nivel)) av(r + ".marcador.nivel", "tendría que ser 1, 2 o 3");
  };
  const bloques = (lista, r) => {
    if (lista === undefined) return;
    if (!Array.isArray(lista)) { err(r, "«bloques» tiene que ser una lista"); return; }
    lista.forEach((b, i) => {
      const rb = `${r}.bloques[${i}]`;
      if (typeof b === "string") { texto(b, rb); return; }
      if (!b || typeof b !== "object") { err(rb, "bloque inválido"); return; }
      if (b.salto || b.espacio) return;
      if (b.alLado !== undefined) {
        if (b.alLado !== true && b.alLado !== "centro") av(rb + ".alLado", "tendría que ser true o \"centro\"");
        else if (i === 0) av(rb + ".alLado", "va al lado del bloque anterior de la misma lista (no en el primero)");
        else if (b.seccion !== undefined) {
          // una sección va al lado de la sección anterior, y ninguna de las dos lleva secciones adentro
          const ant = lista[i - 1], conSecciones = (s) => (s.bloques || []).some((x) => x && x.seccion !== undefined);
          if (!ant || ant.seccion === undefined) av(rb + ".alLado", "una sección va al lado de la sección anterior (el bloque anterior no es una sección)");
          else if (conSecciones(ant) || conSecciones(b)) av(rb + ".alLado", "dos secciones van lado a lado solo si no tienen secciones adentro");
        }
      }
      if (b.texto !== undefined) { texto(String(b.texto), rb); color(b.color, rb + ".color"); return; }
      if (Array.isArray(b.pasos)) {
        if (b.notas !== undefined && b.notas !== "arriba") av(rb + ".notas", "tendría que ser \"arriba\" (o no ponerse: van a la derecha)");
        if (b.tam !== undefined && !TAMS.includes(b.tam)) av(rb + ".tam", `tendría que ser ${TAMS.join(", ")}`);
        // la acción se anuncia antes de hacerse: el primer renglón no lleva nota
        const r0 = b.pasos[0];
        if (r0 && typeof r0 === "object" && !Array.isArray(r0) && r0.nota)
          av(`${rb}.pasos[0].nota`, "el primer renglón no se anuncia: escribí primero la expresión sola y la acción en el renglón donde se hace");
        b.pasos.forEach((l, j) => renglon(l, `${rb}.pasos[${j}]`, j, b.pasos));
        return;
      }
      if (b.generador) {
        if (!GENERADORES.includes(b.generador)) err(rb, `no existe el generador «${b.generador}»`);
        if (b.partir !== undefined && typeof b.partir !== "boolean") av(rb + ".partir", "tendría que ser true o false");
        return;
      }
      if (b.seccion !== undefined) {
        texto(String(b.seccion), rb + ".seccion"); color(b.color, rb + ".color"); marcador(b.marcador, rb);
        if (!Array.isArray(b.bloques) || !b.bloques.length) av(rb, "una sección sin «bloques» queda vacía");
        bloques(b.bloques, rb);
        return;
      }
      if (b.qr !== undefined) {
        if (typeof b.qr !== "string" || !/^https?:\/\/\S+$/.test(b.qr)) err(rb + ".qr", "tiene que ser una dirección que empiece con https://");
        for (const k of ["lado", "ancho"]) if (b[k] !== undefined && !(typeof b[k] === "number" && b[k] > 0)) av(`${rb}.${k}`, "tendría que ser un número positivo");
        return;
      }
      if (b.triangulos !== undefined) {
        if (!Array.isArray(b.triangulos) || !b.triangulos.length) { err(rb + ".triangulos", "tiene que ser una lista de triángulos y textos"); return; }
        b.triangulos.forEach((t, j) => {
          const rt = `${rb}.triangulos[${j}]`;
          if (typeof t === "string") { texto(t, rt); return; }
          const a = t && t.angulos;
          if (!Array.isArray(a) || a.length !== 3 || !a.every((v) => typeof v === "number" && v > 0) || Math.abs(a[0] + a[1] + a[2] - 180) > 0.01)
            err(rt + ".angulos", "tienen que ser tres números positivos que sumen 180");
          if (t && t.nombre !== undefined) texto(String(t.nombre), rt + ".nombre");
        });
        if (b.alto !== undefined && !(typeof b.alto === "number" && b.alto > 0)) av(rb + ".alto", "tendría que ser un número positivo");
        color(b.color, rb + ".color");
        return;
      }
      err(rb, "bloque sin «texto», «pasos», «generador», «seccion», «qr», «triangulos», «salto» ni «espacio»");
    });
  };

  if (!sol || typeof sol !== "object") { err("raíz", "no es un objeto"); return { errores, avisos }; }
  if (!opc.parte && sol.formato !== FORMATO) av("formato", `tendría que ser «${FORMATO}»`);
  if (!opc.parte && !sol.titulo) av("titulo", "falta el título");
  const m = sol.meta || {};
  if (opc.parte && !sol.meta) { /* una parte de texto no tiene meta */ }
  else if (!sol.meta) av("meta", "falta «meta» (materia, institucion, anio, tp, fuente, estado)");
  else {
    for (const k of ["materia", "institucion", "anio", "tp", "fuente"]) if (!m[k]) av("meta." + k, "falta");
    if (!ESTADOS.includes(m.estado)) av("meta.estado", `tendría que ser ${ESTADOS.join(", ")}`);
  }
  for (const k of ["cabecera", "pie"]) if (sol[k] !== undefined && typeof sol[k] !== "string") err(k, "tiene que ser un texto (puede ser vacío)");
  const est = sol.estilo || {};
  const FUENTES = ["normal", "mano", "codigo"], TAMS = ["S", "M", "L", "XL"];
  if (est.fuente !== undefined && !FUENTES.includes(est.fuente)) av("estilo.fuente", `tendría que ser ${FUENTES.join(", ")}`);
  if (est.fuenteEnunciado !== undefined && !FUENTES.includes(est.fuenteEnunciado)) av("estilo.fuenteEnunciado", `tendría que ser ${FUENTES.join(", ")}`);
  if (est.tam !== undefined && !TAMS.includes(est.tam)) av("estilo.tam", `tendría que ser ${TAMS.join(", ")}`);
  if (est.tamEnunciado !== undefined && !TAMS.includes(est.tamEnunciado) && !(typeof est.tamEnunciado === "number" && est.tamEnunciado > 0))
    av("estilo.tamEnunciado", `tendría que ser ${TAMS.join(", ")} o un número`);
  if (est.continuacion !== undefined && typeof est.continuacion !== "boolean") av("estilo.continuacion", "tendría que ser true o false");
  if (est.margenes !== undefined) {
    const m = est.margenes;
    if (typeof m !== "object" || Array.isArray(m)) err("estilo.margenes", "es un objeto { sup, inf, ext, lomo } en mm");
    else for (const k of Object.keys(m)) {
      if (!["sup", "inf", "ext", "lomo"].includes(k)) av("estilo.margenes." + k, "solo valen sup, inf, ext y lomo");
      else if (!(typeof m[k] === "number" && m[k] >= 0 && m[k] <= 80)) av("estilo.margenes." + k, "tendría que ser un número de 0 a 80 (mm)");
    }
  }
  if (est.dobleFaz !== undefined && typeof est.dobleFaz !== "boolean") av("estilo.dobleFaz", "tendría que ser true o false");
  if (est.sangriaEnunciado !== undefined && est.sangriaEnunciado !== "rotulo" && !(typeof est.sangriaEnunciado === "number" && est.sangriaEnunciado >= 0))
    av("estilo.sangriaEnunciado", "tendría que ser «rotulo» o un número");
  if (est.numeracion !== undefined) {
    const nu = est.numeracion;
    if (typeof nu !== "object" || Array.isArray(nu)) err("estilo.numeracion", "es un objeto { ejercicio, item }");
    else for (const k of ["ejercicio", "item"]) if (nu[k] !== undefined && typeof nu[k] !== "string") err(`estilo.numeracion.${k}`, "tiene que ser un texto, por ejemplo «Ejercicio {n}:»");
  }
  // bloques sueltos antes de los ejercicios (el texto de una introducción)
  if (sol.bloques !== undefined) bloques(sol.bloques, "raíz");
  if (!Array.isArray(sol.ejercicios)) { if (!opc.parte) err("ejercicios", "falta la lista de ejercicios"); }
  else sol.ejercicios.forEach((ej, i) => {
    const r = `ejercicios[${i}]`;
    if (!ej.enunciado) av(r, "falta el enunciado");
    marcador(ej.marcador, r);
    bloques(ej.bloques, r);
    (ej.items || []).forEach((it, j) => {
      marcador(it.marcador, `${r}.items[${j}]`); bloques(it.bloques, `${r}.items[${j}]`);
      if (it.alLado !== undefined && typeof it.alLado !== "boolean") av(`${r}.items[${j}].alLado`, "tendría que ser true o false");
      if (it.alLado && j === 0) av(`${r}.items[${j}].alLado`, "el primer ítem no tiene un ítem anterior al que ponerse al lado");
    });
    if (!ej.bloques && !ej.items) av(r, "no tiene ni bloques ni ítems");
  });
  return { errores, avisos };
}

// ---------------------------------------------------------- cuadernillos
// Un cuadernillo (unzip.mat/cuadernillo@1) junta en un solo juego de hojas una
// carátula, partes de texto, un índice y los trabajos prácticos (ver FORMATO.md).
// Las partes «solucion» traen la solución adentro («solucion») o la ruta a su
// solucion.json, relativa a la carpeta del cuadernillo («ruta»).
export const FORMATO_CUADERNILLO = "unzip.mat/cuadernillo@1";
const TIPOS_PARTE = ["caratula", "texto", "indice", "solucion"];
const tipoParte = (p) => p.tipo || (p.solucion || p.ruta ? "solucion" : "texto");

// Cada trabajo práctico está una sola vez, en el banco (tps/), sin número ni
// cursada: lleva su «tema» (y «temaCabecera», si en la cabecera va otro texto).
// Lo que depende de la cursada lo pone el cuadernillo: la parte trae el «rotulo»
// («T.P. 11») y el cuadernillo, las «plantillas» del título, el subtítulo, la
// cabecera y el marcador, con {rotulo}, {tema} y {temaCabecera}. La parte puede
// cambiar cualquiera de esos textos («titulo», «subtitulo», «cabecera», «tema»,
// «temaCabecera») y agregar «bloques» antes de los de la solución (una aclaración
// que vale solo para esa cursada).
const CAMPOS_PLANTILLA = ["titulo", "subtitulo", "cabecera", "marcador"];
const CAMPOS_PARTE_SOLUCION = ["rotulo", "tema", "temaCabecera", "titulo", "subtitulo", "bloques"];

export function aplicarCursada(sol, p, plantillas = {}) {
  if (p.rotulo === undefined) return { sol, marcador: p.marcador };
  const tema = p.tema ?? sol.tema ?? "";
  const datos = { rotulo: p.rotulo, tema, temaCabecera: p.temaCabecera ?? sol.temaCabecera ?? tema };
  const llenar = (s) => s.replace(/\{(rotulo|tema|temaCabecera)\}/g, (_, k) => datos[k]);
  const texto = (k) => typeof p[k] === "string" ? llenar(p[k]) : p[k] ?? (typeof plantillas[k] === "string" ? llenar(plantillas[k]) : undefined);
  const out = { ...sol };
  for (const k of ["titulo", "subtitulo", "cabecera"]) { const v = texto(k); if (v !== undefined) out[k] = v; }
  if (Array.isArray(p.bloques) && p.bloques.length) out.bloques = [...p.bloques, ...(sol.bloques || [])];
  out.meta = { ...(sol.meta || {}), tp: p.rotulo };
  return { sol: out, marcador: texto("marcador") };
}

// el cuadernillo con cada «ruta» reemplazada por su solución, ya con los textos
// de la cursada (lo que lee la pizarra)
export function completarCuadernillo(c, carpeta) {
  const { plantillas, ...resto } = c;
  return { ...resto, partes: (c.partes || []).map((p) => {
    if (!p || typeof p !== "object" || !(p.solucion || p.ruta)) return p;
    let sol = p.solucion;
    if (!sol) {
      const abs = path.resolve(carpeta, p.ruta);
      if (!fs.existsSync(abs)) throw new Error(`No existe ${p.ruta} (desde ${carpeta})`);
      sol = JSON.parse(fs.readFileSync(abs, "utf8"));
    }
    const cursada = aplicarCursada(sol, p, plantillas);
    const parte = Object.fromEntries(Object.entries(p).filter(([k]) => k !== "ruta" && !CAMPOS_PARTE_SOLUCION.includes(k)));
    if (p.rotulo !== undefined) delete parte.cabecera; // ya está en la solución
    if (cursada.marcador !== undefined) parte.marcador = cursada.marcador;
    return { tipo: "solucion", ...parte, solucion: cursada.sol };
  }) };
}

export function revisarCuadernillo(c, carpeta) {
  const errores = [], avisos = [];
  const err = (r, m) => errores.push(`${r}: ${m}`), av = (r, m) => avisos.push(`${r}: ${m}`);
  if (!c || typeof c !== "object") { err("raíz", "no es un objeto"); return { errores, avisos }; }
  if (c.formato !== FORMATO_CUADERNILLO) av("formato", `tendría que ser «${FORMATO_CUADERNILLO}»`);
  if (!c.titulo) av("titulo", "falta el título (es el nombre de la pizarra y del PDF)");
  for (const k of ["cabecera", "pie"]) if (c[k] !== undefined && typeof c[k] !== "string") err(k, "tiene que ser un texto (puede ser vacío)");
  const est = c.estilo || {};
  if (est.partesEnImpar !== undefined && typeof est.partesEnImpar !== "boolean") av("estilo.partesEnImpar", "tendría que ser true o false");
  if (est.escala !== undefined && !(typeof est.escala === "number" && est.escala >= 0.5 && est.escala <= 1)) av("estilo.escala", "tendría que ser un número de 0.5 a 1 (0.8 = hojas al 80 %)");
  if (c.plantillas !== undefined) {
    const pl = c.plantillas;
    if (!pl || typeof pl !== "object" || Array.isArray(pl)) err("plantillas", "es un objeto { titulo, subtitulo, cabecera, marcador }");
    else for (const k of Object.keys(pl)) {
      if (!CAMPOS_PLANTILLA.includes(k)) av(`plantillas.${k}`, `campo desconocido (valen ${CAMPOS_PLANTILLA.join(", ")})`);
      else if (typeof pl[k] !== "string") err(`plantillas.${k}`, "tiene que ser un texto");
    }
  }
  const revisarMarcadores = (mk, r) => {
    if (!mk || typeof mk !== "object" || Array.isArray(mk)) { err(r, "es un objeto { ejercicio, item } con plantillas como «{rotulo}»"); return; }
    for (const k of Object.keys(mk)) {
      if (!["ejercicio", "item"].includes(k) || typeof mk[k] !== "string") err(r + "." + k, "solo valen «ejercicio» e «item», con un texto");
    }
  };
  if (c.marcadores !== undefined) revisarMarcadores(c.marcadores, "marcadores");
  if (!Array.isArray(c.partes) || !c.partes.length) { err("partes", "falta la lista de partes"); return { errores, avisos }; }
  let indices = 0;
  const rutasVistas = new Map();
  c.partes.forEach((p, i) => {
    const r = `partes[${i}]`;
    if (!p || typeof p !== "object") { err(r, "parte inválida"); return; }
    const tipo = tipoParte(p);
    if (!TIPOS_PARTE.includes(tipo)) { err(r + ".tipo", `tiene que ser ${TIPOS_PARTE.join(", ")}`); return; }
    if (p.cabecera !== undefined && typeof p.cabecera !== "string") err(r + ".cabecera", "tiene que ser un texto");
    if (p.marcador !== undefined && typeof p.marcador !== "boolean" && typeof p.marcador !== "string") err(r + ".marcador", "es true, false o un texto");
    if (p.nivel !== undefined && ![1, 2].includes(p.nivel)) err(r + ".nivel", "tiene que ser 1 o 2");
    for (const k of ["enIndice", "sinCabecera", "impar"]) if (p[k] !== undefined && typeof p[k] !== "boolean") av(`${r}.${k}`, "tendría que ser true o false");
    if (tipo === "caratula") {
      if (!p.titulo) av(r, "una carátula sin título");
      if (p.lineas !== undefined && !Array.isArray(p.lineas)) err(r + ".lineas", "es una lista de textos");
      return;
    }
    if (tipo === "indice") {
      indices++;
      if (p.niveles !== undefined && ![1, 2, 3, 4, 5].includes(p.niveles)) av(r + ".niveles", "tendría que ser de 1 a 5");
      if (p.soloEjercicios !== undefined && typeof p.soloEjercicios !== "boolean") av(r + ".soloEjercicios", "tendría que ser true o false");
      if (p.soloEjercicios && p.niveles !== undefined) av(r + ".niveles", "con «soloEjercicios» no se usa");
      return;
    }
    if (tipo === "texto") {
      if (!p.titulo) av(r, "una parte sin título no tiene marcador ni entrada en el índice");
      const v = revisar({ titulo: p.titulo, bloques: p.bloques || [], estilo: est }, { parte: true });
      v.errores.forEach((e) => errores.push(`${r}.${e}`)); v.avisos.forEach((a) => avisos.push(`${r}.${a}`));
      return;
    }
    let sol = p.solucion;
    if (!sol && p.ruta) {
      const abs = path.resolve(carpeta || ".", p.ruta);
      if (!fs.existsSync(abs)) { err(r + ".ruta", `no existe ${p.ruta}`); return; }
      try { sol = JSON.parse(fs.readFileSync(abs, "utf8")); } catch (e) { err(r + ".ruta", `${p.ruta} no es un JSON válido`); return; }
    }
    if (!sol) { err(r, "falta «solucion» o «ruta»"); return; }
    if (p.ruta) {
      const abs = path.resolve(carpeta || ".", p.ruta);
      if (rutasVistas.has(abs)) av(r + ".ruta", `el mismo trabajo práctico ya está en ${rutasVistas.get(abs)}`);
      else rutasVistas.set(abs, r);
    }
    for (const k of ["rotulo", "tema", "temaCabecera", "titulo", "subtitulo"]) if (p[k] !== undefined && typeof p[k] !== "string") err(`${r}.${k}`, "tiene que ser un texto");
    if (p.bloques !== undefined && !Array.isArray(p.bloques)) err(r + ".bloques", "es una lista de bloques");
    else if (p.bloques) {
      const v = revisar({ titulo: "-", bloques: p.bloques, estilo: est }, { parte: true });
      v.errores.forEach((e) => errores.push(`${r}.${e}`)); v.avisos.forEach((a) => avisos.push(`${r}.${a}`));
    }
    if (p.rotulo !== undefined && !(p.tema ?? sol.tema)) av(r, "la solución no tiene «tema» (las plantillas lo usan)");
    if (p.rotulo === undefined && (p.tema || p.temaCabecera || p.titulo || p.subtitulo)) av(r, "«tema», «titulo» y «subtitulo» de la parte solo se usan con «rotulo»");
    if (p.marcadores !== undefined) revisarMarcadores(p.marcadores, r + ".marcadores");
    // los avisos de estilo de cada trabajo práctico salen al validar su solucion.json
    revisar(sol).errores.forEach((e) => errores.push(`${r}.solucion.${e}`));
  });
  if (indices > 1) av("partes", "hay más de un índice");
  return { errores, avisos };
}

export function buscar(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...buscar(p));
    else if (d.name === "solucion.json" || d.name === "cuadernillo.json") out.push(p);
  }
  return out;
}

export const GENERADORES_VALIDOS = GENERADORES;

// los enunciados de los ejercicios y de los ítems, sin espacios de más: dos
// trabajos prácticos con la misma huella son el mismo
export function huellaEnunciado(sol) {
  if (!Array.isArray(sol?.ejercicios) || !sol.ejercicios.length) return "";
  return sol.ejercicios.map((e) => [e.enunciado || "", ...(e.items || []).map((it) => it.enunciado || "")].join("\n"))
    .join("\n\n").replace(/\s+/g, " ").trim();
}

// solo cuando se ejecuta como programa (no cuando lo importa el servidor MCP)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const rutas = process.argv.slice(2).length ? process.argv.slice(2) : buscar(path.join(raiz, "solucionarios"));
  let hayErrores = false;
  const enunciados = new Map(); // trabajos prácticos repetidos: tiene que haber una sola copia
  for (const ruta of rutas) {
    let sol;
    try { sol = JSON.parse(fs.readFileSync(ruta, "utf8")); }
    catch (e) { console.log(`✗ ${ruta}\n    error: no es un JSON válido (${e.message})`); hayErrores = true; continue; }
    const { errores, avisos } = Array.isArray(sol.partes) ? revisarCuadernillo(sol, path.dirname(path.resolve(ruta))) : revisar(sol);
    if (!Array.isArray(sol.partes)) {
      if (path.resolve(ruta).split(path.sep).includes("tps") && !sol.tema) avisos.push("tema: falta (un trabajo práctico del banco lo necesita para el título y la cabecera de cada cursada)");
      const firma = huellaEnunciado(sol);
      if (firma && enunciados.has(firma)) avisos.push(`tiene el mismo enunciado que ${enunciados.get(firma)}: tendría que haber una sola copia (ver FORMATO.md, «Banco de trabajos prácticos»)`);
      else if (firma) enunciados.set(firma, ruta);
    }
    console.log(`${errores.length ? "✗" : "✓"} ${ruta}${avisos.length ? ` (${avisos.length} avisos)` : ""}`);
    errores.forEach((e) => console.log("    error: " + e));
    avisos.forEach((a) => console.log("    aviso: " + a));
    if (errores.length) hayErrores = true;
  }
  if (!rutas.length) console.log("No hay archivos solucion.json para revisar.");
  process.exit(hayErrores ? 1 : 0);
}
