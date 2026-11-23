# Formato de las soluciones (`unzip.mat/solucion@1`)

Cada solucionario es un archivo `solucion.json`. La pizarra
[unzip.mat](https://github.com/Tapulela/unzip.mat) lo dibuja en hojas A4 desde
**Generadores → Impresión → «Importar solución (.json)»**. Después se corrige a mano
y se imprime o se guarda como PDF desde el panel de Hojas A4.

La idea es separar **qué** se escribe (este archivo, que puede armar una IA o una
persona) de **cómo** se dibuja: posiciones, raíces, fracciones, saltos de hoja. De eso
se encarga la pizarra.

## Estructura general

```json
{
  "formato": "unzip.mat/solucion@1",
  "titulo": "Matemática 1 — TP 3: Factorización",
  "subtitulo": "Resolución",
  "meta": {
    "materia": "Matemática 1",
    "institucion": "UTN FRBA",
    "anio": 2026,
    "tp": "TP 3",
    "fuente": "Guía de la cátedra, 1.er cuatrimestre 2026",
    "autores": ["..."],
    "estado": "borrador"
  },
  "estilo": { "fuente": "normal", "tam": "M", "notas": true },
  "ejercicios": [ ... ]
}
```

| Campo | Qué es |
|---|---|
| `titulo`, `subtitulo` | Encabezado de la primera hoja. |
| `cabecera`, `pie` | Texto de la cabecera y del pie de página de todas las hojas (puede tener `\n`). `{n}` es el número de hoja y `{total}` la cantidad de hojas: `"Hoja {n} de {total}"`. Un texto vacío deja la banda con su línea y sin texto. La cabecera y el pie son de toda la pizarra: si ya existen, la pizarra no los cambia. |
| `meta` | Datos para el catálogo. La pizarra no los dibuja. `estado`: `borrador` (lo hizo una IA y nadie lo revisó), `revisado` o `publicado`. |
| `estilo.fuente` | `normal` (Nunito), `mano` (Excalifont) o `codigo` (Cascadia). |
| `estilo.tam` | Tamaño del texto: `S`, `M`, `L` o `XL`. Las notas salen un poco más chicas. |
| `estilo.notas` | `false` para no dibujar las notas de los pasos. |
| `estilo.fuenteEnunciado` | Fuente de la consigna (enunciados y su numeración): `normal`, `mano` o `codigo`. Si falta, es la de `estilo.fuente`. |
| `estilo.tamEnunciado` | Tamaño del enunciado de cada ejercicio: `S`, `M`, `L`, `XL` o un número (`M` es 20 y `L` es 28). Si falta, es un tamaño de título. Los enunciados de los ítems van con `estilo.tam`. |
| `estilo.numeracion` | Cómo se numera: `{ "ejercicio": "{n})", "item": "{i})" }` (lo que se usa si falta). `{n}` es el número del ejercicio e `{i}` el del ítem. Ejemplo: `{ "ejercicio": "Ejercicio {n}:", "item": "{n}.{i}" }` da «Ejercicio 4:», «4.a», «4.b». |
| `estilo.sangriaEnunciado` | Dónde empiezan los renglones de la consigna después del primero: `"rotulo"` (debajo del texto, después de «Ejercicio 4:», lo que se usa si falta) o un número, la sangría medida desde el comienzo del rótulo (por ejemplo `24`). |
| `estilo.margenes` | Márgenes de las hojas A4, en mm: `{ "sup": 10, "inf": 10, "ext": 10, "lomo": 15 }`. Al importar pasan al panel de Hojas A4 (valen para las hojas nuevas). Si falta, quedan los del panel. |
| `estilo.dobleFaz` | `true` para que el lomo cambie de lado en las hojas pares (impresión de los dos lados). |
| `estilo.continuacion` | `true` para avisar en gris, al pie de la hoja, cuando un ejercicio o un ítem sigue en la hoja siguiente: «(Continúa en la siguiente hoja)», o «(Continúa la consigna en la siguiente hoja)» si se corta un enunciado. Si la hoja siguiente empieza un ejercicio o un ítem nuevo, no se avisa. Un enunciado nunca se corta si entra en una hoja. |

## Ejercicios e ítems

```json
{
  "numero": 1,
  "enunciado": "Factorizar P(x) = 2x² − 2x − 12.",
  "bloques": [ ... ],
  "items": [
    { "numero": "a", "enunciado": "...", "bloques": [ ... ] }
  ]
}
```

- `numero` es opcional: si falta, se numera 1, 2, 3… y los ítems a, b, c…
- `marcador` (en un ejercicio, un ítem o una sección) agrega un marcador del PDF: el
  índice que muestra el lector de PDF en su panel y que lleva a ese lugar. Vale `true`
  (el título es el rótulo y el enunciado, por ejemplo «Unidad 1: Lógica
  proposicional», o el título de la sección), un texto (el título) o
  `{ "titulo": "...", "nivel": 2 }`, con nivel de 1 a 3 (por defecto, 1 en un
  ejercicio, 2 en un ítem y en una sección, el nivel de anidamiento). Se dibuja en
  violeta en el margen y no se imprime. El PDF que guarda «Imprimir / PDF» no trae
  los marcadores: se agregan después con «Agregar marcadores a un PDF», en el panel
  de Hojas A4.
- `"alLado": true` (en un ítem) lo pone a la derecha del ítem anterior, alineado arriba,
  si los dos entran a lo ancho de la hoja (si no, va debajo, con un aviso). Sirve para
  ítems angostos, como dos tablas de verdad chicas. Los dos quedan en la misma hoja y no
  se parten. No se aplica a ítems con secciones o con gráficos de un generador.
- `enunciado` es texto común y se corta en renglones solo. Conviene citar lo justo, o
  reescribirlo con tus palabras (ver «Derechos» en el README).
- Un ejercicio puede tener `bloques` propios, `items`, o las dos cosas (primero van sus
  bloques y después los ítems).

## Bloques

| Bloque | Qué dibuja |
|---|---|
| `{ "texto": "...", "color": "gris", "tam": "S" }` | Un párrafo. Un `"..."` suelto también vale como texto. |
| `{ "pasos": [ renglones ] }` | Un desarrollo paso a paso (ver abajo). |
| `{ "generador": "recta", "op": { ... } }` | Un gráfico armado con un generador de la pizarra. Queda vinculado: al seleccionarlo se edita desde su panel. |
| `"partir": true` (en un bloque de generador) | El dibujo se puede repartir entre hojas renglón por renglón, como un desarrollo, en vez de pasar entero a la hoja siguiente. Sirve para cálculos largos sin gráfico (las raíces n-ésimas de `raicesC`). Los títulos del cálculo no quedan solos al pie. La parte de cada hoja ya no se edita desde el panel. |
| `{ "seccion": "Título", "bloques": [ ... ] }` | Una sección: el título subrayado (del tamaño del texto, en azul o en `color`) y sus bloques debajo, con sangría y una línea vertical a la izquierda que acompaña cada renglón, también si la sección sigue en otra hoja. Las secciones se pueden anidar. |
| `{ "salto": true }` | Empieza una hoja nueva. |
| `{ "qr": "https://…", "titulo": "…" }` | Un código QR dibujado (con cuadraditos de la pizarra, nítido al imprimir), con el título arriba y la dirección escrita abajo, centrados en una columna de media hoja: dos QR van lado a lado con `alLado`. En el PDF, la columna entera es un enlace a la dirección. `lado` (por defecto 200) y `ancho` cambian el tamaño del código y de la columna. |
| `{ "triangulos": [ { "nombre": "T₁", "angulos": [90, 30, 60] }, "R", { … } ] }` | Una fila de triángulos dibujados a partir de sus ángulos en grados (suman 180): el primero abajo a la izquierda, el segundo abajo a la derecha y el tercero arriba. Cada ángulo lleva su arco y su medida (el recto, un cuadradito) y el nombre va arriba. Un texto suelto («R», «∧», «=») se escribe entre los triángulos, a media altura. `alto` (por defecto 80) es la altura máxima; `color` es el de los lados. No se parte entre hojas. Sirve para contraejemplos con triángulos. |
| `"unir": true` (en un bloque de texto) | El texto no se separa de lo que le sigue: si no entra, pasa a la hoja siguiente junto con el bloque de abajo. Sirve para «La tabla sigue:». |
| `"continua": "..."` (en cualquier bloque) | Con `estilo.continuacion`, el aviso que se escribe si la hoja se corta justo antes de este bloque. Por ejemplo, `"La tabla sigue en la siguiente hoja"`. Con `""` no se escribe ningún aviso (por ejemplo, si el bloque anterior ya termina con «(La tabla continúa)»). |
| `"notas": "arriba"` (en un bloque de pasos) | La nota de cada paso se escribe en su propio renglón, arriba del renglón donde se hace (y no a la derecha). Sirve para desarrollos angostos. Un bloque de pasos con `alLado` que no entra con las notas a la derecha se rehace solo con las notas arriba. |
| `"tam": "S"` (en un bloque de pasos) | Tamaño del texto de ese bloque (`S`, `M`, `L` o `XL`). Sirve para que un renglón largo entre a lo ancho de la hoja. |
| `"unir": true` (en un bloque de pasos) | Como en un texto: el bloque no se separa del siguiente (por ejemplo, el título «Paso 3» de la ecuación que va abajo, más chica). |
| `"entero": true` (en un bloque de pasos) | El desarrollo no se parte entre dos hojas: si no entra al pie, pasa entero a la siguiente (si entra en una hoja). Los dibujos de los generadores ya se comportan así. |
| `{ "espacio": 2 }` | Deja lugar libre (en renglones), por ejemplo para completar a mano. |
| `"alLado": true` (en cualquier bloque) | El bloque va a la derecha del bloque anterior de la misma lista, alineado arriba; con `"centro"`, centrado en vertical. Los dos quedan juntos y no se parten entre hojas. Sirve para dos recuadros cortos en un renglón o para los resultados al lado de un gráfico. En una sección, la sección entera (título, línea y contenido) va a la derecha de la sección anterior, por ejemplo «Miembro izquierdo» y «Miembro derecho»; las dos no pueden tener otras secciones adentro. Si no entra a lo ancho, va debajo, con un aviso. |

### Renglones de `pasos`

```json
{ "izq": "P(x)", "rel": "=", "der": [items], "nota": "Sacar factor común 2", "notaColor": "producto" }
```

| Campo | Qué es |
|---|---|
| `izq` | Lo que va a la izquierda de la relación (`P(x)`, `x₁,₂`): un texto o, como `der`, un item o una lista de items (con colores y fracciones). Los `=` de un bloque quedan alineados y cada `izq` va pegado a su `=` (alineado a la derecha). |
| `rel` | La relación (`=`, `<`, `⇔`…). Si hay `izq` y falta `rel`, es `=`. Con `rel` y sin `izq` sale un renglón que sigue al anterior: `  = …`. Sin las dos, el renglón empieza en el margen. |
| `der` | La expresión: un item o una lista de items. Un renglón que es solo un texto o una lista vale como `der`. |
| `nota` | Qué se hace en **este** paso: un texto o una lista de renglones. Se dibuja a la derecha del renglón **anterior** (o arriba de este renglón, con `"notas": "arriba"`), o sea, se anuncia antes de hacerlo. El primer renglón de un bloque no lleva nota: es la expresión de partida. |
| `notaColor` | Color de la nota. Conviene que sea el mismo color de lo que cambia en el paso. |
| `color` | Color de todo el renglón (por ejemplo, el resultado final). |
| `caja` | Recuadro redondeado alrededor de la expresión: `true` o un color. |
| `llave` | Llave debajo del renglón, de la que salen los renglones `rama` que le siguen. |
| `rama` | Etiqueta de una bifurcación: `"x₁"` dibuja `→ x₁ = …` colgando de la llave. |
| `marcar` | `{ "de": 0, "a": 1, "texto": ["Aplicar diferencia de cuadrados:", "u² − v² = (u − v)(u + v)"], "color": "producto" }`: llave bajo los items `de`..`a` de `der` (índices desde 0; tienen que ser textos) y una flecha al renglón siguiente con la explicación. |
| `seccion` | Corta la alineación de los `=`: lo que sigue se alinea aparte y queda un poco separado. |

### Items (lo que va en `der`)

| Item | Ejemplo |
|---|---|
| texto | `"2x² − 2x − 12"` |
| texto con color | `{ "t": "+ 1", "color": "suma" }` |
| fracción | `{ "frac": [numerador, denominador] }`, donde cada uno es un item o una lista |
| raíz dibujada | `{ "raiz": radicando }`, y con índice `{ "raiz": radicando, "indice": "n − 1" }` (más chico y arriba del gancho, para que no se lea como un producto). En textos, `√25`, `√(a + b)` y `√[3]8` también se dibujan. |
| marca dibujada | `{ "marca": "ok" }` (✓ verde) o `{ "marca": "mal" }` (✗ roja) |
| sistema | `{ "sistema": [fila, fila] }`, con una llave a la izquierda |
| tabla | `{ "tabla": [[celda, celda], [celda, celda]] }`. Con `"lineas": true` lleva marco y grilla (cada celda deja a lo sumo un carácter de margen a cada lado), con una línea más gruesa después de la primera fila y de la primera columna (tabla de doble entrada). Las celdas van alineadas a la derecha; `"alinear"` cambia eso: `"izq"`, `"centro"` o `"der"` para toda la tabla, o una lista con una por columna (`["der", "centro", "centro"]`). `"columnasFijas": 3` corre la línea gruesa vertical después de las tres primeras columnas (las de las variables en una tabla de verdad). |

Las potencias y los subíndices se escriben con caracteres Unicode: `x² x³ xⁿ x₁ x₂`. Los
signos van con sus caracteres: `−` (menos), `·`, `±`, `≤`, `≥`, `≠`, `∈`, `∪`, `∩`, `⇔`,
`⇒`, `∞`, `π`, `Δ`.

### Colores

Nombres: `suma` (verde: sumar o restar), `producto` (violeta: multiplicar, dividir,
factor común, reemplazar), `mal` (rojo), `a`, `b` y `c` (los coeficientes de la fórmula
cuadrática), `condicion`, `caso`, `tinta`, `azul`, `rojo`, `verde`, `naranja`, `violeta`,
`celeste` y `gris`. También se puede usar `#rrggbb`.

## Estilo de los desarrollos

Así es como se escriben los pasos en las resoluciones (es lo mismo que hacen los
generadores de la pizarra):

1. **Cada paso se anuncia antes de hacerlo**: la `nota` del renglón N se dibuja al lado
   del renglón N − 1.
2. **Las cuentas se hacen de a una**: una operación por renglón. Con fracciones, primero
   el denominador común.
3. **Lo que cambia en un paso va en color**, y la nota del paso, en el mismo color:
   verde para sumar o restar, violeta para multiplicar, dividir, factor común o
   reemplazar.
4. **Las marcas se dibujan**: nada de ✓ o ✗ como caracteres; se usa `{ "marca": "ok" }`.
5. **Las propiedades importantes se marcan** con `marcar` (por ejemplo, trinomio
   cuadrado perfecto o diferencia de cuadrados).
6. **Las verificaciones van sin colores**, salvo la marca ✓/✗.
7. **El resultado final va en un recuadro** (`caja`).

## Generadores disponibles

`recta`, `funcion`, `tabla`, `boole`, `conjuntos`, `venn`, `relaciones`, `estructuras`,
`combinatoria`, `mcm`, `valorAbsoluto`, `inecuaciones2`, `racionales`, `factorizacion`,
`raicesC`, `complejos`, `razonamientos`, `simpLogica`, `simpBoole`, `simpConjuntos` y
`plantillas`. En `op` van las opciones del generador. Lo que no se pone queda como en el
panel. La forma más fácil de averiguar las opciones es armar el gráfico en la pizarra,
seleccionarlo y mirar `customData.pizarra.opciones` en el archivo `.excalidraw`.

Las raíces n-ésimas (`raicesC`): cada fila es `{ "nombre": "w", "texto": "5 + 9i", "n": "3" }`.
`"columnas": 2` escribe las raíces en dos columnas (la primera mitad a la izquierda); si
no entran a lo ancho de la hoja, la pizarra las deja en una columna. `"grafico": false`
para no dibujar el plano.

Un gráfico de funciones (`funcion`): cada fila es una función de JavaScript
(`"x => x**2 - 9"`; la potencia es `**` y un menos delante de una potencia va
como `9 - x**2`, no `-x**2`), con `dominio` (`"x <= 2"`, `"(2, 4]"`) para una
función por tramos (el mismo `nombre` en cada tramo) y `puntos` para marcar
valores. `tamano`: `mini` (unos 360 de ancho), `chico`, `medio` o `grande`.
Con `marcarExtremos` dibuja ● y ○ en los extremos de cada tramo; donde se tocan
dos tramos, el que se escribe después queda arriba.

Ejemplo, una recta real con un intervalo:

```json
{ "generador": "recta", "op": { "filas": [{ "texto": "(−1, 2)", "color": "#1971c2" }],
  "mostrarUnion": false, "mostrarResultado": false, "titulos": false, "largo": "corta" } }
```

Un diagrama de Venn (2 a 4 conjuntos) que calcula las zonas sin dato. Cada fila es un
dato: `U = 38`, `|V| = 18`, `|A ∩ B| = 11` (incluye la zona común a todos), `solo R = 3`,
`R ∩ A − V = 9`, `los tres = 5`, `ninguno = 0`, o el nombre de la variable de una zona
(`solo V = v`). `mostrar` es `planteo` (datos y variables) o `resuelto`:

```json
{ "generador": "venn", "op": { "nombres": "V, R, A",
  "filas": [{ "texto": "U = 38" }, { "texto": "|V| = 18" }, { "texto": "solo V = v" }],
  "variables": "v, x, y, n", "mostrar": "planteo", "tamano": "chico", "textos": "debajo",
  "trazos": "distintos", "datos": false, "referencias": false, "titulos": false } }
```

Más sobre `venn`:

- Las filas pueden ser strings (`"filas": ["U = 38", "|V| = 18"]`). También entiende
  `n(A) = 23`, cualquier expresión con `∪ ∩ − Δ '` (`|A ∪ B| = 30`, `(A ∪ B)' = 2`),
  `solo A y B = 6` y `A y B pero no C = 6`. ∩ se resuelve antes que ∪, − y Δ.
- `variables` nombra las zonas sin dato en este orden: primero las de un solo conjunto,
  después las de dos, tres..., y al final la de afuera (`ninguno`). Si no alcanzan,
  sigue con x₁, x₂...
- Opciones: `nombres` (2 a 4), `mostrar` (`planteo` | `resuelto`), `tamano` (`chico` |
  `medio` | `grande`), `tamTexto`, `fuente`, `cardinales` (`no` | `datos` | `todos`:
  escribe `|A| = 23` en lugar del nombre), `trazos` (`distintos` | `iguales`), `colores`,
  `datos` (lista de datos), `referencias` (qué zona es cada variable), `ecuaciones`
  (las del planteo), `pasos` (cómo se calcula cada variable, solo en `resuelto`),
  `variableYValor` (`x = 6` en la zona), `textos` (`derecha` | `debajo`; la resolución
  va siempre debajo) y `titulos`.
- Si los datos no cierran (una zona da negativa o no entera, una suma no coincide) o no
  alcanzan, el importador lo avisa con la ruta del bloque.
- Conviene `"titulos": false`: el título del generador puede quedar solo al pie de una
  hoja, separado del diagrama.

## Reparto en hojas

La pizarra crea hojas A4 nuevas, a la derecha de lo que ya haya, con los márgenes, la
escala y el doble faz del panel de Hojas A4. Cada bloque se corta en renglones y los
renglones pasan a la hoja siguiente cuando no entran. Un título o un enunciado nunca
queda solo al pie de una hoja.

El dibujo de un generador no se parte si entra en una hoja. La excepción es la regla de
los signos (`inecuaciones2` y `racionales`): se puede partir entre un caso y el
siguiente, y la hoja nueva empieza repitiendo la cabecera (la inecuación con su llave
y la regla de los signos).

Un gráfico que se extiende a la izquierda de su lugar (por ejemplo, un plano complejo con la
parte negativa del eje real) se corre a la derecha hasta alinearse con el rótulo de su ítem,
para no salirse del área útil. Si un bloque con `alLado` no entra con la separación de siempre,
se prueba con la mitad. Las líneas verticales de las secciones nunca se salen del área útil.

Si un renglón es más ancho que el área útil, al importar aparece un aviso. En ese caso
conviene partir el paso, acortar la nota o usar `"tam": "S"`.

Un ejemplo completo está en
[`solucionarios/_ejemplo/tp-ejemplo/solucion.json`](solucionarios/_ejemplo/tp-ejemplo/solucion.json).

## Cuadernillo completo (`unzip.mat/cuadernillo@1`)

Un `cuadernillo.json` junta en un solo juego de hojas, listo para imprimir y encuadernar,
una carátula, partes de texto, un índice y los trabajos prácticos ya resueltos, en orden.
Cada parte empieza en una hoja nueva. El de Matemática 1 está en
[`solucionarios/matematica-1/ausc-puc-lsi/2026 - cuatrimestre 2/cuadernillo.json`](solucionarios/matematica-1/ausc-puc-lsi/2026%20-%20cuatrimestre%202/cuadernillo.json).

```json
{
  "formato": "unzip.mat/cuadernillo@1",
  "titulo": "Solucionario Matemática 1 — Año 2026 · Cuatrimestre 2",
  "cabecera": "Matemática 1\nSolucionario de los trabajos prácticos",
  "pie": "Hoja {n} de {total}",
  "meta": { "...": "como en una solución" },
  "estilo": { "margenes": { "sup": 10, "inf": 10, "ext": 10, "lomo": 15 }, "dobleFaz": true, "partesEnImpar": true },
  "partes": [
    { "tipo": "caratula", "antetitulo": "Matemática 1", "titulo": "Solucionario…", "subtitulo": "Año 2026", "lineas": ["…"], "pie": "…" },
    { "tipo": "texto", "titulo": "Introducción", "bloques": [ ... ] },
    { "tipo": "indice", "titulo": "Contenido", "niveles": 2 },
    { "tipo": "texto", "titulo": "A tener en cuenta", "bloques": [ ... ] },
    { "ruta": "tp-01-logica-proposicional/solucion.json", "marcador": "T.P. 1: Lógica proposicional" }
  ]
}
```

| Campo | Qué es |
|---|---|
| `cabecera`, `pie` | Los generales: valen para las partes que no traen la suya (introducción, índice…). |
| `estilo` | El de las partes de texto y del índice, y lo que no definan las soluciones. `partesEnImpar: true` (con `dobleFaz`) hace empezar cada parte en una hoja impar: si hace falta, deja una hoja en blanco antes, sin cabecera ni pie. `escala` (de 0.5 a 1, por defecto 1) es la escala de las hojas con la que `pdf-cuadernillo.mjs` arma el PDF: con 0.8 todo se imprime al 80 % y entra más por hoja (el área útil pasa de 699 a 874 de ancho). Para revisarlo en la pizarra con el mismo reparto, el panel de Hojas A4 tiene que estar en esa escala. |
| `partes[].tipo` | `caratula`, `texto`, `indice` o `solucion` (si falta: `solucion` si trae `ruta` o `solucion`, si no `texto`). |
| `caratula` | `antetitulo`, `titulo`, `subtitulo`, `lineas` (lista) y `pie` (abajo de todo), centrados. La hoja no lleva cabecera, pie ni número. |
| `texto` | `titulo` (con el mismo encabezado que una solución), `subtitulo` y `bloques` (los mismos bloques de los ejercicios). |
| `indice` | Los marcadores de las partes que van en el índice, hasta el nivel `niveles` (por defecto 2: partes y trabajos prácticos en el nivel 1, ejercicios en el 2), con línea de puntos y número de hoja. No incluye la carátula ni a sí mismo. |
| `solucion` | Un trabajo práctico: `ruta` (su `solucion.json`, relativa a la carpeta del cuadernillo) o `solucion` (el objeto). Lleva **su propia cabecera** (`cabecera` de la solución, o `cabecera` de la parte), que vale desde su primera hoja. Su `titulo`, `estilo` y numeración son los de la solución. |
| `partes[].marcador` | Título del marcador de la parte (nivel 1). Si falta, el título de la parte; en una solución conviene uno corto («T.P. 1: Lógica proposicional»). `false`: sin marcador. |
| `partes[].marcadores` | Solo en una solución: plantillas de los marcadores de sus ejercicios e ítems (nivel 2 y 3). `{rotulo}` es el rótulo sin los dos puntos («Ejercicio 4», «4.a») y `{enunciado}`, el primer renglón de la consigna. Por defecto `{ "ejercicio": "{rotulo}" }`: todos los ejercicios con marcador, aunque la solución no lo tenga. Por ejemplo, `{ "ejercicio": "{rotulo}: {enunciado}", "item": "{rotulo}" }`. |
| `partes[].enIndice` | `false` para que una parte no figure en el índice (sigue teniendo marcador). |
| `partes[].sinCabecera` | `true`: las hojas de la parte no llevan cabecera, pie ni número (por ejemplo, la hoja de enlaces del reverso de la carátula). |
| `partes[].impar` | `false`: la parte sigue en la hoja que toque aunque haya `partesEnImpar` (así la hoja de enlaces queda en el reverso de la carátula). |
| `partes[].compacto` | Solo en el índice: `true` junta más los renglones, para que entre en una hoja menos. |

**Armarlo.** La pizarra no lee archivos del disco, así que los trabajos prácticos se
copian adentro antes de importarlo:

```
node herramientas/armar-cuadernillo.mjs "solucionarios/…/cuadernillo.json"
```

valida y escribe al lado `cuadernillo.armado.json` (no va al repositorio), que se importa
con «Importar solución (.json)». Con el servidor MCP alcanza con
`dibujar_en_pizarra` y la ruta del `cuadernillo.json`.

**PDF automático.** Con la pizarra local abierta (su servidor, no hace falta el navegador):

```
node herramientas/pdf-cuadernillo.mjs "solucionarios/…/cuadernillo.json" salida.pdf
```

abre Chrome (o Edge) sin ventana y con un perfil aparte, importa el cuadernillo, lo imprime
a PDF y le agrega los marcadores y los enlaces. Tarda unos minutos con todos los TP.

**Publicarlo.** El QR del cuadernillo apunta a la release `cuadernillo-matematica-1-2026-c2`
del repositorio, archivo `Solucionario-Matematica-1-2026-C2.pdf`. Para publicar una versión
nueva se reemplaza ese archivo en la misma release (`gh release upload … --clobber`): así el
QR impreso sigue llevando a la última versión.

**PDF con índice y marcadores, a mano.** «Imprimir / PDF» (los números de hoja del índice se
actualizan solos antes de imprimir, por si se agregaron hojas a mano) y después, en el
panel de Hojas A4, «Agregar marcadores y enlaces a un PDF…» con ese PDF: cada renglón del
índice pasa a ser un enlace a su hoja, y el panel de marcadores del lector muestra las
partes, los trabajos prácticos y sus ejercicios.

**Cabeceras.** En la pizarra, cada cabecera de una parte es un marco «Cabecera · T.P. 1…»
arriba de la primera hoja de la parte; se corrige como la general. En el panel de Hojas
A4, «Cabecera nueva desde esta hoja» agrega otra a mano, y «Sin cabecera en esta hoja»
saca la cabecera, el pie y el número de una hoja.
