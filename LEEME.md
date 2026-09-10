# FERRETERIA Y HERRAMIENTAS MILLAN S.A.S. — sitio web

Sitio de una página, con identidad propia: base clara de papel, bandas oscuras,
el naranja del logo como único acento y tipografía condensada de cartel de
ferretería. El catálogo se recorre con un riel de categorías a la izquierda y
un buscador general arriba.

**No es una tienda en línea:** no hay precios, ni carrito, ni pagos. Todo
termina en una consulta por WhatsApp o en un llamado.

## Cómo verlo en esta computadora

```bash
npm install
npm run dev
```

Queda en <http://localhost:5173>.

Para ver cómo se va a ver el catálogo **una vez cargado**, con productos y
equipos de ejemplo: <http://localhost:5173/?demo=1>. Esos productos son
inventados, salen marcados con un cartel y **no forman parte de la página
normal**.

## Qué hay en cada archivo

| Archivo | Qué se toca ahí |
|---|---|
| `public/js/datos.js` | Teléfonos, redes, horarios, dirección y **las categorías y subcategorías** |
| `public/js/filas.js` | **Los productos**, una línea por producto |
| `public/js/alquiler.js` | **Los equipos de alquiler** y sus categorías |
| `public/index.html` | Los textos de las secciones |
| `public/css/styles.css` | Colores, tipografías y diseño |
| `public/img/` | Las fotos |
| `public/panel.html` | El panel de opiniones (lleva sus propios estilos) |

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
- **Subcategorías:** se agregan o se sacan dentro de `sub`.

El riel de categorías, el menú "Todo el catálogo", el índice, los filtros y el
pie se rearman solos.

## Cargar equipos de alquiler

En `public/js/alquiler.js`, dentro de `ALQUILER`. Las categorías (`GRUPOS`) ya
están armadas y **la sección aparece recién cuando hay equipos cargados**.

En las tarjetas no se muestra marca ni modelo: sólo qué es la máquina y para
qué sirve, porque el parque de alquiler se renueva.

## Las fotos

El sitio funciona sin ninguna foto. Cuando subas una con el nombre correcto,
aparece sola: no hay que tocar código.

| Archivo | Dónde se ve |
|---|---|
| `public/img/hero.webp` | detrás de la ficha de atención de la portada |
| `public/img/alquiler.webp` | detrás de la banda oscura de Alquiler |
| `public/img/local.webp` | detrás de la banda final "¿No encontrás lo que buscás?" |
| `public/img/p/<categoria>-<codigo>.webp` | una por producto |
| `public/img/alq/<id>.webp` | una por equipo de alquiler |

Las de fondo conviene subirlas de unos 1600 px de ancho; las de producto,
cuadradas, de 600 px como máximo. Todas en **WebP** y servidas desde el propio
sitio.

El logo ya está cargado: `public/img/logo.webp` y `public/img/logo-256.webp`
(este último es el ícono de la pestaña).

## Opiniones de clientes

Lo que manda un cliente **queda pendiente y no se ve**. Recién aparece cuando se
aprueba desde `/panel`, que pide una clave.

- En esta computadora, la clave está en `.env.local` (`CLAVE_PANEL`).
- Publicado, hacen falta dos variables de entorno en Vercel:
  - `CLAVE_PANEL` — la clave del panel
  - `POSTGRES_URL` (o `DATABASE_URL`) — la base de datos

**Sin base de datos configurada, la sección de opiniones no aparece en el sitio
publicado.** Es a propósito: antes que recibir opiniones que se van a perder,
mejor no pedirlas.

## Falta completar

- La **dirección del local** (calle, barrio, localidad, provincia) en
  `SITE.direccion`, dentro de `public/js/datos.js`. Mientras no esté, la página
  la muestra marcada en naranja para que no quede olvidada.
- El **enlace de Google Maps** (`SITE.comoLlegar`) y la dirección para el mapa
  incrustado (`SITE.mapa`).
- El bloque `address` de la ficha para buscadores, en el `<head>` de `index.html`.
- El **dominio**: reemplazar `[DOMINIO]` en `index.html`, `robots.txt` y
  `sitemap.xml` por el subdominio real una vez publicado.

## Publicar

Conectar el repositorio a Vercel. El archivo `vercel.json` ya trae todo:
carpeta pública, direcciones sin `.html`, caché larga para las imágenes y las
cabeceras de seguridad. **Cada cambio que se sube a `main` se publica solo, en
la misma dirección de siempre.**
