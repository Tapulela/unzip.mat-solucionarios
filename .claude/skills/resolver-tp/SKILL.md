---
name: resolver-tp
description: Resuelve un trabajo práctico o un examen de matemática (enunciado en PDF, foto o texto) y escribe el borrador del solucionario como solucion.json (formato unzip.mat/solucion@1), listo para importar en la pizarra unzip.mat e imprimir en A4. Usar cuando pidan resolver, hacer el solucionario o el borrador de un TP, una guía o un examen, o agregar un TP resuelto al repositorio.
---

# Resolver un TP y armar su solucionario

El resultado es un archivo `solucion.json` que la pizarra unzip.mat dibuja en hojas A4
(Generadores → Impresión → «Importar solución (.json)»). Lo que hagas es un **borrador**:
un docente lo revisa y lo corrige en la pizarra antes de publicarlo. Igual, cada
resultado tiene que estar verificado: un error en un solucionario les enseña mal a los
chicos.

Antes de empezar, lee `FORMATO.md` (en la raíz del repositorio): ahí están los campos,
los items, los colores y el estilo de los desarrollos. El ejemplo completo está en
`solucionarios/_ejemplo/tp-ejemplo/solucion.json`.

Lee también `REGLAS.md` (en la raíz): son los criterios que pidieron los docentes al
revisar resoluciones anteriores (consigna y respuesta, numeración, tablas de verdad,
nombres de las leyes…) y valen para todas. Si el usuario pide un criterio nuevo que
sirve para otras resoluciones, agrégalo ahí.

## Pasos

1. **Leer el enunciado completo.** Si es un PDF o una foto, transcribe cada ejercicio con
   cuidado: exponentes, signos, fracciones. Si algo no se lee bien, pregúntalo; no lo
   adivines.
2. **Buscarlo en el banco antes de resolverlo.** Cada TP está una sola vez, en
   `solucionarios/<materia>/<institucion>/tps/<tema>/solucion.json`, sin número ni
   cursada (ver «Banco de trabajos prácticos» en `FORMATO.md`). Compara el enunciado
   con los del banco del mismo tema:
   - **idéntico** (los mismos ejercicios, ítems y datos): no se resuelve de nuevo; solo
     se agrega la parte en el `cuadernillo.json` de la cursada, con su `rotulo`;
   - **con cualquier diferencia** (un dato, un ítem, un ejercicio de más): es otra
     versión, en una carpeta nueva del banco. Si ya hay una del mismo tema, las dos
     llevan letra (`estructuras-algebraicas-a`, `-b`; al renombrar la que no tenía, se
     actualizan las rutas de los cuadernillos).
   La carpeta va en minúsculas, sin tildes y con guiones. La solución lleva `tema`
   (y `temaCabecera` si en la cabecera va otro texto), un `titulo` y una `cabecera`
   genéricos, sin número ni cuatrimestre, y `meta.tp` con el tema. Lo que vale para una
   sola cursada (por ejemplo, «en el PDF figura como T.P. 6») va en los `bloques` de la
   parte del cuadernillo, no en la solución. Si no sabes la materia, la institución,
   el año, el cuatrimestre o el número del TP en esa cursada, pregunta.
3. **Resolver cada ejercicio** como lo explicaría un docente en el pizarrón, para chicos
   que están aprendiendo:
   - una operación por renglón; con fracciones, primero el denominador común;
   - cada paso con su `nota` (qué se hace), que se dibuja antes del paso;
   - lo que cambia en un paso en color, y la nota del mismo color: `suma` (verde) para
     sumar o restar, `producto` (violeta) para multiplicar, dividir, factor común o
     reemplazar;
   - las propiedades importantes marcadas con `marcar`;
   - el resultado final en `caja`;
   - las bifurcaciones (dos raíces, dos casos) con `llave` y renglones `rama`;
   - los gráficos (recta real, funciones, tablas de verdad, conjuntos) con el
     `generador` de la pizarra, no dibujados a mano.
