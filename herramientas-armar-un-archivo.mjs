/**
 * Junta todo el sitio en un solo .html que se abre con doble clic:
 * estilos, scripts, logo, mapa y las fotos del local y del alquiler van
 * incrustados (las fotos de los productos del catálogo, no).
 *
 *   node herramientas-armar-un-archivo.mjs
 */

import { readFile, writeFile, readdir } from "node:fs/promises";

const P = "./public/";
const leer = (f) => readFile(P + f, "utf8");
const base64 = async (f) => (await readFile(P + f)).toString("base64");
const dataUri = async (f) => "data:image/webp;base64," + (await base64(f));

let html = await leer("index.html");
const css = await leer("css/styles.css");
const filas = await leer("js/filas.js");

/* Los módulos se pegan en orden y se les quitan import/export. resenas.js
   repite nombres ($, esc), así que va encerrado en su propio bloque. */
const sinModulo = (s) =>
  s.replace(/^import[\s\S]*?from\s+"\.\/[^"]+";\s*$/gm, "")
   .replace(/^export\s+(const|function|async function|class)\s/gm, "$1 ")
   .replace(/^export\s+\{[^}]*\};?\s*$/gm, "");

const js = [
  sinModulo(await leer("js/datos.js")),
  sinModulo(await leer("js/alquiler.js")),
  sinModulo(await leer("js/app.js")),
  "(() => {\n" + sinModulo(await leer("js/resenas.js")) + "\n})();",
].join("\n\n");

/* Las fotos de fondo, incrustadas: app.js las busca en globalThis.FOTOS. */
const fotos = {};
for (const n of ["frente", "alquiler", "cat-explosion", "cat-electricas", "cat-manuales"]) {
  fotos[n] = await dataUri(`img/${n}.webp`);
}
for (const carpeta of ["rubros", "fotos", "alq"]) {
  for (const f of await readdir(P + "img/" + carpeta)) {
    if (f.endsWith(".webp")) fotos[`${carpeta}/${f.replace(".webp", "")}`] = await dataUri(`img/${carpeta}/${f}`);
  }
}
const tablaFotos = `globalThis.FOTOS = ${JSON.stringify(fotos)};`;

const logo = await dataUri("img/logo.webp");
const icono = await dataUri("img/logo-256.webp");
const mapa = await dataUri("img/mapa.webp");

/* Ojo: en replace, un "$$" del código fuente se interpreta como "$".
   Por eso todos los reemplazos van con función, que no hace sustituciones. */
const meter = (busca, texto) => { html = html.replace(busca, () => texto); };

meter(/<link rel="stylesheet" href="css\/styles\.css">/, `<style>\n${css}\n</style>`);
meter(/<script src="js\/filas\.js"><\/script>/, `<script>\n${tablaFotos}\n${filas}\n</script>`);
meter(/<script type="module" src="js\/(sitio|app)\.js"><\/script>/, `<script type="module">\n${js}\n</script>`);
meter(/<script type="module" src="js\/resenas\.js"><\/script>/, "");
html = html.replace(/src="img\/logo\.webp"/g, () => `src="${logo}"`);
html = html.replace(/href="img\/logo-256\.webp"/, () => `href="${icono}"`);
html = html.replace(/href="img\/logo\.webp"/, () => `href="${logo}"`);
html = html.replace(/src="img\/fotos\/([a-z-]+)\.webp"/g, (_, n) => `src="${fotos["fotos/" + n]}"`);
/* El mapa lo resuelve el JS con una ruta desde la raíz del sitio: acá se lo
   deja resuelto antes de que el módulo arranque. */
html = html.replace(/<\/style>/, () =>
  `</style>\n<script>globalThis.MAPA_INCRUSTADO = ${JSON.stringify(mapa)};</script>`);

await writeFile("sitio-en-un-archivo.html", html);
console.log("sitio-en-un-archivo.html:", Math.round(html.length / 1024), "KB");
console.log("fotos incrustadas:", Object.keys(fotos).length + 4);
