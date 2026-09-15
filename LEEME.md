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
| `public/js/datos.js` | Teléfonos, redes, horarios, dirección, ficha de Google, **las categorías del catálogo** y **los rubros** |
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
  "MS250|Motosierra 45 cc espada 18\"|Stihl|MS-250|motosierras||45 cc · Espada 18\" · 2 tiempos|",
],
```

El orden de los campos es:

```
codigo | nombre | marca | modelo | subcategoria | foto | caracteristicas | medidas
```

- **codigo** — el código interno. También nombra la foto.
- **marca** — se puede dejar vacío. Cuando hay dos o más marcas cargadas,
  aparece solo el filtro por marca.
- **modelo** — se puede dejar vacío.
- **subcategoria** — una de las claves `sub` de esa categoría, en `datos.js`.
- **foto** — el nombre del archivo en `public/img/p/`; dejalo **vacío** si se llama
  `<categoria>-<codigo>.webp`; poné **`-`** si todavía no hay foto. Con `-` la tarjeta dibuja una herramienta en lugar de
  mostrar una imagen rota.
- **caracteristicas** — texto corto, con las partes separadas por ` · `.
- **medidas** — cuando el mismo producto viene en varias medidas, cada una con
  su código: `codigo=medida;codigo=medida`. La ficha las muestra en una tabla.
  Si no, queda vacío.

La foto de ese producto va en `public/img/p/explosion-MS250.webp`
(`img/p/<categoria>-<codigo>.webp`).

> **Regla:** antes una foto que falta que una foto equivocada. Si no estás
> seguro de que la imagen es de ese producto, poné `-`.

## Las dos partes del catálogo

El sitio muestra los productos de dos maneras distintas, y cada una se
configura en su propia lista dentro de `public/js/datos.js`:

### 1. `CATEGORIAS` — las que llevan catálogo

**Máquinas a explosión**, **Máquinas eléctricas** y **Herramientas de mano**. Son las que tienen
riel, subcategorías, buscador, ficha de producto con foto, modelo y código.
Los productos van en `filas.js`.

- **Agregar:** sumá el objeto a la lista y usá el mismo `id` como clave en
  `filas.js`.
- **Sacar:** borrá el objeto (y sus productos).
- **Renombrar:** cambiá `nombre`. Al `id` conviene no tocarlo, porque nombra
  las fotos y los enlaces.

### 2. `RUBROS` — las secciones informativas

**Bulones, Pinturas, PVC, Materiales y Repuestos.**
No llevan lista de productos: cada uno es una tarjeta con foto de fondo,
nombre, un texto corto y un botón de **Consultar por WhatsApp**.

```js
{
  id: "bulones",          // nombra la foto: img/rubros/bulones.webp
  nombre: "Bulones",
  texto: "Una o dos líneas sobre el rubro.",
  icono: "bulon",         // una de las claves de ICONOS
}
```

Para sumar un rubro, un objeto más en la lista. Para sacarlo, borralo.

El riel del catálogo, el menú "Todo el catálogo", el índice, los filtros, la
sección de rubros y el pie se rearman solos con lo que haya en esas dos listas.

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

En la sección **Pasá por el local** se ve una **imagen del mapa** con el local
marcado (`public/img/mapa.webp`), con la dirección abajo, y encima se carga el
mapa interactivo de Google cuando el navegador lo permite. Si lo bloquea, queda
la imagen: la página nunca deja de mostrar dónde está el local.

Nada de esto necesita clave de API. Para rehacer la imagen del mapa:

```bash
node herramientas-armar-el-mapa.mjs
```

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
| `public/img/frente.webp` | **el fondo de la portada** y el de la banda final |
| `public/img/alquiler.webp` | detrás de la banda oscura de Alquiler |
| `public/img/cat-<id>.webp` | el cartel de cada categoría del catálogo (`cat-explosion`, `cat-electricas`, `cat-manuales`), de 1000 × 914 |
| `public/img/rubros/<id>.webp` | **la imagen de cada tarjeta de rubro** (bulones, pinturas, pvc, materiales, repuestos) |
| `public/img/local/vista-general.webp` | **la vista general del salón**, en la sección El local |
| `public/img/local/parada-1.webp` | el primer cuadro del paseo, que se ve mientras carga el video |
| `public/img/p/<categoria>-<codigo>.webp` | una por producto |
| `public/img/alq/<id>.webp` | una por equipo de alquiler |

Las de fondo conviene subirlas de unos 1600 px de ancho; las de rubro, de unos
1000 px; las de producto, cuadradas, de 600 px como máximo. Todas en **WebP**.

Las de rubro se muestran **enteras, sin recortar**: como los carteles traen el
nombre del rubro impreso, la tarjeta los deja leer completos y abajo pone el
texto y el botón de WhatsApp. Conviene que todas tengan la misma proporción
(las actuales son de 1312 × 1199).

Mientras un rubro no tenga foto, la tarjeta se dibuja con su ícono sobre un
fondo oscuro y se ve igual de terminada. Al subir la foto con el nombre
correcto, aparece sola. Lo mismo con las categorías del catálogo.

**El mapa** (`public/img/mapa.webp`) ya está generado, con el local marcado.
Si alguna vez hay que rehacerlo, está el script que lo arma a partir de las
coordenadas de la ficha de Google.

## El local por dentro

La sección **El local** tiene dos piezas que se mueven juntas:

- **El paseo** (`public/video/local.mp4`, 464 × 832, 6 MB): el video del salón,
  que se recorre **parada por parada** con las flechas. Al avanzar, el video
  camina hasta la parada siguiente y se detiene en su cuadro exacto; al
  retroceder o saltar lejos, hace un fundido corto. Se acerca con + y −, con
  la rueda o con dos dedos, y acercado se arrastra para mirar el detalle. En el
  celular, deslizar de costado también cambia de parada. El video se empieza a
  bajar recién cuando la sección está cerca.
- **La vista general** (`public/img/local/vista-general.webp`): las dos
  panorámicas del salón, una desde la entrada y otra desde el mostrador, en una
  tira que se arrastra. Cada parada es un punto: tocarlo lleva el paseo hasta ahí.

Las paradas están en `PARADAS`, en `public/js/datos.js`: el nombre, el segundo
del video donde se detiene y dónde va su punto en la vista general.

### Cómo se prepararon los archivos

Las panorámicas originales traían bordes negros arriba y abajo (la parte que el
celular no llegó a cubrir al girar): se recortó a la franja que está completa en
todo el ancho, se afiló apenas y se pegaron las dos en una sola tira.

El video se limpió de grano, se pasó a 24 cuadros por segundo con un cuadro
clave por segundo (para que salte rápido a cada parada) y se le sacó el audio:

```bash
ffmpeg -i original.mp4 -an -vf "hqdn3d=2.5:2.5:7:7,fps=24" -c:v libx264 -preset slow -tune film -crf 28 -g 24 -keyint_min 24 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/video/local.mp4
```

El servidor de prueba responde pedidos por rango, que es lo que necesita el
`<video>` para saltar de un punto a otro sin bajarlo entero. Vercel ya lo hace.

## El sitio en un solo archivo

```bash
node herramientas-armar-un-archivo.mjs
```

Junta el HTML, los estilos, los scripts, el logo y el mapa en un único `.html` que se
abre con doble clic. Sirve para mandarlo por mail o subirlo a cualquier hosting.
En esa versión las reseñas no se cargan (no hay servidor), pero los botones a
Google sí funcionan.

## Publicar

Conectar el repositorio a Vercel. `vercel.json` ya trae la carpeta pública, las
direcciones sin `.html`, la caché larga de las imágenes y las cabeceras de
seguridad. **Cada cambio que se sube a `main` se publica solo.**
