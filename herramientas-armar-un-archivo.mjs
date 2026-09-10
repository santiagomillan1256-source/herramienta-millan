/**
 * Arma el sitio entero en un solo archivo .html.
 *
 * Junta el HTML, los estilos, los scripts, el logo y el mapa en un único
 * archivo que se abre con doble clic, sin servidor. Sirve para mandarlo por
 * mail o subirlo a cualquier hosting.
 *
 *   node herramientas-armar-un-archivo.mjs
 *
 * Deja dos archivos:
 *   millan.html            el sitio completo
 *   ferreteria-millan.html el mismo, sin <html>/<head>/<body>, para publicar
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/* Se resuelve desde este archivo, así funciona con espacios en la ruta. */
const P = fileURLToPath(new URL("./public/", import.meta.url));
const leer = (f) => readFile(P + f, "utf8");

let html = await leer("index.html");
const css = await leer("css/styles.css");
const filas = await leer("js/filas.js");

/* Los módulos se pegan en orden y se les quitan import/export: quedan todos
   en el mismo ámbito. resenas.js repite nombres ($, esc), así que va
   encerrado en su propio bloque. */
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

const base64 = async (f) =>
  "data:image/webp;base64," + (await readFile(P + f)).toString("base64");

const logo = await base64("img/logo.webp");
const icono = await base64("img/logo-256.webp");
const mapa = await base64("img/mapa.webp");

/* Ojo: en replace, un "$$" del código fuente se interpreta como "$".
   Por eso todos los reemplazos van con función, que no sustituye nada. */
const meter = (busca, texto) => { html = html.replace(busca, () => texto); };

meter(/<link rel="stylesheet" href="css\/styles\.css">/, `<style>\n${css}\n</style>`);
meter(/<script src="js\/filas\.js"><\/script>/, `<script>\n${filas}\n</script>`);
meter(/<script type="module" src="js\/app\.js"><\/script>/, `<script type="module">\n${js}\n</script>`);
meter(/<script type="module" src="js\/resenas\.js"><\/script>/, "");

html = html.replace(/src="img\/logo\.webp"/g, () => `src="${logo}"`);
meter(/href="img\/logo-256\.webp"/, `href="${icono}"`);
meter(/href="img\/logo\.webp"/, `href="${logo}"`);
meter(/src="img\/mapa\.webp"/, `src="${mapa}"`);

await writeFile("millan.html", html);
console.log("un archivo:", Math.round(html.length / 1024), "KB");
console.log("$$ intacto:", html.includes("const $$ ="));
console.log("mapa incrustado:", !html.includes('src="img/mapa.webp"'));
console.log("archivos sueltos que quedan:", (html.match(/"(js|css|img)\//g) || []).length);

/* Y la versión para publicar como página: sin <html>, <head> ni <body>. */
const fuentes = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0];
const estilos = html.match(/<style>[\s\S]*?<\/style>/)[0];
const cuerpo = html.match(/<body>([\s\S]*)<\/body>/)[1];
await writeFile(
  "ferreteria-millan.html",
  `<title>FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.</title>\n${fuentes}\n${estilos}\n${cuerpo.trim()}\n`
);
console.log("version para publicar lista");
