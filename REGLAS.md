# Reglas de las resoluciones

Criterios que fueron pidiendo los docentes al revisar los solucionarios. Valen para
todas las resoluciones nuevas, además de lo que dice [FORMATO.md](FORMATO.md) sobre el
formato del archivo. Si una regla nueva contradice una de acá, se actualiza este
documento.

## Consigna y respuesta

- **Siempre se escribe la consigna**: el enunciado de cada ejercicio y el de cada ítem,
  y debajo, la respuesta. Nunca la respuesta sola.
- El texto de la consigna se copia del trabajo práctico tal cual (es material del
  docente que pide el solucionario), salvo que sea muy largo.
- **Las respuestas van en azul** (`"color": "azul"`): los textos de respuesta, las
  proposiciones simples de una traducción y el resultado en recuadro.
- Las explicaciones de apoyo (qué es una tautología, por qué se eligió un método,
  otra forma posible de escribir el resultado) van en **gris y chicas**
  (`"color": "gris", "tam": "S"`).
- **Toda explicación de apoyo empieza con «Nota para el estudiante:»**, para que impresa
  en blanco y negro se distinga de la consigna y de la respuesta.
- Lo que es parte de la respuesta **no** es una nota: los pasos de una demostración
  (la hipótesis, «sea x ∈ …», la conclusión), las justificaciones que pide la consigna
  y los títulos de sus partes van en la respuesta, no en gris.
- **Cada ítem con su respuesta.** Si una consigna enumera varios ítems en un renglón
  («1) …, 2) …, 3) …»), no se copian todos juntos: cada ítem va en su propio renglón con
  su respuesta al lado o debajo. Si el trabajo práctico los nombra con letras, cada
  uno es un ítem del JSON. Los datos de la consigna (los conjuntos A, B, C…) van uno
  por renglón, con un renglón libre entre ellos si son largos.
- **Ejercicios en partes.** Si hay que probar o resolver dos cosas (por ejemplo
  «C ⊂ A y A ≠ C»), cada una lleva un título («Primera parte: C ⊆ A») y termina con su
  conclusión, de modo que se vea dónde empieza y dónde termina cada análisis.

## Lenguaje

- **Palabras antes que símbolos en el texto.** En las oraciones se escriben los
  conectores con palabras («y», «porque», «dado que»), no con comas, dos puntos o
  flechas. Los dos puntos después de una expresión («A ≠ C: 3 ∈ A…») se confunden con
  «tal que» o «para todo»: se escribe «A ≠ C dado que 3 ∈ A…». El lenguaje formal de la
  materia (∈, ⊆, ∪, ⇒, ¬…) sí se usa, porque es parte de lo que se aprende.
- Tampoco «:» para dividir: se escribe «6 = 2 · 3» o «6 dividido 2».
- **Abreviaturas parejas.** Si se abrevian nombres, todas las abreviaturas tienen la
  misma cantidad de letras (Pr, In, Po; no P, I, Po).

## Interpretación literal (traducciones y lógica proposicional)

- **Se traduce lo que está escrito, no lo que «tiene más sentido».** La cátedra valora
  la interpretación literal del enunciado por encima de la que surge de comprender el
  texto o de lo que sería lógicamente razonable. Por ejemplo: «pierde» es su propia
  proposición simple, no ¬«gana» (puede haber empate).
- **Disyunciones:** un «o» solo es ∨. «O… o…» y «o bien… o bien…» son disyunción
  excluyente (⊻), también en los argumentos (por ejemplo, «O vamos al cine o al
  restaurante» es p ⊻ q).
- **Qué es proposición:** un enunciado con variables, como «x + 5 = 10», no es
  proposición por ser una proposición abierta (su valor de verdad depende de x). Una
  negación («No es cierto que…») es una proposición compuesta.
- No se agregan aclaraciones del tipo «también vale…» o «si se entiende que…» con otra
  interpretación posible: se da una sola respuesta, la literal.
- Las traducciones al lenguaje natural son una sola oración, sin variantes entre
  paréntesis.

