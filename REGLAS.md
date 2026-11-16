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
  "continuacion": true
}
```

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

## Demostraciones

- Si la consigna pide demostrar y hay varios métodos, se elige uno y se aclara en gris
  que existen otros, nombrándolos: tabla de verdad, simplificación con las leyes del
  álgebra proposicional, razonamiento deductivo, mostrar que el bicondicional es una
  tautología. Si conviene, se dice por qué se eligió ese.
- Para decidir si un argumento es válido se arma la tabla de verdad de su forma
  [premisas] → conclusión: es válido si es tautología. Si es inválido, se muestra la
  fila que es contraejemplo y se nombra la falacia.

## Resultados

- El resultado final va en un recuadro y se escribe completo: «p ∧ q = F», no solo «F».
- En una evaluación con valores dados, cada paso hace una sola cosa (reemplazar, negar,
  resolver un paréntesis), con su nota.

## Circuitos

- El circuito se dibuja con el generador `tabla` (`mostrarTabla: false`,
  `interruptores: true`). El generador escribe la fórmula arriba del circuito; si el
  circuito es parte de la consigna, ese texto hay que borrarlo a mano en la pizarra.
