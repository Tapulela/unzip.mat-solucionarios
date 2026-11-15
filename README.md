# unzip.mat · solucionarios

Trabajos prácticos de matemática resueltos paso a paso, para imprimir en hojas A4.

Cada resolución está escrita como un archivo `solucion.json`. La pizarra
[unzip.mat](https://github.com/Tapulela/unzip.mat) lo dibuja en hojas A4 con raíces y
fracciones dibujadas, notas en cada paso, colores y gráficos. Ahí se corrige a mano y se
exporta a PDF.

## Cómo está organizado

```
solucionarios/
  <materia>/<institucion>/<año>/<tp>/
    solucion.json       ← la resolución (lo que se edita y se revisa)
    solucion.excalidraw ← cómo quedó en la pizarra, con las correcciones a mano
    solucion.pdf        ← lista para imprimir
FORMATO.md              ← cómo se escribe un solucion.json
herramientas/validar.mjs
.claude/skills/resolver-tp/  ← skill para que Claude arme el borrador
```

## Cómo se arma un solucionario

1. **Borrador.** A mano o con una IA. Con [Claude Code](https://claude.com/claude-code)
   abierto en este repositorio, alcanza con pedir «resolvé este TP» y adjuntar el
   enunciado: la skill `resolver-tp` escribe el `solucion.json`, verifica las cuentas y
   lo valida.
2. **Validar:** `node herramientas/validar.mjs` (requiere Node 18 o más nuevo).
3. **Importar en la pizarra:** Generadores → Impresión → «Importar solución (.json)».
4. **Corregir** lo que haga falta, guardar el `.excalidraw` y exportar el PDF desde el
   panel de Hojas A4 («Imprimir / PDF»).
5. **Pull request**, con `meta.estado` en `revisado` cuando alguien lo controló.

Si encontrás un error en un solucionario, abrí un issue con el TP, el ejercicio y qué
está mal.

## Derechos

- **Las resoluciones** se publican con licencia
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
- **Los enunciados** son de sus autores. Se cita solo lo necesario para entender cada
  resolución, con la fuente en `meta.fuente`. Si un enunciado es largo, se reescribe con
  otras palabras conservando los datos. Si sos autor de un enunciado y querés que lo
  saquemos, abrí un issue.
- **Exámenes:** se publican recién después de la fecha del examen.
- Nada de nombres ni datos de alumnos.
