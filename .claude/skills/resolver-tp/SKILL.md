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

## Pasos

1. **Leer el enunciado completo.** Si es un PDF o una foto, transcribe cada ejercicio con
   cuidado: exponentes, signos, fracciones. Si algo no se lee bien, pregúntalo; no lo
   adivines.
2. **Ubicar la carpeta**:
   `solucionarios/<materia>/<institucion>/<año>/<tp>/solucion.json`, con nombres en
   minúsculas, sin tildes y con guiones (`matematica-1/utn-frba/2026/tp-03-factorizacion`).
   Si no sabes la materia, la institución o el año, pregunta.
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
   dónde sale el enunciado.
6. **Validar**: `node herramientas/validar.mjs ruta/a/solucion.json`. Corrige todos los
   errores y también los avisos de estilo (signo `−` y no `-`, `·` y no `*`, superíndices
   y no `^`, marcas dibujadas y no ✓/✗).
7. **Contarle al usuario** qué ejercicios quedaron resueltos, cuáles verificaste y cómo,
   y qué conviene revisar. Recuérdale que lo importe en la pizarra, lo corrija y guarde
   junto al JSON el `.excalidraw` y el PDF exportado desde el panel de Hojas A4.

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
  repositorio.
- **Git**: trabaja en una rama (`tp/<materia>-<tp>`). No hagas commit, push ni pull
  request sin que el usuario lo pida.
