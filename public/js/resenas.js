/**
 * Opiniones de Google.
 *
 * Las reseñas son las de la ficha del local: se escriben y se leen en Google.
 * Acá sólo se muestran. El pedido va a /api/resenas, que es quien habla con
 * Google (la clave no puede estar en el navegador).
 *
 * Si no hay servidor o todavía no está configurada la clave, la sección
 * igual sirve: quedan los botones para ver las opiniones y para dejar una.
 */

import { SITE, GOOGLE } from "./datos.js";

const $ = (s, c = document) => c.querySelector(s);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const ESTRELLA = '<path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"/>';

function estrellas(n, clase = "") {
  const llenas = Math.round(n);
  return `<span class="estrellas ${clase}" role="img" aria-label="${n} de 5 estrellas">${
    Array.from({ length: 5 }, (_, i) =>
      `<svg class="estrella${i < llenas ? " llena" : ""}" viewBox="0 0 24 24" aria-hidden="true">${ESTRELLA}</svg>`
    ).join("")
  }</span>`;
}

/* La "G" de Google, para dejar claro de dónde salen las opiniones. */
const G_SVG = `<svg class="g-ico" viewBox="0 0 24 24" aria-hidden="true">
  <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z"/>
  <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 20.9 7.6 23.5 12 23.5z"/>
  <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3z"/>
  <path fill="#EA4335" d="M12 5.1c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.6 15.1.5 12 .5 7.6.5 3.7 3.1 1.8 6.8l3.8 3C6.5 7.1 9 5.1 12 5.1z"/>
</svg>`;

const ESTADO = $("#resenas-estado");
const LISTA = $("#resenas");
const RESUMEN = $("#resenas-resumen");
const ACCIONES = $("#resenas-acciones");

/* Los dos botones que van siempre: no dependen de la API. */
function pintarAcciones(total) {
  ACCIONES.innerHTML = `
    <a class="boton boton-naranja" href="${esc(GOOGLE.dejarResena)}" target="_blank" rel="noopener">
      ${G_SVG}Dejar una reseña en Google
    </a>
    <a class="boton boton-linea" href="${esc(GOOGLE.resenas)}" target="_blank" rel="noopener">
      ${total ? `Ver las ${total} opiniones` : "Ver todas las opiniones"}
      <svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>`;
}

function pintarResumen({ promedio, total }) {
  if (!promedio) { RESUMEN.hidden = true; return; }
  RESUMEN.hidden = false;
  RESUMEN.innerHTML = `
    <span class="resenas-nota">${promedio.toFixed(1).replace(".", ",")}</span>
    <span class="resenas-detalle">
      ${estrellas(promedio)}
      <span>${total} ${total === 1 ? "opinión" : "opiniones"} en Google</span>
    </span>`;
}

function tarjeta(r) {
  const inicial = r.autor.trim().charAt(0).toUpperCase() || "?";
  /* La foto de perfil la sirve Google; si no carga, queda la inicial. */
  const cara = r.foto
    ? `<img src="${esc(r.foto)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
    : "";
  return `<article class="resena">
    <header class="resena-top">
      <span class="resena-cara" aria-hidden="true">${inicial}${cara}</span>
      <span class="resena-quien">
        <b>${esc(r.autor)}</b>
        <span>${esc(r.cuando)}</span>
      </span>
      ${G_SVG}
    </header>
    ${estrellas(r.estrellas, "chicas")}
    <p class="resena-texto">${esc(r.texto)}</p>
    ${r.enlace ? `<a class="resena-enlace" href="${esc(r.enlace)}" target="_blank" rel="noopener">Ver en Google</a>` : ""}
  </article>`;
}

function sinApi() {
  ESTADO.innerHTML = `Las opiniones se leen y se escriben en la ficha de
    <b>${esc(SITE.google.nombre)}</b> en Google Maps.`;
  ESTADO.hidden = false;
  LISTA.hidden = true;
  RESUMEN.hidden = true;
  pintarAcciones(0);
}

async function cargar() {
  pintarAcciones(0);
  try {
    const r = await fetch("/api/resenas", { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error();
    const datos = await r.json();

    if (!datos.habilitado || !datos.resenas?.length) return sinApi();

    pintarResumen(datos);
    LISTA.innerHTML = datos.resenas.map(tarjeta).join("");
    LISTA.hidden = false;
    ESTADO.hidden = true;
    pintarAcciones(datos.total);
  } catch {
    sinApi();
  }
}

cargar();
