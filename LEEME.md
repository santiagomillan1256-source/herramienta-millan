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

## Las dos partes del catálogo

El sitio muestra los productos de dos maneras distintas, y cada una se
configura en su propia lista dentro de `public/js/datos.js`:

### 1. `CATEGORIAS` — las que llevan catálogo

Sólo **Máquinas a explosión** y **Máquinas eléctricas**. Son las que tienen
riel, subcategorías, buscador, ficha de producto con foto, modelo y código.
Los productos van en `filas.js`.

- **Agregar:** sumá el objeto a la lista y usá el mismo `id` como clave en
  `filas.js`.
- **Sacar:** borrá el objeto (y sus productos).
- **Renombrar:** cambiá `nombre`. Al `id` conviene no tocarlo, porque nombra
  las fotos y los enlaces.

### 2. `RUBROS` — las secciones informativas

**Bulones, Pinturas, PVC, Materiales, Herramientas manuales y Repuestos.**
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
| `public/img/cat-<id>.webp` | la foto de cada categoría del catálogo (`cat-explosion`, `cat-electricas`) |
| `public/img/rubros/<id>.webp` | **la imagen de cada tarjeta de rubro** (bulones, pinturas, pvc, materiales, manuales, repuestos) |
| `public/img/salon.webp` | **la panorámica del salón**, el recorrido por el local |
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

## El recorrido por el local

La sección **El local** no muestra un video: muestra **una sola imagen
panorámica del salón entero** (`public/img/salon.webp`, 3336 × 666, 185 KB).
Se arrastra para girar la vista y se puede acercar con la rueda, con dos dedos
o con los botones + y −. El video en movimiento es una segunda capa, detrás del
botón "Ver en movimiento", y **no se descarga hasta que alguien lo pide**.

### De dónde sale la panorámica

El original es un video de 832 × 464 en el que la cámara barre el salón de
izquierda a derecha. La panorámica se armó con **slit-scan**: de cada uno de
los 583 cuadros se toma nada más que una tira de su franja central —la parte
donde el lente deforma menos— y las tiras se pegan una al lado de la otra.

Cada columna de la panorámica viene de **un solo cuadro**, así que conserva
exactamente la nitidez del original; no hay promedios ni estirado. Se probó
antes el camino de apilar cuadros para ganar resolución, y salió **peor**: con
paralaje y distorsión de lente los cuadros no se superponen de forma perfecta y
el promedio termina borroneando.

El corrimiento de cada cuadro se mide por correlación cruzada de perfiles 1D
(las columnas para el movimiento horizontal, las filas para el vertical), con
el pico interpolado para llegar al subpíxel. En este video el paneo resultó
monótono, sin retrocesos, con una confianza de correlación de 0,996.

Los scripts quedaron fuera del repositorio porque se usan una sola vez. Si hay
que rehacer la panorámica con otro video, el procedimiento es: medir el
corrimiento cuadro a cuadro, repartir las columnas de salida entre los cuadros,
muestrear cada una con interpolación bilineal, recortar el rectángulo que quede
cubierto en todas las columnas y recién ahí agrandar al doble y afilar.

### El video en movimiento

```bash
ffmpeg -i nuevo.mp4 -an   -vf "nlmeans=s=2.2:p=5:r=11,scale=1248:696:flags=lanczos,unsharp=5:5:0.9:5:5:0.0"   -r 24 -c:v libx264 -crf 21 -g 12 -keyint_min 12 -sc_threshold 0   -pix_fmt yuv420p -movflags +faststart public/video/recorrido.mp4
```

Dos cosas importan acá. El `-g 12` pone cuadros clave cada medio segundo: con
eso el arrastre responde al toque, y con cuadros clave cada varios segundos se
arrastra a los saltos. Y `nlmeans` limpia el grano mejor que `hqdn3d`
conservando el detalle: al mismo CRF el archivo salió 500 KB más chico y se ve
más limpio.

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
