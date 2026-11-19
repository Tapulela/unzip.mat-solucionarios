# unzip.mat · solucionarios

Trabajos prácticos de matemática resueltos paso a paso, para imprimir en hojas A4.

Cada resolución está escrita como un archivo `solucion.json`. La pizarra
[unzip.mat](https://github.com/Tapulela/unzip.mat) lo dibuja en hojas A4 con raíces y
fracciones dibujadas, notas en cada paso, colores y gráficos. Ahí se corrige a mano y se
exporta a PDF.

## Cómo está organizado

```
solucionarios/
  <materia>/<institucion>/<año> - cuatrimestre <n>/<tp>/
    solucion.json       ← la resolución (lo que se edita y se revisa)
    solucion.excalidraw ← cómo quedó en la pizarra, con las correcciones a mano
    solucion.pdf        ← lista para imprimir
  <materia>/<institucion>/<año> - cuatrimestre <n>/cuadernillo.json
                        ← todos los TP juntos: carátula, índice, cabecera por TP
FORMATO.md              ← cómo se escribe un solucion.json (y un cuadernillo)
herramientas/validar.mjs
herramientas/armar-cuadernillo.mjs ← arma el cuadernillo para importarlo
herramientas/pdf-cuadernillo.mjs   ← genera el PDF del cuadernillo (con marcadores y enlaces)
mcp/servidor.mjs        ← servidor MCP (validar, guardar, dibujar en la pizarra)
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

## Servidor MCP

`mcp/servidor.mjs` es un servidor [MCP](https://modelcontextprotocol.io) que le da a
una IA estas herramientas:

| Herramienta | Qué hace |
|---|---|
| `formato_solucion` | Devuelve `FORMATO.md` y el ejemplo completo. |
| `validar_solucion` | Errores y avisos de estilo de una solución, sin dibujarla. |
| `listar_solucionarios` / `leer_solucion` | Recorren el repositorio. |
| `guardar_solucion` | Valida y guarda en `solucionarios/<ruta>/solucion.json`. No pisa un archivo que ya existe salvo que se le pida, y no hace commit. |
| `dibujar_en_pizarra` | Dibuja la solución en la pizarra abierta y devuelve una imagen de cada hoja A4, más los avisos (renglones que se salen de la hoja). Si se vuelve a dibujar la misma solución, reemplaza la versión anterior. |
| `ver_pizarra` | Imágenes de las hojas, por ejemplo para ver lo que el docente corrigió a mano. |
| `estado_pizarra` | Qué hojas hay en la pizarra y de qué solución es cada una. |

Para dibujar, la pizarra tiene que estar abierta con su servidor local (`node
servidor.js` o «Iniciar pizarra.bat»). Si hay varias ventanas, dibuja en la que se usó
por última vez. Si la pizarra no está en `http://127.0.0.1:3000`, se cambia con la
variable `PIZARRA_URL`.

**Instalar:** `npm install` en este repositorio. Requiere Node 18 o más nuevo.

**Claude Code:** ya está configurado en `.mcp.json`. Al abrir Claude Code en esta
carpeta, pregunta si querés habilitar el servidor `unzip-mat`.

**Claude Desktop** (u otro cliente MCP): agregar en su configuración
(`claude_desktop_config.json`), con la ruta donde clonaste el repositorio:

```json
{
  "mcpServers": {
    "unzip-mat": {
      "command": "node",
      "args": ["C:/ruta/a/unzip.mat-solucionarios/mcp/servidor.mjs"]
    }
  }
}
```

## Derechos

- **Las resoluciones** se publican con licencia
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
- **Los enunciados** son de sus autores. Se cita solo lo necesario para entender cada
  resolución, con la fuente en `meta.fuente`. Si un enunciado es largo, se reescribe con
  otras palabras conservando los datos. Si sos autor de un enunciado y querés que lo
  saquemos, abrí un issue.
- **Exámenes:** se publican recién después de la fecha del examen.
- Nada de nombres ni datos de alumnos.
