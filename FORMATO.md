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
| `estilo.continuacion` | `true` para avisar en gris, al pie de la hoja, cuando un ejercicio sigue en la hoja siguiente: «(Continúa en la siguiente hoja)», o «(Continúa la consigna en la siguiente hoja)» si se corta un enunciado. Un enunciado nunca se corta si entra en una hoja. |

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
| `{ "salto": true }` | Empieza una hoja nueva. |
| `"unir": true` (en un bloque de texto) | El texto no se separa de lo que le sigue: si no entra, pasa a la hoja siguiente junto con el bloque de abajo. Sirve para «La tabla sigue:». |
| `"continua": "..."` (en cualquier bloque) | Con `estilo.continuacion`, el aviso que se escribe si la hoja se corta justo antes de este bloque. Por ejemplo, `"La tabla sigue en la siguiente hoja"`. |
| `{ "espacio": 2 }` | Deja lugar libre (en renglones), por ejemplo para completar a mano. |

### Renglones de `pasos`

```json
{ "izq": "P(x)", "rel": "=", "der": [items], "nota": "Sacar factor común 2", "notaColor": "producto" }
```

| Campo | Qué es |
|---|---|
| `izq` | Lo que va a la izquierda de la relación (`P(x)`, `x₁,₂`). Los `=` de un bloque quedan alineados. |
| `rel` | La relación (`=`, `<`, `⇔`…). Si hay `izq` y falta `rel`, es `=`. Con `rel` y sin `izq` sale un renglón que sigue al anterior: `  = …`. Sin las dos, el renglón empieza en el margen. |
| `der` | La expresión: un item o una lista de items. Un renglón que es solo un texto o una lista vale como `der`. |
| `nota` | Qué se hace en **este** paso: un texto o una lista de renglones. Se dibuja a la derecha del renglón **anterior**, o sea, se anuncia antes de hacerlo. |
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
| raíz dibujada | `{ "raiz": radicando }`. En textos, `√25`, `√(a + b)` y `√[3]8` también se dibujan. |
| marca dibujada | `{ "marca": "ok" }` (✓ verde) o `{ "marca": "mal" }` (✗ roja) |
| sistema | `{ "sistema": [fila, fila] }`, con una llave a la izquierda |
| tabla | `{ "tabla": [[celda, celda], [celda, celda]] }` |

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

`recta`, `funcion`, `tabla`, `boole`, `conjuntos`, `relaciones`, `estructuras`,
`combinatoria`, `mcm`, `valorAbsoluto`, `inecuaciones2`, `racionales`, `factorizacion`,
`raicesC`, `complejos`, `razonamientos`, `simpLogica`, `simpBoole`, `simpConjuntos` y
`plantillas`. En `op` van las opciones del generador. Lo que no se pone queda como en el
panel. La forma más fácil de averiguar las opciones es armar el gráfico en la pizarra,
seleccionarlo y mirar `customData.pizarra.opciones` en el archivo `.excalidraw`.

Ejemplo, una recta real con un intervalo:

```json
{ "generador": "recta", "op": { "filas": [{ "texto": "(−1, 2)", "color": "#1971c2" }],
  "mostrarUnion": false, "mostrarResultado": false, "titulos": false, "largo": "corta" } }
```

## Reparto en hojas

La pizarra crea hojas A4 nuevas, a la derecha de lo que ya haya, con los márgenes, la
escala y el doble faz del panel de Hojas A4. Cada bloque se corta en renglones y los
renglones pasan a la hoja siguiente cuando no entran. Un título o un enunciado nunca
queda solo al pie de una hoja.

Si un renglón es más ancho que el área útil, al importar aparece un aviso. En ese caso
conviene partir el paso, acortar la nota o usar `"tam": "S"`.

Un ejemplo completo está en
[`solucionarios/_ejemplo/tp-ejemplo/solucion.json`](solucionarios/_ejemplo/tp-ejemplo/solucion.json).
