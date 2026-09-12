/**
 * Servidor para probar en la máquina.
 *
 * Sirve la carpeta public/ y hace que /api/loquesea entre por api/loquesea.js,
 * igual que en el sitio publicado. Sólo para desarrollo.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL(".", import.meta.url));

/* Claves y cadenas de conexión para probar acá, si existe el archivo.
   .env.local no se sube al repositorio. */
try { process.loadEnvFile(join(RAIZ, ".env.local")); } catch { /* no hay, seguimos */ }

const PUBLICA = join(RAIZ, "public");
const PUERTO = Number(process.env.PORT) || 5173;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

async function existe(ruta) {
  try { return (await stat(ruta)).isFile(); } catch { return false; }
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const camino = decodeURIComponent(url.pathname);

  /* Puntos de entrada de la API. */
  if (camino.startsWith("/api/")) {
    const nombre = camino.slice(5).replace(/[^a-z0-9_-]/gi, "");
    const modulo = join(RAIZ, "api", `${nombre}.js`);
    if (!nombre || !(await existe(modulo))) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "No existe ese recurso." }));
    }
    try {
      /* La marca de tiempo obliga a releer el archivo tras cada cambio. */
      const { default: manejar } = await import(`file://${modulo}?v=${Date.now()}`);
      req.query = Object.fromEntries(url.searchParams);
      return await manejar(req, res);
    } catch (e) {
      console.error(e);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: e.message }));
    }
  }

  /* Archivos de la carpeta pública. */
  let relativo = normalize(camino).replace(/^([/\\])+/, "");
  if (relativo.includes("..")) {
    res.writeHead(403);
    return res.end("Prohibido");
  }
  if (!relativo) relativo = "index.html";

  let archivo = join(PUBLICA, relativo);
  if (!(await existe(archivo)) && !extname(relativo)) archivo = `${archivo}.html`;
  if (!(await existe(archivo))) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("No encontrado");
  }

  const tipo = TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream";
  const cuerpo = await readFile(archivo);

  /* Pedido por rango: es lo que usa el <video> para saltar a un punto sin
     bajar el archivo entero. Vercel lo hace solo; acá lo imitamos. */
  const rango = /^bytes=([0-9]*)-([0-9]*)$/.exec(req.headers.range || "");
  if (rango) {
    const fin = rango[2] ? Math.min(Number(rango[2]), cuerpo.length - 1) : cuerpo.length - 1;
    const inicio = rango[1] ? Number(rango[1]) : 0;
    if (inicio > fin) {
      res.writeHead(416, { "Content-Range": `bytes */${cuerpo.length}` });
      return res.end();
    }
    res.writeHead(206, {
      "Content-Type": tipo,
      "Content-Range": `bytes ${inicio}-${fin}/${cuerpo.length}`,
      "Accept-Ranges": "bytes",
      "Content-Length": fin - inicio + 1,
      "Cache-Control": "no-store",
    });
    return res.end(cuerpo.subarray(inicio, fin + 1));
  }

  res.writeHead(200, {
    "Content-Type": tipo,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
  });
  res.end(cuerpo);
});

servidor.listen(PUERTO, () => {
  console.log(`Sitio en http://localhost:${PUERTO}`);
});