4. **Verificar los resultados.**
   - Reemplaza las soluciones en el enunciado original.
   - Si hay Python con SymPy, úsalo para comprobar cuentas, factorizaciones, raíces,
     límites, derivadas o integrales:
     `python -c "import sympy as s; x=s.symbols('x'); print(s.factor(2*x**2-2*x-12))"`.
   - Si una verificación no cierra, corrige el desarrollo, no la verificación.
   - Lo que no puedas verificar, avísalo al final.
5. **Escribir `solucion.json`** con `meta.estado: "borrador"` y `meta.fuente`, que dice de
   dónde sale el enunciado. **Siempre con marcadores del PDF** (`marcador`) en cada
   ejercicio, cada ítem y las secciones principales, como dice «Marcadores del PDF» en
   `REGLAS.md`.
6. **Validar**: con la herramienta MCP `validar_solucion` (servidor `unzip-mat`) o con
   `node herramientas/validar.mjs ruta/a/solucion.json`. Corrige todos los errores y
   también los avisos de estilo (signo `−` y no `-`, `·` y no `*`, superíndices y no
   `^`, marcas dibujadas y no ✓/✗).
7. **Mirar cómo queda.** Si el servidor MCP `unzip-mat` está disponible y la pizarra
   está abierta, usa `dibujar_en_pizarra`: devuelve una imagen de cada hoja y los
   avisos. Revisa las imágenes como lo haría un docente: renglones que se salen de la
   hoja, notas que se pisan, una fracción o una llave cortada entre dos hojas, un
   desarrollo difícil de seguir. Corrige el JSON y vuelve a dibujar; la versión nueva
   reemplaza a la anterior. Si la pizarra no está abierta, sigue sin este paso y avisa.
8. **Guardar** con `guardar_solucion` o escribiendo el archivo en el banco, y agregar la
   parte al `cuadernillo.json` de la cursada (`ruta` al banco y `rotulo`, «T.P. 10»). Si
   la cursada todavía no tiene cuadernillo, se crea copiando el de otra cursada.
   Valida con `node herramientas/validar.mjs` (sin rutas): avisa si dos TP del banco
   tienen el mismo enunciado. Después vuelve a armar los cuadernillos con
   `node herramientas/armar-cuadernillo.mjs` (sin rutas): el `cuadernillo.armado.json`
   de cada cursada va al repositorio y se commitea junto con el cambio.
9. **Contarle al usuario** qué ejercicios quedaron resueltos, cuáles verificaste y cómo,
   y qué conviene revisar. Recuérdale que las correcciones se pasan al `solucion.json`
   del banco (lo que se corrige a mano en la pizarra queda solo en ese dibujo, y no
   llega a las otras cursadas).

## Reglas

- **Escritura matemática**: Unicode, no LaTeX. `x²`, `x₁`, `−`, `·`, `±`, `≤`, `≥`,
  `≠`, `∈`, `ℝ`, `∞`, `⇔`. Fracciones con `{ "frac": [...] }` y raíces con
  `{ "raiz": ... }` o `√` dentro de un texto; nunca `a/b` para una fracción que se
  muestra.
- **Ancho**: el área útil de una hoja mide unas 800 unidades, que con el tamaño M son
  unos 60 caracteres entre la expresión y su nota. Si una expresión es larga, pártela en
  dos renglones. Las notas, cortas: hasta unas 35 letras por renglón; si hace falta
  más, usa una lista de renglones.
- **Derechos**: cita el enunciado tal cual solo si es corto. Si es largo, reescríbelo
  conservando los datos. No copies logos ni el formato del PDF original. Nada de nombres
  de alumnos.
- **Exámenes**: pregunta si ya pasó la fecha del examen. Si no pasó, no lo agregues al
  repositorio. Un parcial no va al banco de TP: va en
  `solucionarios/<materia>/<institucion>/parciales/<tipo>/<año> - cuatrimestre <n> - parcial <n> <tipo>[ - <variante>]/`
  (tipos: primer o segundo parcial práctico, teórico o práctico teórico), con la foto o
  el archivo del examen como `consigna.png` (registro documental, siempre) y su
  `solucion.json`; después se suma al índice de `parciales/README.md` con «[Resuelto]».
- **Git**: trabaja en una rama (`tp/<materia>-<tp>`). No hagas commit, push ni pull
  request sin que el usuario lo pida.
