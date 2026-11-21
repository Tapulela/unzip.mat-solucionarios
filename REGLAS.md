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
  "margenes": { "sup": 10, "inf": 10, "ext": 10, "lomo": 15 },
  "dobleFaz": true,
  "continuacion": true
}
```

- **Márgenes de las hojas**: lomo 15 mm, exterior 10 mm, superior 10 mm e inferior
  10 mm, con doble faz (el lomo cambia de lado en las hojas pares).

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
- **Los desarrollos algebraicos se parten entre hojas**: si un ejercicio no entra, se
  escribe lo que entra, la hoja termina con «(Continúa en la siguiente hoja)» y los
  pasos siguen en la otra. No es todo o nada: los bloques de pasos no llevan
  `"entero": true` (salvo los casos que piden ir juntos, como cada caso evaluado de
  una relación), así no quedan hojas casi vacías con solo una consigna.
- **No dejar espacios en blanco**: solo pasa entero a la hoja siguiente lo que no se
  puede partir (una consigna, un gráfico). Un cálculo largo de un generador lleva
  `"partir": true`.
- No se dejan medias hojas en blanco por un dibujo de la regla de los signos
  (generadores `inecuaciones2` y `racionales`): se parte entre un caso y el
  siguiente, y arriba de la hoja nueva se repite la cabecera (la inecuación con
  su llave y la regla, por ejemplo «+/+ ∨ −/−»), con el tallo de la llave bajando
  hasta el caso. La pizarra lo hace sola al importar.
- Una nota gris que explica lo que viene abajo (una tabla, un desarrollo) lleva
  `"unir": true`, para que no quede sola al pie de una hoja.
- Si un ejercicio o un ítem sigue en la hoja siguiente, se avisa en gris al pie de la hoja
  (`estilo.continuacion`): «(Continúa en la siguiente hoja)» o «(Continúa la consigna en
  la siguiente hoja)». Si la hoja siguiente empieza un ejercicio o un ítem nuevo, no se
  avisa: no hay nada que continúe.

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
- **Si la tabla no entra a lo ancho, sigue debajo** (o en la hoja siguiente) en otra
  tabla, que repite las columnas de las variables. Al pie de la tabla que se corta va,
  en gris, «(La tabla continúa)», en el mismo bloque de pasos que la tabla. Antes de la
  segunda tabla va `{ "texto": "Continuación de la tabla:", "color": "gris", "tam": "S",
  "unir": true, "continua": "" }` (sin aviso de hoja: ya avisa el pie de la tabla).

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
  (A ∪ (Aᶜ ∩ B) = A ∪ B, A ∩ (Aᶜ ∪ B) = A ∩ B). Vale igual en lógica proposicional
  ((p ∨ q) ∧ p ≡ p es absorción total) y en álgebra de Boole: nunca «absorción» sola.

## Demostraciones

- **Probar algo verdadero se hace con una demostración. Probar que algo es falso se
  hace con un contraejemplo**, y solo si no hay uno posible, con una demostración
  formal. Excepción: en las propiedades que son una igualdad (estructuras
  algebraicas), lo que no se cumple se muestra desarrollando los dos miembros hasta
  ver que son distintos.
- La demostración se escribe completa y como parte de la respuesta: la hipótesis es
  un paso explícito («Hipótesis: A ⊆ C y B ⊆ C»), después «Sea x ∈ …», cada paso con la
  definición o propiedad que usa, y al final la conclusión.
- Si la consigna pide demostrar y hay varios métodos, se elige uno y se aclara en gris
  que existen otros, nombrándolos: tabla de verdad, simplificación con las leyes del
  álgebra proposicional, razonamiento deductivo, mostrar que el bicondicional es una
  tautología. Si conviene, se dice por qué se eligió ese.
- **Inducción, paso 3**: la primera expresión del paso 3 es la igualdad completa para
  n = k + 1, con el objetivo escrito como miembro derecho («1 + … + (k + 1)² =
  (k + 1)(k + 2)(2k + 3)/6»), no un «Objetivo: …» aparte. Si no entra a lo ancho, ese
  renglón va más chico (un bloque de pasos con `"tam": "S"`, y el título «Paso 3» con
  `"unir": true` para que no quede separado). Después se desarrolla el miembro
  izquierdo, aplicando la hipótesis de inducción, hasta llegar al derecho.
- **Inducción, factorizar un polinomio de segundo grado**: si en el paso 3 aparece un
  polinomio de segundo grado que hay que factorizar (2k² + 3k + 1, k² + 4k + 4…), la
  factorización se hace como parte de la resolución, no se da hecha ni se deja para una
  nota: el desarrollo se corta en ese renglón, va un texto («Para factorizar 2k² + 3k + 1
  se buscan sus raíces con la fórmula cuadrática:», «Para factorizar k² + 4k + 4 se
  aplica trinomio cuadrado perfecto:» o «… se completa el cuadrado:») y un
  bloque de pasos con la factorización completa (sin `"entero"`: ocupa casi una hoja, y
  si no se puede partir deja hojas a medio llenar), y después el
  desarrollo sigue repitiendo el renglón cortado y «= …» con la nota «Reemplazar la
  factorización». Con la **fórmula cuadrática**: identificar a, b y c, la fórmula con
  los valores, las cuentas, las dos raíces (llave y ramas k₁, k₂) y la forma
  factorizada a(k − k₁)(k − k₂), distribuyendo a si hace falta (2(k + 1/2) = 2k + 1).
  **Completando el cuadrado**: escribir el término lineal como 2 · m · k, sumar y
  restar m², cuadrado de un binomio y resolver lo que queda. El orden para elegir el
  método está abajo («Factorizar un polinomio de segundo grado»).
  Debajo, en gris, que también se puede por los otros métodos y la verificación
  (desarrollar el producto y volver al polinomio).

## Factorizar un polinomio de segundo grado

Vale en cualquier ejercicio, no solo de inducción. Se usa el primer método que se pueda
aplicar, en este orden:

1. **Trinomio cuadrado perfecto** (k² + 4k + 4). Dos pasos: reescribir el polinomio
   como a² + 2ab + b² («= k² + 2 · k · 2 + 2²», nota «Reescribir como a² + 2ab + b²»),
   y la forma factorizada «= (k + 2)²» en un recuadro, con la nota «Trinomio cuadrado
   perfecto con a = k y b = 2: a² + 2ab + b² = (a + b)²» (o (a − b)² si el término del
   medio es negativo). a y b en los colores `a` y `b`. Nada más: sin buscar las bases
   ni verificar el doble producto aparte. Texto antes: «Para factorizar k² + 4k + 4 se
   aplica trinomio cuadrado perfecto:».
2. **Descomposición, caso 1**: ax² + bx + c con b = a + c o b = −(a + c)
   (2k² + 3k + 1, x² − 2x − 3). El nombre «caso 1» es el de la filmina de la cátedra
   (y del generador de factorización de la pizarra), no de una bibliografía. Texto
   antes: «Para factorizar 2k² + 3k + 1 se aplica descomposición: el término lineal se
   arma con a y c (b = a + c, 3 = 2 + 1):». Pasos: el polinomio; reescribir el término
   lineal como suma o resta de a y c («= 2k² + (2 + 1)k + 1», nota «Escribir 3k como
   (2 + 1)k»); aplicar la distributiva («= 2k² + 2k + k + 1»); sacar factor común en el
   primer grupo («= 2k(k + 1) + k + 1»), en el segundo («= 2k(k + 1) + 1(k + 1)», el 1
   se escribe) y el binomio común («= (k + 1)(2k + 1)», en un recuadro).
3. **Fórmula cuadrática**, en los demás casos (o completar el cuadrado).

En todos estos desarrollos, una fórmula va en la nota y no en un renglón propio:
una línea larga sin `izq` corre todas las notas del bloque hacia la derecha y se salen
de la hoja. Si el ejercicio usa un generador que factoriza solo (`inecuaciones2` lo
hace siempre con la fórmula cuadrática), la factorización por los métodos 1 o 2 se
escribe antes en un bloque de pasos, en el mismo tamaño que el generador, y al
generador se le pasa la inecuación ya factorizada («(x + 1)(x − 3) < 0»), con el
texto «Reemplazando la factorización, la inecuación queda:».

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
  «Definición general:» con la fórmula en el mismo renglón
  («∀x, y ∈ A: (x, y) ∈ R → (y, x) ∈ R», con R genérica), y «Definición aplicada:» con
  la fórmula en el mismo renglón (con el conjunto y el nombre de la relación del
  ejercicio). En el JSON, el rótulo lleva `"unir": true` y la fórmula, `"alLado": true`.
  Los nombres de las propiedades: reflexividad, arreflexividad,
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

## Estructuras algebraicas

- **Nombres de las estructuras de la cátedra** (no se usan «grupoide», «magma» ni
  «monoide» en el sentido de semigrupo con neutro):
  - Par ordenado (A, ∗):
    - **monoide**: ∗ es ley de composición interna (L.C.I.);
    - **semigrupo**: L.C.I. y asociativa;
    - **grupo**: L.C.I., asociativa, con neutro y con inverso para todo elemento;
    - **grupo abeliano**: grupo y además conmutativa.
  - Terna ordenada (A, +, ∗):
    - **anillo**: (A, +) es grupo abeliano, (A, ∗) es semigrupo y la segunda ley es
      distributiva con respecto a la primera, por izquierda y por derecha;
    - **anillo abeliano**: anillo y además ∗ es conmutativa;
    - **cuerpo**: (A, +) es grupo abeliano, (A − {e₊}, ∗) es grupo abeliano y ∗ es
      distributiva con respecto a + por izquierda y por derecha;
    - **álgebra de Boole**: (A, +) y (A, ∗) son semigrupos conmutativos con unidad,
      todo elemento tiene complemento y cada operación es distributiva con respecto
      a la otra.
- Si una estructura cumple propiedades de más que su nombre (por ejemplo, un
  semigrupo con neutro que no es grupo), se le da el nombre más alto que cumple y se
  dicen aparte las propiedades que tiene de más: «(S, ∗) es un semigrupo; además es
  conmutativa y tiene neutro, pero no es grupo».
- Los nombres que pide la consigna y no están en esta lista (anillo unitario, dominio
  de integridad) se usan igual, definidos en una nota para el estudiante.
- **Cada propiedad en su sección** (bloque `seccion`), con título («Análisis de la ley
  de composición interna», «Análisis de la propiedad asociativa», «Análisis de la
  propiedad conmutativa», «Análisis de la existencia de elemento neutro», «Análisis
  de la existencia de elemento inverso», «Análisis de la propiedad distributiva»), y
  al final de la sección su conclusión, para que se vea dónde termina una y empieza
  la otra. Orden: L.C.I., asociativa, conmutativa, neutro, inverso, distributiva.
- **Las secciones no se marcan con letra más grande**: el título va del tamaño del
  texto, subrayado, y el contenido con sangría y una línea vertical a la izquierda
  (eso lo dibuja el bloque `seccion`). Dentro de una propiedad, «Miembro izquierdo»,
  «Miembro derecho», «Elemento neutro por derecha»… son secciones anidadas. Las
  partes de un ejercicio («Primera parte: (ℤ, +) es un grupo abeliano») también.
- **La comparación final de los dos miembros va en un solo renglón**
  («a + b + c + ab = a + b + c + ab»), fuera de las secciones de los miembros.
- **Definición general y definición aplicada.** La definición general es la genérica,
  con un conjunto A y una operación ∗ («∀a, b, c ∈ A: (a ∗ b) ∗ c = a ∗ (b ∗ c)»); en
  una terna, + es la primera operación y ∗ la segunda («a ∗ (b + c) = (a ∗ b) + (a ∗ c)»).
  Después va «Definición aplicada:» con el conjunto y las operaciones del ejercicio.
  Los dos rótulos llevan la fórmula en el mismo renglón, como en relaciones binarias.
- **Miembro izquierdo y miembro derecho.** Si una propiedad es una igualdad, se
  plantea la igualdad, y cada miembro se desarrolla en su propia sección, con el
  título «Miembro izquierdo» o «Miembro derecho». Al final se comparan.
- **Conmutativa**: definición, la ecuación, el desarrollo de cada miembro por separado
  y, si se cumple, se reordena el miembro derecho hasta que quede igual al izquierdo.
  No se empieza por un miembro para llegar al otro.
- **Una propiedad que no se cumple se muestra desarrollando los dos miembros** hasta
  ver que son distintos (no con un contraejemplo numérico): «a + 3b + 3c ≠ a + 3b + 9c».
  Para el neutro o el inverso, se despeja y se muestra que el resultado depende del
  elemento o no está en el conjunto.
- **Neutro e inverso por derecha y por izquierda.** Se analiza primero por derecha
  («Elemento neutro por derecha»). Por izquierda:
  - neutro: si ∗ ya se probó conmutativa, se aclara que por eso no hace falta
    analizarlo por izquierda; si no, se analiza en su propia sección;
  - inverso: si ∗ ya se probó conmutativa o asociativa, se aclara que por esa
    propiedad no hace falta analizarlo por izquierda; si no es ni conmutativa ni
    asociativa, se dice que por eso hay que analizarlo, y se analiza en su propia
    sección.
  - Nunca «del otro lado»: se dice «analizando el elemento inverso por izquierda».
- **Si algún elemento no tiene inverso, no se cumple la existencia de elemento
  inverso**, y así se escribe en el resumen, aunque otros elementos sí lo tengan.
- **Resumen de propiedades** al final de cada estudio de una estructura: cada
  propiedad con su marca dibujada (✓ o ✗) y el nombre de la estructura en un recuadro.
- **Tablas de doble entrada** (tabla de una operación): item `tabla` con
  `"lineas": true`, para que tenga marco y grilla.

## Consignas que no se pueden cumplir

- No se reinterpreta la consigna, salvo que el error sea evidente y la corrección
  también. Si se pide algo que no se puede hacer, se resuelve por qué no se puede:
  por ejemplo, «no está definida la clase de equivalencia porque la relación no es de
  equivalencia, ya que no cumple la propiedad simétrica», o «no se puede probar que ∗
  es distributiva porque los dos miembros son distintos».

## Conjuntos por extensión en varios renglones

- Si un conjunto escrito por extensión ocupa más de un renglón, los renglones que
  siguen empiezan a la derecha de la llave de apertura, alineados con el primer
  elemento (en el JSON: `"rel": ""` y un espacio delante del primer elemento).
- Si los elementos tienen un orden elegido (por cantidad de elementos, de menor a
  mayor), se dice en una nota cuál es.

## Rectas reales

- Se dibujan con el estilo de **líneas** (`"estilo": "lineas"`), no rayado: se imprimen
  en blanco y negro. Lo mismo las rectas de cada caso en los generadores
  `inecuaciones2`, `racionales` y `valorAbsoluto`: `"estiloRecta": "lineas"` en `op`.
- Los números no se pueden pisar. Si dos extremos quedan muy cerca, se agranda la
  recta (`"largo": "larga"`) o cada intervalo va a su propia altura.
- Para decidir si un argumento es válido se arma la tabla de verdad de su forma
  [premisas] → conclusión: es válido si es tautología. Si es inválido, se muestra la
  fila que es contraejemplo y se nombra la falacia.

## Gráficos de funciones

- **Gráficos chicos**: el generador `funcion` va con `"tamano": "mini"` (unos 360 de
  ancho con los números), no a todo el ancho de la hoja. `"chico"` solo si la curva
  necesita más detalle.
- **Lo que acompaña al gráfico va a su lado**: los resultados cortos (Dom, Im,
  intervalos de crecimiento) van a la derecha del gráfico con `"alLado": "centro"`
  en el bloque del recuadro (o `true` para alinearlo arriba).
- **Paridad**: para ver si una función es par (o impar) se escribe la ecuación de la
  definición, f(−x) = f(x) (o f(−x) = −f(x)), se reemplaza en los dos miembros y se
  opera en los dos hasta ver que son iguales (✓). No se parte de f(−x) para llegar a
  f(x). Si no son iguales para todo x, se dice por qué y se da un contraejemplo.
- **Contraejemplo de paridad, como en relaciones binarias**: «Definición general:» con
  ∀x: x ∈ Dom f → f(−x) = f(x) en el mismo renglón, «Definición aplicada:» con el
  dominio y el nombre de la función, «La propiedad no se
  cumple. Lo demostramos con un contraejemplo…», el caso evaluado («x = 1 ⇒ 1 ∈ ℝ →
  f(−1) = f(1)», debajo los valores, V y F debajo de cada parte y el resultado F
  debajo del →) y al final «Para x = 1 la proposición es falsa, por lo tanto f no es
  par».
- **Rango (o imagen) con el dominio de la relación inversa**: se despeja x en función
  de y, un paso por renglón, y se ve para qué valores de y existe x dentro del dominio
  de la función (radicandos ≥ 0, denominadores ≠ 0, la condición de x de cada
  sección, un valor absoluto o una raíz nunca negativos). Ese dominio de la relación
  inversa es el rango. No se deduce mirando el gráfico.
- **Valor absoluto**: se dice de qué es «lo de adentro»: «lo de adentro del valor
  absoluto».
- **Sin referencia** cuando la función por tramos ya está escrita arriba
  (`"referencia": false`): la referencia muestra el código (`sqrt(x)`, `-1`).

## Números complejos

- **Operación con gráfico: el gráfico a la izquierda y la resolución a la derecha.** Si
  la consigna pide representar en el plano (de Argand), el bloque del generador
  `complejos` va primero y el desarrollo, en un solo bloque de pasos, con
  `"alLado": true`. Si el desarrollo no entra al lado con las notas a la derecha, las
  notas van arriba de cada renglón: la acción en un renglón y la expresión
  resultante en el de abajo (la pizarra lo hace sola).
- El gráfico va antes que el desarrollo para que nunca quede separado de su ítem (si
  va después, puede caer en la hoja del ítem siguiente).
- Si al lado del gráfico va un desarrollo largo, al lado va solo la primera parte (por
  ejemplo, el paréntesis) y el resto sigue debajo, en un bloque que se puede partir
  entre hojas: así el bloque del gráfico entra en lo que queda de la hoja.
- **Raíces n-ésimas** con el generador `raicesC`, con `"partir": true` (el cálculo se
  reparte entre hojas, sin dejar hojas a medio llenar) y `"columnas": 2` (las raíces en
  dos columnas, si entran a lo ancho).
- Cociente: se multiplica arriba y abajo por el conjugado del denominador; arriba, la
  distributiva y abajo (c + di)(c − di) = c² + d²; después i² = −1, agrupar y separar
  la parte real y la imaginaria.

## Aprovechar el espacio

El solucionario se arma desde el principio para ocupar pocas hojas: lo angosto va en
dos columnas, con `"alLado": true` en el segundo bloque (o en la segunda sección). Si
algo no entra a lo ancho, la pizarra lo deja debajo con un aviso; en ese caso se
vuelve a una columna.

- **Recuadros cortos en un mismo renglón**: dos resultados que se leen juntos («f
  decrece en …» y «f crece en …», «Dom = ℝ» e «Im = …») van uno al lado del otro, con
  `"alLado": true` en el segundo. Los recuadros de resultado seguidos van de a dos.
- **Ítems y casos angostos, de a dos**: dos ítems seguidos con desarrollos cortos
  (3.1 y 3.2), los casos de una variable (x = 1, x = 2), los valores absolutos de un
  ejercicio y las secciones paralelas («Miembro izquierdo» y «Miembro derecho»,
  la generatriz de dos números, dos figuras) van uno al lado del otro.
- **Notas arriba en las dos columnas**: si un bloque de pasos al lado de otro no
  entra con las notas a la derecha, va con `"notas": "arriba"`. En dos secciones
  lado a lado, las dos llevan las notas arriba, así se leen igual.
- **Módulo y argumento lado a lado** (números complejos): la frase del cuadrante va
  antes y debajo, el cálculo del módulo (ρ o |z|) a la izquierda y el del argumento
  (α, φ) a la derecha.
- **La recta numérica al lado del resultado**: el gráfico de la solución va a la
  derecha del recuadro «S = …», con `"alLado": "centro"` (centrado en vertical).
- **Rótulos cortos**: «Reemplazar» (no «Reemplazar los valores»), «Definición general:»
  y «Definición aplicada:» con la fórmula en el mismo renglón, «Forma polar del
  resultado.» (sin «Módulo:»). El rótulo no repite lo que ya dice el título.
- No se dejan medias hojas en blanco: si un gráfico no entra al pie, se achica o se
  pone al lado del texto antes de pasarlo entero a la hoja siguiente.
- **Cuadernillo sin hojas en blanco en los preliminares**: el Contenido va al dorso
  de la Presentación y la Introducción al dorso del índice (`"impar": false`), y el
  índice va compacto (`"compacto": true`).

## Resultados

- El resultado final va en un recuadro y se escribe completo: «p ∧ q = F», no solo «F».
- **El recuadro encierra la igualdad entera** («A = B», «A ∩ B = {1, 2}»), nunca solo el
  miembro derecho o un símbolo. En el JSON, el renglón final lleva toda la igualdad en
  `der` (sin `izq`); si el desarrollo terminó en «= …», se agrega un renglón final con
  la igualdad completa.
- En una evaluación con valores dados, cada paso hace una sola cosa (reemplazar, negar,
  resolver un paréntesis), con su nota.

## Pasos de un desarrollo

- **Primero la acción y después la expresión donde se hace.** La nota anuncia el paso:
  va al lado del renglón anterior (o arriba del renglón, si las notas van arriba) y la
  expresión de abajo muestra el resultado. Nunca una nota al lado de la expresión
  donde ya se hizo lo que dice.
- **El primer renglón es la operación igualada a su reemplazo**: «z₁ + z₂ = (4 + 5i) +
  (3 − 2i)», sin nota (el reemplazo se ve en el mismo renglón), y los pasos siguen
  abajo con «= …». En el JSON, la operación va en `izq` y el reemplazo en `der`; si la
  operación lleva una fracción dibujada (no entra en `izq`), va toda en `der`:
  `[{ "frac": ["z₁", "z₃"] }, " = ", { "frac": [...] }]`. No se hace cuando el primer
  renglón ya son números (no hay nada que reemplazar).

- **Nunca más de un paso por renglón**, en todos los temas: ni cadenas como
  «(1 ∗ 1) ∗ 0 = 2 ∗ 0 = 4», ni dentro de un párrafo de texto. Cada igualdad del
  desarrollo va en su propio renglón de `pasos`, con su nota.
- **Factor común en su propio renglón**: al sacar factor común, lo de adentro del
  paréntesis queda sin resolver («90 · (1 + 7) − 702») y se resuelve en el renglón
  siguiente («90 · 8 − 702»). Lo mismo con la distributiva, el signo − delante de un
  paréntesis y el cambio de orden de los términos (propiedad conmutativa): cada uno
  es un renglón.
- **Identidad de Bézout**: el cálculo va en su propia sección, «Identidad de
  Bézout», separada de la del máximo común divisor, así queda claro dónde empieza.

- **Una operación en los dos miembros se escribe en los dos, y en color en los dos**
  (propiedad uniforme): «x² + 1 − 1 = 0 − 1», con los dos «− 1» en verde. Como `izq` no
  admite colores, esos renglones van enteros en `der`, con `"rel": ""` y espacios
  delante para que los «=» queden alineados.
- **Nunca se multiplica en cruz.** Para sacar los denominadores de una igualdad entre
  fracciones se aplica la propiedad uniforme una vez por cada denominador: se
  multiplican los dos miembros por el primer denominador (en color en los dos), se
  simplifica, y después lo mismo con el otro. Si el denominador tiene una variable, se
  aclara que no puede valer 0.
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

## Álgebra de Boole

- **Notación**: el complemento se escribe con prima (A', (A + B)'), porque la barra
  arriba no se puede escribir en un renglón; se aclara una vez en una nota. El producto
  va con punto y sin espacios (A·B'·C) y la suma con espacios (A·B + C).
- **Tablas de verdad** con el item `tabla` de los pasos (no con el generador `tabla`, que
  escribe ∧, ∨ y ¬): `"lineas": true`, `"alinear": "centro"` y `"columnasFijas"` con la
  cantidad de variables, para que la línea gruesa quede después de ellas. Valores 0 y 1,
  la primera fila con todo en 0 (así el número de cada fila es el del minitérmino), una
  columna por subexpresión y la de la función en azul. Las celdas dejan a lo sumo el
  ancho de un carácter de margen a cada lado (la tabla queda angosta). Si aun así no
  entra a lo ancho, se parte como se explica en «Tablas de verdad».
- **Simplificaciones**: un paso por renglón, lo que cambia en violeta y la nota con el
  nombre de la ley y la ley escrita («Absorción parcial: A + A'·B = A + B»). Los nombres
  son los del manual complementario: identidad, complemento, idempotencia,
  conmutatividad, asociatividad, distributividad, inversa distributiva, De Morgan,
  elementos dominantes, absorción total, absorción parcial, involución y teorema del
  consenso.
- **Forma estándar**: a cada producto que le falta una variable X se lo multiplica por
  1 (identidad) y el 1 se cambia por X + X' (complemento); en un producto de sumas, se
  suma 0 y se cambia por X·X'. Al final, la forma con Σm(…) o ΠM(…).
- **Verificar una ecuación**: «Miembro izquierdo» y «Miembro derecho» en secciones, y la
  comparación en un renglón. Si los miembros simplificados no son iguales, se escriben
  los dos en forma estándar para mostrar que son distintos (no con un contraejemplo).
- **Circuitos con compuertas**: se dibujan con el generador `boole` (solo `circuito`). El
  generador escribe la ecuación arriba del circuito; si el circuito es parte de la
  consigna, ese texto hay que borrarlo a mano en la pizarra.