## Estilo de la consigna y numeración

Se usa este `estilo` en todas las resoluciones:

```json
"estilo": {
  "fuente": "normal", "tam": "M", "notas": true,
  "fuenteEnunciado": "codigo",
  "tamEnunciado": 22,
  "numeracion": { "ejercicio": "Ejercicio {n}:", "item": "{n}.{i}" },
  "sangriaEnunciado": 24,
  "continuacion": true
}
```

- Los renglones de la consigna que siguen al primero llevan una sangría chica (24), no
  la del ancho de «Ejercicio 4:».
- **Los datos de la consigna van en renglones separados**: si la consigna define dos o
  más conjuntos o condiciones («A = … y B = …»), cada uno va en su renglón (`\n` en el
  enunciado), en vez de seguir en prosa.

- La consigna va en fuente de código (Cascadia), un poco más grande que el texto de la
  resolución (22 contra 20), pero no tamaño de título.
- Los ejercicios se rotulan «Ejercicio 1:», «Ejercicio 2:»…
- Los ítems son subítems del ejercicio: «4.a», «4.b»… si el trabajo práctico los
  nombra con letras, y «4.1», «4.2»… si los numera o si no les pone nombre (se numeran
  de izquierda a derecha y de arriba hacia abajo). En `items[].numero` va la letra o el
  número tal como figura en el trabajo práctico.

## Cabecera y pie de página

- Toda resolución lleva cabecera y pie (`cabecera` y `pie` en la raíz del JSON).
- Cabecera: la materia y el trabajo práctico, por ejemplo
  `"Matemática 1\nT.P. 1 - Lógica proposicional - Año 2026 - Cuatrimestre 2"`. Si no hay
  nada que poner, va vacía (`""`), pero va.
- Pie: la numeración de la hoja sobre el total, `"Hoja {n} de {total}"`.

## Saltos de hoja

- Una consigna no se corta entre dos hojas (la pizarra la pasa entera a la hoja
  siguiente).
- Una nota gris que explica lo que viene abajo (una tabla, un desarrollo) lleva
  `"unir": true`, para que no quede sola al pie de una hoja.
- Si un ejercicio sigue en la hoja siguiente, se avisa en gris al pie de la hoja
  (`estilo.continuacion`): «(Continúa en la siguiente hoja)» o «(Continúa la consigna en
  la siguiente hoja)».

## Tablas de verdad

- Se arman con el generador `tabla` de la pizarra, no con el item `tabla` de los
  pasos: llevan marco, una línea gruesa después de las columnas de las variables y la
  columna de la fórmula pedida en azul.
- Van paso a paso: una columna por subfórmula, en el orden en que se resuelven. Las
  columnas se dan explícitas en `filas`, con `intermedias: false`; las intermedias en
  tinta (`#1e1e1e`) y la de la fórmula en azul (`#1971c2`). Sin título
  («Tabla de verdad»).
- Primera fila con todo verdadero; valores V y F.
- Debajo de la tabla, en azul: «fórmula: Tautología» (o Contingencia, o Contradicción),
  aunque la consigna no pida clasificar.
- **Si la tabla no entra a lo ancho, sigue debajo** en otra tabla, que repite las
  columnas de las variables. Antes de la segunda tabla va
  `{ "texto": "Continuación de la tabla:", "color": "gris", "tam": "S", "unir": true,
  "continua": "La tabla sigue en la siguiente hoja" }`.

## Nombres de las leyes del álgebra proposicional

- Sacar factor común (p ∧ q) ∨ (p ∧ r) ≡ p ∧ (q ∨ r): **inversa distributiva** (no
  «distributiva»). «Distributiva» es solo el sentido en que se reparte.
- p ∨ ¬p ≡ V: **ley de complemento** (también llamada ley de tercero excluido).
- p ∧ ¬p ≡ F: **ley de complemento** (también llamada ley de contradicción).
- En la nota de cada paso, el nombre de la ley y la ley escrita, por ejemplo
  «Ley de complemento: q ∨ ¬q ≡ V».

