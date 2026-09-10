# FERRETERIA Y HERRAMIENTAS MILLAN S.A.S. — sitio web

Sitio de una página: base clara de papel, bandas oscuras, el naranja del logo
como único acento y tipografía condensada de cartel de ferretería. El catálogo
se recorre con un riel de categorías a la izquierda y un buscador general arriba.

**No es una tienda en línea:** no hay precios, ni carrito, ni pagos. Todo
termina en una consulta por WhatsApp o en un llamado.

## Cómo verlo en esta computadora

```bash
npm run dev
```

Queda en <http://localhost:5173>. No hace falta instalar nada.

Para ver cómo se va a ver el catálogo **una vez cargado**, con productos y
equipos de ejemplo: <http://localhost:5173/?demo=1>. Esos productos son
inventados, salen marcados con un cartel y **no forman parte de la página
normal**.

## Qué hay en cada archivo

| Archivo | Qué se toca ahí |
|---|---|
| `public/js/datos.js` | Teléfonos, redes, horarios, dirección, ficha de Google y **las categorías y subcategorías** |
| `public/js/filas.js` | **Los productos**, una línea por producto |
| `public/js/alquiler.js` | **Los equipos de alquiler** y sus categorías |
| `public/js/resenas.js` | Cómo se muestran las opiniones de Google |
| `api/resenas.js` | Consulta las reseñas a Google (la clave vive acá, no en el navegador) |
| `public/index.html` | Los textos de las secciones |
| `public/css/styles.css` | Colores, tipografías y diseño |
| `public/img/` | Las fotos |

## Cargar un producto

En `public/js/filas.js`, dentro de la categoría que corresponda:

```js
explosion: [
  "MS250|Motosierra 45 cc espada 18\"|Stihl|MS-250|motosierras||45 cc · Espada 18\" · 2 tiempos",
],
```

El orden de los campos es:

```
codigo | nombre | marca | modelo | subcategoria | foto | caracteristicas
```

- **codigo** — el código interno. También nombra la foto.
- **marca** — se puede dejar vacío. Cuando hay dos o más marcas cargadas,
  aparece solo el filtro por marca.
- **modelo** — si va vacío, se usa el código.
- **subcategoria** — una de las claves `sub` de esa categoría, en `datos.js`.
- **foto** — dejalo **vacío** si la foto está en `public/img/p/`; poné **`-`** si
  todavía no hay foto. Con `-` la tarjeta dibuja una herramienta en lugar de
  mostrar una imagen rota.
- **caracteristicas** — texto corto, con las partes separadas por ` · `.

La foto de ese producto va en `public/img/p/explosion-MS250.webp`
(`img/p/<categoria>-<codigo>.webp`).

> **Regla:** antes una foto que falta que una foto equivocada. Si no estás
> seguro de que la imagen es de ese producto, poné `-`.

## Agregar, cambiar o sacar una categoría

Todo pasa por `CATEGORIAS`, en `public/js/datos.js`. Cada categoría es un
objeto con `id`, `nombre`, `lema`, `texto`, `icono` y la lista `sub` de
subcategorías.

- **Agregar:** sumá el objeto a la lista y usá el mismo `id` como clave en
  `filas.js`.
- **Sacar:** borrá el objeto (y sus productos).
- **Renombrar:** cambiá `nombre`. Al `id` conviene no tocarlo, porque nombra las
  fotos y los enlaces.

El riel de categorías, el menú "Todo el catálogo", el índice, los filtros y el
pie se rearman solos.

## Cargar equipos de alquiler

En `public/js/alquiler.js`, dentro de `ALQUILER`. Las categorías (`GRUPOS`) ya
están armadas y **la sección aparece recién cuando hay equipos cargados**.

## Ubicación

Sale toda de `SITE.direccion` y `SITE.google`, en `public/js/datos.js`:

- **Dirección**: Mendoza Sur 2357, Villa Krause, Rawson — San Juan (J5425).
- **Ficha de Google**: `placeId` `ChIJV6PL-ts_gZYRSlwFeKtY-Jk`.

De ese `placeId` salen solos el botón **Ver ubicación en Google Maps**, el de
**Cómo llegar**, el mapa incrustado y los dos botones de reseñas. Si algún día
cambia la ficha del local, se cambia el `placeId` y se acomoda todo.

El mapa incrustado **no necesita clave de API**. Debajo del mapa queda siempre
una tarjeta con la dirección: si el navegador bloquea el marco de Google, la
página igual dice dónde queda el local.

## Opiniones: las reseñas de Google

No hay un sistema de opiniones propio. La sección muestra las reseñas reales de
la ficha de Google y manda a Google para escribir una:

- **Dejar una reseña en Google** → abre el formulario de Google.
- **Ver todas las opiniones** → abre la ficha con todas las reseñas.

Esos dos botones **funcionan siempre**, sin configurar nada.

Para que además se **vean las reseñas dentro de la página** hace falta una clave
de Google, porque Google no ofrece un recuadro gratis para incrustarlas:

1. Entrá a <https://console.cloud.google.com/> y creá un proyecto.
2. Habilitá **Places API (New)**.
3. Creá una **clave de API** y restringila a esa API.
4. En Vercel → *Settings* → *Environment Variables*, agregá:
   - `GOOGLE_MAPS_API_KEY` — la clave
   - `GOOGLE_PLACE_ID` — opcional; si no está, usa el local de Millán

`api/resenas.js` consulta a Google **cada seis horas** y guarda la respuesta, así
que el consumo es de unas 120 consultas por mes: entra de sobra en el uso
gratuito. La clave nunca llega al navegador.

Google entrega **hasta cinco reseñas** por consulta: ese es el máximo que se
puede mostrar dentro de la página. El botón "Ver todas las opiniones" lleva al
resto.

## Las fotos

El sitio funciona sin ninguna foto. Cuando subas una con el nombre correcto,
aparece sola: no hay que tocar código.

| Archivo | Dónde se ve |
|---|---|
| `public/img/hero.webp` | detrás de la ficha de atención de la portada |
| `public/img/alquiler.webp` | detrás de la banda oscura de Alquiler |
| `public/img/local.webp` | detrás de la banda final |
| `public/img/p/<categoria>-<codigo>.webp` | una por producto |
| `public/img/alq/<id>.webp` | una por equipo de alquiler |

Las de fondo conviene subirlas de unos 1600 px de ancho; las de producto,
cuadradas, de 600 px como máximo. Todas en **WebP**.

## El sitio en un solo archivo

```bash
node herramientas-armar-un-archivo.mjs
```

Junta el HTML, los estilos, los scripts y el logo en un único `.html` que se
abre con doble clic. Sirve para mandarlo por mail o subirlo a cualquier hosting.
En esa versión las reseñas no se cargan (no hay servidor), pero los botones a
Google sí funcionan.

## Publicar

Conectar el repositorio a Vercel. `vercel.json` ya trae la carpeta pública, las
direcciones sin `.html`, la caché larga de las imágenes y las cabeceras de
seguridad. **Cada cambio que se sube a `main` se publica solo.**
