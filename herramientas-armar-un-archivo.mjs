import { readFile, writeFile } from "node:fs/promises";
const P = "D:/Claude/Herramienta millan/public/";
const leer = (f) => readFile(P + f, "utf8");

let html = await leer("index.html");
const css = await leer("css/styles.css");
const filas = await leer("js/filas.js");

const sinModulo = (s) =>
  s.replace(/^import[\s\S]*?from\s+"\.\/[^"]+";\s*$/gm, "")
   .replace(/^export\s+(const|function|async function|class)\s/gm, "$1 ")
   .replace(/^export\s+\{[^}]*\};?\s*$/gm, "");

/* datos, alquiler y app comparten ámbito; resenas.js repite nombres ($, esc),
   así que va encerrado en su propio bloque. */
const js = [
  sinModulo(await leer("js/datos.js")),
  sinModulo(await leer("js/alquiler.js")),
  sinModulo(await leer("js/app.js")),
  "(() => {\n" + sinModulo(await leer("js/resenas.js")) + "\n})();",
].join("\n\n");

const logo = "data:image/webp;base64," + (await readFile(P + "img/logo.webp")).toString("base64");
const icono = "data:image/webp;base64," + (await readFile(P + "img/logo-256.webp")).toString("base64");

/* En replace, un "$$" del código fuente se interpreta como "$": por eso
   todos los reemplazos van con función. */
const meter = (busca, texto) => { html = html.replace(busca, () => texto); };

meter(/<link rel="stylesheet" href="css\/styles\.css">/, `<style>\n${css}\n</style>`);
meter(/<script src="js\/filas\.js"><\/script>/, `<script>\n${filas}\n</script>`);
meter(/<script type="module" src="js\/app\.js"><\/script>/, `<script type="module">\n${js}\n</script>`);
meter(/<script type="module" src="js\/resenas\.js"><\/script>/, "");
html = html.replace(/src="img\/logo\.webp"/g, () => `src="${logo}"`);
html = html.replace(/href="img\/logo-256\.webp"/, () => `href="${icono}"`);
html = html.replace(/href="img\/logo\.webp"/, () => `href="${logo}"`);

await writeFile("millan.html", html);
console.log("un archivo:", Math.round(html.length / 1024), "KB");
console.log("$$ intacto:", html.includes("const $$ ="));
console.log("resenas incluidas:", html.includes("Dejar una reseña en Google"));
console.log("scripts sueltos:", (html.match(/src="js\//g) || []).length);

// Y la versión para publicar, sin html/head/body.
const fuentes = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0];
const estilos = html.match(/<style>[\s\S]*?<\/style>/)[0];
const cuerpo = html.match(/<body>([\s\S]*)<\/body>/)[1];
await writeFile(
  "ferreteria-millan.html",
  `<title>FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.</title>\n${fuentes}\n${estilos}\n${cuerpo.trim()}\n`
);
console.log("artefacto listo");