## Nombres de las leyes del álgebra de conjuntos

- La absorción se nombra siempre con su tipo: **absorción total**
  (A ∪ (A ∩ B) = A, A ∩ (A ∪ B) = A) o **absorción parcial**
  (A ∪ (Aᶜ ∩ B) = A ∪ B, A ∩ (Aᶜ ∪ B) = A ∩ B).

## Demostraciones

- **Probar algo verdadero se hace con una demostración. Probar que algo es falso se
  hace con un contraejemplo**, y solo si no hay uno posible, con una demostración
  formal.
- La demostración se escribe completa y como parte de la respuesta: la hipótesis es
  un paso explícito («Hipótesis: A ⊆ C y B ⊆ C»), después «Sea x ∈ …», cada paso con la
  definición o propiedad que usa, y al final la conclusión.
- Si la consigna pide demostrar y hay varios métodos, se elige uno y se aclara en gris
  que existen otros, nombrándolos: tabla de verdad, simplificación con las leyes del
  álgebra proposicional, razonamiento deductivo, mostrar que el bicondicional es una
  tautología. Si conviene, se dice por qué se eligió ese.

## Relaciones binarias

- **Qué se busca, en palabras simples**: antes de calcular, se dice qué pares forman la
  relación con palabras de todos los días, por ejemplo «Todos los elementos del producto
  cartesiano A × B donde la suma del primer elemento (x) más el segundo elemento (y) sea
  menor o igual a 12».
- **Propiedades que se analizan**: reflexiva, simétrica, antisimétrica y transitiva.
  Arreflexiva, asimétrica y atransitiva se analizan solo si no se cumple la propiedad
  correspondiente (si R es reflexiva, no se analiza si es arreflexiva), salvo que la
  consigna la pida.
- Se dice **arreflexiva**, nunca «irreflexiva».
- **Análisis de una propiedad**: título «Análisis de la propiedad simétrica», después
  «Definición general de simetría:» y la fórmula en un renglón aparte
  («∀x, y ∈ A: (x, y) ∈ R → (y, x) ∈ R», con R genérica), y «Definición aplicada en el
  contexto de este ejercicio:» con la fórmula en otro renglón (con el conjunto y el
  nombre de la relación del ejercicio). Los nombres: reflexividad, arreflexividad,
  simetría, asimetría, antisimetría, transitividad, atransitividad. El condicional se
  escribe «→»; «⇒» se usa para «reemplazando queda».
- **La reflexividad se define con una implicación**: ∀x: x ∈ A → (x, x) ∈ R (y la
  arreflexividad, ∀x: x ∈ A → (x, x) ∉ R). Cada caso evalúa también x ∈ A.
- Cada caso evaluado va en su propio bloque de pasos con `"entero": true`, para que la
  proposición y sus valores no queden en hojas distintas.
- **Si la propiedad se cumple (sobre un conjunto finito)**: se evalúa caso por caso, como
  en el pizarrón: «x = 1, y = 2 ⇒ (1, 2) ∈ R → (2, 1) ∈ R», debajo el valor de cada
  parte centrado bajo ella (V en verde, F en rojo) con el conector, y debajo el
  resultado bajo el conector principal. Con ∧ hay un renglón más (primero el valor del
  ∧). Se muestran los dos primeros casos, «…» y el último caso, y la conclusión «De esta
  forma se verifica la proposición para cada valor de x e y, por lo tanto R es
  simétrica».
- Una nota para el estudiante aclara que este método solo sirve cuando la relación es
  sobre un conjunto finito y la propiedad se cumple en todos los casos.
- **Si una propiedad no se cumple**: primero se dice que no se cumple y que se
  demuestra con un contraejemplo; después el caso evaluado igual que los otros, con
  valores explícitos de x, y (z) que dan F; y al final «Para x = 3 e y = 1 la proposición
  es falsa, por lo tanto R no es simétrica».
- Los valores se alinean con espacios calculados con el ancho de la fuente (Nunito M:
  espacio 5,2, dígitos 12; ∈ ≈ 13,7, → ≈ 20,8, ⇒ ≈ 17,5, medidos en la pizarra).
