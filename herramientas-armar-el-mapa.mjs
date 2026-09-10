import sharp from "sharp";
import { writeFile } from "node:fs/promises";

/* El local, según la ficha de Google. */
const LAT = -31.5880989, LON = -68.5369484, Z = 16, TAM = 256;

const n = 2 ** Z;
const xExacto = ((LON + 180) / 360) * n;
const rad = (LAT * Math.PI) / 180;
const yExacto = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;

const COLS = 5, FILAS = 4;
const x0 = Math.floor(xExacto) - Math.floor(COLS / 2);
const y0 = Math.floor(yExacto) - Math.floor(FILAS / 2);

const piezas = [];
for (let dy = 0; dy < FILAS; dy++) {
  for (let dx = 0; dx < COLS; dx++) {
    const url = `https://tile.openstreetmap.org/${Z}/${x0 + dx}/${y0 + dy}.png`;
    const r = await fetch(url, {
      headers: { "User-Agent": "sitio-ferreteria-millan/1.0 (mapa estatico del local)" },
    });
    if (!r.ok) throw new Error(`tile ${url}: ${r.status}`);
    piezas.push({ input: Buffer.from(await r.arrayBuffer()), left: dx * TAM, top: dy * TAM });
  }
}

const anchoTotal = COLS * TAM, altoTotal = FILAS * TAM;
// Dónde cae el local dentro de la imagen pegada.
const px = (xExacto - x0) * TAM;
const py = (yExacto - y0) * TAM;

const PIN = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="52" height="66" viewBox="0 0 52 66">
  <ellipse cx="26" cy="61" rx="11" ry="4" fill="rgba(0,0,0,.25)"/>
  <path d="M26 3c-9.9 0-18 8.1-18 18 0 13 18 33 18 33s18-20 18-33c0-9.9-8.1-18-18-18z"
        fill="#e8720c" stroke="#fff" stroke-width="3.5"/>
  <circle cx="26" cy="21" r="6.5" fill="#fff"/>
</svg>`);

const pegado = await sharp({
  create: { width: anchoTotal, height: altoTotal, channels: 3, background: "#e9e5dd" },
})
  .composite([
    ...piezas,
    { input: PIN, left: Math.round(px - 26), top: Math.round(py - 60) },
  ])
  .png()
  .toBuffer();

/* Recorte centrado en el local, con la atribución que pide OpenStreetMap. */
const ANCHO = 1000, ALTO = 820;
const izq = Math.max(0, Math.min(anchoTotal - ANCHO, Math.round(px - ANCHO / 2)));
const arr = Math.max(0, Math.min(altoTotal - ALTO, Math.round(py - ALTO / 2)));

const CREDITO = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="26">
  <rect width="${ANCHO}" height="26" fill="rgba(255,255,255,.82)"/>
  <text x="${ANCHO - 10}" y="18" text-anchor="end" font-family="Arial, sans-serif"
        font-size="13" fill="#3a3a3a">© OpenStreetMap</text>
</svg>`);

const info = await sharp(pegado)
  .extract({ left: izq, top: arr, width: ANCHO, height: ALTO })
  .composite([{ input: CREDITO, left: 0, top: ALTO - 26 }])
  .webp({ quality: 82, effort: 6 })
  .toFile("D:/Claude/Herramienta millan/public/img/mapa.webp");

console.log("mapa.webp", info.width + "x" + info.height, Math.round(info.size / 1024) + " KB");