- En los dígrafos, la reflexividad se explica como «cada vértice tiene un lazo consigo
  mismo».

## Conjuntos por extensión en varios renglones

- Si un conjunto escrito por extensión ocupa más de un renglón, los renglones que
  siguen empiezan a la derecha de la llave de apertura, alineados con el primer
  elemento (en el JSON: `"rel": ""` y un espacio delante del primer elemento).
- Si los elementos tienen un orden elegido (por cantidad de elementos, de menor a
  mayor), se dice en una nota cuál es.

## Rectas reales

- Se dibujan con el estilo de **líneas** (`"estilo": "lineas"`), no rayado: se imprimen
  en blanco y negro.
- Los números no se pueden pisar. Si dos extremos quedan muy cerca, se agranda la
  recta (`"largo": "larga"`) o cada intervalo va a su propia altura.
- Para decidir si un argumento es válido se arma la tabla de verdad de su forma
  [premisas] → conclusión: es válido si es tautología. Si es inválido, se muestra la
  fila que es contraejemplo y se nombra la falacia.

## Resultados

- El resultado final va en un recuadro y se escribe completo: «p ∧ q = F», no solo «F».
- **El recuadro encierra la igualdad entera** («A = B», «A ∩ B = {1, 2}»), nunca solo el
  miembro derecho o un símbolo. En el JSON, el renglón final lleva toda la igualdad en
  `der` (sin `izq`); si el desarrollo terminó en «= …», se agrega un renglón final con
  la igualdad completa.
- En una evaluación con valores dados, cada paso hace una sola cosa (reemplazar, negar,
  resolver un paréntesis), con su nota.

## Pasos de un desarrollo

- **Una operación en los dos miembros se escribe en los dos, y en color en los dos**
  (propiedad uniforme): «x² + 1 − 1 = 0 − 1», con los dos «− 1» en verde. Como `izq` no
  admite colores, esos renglones van enteros en `der`, con `"rel": ""` y espacios
  delante para que los «=» queden alineados.
- **Definición y después reemplazo.** Si se usa una definición (A Δ B, A − B, Aᶜ), primero
  se escribe la definición y en el renglón siguiente se reemplaza.
- **Reemplazos alineados**: lo que se reemplaza se escribe en el renglón de abajo,
  justo debajo de lo reemplazado, y lo demás queda igual. Si lo nuevo es más corto, se
  agregan espacios para que lo que sigue no se corra; si es más largo, se alinea con el
  signo igual. Para eso el desarrollo empieza con la expresión sola en un renglón
  (`"rel": ""`) y los reemplazos van en el renglón «= …» de abajo. Los espacios se
  calculan con el ancho real de la fuente (en Nunito tamaño M, un espacio mide 5,2 y
  cada dígito 12).
- **El signo igual alineado**: entre lo de la izquierda y el «=» no queda un hueco. Si
  los miembros izquierdos tienen distinto largo, se tabula antes («   x = 6» debajo de
  «23 = 17 + x»). Un rótulo («Rojas:») va en su propio renglón, no a la izquierda de la
  igualdad.
- **Un signo delante de una fracción dibujada lleva un espacio** (`"− "` antes del
  item `frac`): pegado a la raya de fracción queda feo.
- **Las cuentas simples no llevan nota** (sumar o restar números, «Sumar 3 + 9 + 5»). Sí
  la llevan si la nota agrega una interpretación («Sumar todas las zonas», «Restar del
  total»).
- El complemento se plantea también por comprensión, negando la condición:
  Bᶜ = {x ∈ ℝ : ¬(1 ≤ x)} = {x ∈ ℝ : 1 > x}.

## Circuitos

- El circuito se dibuja con el generador `tabla` (`mostrarTabla: false`,
  `interruptores: true`). El generador escribe la fórmula arriba del circuito; si el
  circuito es parte de la consigna, ese texto hay que borrarlo a mano en la pizarra.
