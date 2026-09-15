/**
 * FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.
 *
 * Arma la página con los datos de datos.js, filas.js y alquiler.js:
 * cabecera, buscador general, catálogo con riel de categorías, alquiler,
 * ubicación, contacto y las dos ventanas (ficha de producto y elegir número).
 */

import {
  SITE, GOOGLE, CATEGORIAS, RUBROS, ICONOS, PRODUCTOS, armarProductos, categoriaPorId,
  rubroPorId, productosDe, marcasDe, nombreSub, pendiente, waLink, mensajeGeneral,
  mensajeProducto, mensajeCategoria, mensajeRubro, mensajeReparacion, mensajeAlquiler,
  mensajePresupuesto, estadoActual, correoLink,
} from "./datos.js";
import { ALQUILER, ALQUILER_EJEMPLO, GRUPOS, nombreGrupo, mensajeAlquilerMaquina } from "./alquiler.js";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/** Cuántos productos se dibujan de una vez. Una categoría grande pasa del millar. */
const PASO = 48;

/* Con ?demo=1 la página se dibuja con productos y equipos inventados, sólo para
   mirar el diseño. En la página normal no aparece nada de esto. */
const DEMO = new URLSearchParams(location.search).has("demo");
const CATALOGO = DEMO ? armarProductos(globalThis.FILAS_EJEMPLO || {}) : PRODUCTOS;
const EQUIPOS = DEMO ? ALQUILER_EJEMPLO : ALQUILER;

const estado = { cat: null, sub: "todas", marca: "todas", q: "", limite: PASO, grupo: null };

/* ── Utilidades ───────────────────────────────────────────── */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function normalizar(s) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

const INDICE = new Map(
  CATALOGO.map((p) => [p.id, normalizar(
    [p.nombre, p.sku, p.modelo, p.marca, p.categoriaNombre, nombreSub(p.categoria, p.sub), p.caracteristicas,
      ...p.medidas.map((m) => `${m.codigo} ${m.detalle}`)].join(" ")
  )])
);

const WA_SVG = '<svg class="wa-icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.96L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.9-9.9A9.9 9.9 0 0 0 12.04 2Zm5.8 14.05c-.24.68-1.42 1.32-1.95 1.36-.5.05-.98.23-3.3-.7-2.78-1.1-4.53-3.95-4.67-4.13-.13-.18-1.11-1.48-1.11-2.83 0-1.34.7-2 .95-2.28.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.48.24.57.8 1.98.87 2.12.07.14.11.3.02.48-.09.18-.13.3-.26.46-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.16 1.5 1.88 1.04.92 1.91 1.21 2.18 1.35.27.13.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.14.45.2.51.32.07.11.07.64-.17 1.31Z"/></svg>';
const FLECHA = '<svg class="icono flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const TEL_SVG = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.6a13 13 0 0 0 6 6L15 14l5 2v4a17 17 0 0 1-16-16z"/></svg>';
const PIN_SVG = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>';
const RUTA_SVG = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="m21.4 12-9.4 9.4L2.6 12 12 2.6z"/><path d="M8.6 14v-2.2a2 2 0 0 1 2-2h4.2"/><path d="m13 8 2 2-2 2"/></svg>';
const IG_SVG = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>';
const MAIL_SVG = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.6 6.2 8.4 6.6 8.4-6.6"/></svg>';
const TT_SVG ='<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3.2v9.9a3.7 3.7 0 1 1-3.1-3.65"/><path d="M15.2 3.2a5 5 0 0 0 4.6 4.2"/></svg>';
/* Marcador para lo que todavía no tiene foto: mejor un dibujo que una imagen rota. */
const SIN_FOTO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8 8a2.5 2.5 0 0 1-3.5-3.5l8-8z"/><path d="M14.7 6.3 17.3 3.7a4 4 0 0 0-5 5"/></svg>';
const SIN_MAQUINA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18M6 20v-6l4-2 4 3 4-4v9M10 12V7l4-2v4"/><circle cx="8" cy="17" r="1.4"/><circle cx="16" cy="17" r="1.4"/></svg>';

const dibujo = (clave) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[clave] || ICONOS.herramienta}</svg>`;

/** Dónde está una foto de fondo. Va desde la raíz del sitio porque, dentro de
 *  una variable CSS, una dirección relativa se resuelve contra la hoja de
 *  estilos (/css/) y no contra la página. En la versión de un solo archivo,
 *  las fotos vienen incrustadas en globalThis.FOTOS. */
const rutaFoto = (nombre) =>
  (globalThis.FOTOS && globalThis.FOTOS[nombre]) || `/img/${nombre}.webp`;

/* Carteles de categoría con nombre propio: las imágenes se guardan en caché
   por un año, así que una imagen nueva necesita un nombre nuevo para que el
   navegador no siga mostrando la anterior. */
const CARTELES = { explosion: "cat-explosion-cartel", electricas: "cat-electricas-cartel" };

/** Un dato que todavía falta se muestra marcado, para que no quede olvidado. */
const dato = (v) => (pendiente(v) ? `<span class="falta">${esc(v)}</span>` : esc(v));

const hhmm = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function horarioDeHoy() {
  const arg = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const franjas = SITE.horarios[arg.getDay()] || [];
  if (!franjas.length) return "Hoy no abrimos";
  return `Hoy ${franjas.map(([a, b]) => `${hhmm(a)}–${hhmm(b)}`).join(" · ")}`;
}

/* ── Los medios de contacto ───────────────────────────────── */

/** Magali y Marcelo: WhatsApp y llamada. Debajo, el fijo y el correo, cada uno por separado. */
function bloqueNumeros(mensaje, asunto) {
  return `<div class="numeros">${SITE.numeros.map((n) => `<div class="numero">
    <span class="numero-txt"><span>${esc(n.persona)} · WhatsApp y celular</span><b>${esc(n.visible)}</b></span>
    <span class="numero-acciones">
      <a class="boton boton-wa boton-chico" href="${waLink(n, mensaje)}" target="_blank" rel="noopener" aria-label="WhatsApp a ${esc(n.persona)}">${WA_SVG} WhatsApp</a>
      <a class="boton boton-linea boton-chico" href="tel:${esc(n.tel)}" aria-label="Llamar a ${esc(n.persona)}">${TEL_SVG} Llamar</a>
    </span>
  </div>`).join("")}
  <div class="otros-medios">
    <a class="otro-medio" href="tel:${esc(SITE.fijo.tel)}">${TEL_SVG}<span><span>Teléfono fijo</span><b>${esc(SITE.fijo.visible)}</b></span><em>Llamar</em></a>
    <a class="otro-medio" href="${esc(correoLink(mensaje, asunto))}">${MAIL_SVG}<span><span>Correo electrónico</span><b>${esc(SITE.correo)}</b></span><em>Enviar correo</em></a>
  </div></div>`;
}

/* ══════ CABECERA Y DATOS FIJOS ═══════════════════════════ */

const d = SITE.direccion;
const HAY_DIRECCION = !pendiente(d.calle);
const LINEA_CORTA = [d.calle, d.barrio].filter((x) => !pendiente(x)).join(", ");
const LINEA_LARGA = [d.localidad, d.provincia].filter((x) => !pendiente(x)).join(" — ");

function pintarCabecera() {
  /* Los dos celulares, uno debajo del otro, en la barra del logo (computadora)
     y en la fila de servicio (tablet y celular). */
  const lineas = SITE.numeros.map((n) =>
    `<a href="tel:${esc(n.tel)}" aria-label="Llamar a ${esc(n.persona)}: ${esc(n.visible)}"><span>${esc(n.persona)}</span><b>${esc(n.visible)}</b></a>`).join("");
  $("#barra-tels").innerHTML = lineas;
  $("#servicio-tels").innerHTML = lineas.replaceAll("<a ", `<a class="servicio-tel" `).replaceAll("<span>", `${TEL_SVG}<span>`);

  $("#servicio-fijo").innerHTML =
    `<a href="tel:${esc(SITE.fijo.tel)}">${TEL_SVG}Teléfono fijo <b>${esc(SITE.fijo.visible)}</b></a>`;
  $("#servicio-correo").innerHTML =
    `<a href="${esc(correoLink())}">${MAIL_SVG}${esc(SITE.correo)}</a>`;

  $("#servicio-redes").innerHTML =
    `<a href="${esc(SITE.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${IG_SVG}</a>
     <a href="${esc(SITE.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok">${TT_SVG}</a>`;

  const corta = $("[data-ubicacion-corta]");
  if (HAY_DIRECCION) corta.textContent = `${d.calle}, ${d.barrio} · ${d.provincia}`;
}

function pintarPortada() {
  const abiertos = SITE.horariosTexto.filter((h) => h.horas !== "Cerrado");
  const dias = abiertos.some((h) => /s[aá]bado/i.test(h.dia)) ? "Lunes a sábado" : abiertos[0]?.dia;
  const nombres = SITE.numeros.map((n) => n.persona);
  const datos = [
    HAY_DIRECCION && [d.calle, [d.barrio, d.provincia].filter((x) => !pendiente(x)).join(" · ")],
    dias && [dias, abiertos.every((h) => h.horas.includes("·")) ? "Mañana y tarde" : abiertos[0].horas],
    nombres.length && [nombres.join(" y "), "Atienden por WhatsApp"],
  ].filter(Boolean);
  $("#portada-datos").innerHTML = datos.map(([v, t]) =>
    `<li><b>${esc(v)}</b><span>${esc(t)}</span></li>`).join("");

  $("#horario-hoy").textContent = horarioDeHoy();
  $("#ficha-nums").innerHTML = SITE.numeros.map((n) => `<div class="ficha-num">
    <span class="ficha-num-txt"><span>${esc(n.persona)} · WhatsApp y celular</span><b>${esc(n.visible)}</b></span>
    <span class="ficha-num-acciones">
      <a class="boton boton-wa boton-chico" href="${waLink(n, mensajeGeneral())}" target="_blank" rel="noopener" aria-label="WhatsApp a ${esc(n.persona)}">${WA_SVG} WhatsApp</a>
      <a class="boton boton-linea boton-chico boton-cuadrado" href="tel:${esc(n.tel)}" aria-label="Llamar a ${esc(n.persona)}">${TEL_SVG}</a>
    </span>
  </div>`).join("") + `<div class="ficha-otros">
    <a href="tel:${esc(SITE.fijo.tel)}">${TEL_SVG}<span><span>Teléfono fijo</span><b>${esc(SITE.fijo.visible)}</b></span></a>
    <a href="${esc(correoLink())}">${MAIL_SVG}<span><span>Correo electrónico</span><b>Enviar correo</b></span></a>
  </div>`;
}

function pintarVisitanos() {
  $("#dato-direccion").innerHTML = [
    `<b class="direccion-calle">${dato(d.calle)}</b>`,
    `${dato(d.barrio)}, ${dato(d.localidad)}`,
    `${dato(d.provincia)}${d.codigoPostal ? ` (${esc(d.codigoPostal)})` : ""} — Argentina`,
    d.referencia && !pendiente(d.referencia) ? esc(d.referencia) : "",
  ].filter(Boolean).join("<br>");

  $("#dato-horarios").innerHTML = SITE.horariosTexto.map((h) =>
    `<li><span>${esc(h.dia)}</span><b>${esc(h.horas)}</b></li>`).join("");

  $("#dato-contactos").innerHTML = [
    ...SITE.numeros.map((n) => `<div class="contacto-fila es-wa">
      <i class="wa"></i>
      <span class="contacto-txt"><span>${esc(n.persona)} · WhatsApp y celular</span><b>${esc(n.visible)}</b></span>
      <span class="contacto-acciones">
        <a class="boton boton-wa boton-chico" href="${waLink(n, mensajeGeneral())}" target="_blank" rel="noopener" aria-label="WhatsApp a ${esc(n.persona)}">${WA_SVG} WhatsApp</a>
        <a class="boton boton-linea boton-chico" href="tel:${esc(n.tel)}" aria-label="Llamar a ${esc(n.persona)}">${TEL_SVG}<span class="solo-ancho">Llamar</span></a>
      </span>
    </div>`),
    `<a class="contacto-fila" href="tel:${esc(SITE.fijo.tel)}">
      ${TEL_SVG}<span class="contacto-txt"><span>Teléfono fijo · sólo llamadas</span><b>${esc(SITE.fijo.visible)}</b></span>
      <span class="contacto-accion">Llamar</span>
    </a>`,
    `<a class="contacto-fila" href="${esc(correoLink())}">
      ${MAIL_SVG}<span class="contacto-txt"><span>Correo electrónico</span><b class="contacto-correo">${esc(SITE.correo)}</b></span>
      <span class="contacto-accion">Enviar correo</span>
    </a>`,
    `<a class="contacto-fila" href="${esc(SITE.instagram)}" target="_blank" rel="noopener">
      ${IG_SVG}<span class="contacto-txt"><span>Instagram</span><b>${esc(SITE.instagramUsuario)}</b></span>${FLECHA}
    </a>`,
    `<a class="contacto-fila" href="${esc(SITE.tiktok)}" target="_blank" rel="noopener">
      ${TT_SVG}<span class="contacto-txt"><span>TikTok</span><b>${esc(SITE.tiktokUsuario)}</b></span>${FLECHA}
    </a>`,
  ].filter(Boolean).join("");

  /* Los dos accesos a Google Maps: ver dónde queda y cómo llegar. */
  $("#ubi-acciones").innerHTML =
    `<a class="boton boton-naranja" href="${esc(GOOGLE.ubicacion)}" target="_blank" rel="noopener">
      ${PIN_SVG}Ver ubicación en Google Maps
    </a>
    <a class="boton boton-linea" href="${esc(GOOGLE.comoLlegar)}" target="_blank" rel="noopener">
      ${RUTA_SVG}Cómo llegar
    </a>`;

  /* Debajo del mapa queda siempre una tarjeta con la dirección: si el visor
     bloquea el marco de Google, la página sigue diciendo dónde queda el local. */
  $("#mapa").innerHTML =
    `<a class="mapa-imagen" href="${esc(GOOGLE.ubicacion)}" target="_blank" rel="noopener"
        aria-label="Ver la ubicación de ${esc(SITE.nombre)} en Google Maps">
      <img src="${globalThis.MAPA_INCRUSTADO || "/img/mapa.webp"}" alt="Mapa con la ubicación del local, en ${esc(d.calle)}" loading="lazy" decoding="async"
           onerror="this.closest('.mapa-imagen').classList.add('sin-mapa'); this.remove()">
      <span class="mapa-pie">
        <span class="mapa-calle">${esc(d.calle)}</span>
        <span>${esc(d.barrio)}, ${esc(d.localidad)} — ${esc(d.provincia)}</span>
      </span>
    </a>
    <iframe title="Mapa con la ubicación de ${esc(SITE.nombre)}" src="${esc(GOOGLE.mapa)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}

function pintarPie() {
  $("#pie-categorias").innerHTML = [
    ...CATEGORIAS.map((c) => `<li><button type="button" data-cat="${c.id}">${esc(c.nombre)}</button></li>`),
    ...RUBROS.map((r) => `<li><button type="button" data-ir-rubro="${r.id}">${esc(r.nombre)}</button></li>`),
  ].join("");

  $("#pie-contacto").innerHTML = [
    ...SITE.numeros.map((n) => `<li><a href="tel:${esc(n.tel)}">${esc(n.persona)} · ${esc(n.visible)}</a></li>`),
    `<li><a href="tel:${esc(SITE.fijo.tel)}">Teléfono fijo · ${esc(SITE.fijo.visible)}</a></li>`,
    `<li><a class="pie-correo" href="${esc(correoLink())}">${esc(SITE.correo)}</a></li>`,
    `<li><a href="${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram ${esc(SITE.instagramUsuario)}</a></li>`,
    `<li><a href="${esc(SITE.tiktok)}" target="_blank" rel="noopener">TikTok ${esc(SITE.tiktokUsuario)}</a></li>`,
  ].join("");

  $("#pie-direccion").innerHTML = HAY_DIRECCION
    ? `${esc(LINEA_CORTA)}${LINEA_LARGA ? ` — ${esc(LINEA_LARGA)}` : ""}`
    : `Dirección: ${dato(d.calle)}`;
}

/* ══════ CATÁLOGO ═════════════════════════════════════════ */

function pintarRiel() {
  const riel = $("#riel");
  riel.querySelectorAll(".riel-item").forEach((e) => e.remove());
  riel.insertAdjacentHTML("beforeend", CATEGORIAS.map((c) => {
    const n = productosDe(c.id, CATALOGO).length;
    return `<button class="riel-item" type="button" data-cat="${c.id}">
      <span class="riel-ico" aria-hidden="true">${dibujo(c.icono)}</span>
      <b>${esc(c.nombre)}</b>
      ${n ? `<span class="cuenta">${n}</span>` : ""}
      <svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
    </button>`;
  }).join(""));
}

function pintarIndice() {
  /* La foto de cada categoría es un cartel con el nombre impreso: se muestra
     entera, y el nombre se repite abajo en texto para que se lea siempre. */
  $("#indice").innerHTML = CATEGORIAS.map((c) => `<div class="indice-bloque" id="indice-${c.id}">
    <button class="indice-foto" type="button" data-cat="${c.id}" aria-label="Ver ${esc(c.nombre.toLowerCase())}">
      <img src="${rutaFoto(CARTELES[c.id] || "cat-" + c.id)}" alt="" loading="lazy" decoding="async" width="1312" height="1199"
           onerror="this.closest('.indice-bloque').classList.add('sin-foto')">
    </button>
    <h4 class="indice-nombre"><span class="indice-ico" aria-hidden="true">${dibujo(c.icono)}</span>${esc(c.nombre)}</h4>
    <ul class="indice-lista">${Object.entries(c.sub).map(([id, nombre]) =>
      `<li><button type="button" data-cat="${c.id}" data-sub="${id}">${esc(nombre)}</button></li>`).join("")}</ul>
  </div>`).join("");
}

function pintarMegamenu() {
  const columnas = CATEGORIAS.map((c) => `<div class="mm-col">
    <button class="mm-cab" type="button" data-cat="${c.id}">
      <span class="mm-ico" aria-hidden="true">${dibujo(c.icono)}</span>
      <b>${esc(c.nombre)}</b>
    </button>
    <div class="mm-subs">${Object.entries(c.sub).map(([id, nombre]) =>
      `<button type="button" data-cat="${c.id}" data-sub="${id}">${esc(nombre)}</button>`).join("")}</div>
  </div>`);

  /* Los rubros sin catálogo llevan a su tarjeta, no a una lista de productos. */
  columnas.push(`<div class="mm-col">
    <div class="mm-cab mm-cab-quieta">
      <span class="mm-ico" aria-hidden="true">${dibujo("herramienta")}</span>
      <b>Otros rubros</b>
    </div>
    <div class="mm-subs">${RUBROS.map((r) =>
      `<button type="button" data-ir-rubro="${r.id}">${esc(r.nombre)}</button>`).join("")}</div>
  </div>`);

  $("#megamenu-grid").innerHTML = columnas.join("");
}

/** Lo que se muestra: con categoría elegida o con búsqueda, la grilla; si no, el índice. */
const enGrilla = () => Boolean(estado.cat) || estado.q.trim().length > 0;

function productosFiltrados() {
  const base = estado.cat ? productosDe(estado.cat, CATALOGO) : CATALOGO;
  const t = normalizar(estado.q).split(" ").filter(Boolean);
  return base.filter((p) => {
    if (estado.cat && estado.sub !== "todas" && p.sub !== estado.sub) return false;
    if (estado.marca !== "todas" && p.marca !== estado.marca) return false;
    if (!t.length) return true;
    return t.every((x) => INDICE.get(p.id).includes(x));
  });
}

function tarjetaProducto(p) {
  return `<article class="producto">
    <button class="producto-foto${p.imagen ? "" : " sin-foto"}" data-ver="${p.id}" aria-label="Ver ficha de ${esc(p.nombre)}">
      ${p.imagen ? `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy" decoding="async">` : SIN_FOTO}
      <span class="producto-codigo">${p.medidas.length > 1 ? `${p.medidas.length} medidas` : esc(p.modelo || p.sku)}</span>
      ${DEMO ? '<span class="producto-demo">Ejemplo</span>' : ""}
    </button>
    <div class="producto-cuerpo">
      <p class="producto-sub">${esc(nombreSub(p.categoria, p.sub))}</p>
      <h4 class="producto-nombre"><button type="button" data-ver="${p.id}">${esc(p.nombre)}</button></h4>
      ${p.marca ? `<p class="producto-marca">${esc(p.marca)}</p>` : ""}
      <div class="producto-acciones">
        <button class="boton boton-wa" type="button" data-consulta-producto="${p.id}">${WA_SVG} Consultar</button>
        <button class="boton boton-linea" type="button" data-ver="${p.id}">Ficha</button>
      </div>
    </div>
  </article>`;
}

function pintarFiltros() {
  const cajaSub = $("#filtros-sub");
  const cajaMarca = $("#filtros-marca");
  cajaSub.querySelectorAll(".chip").forEach((e) => e.remove());
  cajaMarca.querySelectorAll(".chip").forEach((e) => e.remove());

  /* Las subcategorías sólo tienen sentido dentro de una categoría. */
  const cat = estado.cat ? categoriaPorId(estado.cat) : null;
  cajaSub.hidden = !cat;
  if (cat) {
    const todos = productosDe(cat.id, CATALOGO);
    const cuenta = {};
    for (const p of todos) cuenta[p.sub] = (cuenta[p.sub] || 0) + 1;
    const hay = todos.length > 0;
    const items = [
      { id: "todas", txt: "Todas", n: todos.length },
      ...Object.entries(cat.sub)
        .filter(([id]) => !hay || cuenta[id])
        .map(([id, txt]) => ({ id, txt, n: cuenta[id] || 0 })),
    ];
    cajaSub.insertAdjacentHTML("beforeend", items.map((i) =>
      `<button class="chip${i.id === estado.sub ? " activa" : ""}" type="button" data-sub-chip="${i.id}" aria-pressed="${i.id === estado.sub}">${esc(i.txt)}${
        hay ? `<span class="n">${i.n}</span>` : ""}</button>`).join(""));
  }

  /* El filtro de marcas aparece solo cuando hay más de una marca cargada. */
  const marcas = estado.cat
    ? marcasDe(estado.cat, CATALOGO)
    : [...new Set(CATALOGO.map((p) => p.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  cajaMarca.hidden = marcas.length < 2;
  if (!cajaMarca.hidden) {
    cajaMarca.insertAdjacentHTML("beforeend", [{ id: "todas", txt: "Todas" }, ...marcas.map((m) => ({ id: m, txt: m }))]
      .map((i) => `<button class="chip${i.id === estado.marca ? " activa" : ""}" type="button" data-marca-chip="${esc(i.id)}" aria-pressed="${i.id === estado.marca}">${esc(i.txt)}</button>`)
      .join(""));
  }
}

function pintarCatalogo() {
  $("#indice-bloque").hidden = enGrilla();
  $("#categoria-bloque").hidden = !enGrilla();
  $$("[data-cat]").forEach((b) => b.classList.toggle("activa", b.dataset.cat === estado.cat && !b.dataset.sub));
  if (!enGrilla()) return;

  const cat = estado.cat ? categoriaPorId(estado.cat) : null;
  const busqueda = estado.q.trim();

  $("#ruta").innerHTML = cat
    ? `Catálogo <span aria-hidden="true">›</span> <b>${esc(cat.nombre)}</b>`
    : `Catálogo <span aria-hidden="true">›</span> <b>Búsqueda</b>`;
  $("#panel-titulo").textContent = cat ? cat.nombre : `Resultados para “${busqueda}”`;
  $("#panel-texto").textContent = cat
    ? cat.texto
    : "Buscamos en todas las categorías a la vez. Tocá una categoría del listado si querés mirar sólo ese rubro.";

  pintarFiltros();

  const lista = productosFiltrados();
  const grilla = $("#productos");
  grilla.innerHTML = lista.slice(0, estado.limite).map(tarjetaProducto).join("");
  grilla.hidden = lista.length === 0;

  const faltan = lista.length - estado.limite;
  const mas = $("#ver-mas");
  mas.hidden = faltan <= 0;
  if (faltan > 0) mas.textContent = `Ver más productos (quedan ${faltan})`;

  /* Tres vacíos distintos: sin catálogo cargado, sin resultados de búsqueda,
     o un filtro que no dio nada. */
  const vacio = $("#vacio");
  const boton = $(".boton-wa", vacio);
  vacio.hidden = lista.length > 0;
  delete boton.dataset.consulta;
  delete boton.dataset.consultaCategoria;
  const hayEnCategoria = cat ? productosDe(cat.id, CATALOGO).length : CATALOGO.length;
  if (!hayEnCategoria && cat) {
    boton.dataset.consultaCategoria = cat.id;
    $("#vacio-t").textContent = "Todavía no publicamos los productos de esta categoría.";
    $("#vacio-p").textContent =
      `Los estamos cargando. Mientras tanto, escribinos y te decimos qué tenemos de ${cat.nombre.toLowerCase()}: en el local hay mucho más de lo que llegamos a publicar.`;
  } else if (!hayEnCategoria) {
    boton.dataset.consulta = "general";
    $("#vacio-t").textContent = "Todavía estamos cargando el catálogo.";
    $("#vacio-p").textContent =
      "Las categorías ya están armadas y los productos se van a ir sumando. Mientras tanto, escribinos y te decimos si lo tenemos.";
  } else {
    boton.dataset.consulta = "general";
    $("#vacio-t").textContent = "No encontramos nada con ese filtro.";
    $("#vacio-p").textContent =
      "Probá con otra palabra o preguntanos directamente: trabajamos con muchos más artículos de los que están publicados.";
  }

  const q = busqueda ? ` para “<b>${esc(busqueda)}</b>”` : "";
  const s = !cat || estado.sub === "todas" ? "" : ` en <b>${esc(nombreSub(estado.cat, estado.sub))}</b>`;
  const m = estado.marca === "todas" ? "" : ` de <b>${esc(estado.marca)}</b>`;
  $("#cuenta").innerHTML = hayEnCategoria
    ? `<b>${lista.length}</b> ${lista.length === 1 ? "producto" : "productos"}${s}${m}${q}`
    : cat
      ? `<b>${Object.keys(cat.sub).length}</b> subcategorías preparadas en <b>${esc(cat.nombre)}</b>`
      : `Catálogo en preparación`;
}

function abrirCategoria(id, sub = "todas", mover = true) {
  if (!categoriaPorId(id)) return;
  estado.cat = id;
  estado.sub = sub;
  estado.marca = "todas";
  estado.limite = PASO;
  cerrarMegamenu();
  pintarCatalogo();
  if (mover) $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#cat-${id}`);
}

function volverAlIndice() {
  estado.cat = null;
  estado.sub = "todas";
  estado.marca = "todas";
  estado.limite = PASO;
  if (estado.q) { estado.q = ""; $("#buscar").value = ""; $("#buscar-x").hidden = true; }
  pintarCatalogo();
  history.replaceState(null, "", "#catalogo");
  $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}


/* ══════ OTROS RUBROS ══════════════════════════════════════ */

/** Una tarjeta por rubro: foto de fondo, nombre y botón de consulta. */
function pintarRubros() {
  /* La imagen de cada rubro ya trae el nombre impreso, así que se muestra
     entera y sin recortar. El h3 sigue en el documento para quien no ve la
     foto; si la foto falta, "sin-foto" lo vuelve a poner en primer plano. */
  $("#rubros-grid").innerHTML = RUBROS.map((r) => `<article class="rubro" id="rubro-${r.id}">
    <span class="rubro-ico" aria-hidden="true">${dibujo(r.icono)}</span>
    <div class="rubro-foto">
      <img src="${rutaFoto("rubros/" + r.id)}" alt="${esc(r.nombre)}" loading="lazy" decoding="async" width="1312" height="1199"
           onerror="this.closest('.rubro').classList.add('sin-foto')">
    </div>
    <div class="rubro-cuerpo">
      <h3>${esc(r.nombre)}</h3>
      <p>${esc(r.texto)}</p>
      <button class="boton boton-linea boton-chico" type="button" data-consulta-rubro="${r.id}" aria-label="Consultar por WhatsApp: ${esc(r.nombre)}">${WA_SVG}<span>Consultar<span class="solo-ancho"> por WhatsApp</span></span></button>
    </div>
  </article>`).join("");
}

/* ══════ ALQUILER ═════════════════════════════════════════ */

function pintarAlquiler() {
  const hay = EQUIPOS.length > 0;
  $("#alquiler-vacio").hidden = hay;
  $("#grupos").hidden = !hay;
  $("#equipos").hidden = !hay;
  if (!hay) return;

  const usados = Object.keys(GRUPOS).filter((id) => EQUIPOS.some((m) => m.grupo === id));
  const cuantos = (id) => EQUIPOS.filter((m) => m.grupo === id).length;
  const deCuantos = (n) => `${n} ${n === 1 ? "equipo" : "equipos"}`;
  if (estado.grupo && !usados.includes(estado.grupo)) estado.grupo = null;
  const abierto = estado.grupo;

  /* Primero, sólo las categorías: una tarjeta por rubro con la foto de una
     de sus máquinas. Las máquinas aparecen recién al elegir una. */
  $("#grupos").hidden = !!abierto;
  $("#equipos").hidden = !abierto;
  $("#grupos").innerHTML = usados.map((id) => {
    const g = GRUPOS[id];
    const foto = EQUIPOS.find((m) => m.id === g.foto && m.foto) || EQUIPOS.find((m) => m.grupo === id && m.foto);
    return `<button class="alq-categoria" type="button" data-grupo="${esc(id)}" aria-label="Ver los equipos de ${esc(g.nombre.toLowerCase())} (${deCuantos(cuantos(id))})">
      <span class="alq-categoria-foto">${foto
        ? `<img src="${rutaFoto("alq/" + foto.id)}" alt="" loading="lazy" decoding="async" width="800" height="600">`
        : SIN_MAQUINA}</span>
      <span class="alq-categoria-cuerpo">
        <span class="alq-categoria-nombre">${esc(g.nombre)}</span>
        <span class="alq-categoria-texto">${esc(g.texto || "")}</span>
        <span class="alq-categoria-pie">
          <span class="equipos-cuenta">${deCuantos(cuantos(id))}</span>
          <span class="alq-categoria-flecha" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </span>
      </span>
    </button>`;
  }).join("");
  if (!abierto) { $("#equipos").innerHTML = ""; return; }

  const tarjeta = (m) => `<article class="equipo">
    <div class="equipo-foto">${m.foto
      ? `<img src="${rutaFoto("alq/" + m.id)}" alt="${esc(m.nombre)}" loading="lazy" decoding="async" width="800" height="600">`
      : SIN_MAQUINA}</div>
    <div class="equipo-cuerpo">
      <h4>${esc(m.nombre)}</h4>
      <p>${esc(m.descripcion)}</p>
      ${m.caracteristicas?.length ? `<p class="equipo-carac">${m.caracteristicas.map(esc).join(" · ")}</p>` : ""}
      <button class="boton boton-wa boton-chico" type="button" data-consulta-alquiler="${esc(m.id)}" aria-label="Consultar por WhatsApp el alquiler de ${esc(m.nombre.toLowerCase())}">${WA_SVG} Consultar</button>
    </div>
  </article>`;

  /* La categoría elegida: volver, saltar a otra y sus equipos en cuadros. */
  const deEste = EQUIPOS.filter((m) => m.grupo === abierto);
  $("#equipos").innerHTML = `<div class="alq-barra">
      <button class="alq-volver" type="button" data-alq-volver>
        <svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
        Todas las categorías
      </button>
      <div class="alq-otras" role="group" aria-label="Otras categorías de alquiler">${usados.map((id) =>
        `<button class="grupo-chip${id === abierto ? " activa" : ""}" type="button" data-grupo="${esc(id)}" aria-pressed="${id === abierto}">${esc(nombreGrupo(id))} <span class="grupo-n">${cuantos(id)}</span></button>`).join("")}</div>
    </div>
    <section class="equipos-grupo" aria-labelledby="alq-${esc(abierto)}">
      <div class="equipos-grupo-cab">
        <h3 id="alq-${esc(abierto)}" tabindex="-1">${esc(nombreGrupo(abierto))}</h3>
        <span class="equipos-cuenta">${deCuantos(deEste.length)}</span>
        <p>${esc(GRUPOS[abierto]?.texto || "")}</p>
      </div>
      <div class="equipos-grilla">${deEste.map(tarjeta).join("")}</div>
    </section>`;
  /* La barra de categorías arranca mostrando la elegida. */
  const activa = $(".alq-otras .activa");
  if (activa) activa.parentElement.scrollLeft = activa.offsetLeft - activa.parentElement.offsetLeft - 16;
}

/** Abre una categoría de alquiler (o vuelve a las tarjetas con null) y deja
    la vista al comienzo del catálogo de alquiler. El paso queda en el
    historial, así el botón "atrás" del teléfono vuelve a las categorías. */
function elegirGrupo(id, { historial = true } = {}) {
  const antes = estado.grupo;
  estado.grupo = id;
  pintarAlquiler();
  if (historial) {
    const destino = id ? `#alquiler-${id}` : "#alquiler";
    if (id && !antes) history.pushState({ alquiler: id }, "", destino);
    else history.replaceState(id ? { alquiler: id } : null, "", destino);
  }
  /* Con "atrás" el navegador reacomoda el scroll después de este código:
     por eso la vista se acomoda un instante más tarde. */
  setTimeout(() => {
    const caja = $("#alquiler-catalogo");
    const arriba = caja.getBoundingClientRect().top;
    if (arriba < 90 || arriba > innerHeight * 0.5) caja.scrollIntoView({ block: "start" });
    if (id) $(`#alq-${id}`)?.focus({ preventScroll: true });
    else if (antes) $(`.alq-categoria[data-grupo="${antes}"]`)?.focus({ preventScroll: true });
  }, historial ? 0 : 60);
}

/* ══════ CARTELES ═════════════════════════════════════════ */

let focoPrevio = null;

function abrirCartel(id) {
  focoPrevio = document.activeElement;
  $(id).hidden = false;
  document.body.classList.add("sin-scroll");
  $(".cartel-hoja", $(id)).scrollTop = 0;
  $(".cartel-x", $(id)).focus();
}

function cerrarCartel(id) {
  if ($(id).hidden) return;
  $(id).hidden = true;
  if ($("#elegir").hidden && $("#cartel-producto").hidden) document.body.classList.remove("sin-scroll");
  if (focoPrevio) focoPrevio.focus();
}

function abrirFicha(id) {
  const p = CATALOGO.find((x) => x.id === id);
  if (!p) return;
  const rel = productosDe(p.categoria, CATALOGO).filter((x) => x.sub === p.sub && x.id !== p.id).slice(0, 5);
  $("#producto-cuerpo").innerHTML = `<div class="ficha-prod">
    <div class="ficha-prod-foto">${p.imagen
      ? `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}">` : SIN_FOTO}</div>
    <div class="ficha-prod-info">
      <p class="ficha-prod-sub">${esc(p.categoriaNombre)} · ${esc(nombreSub(p.categoria, p.sub))}</p>
      <h3 id="producto-titulo">${esc(p.nombre)}</h3>
      <dl class="tabla-datos">
        ${p.marca ? `<div><dt>Marca</dt><dd>${esc(p.marca)}</dd></div>` : ""}
        ${p.modelo ? `<div><dt>Modelo</dt><dd>${esc(p.modelo)}</dd></div>` : ""}
        ${p.medidas.length > 1 ? "" : `<div><dt>Código</dt><dd>${esc(p.sku)}</dd></div>`}
      </dl>
      ${p.medidas.length > 1 ? `<p class="ficha-prod-t">Medidas y códigos</p>
        <ul class="ficha-medidas">${p.medidas.map((m) =>
          `<li><span>${esc(m.detalle || "—")}</span><b>${esc(m.codigo)}</b></li>`).join("")}</ul>` : ""}
      ${p.caracteristicas ? `<p class="ficha-prod-t">Características</p><p class="ficha-prod-specs">${esc(p.caracteristicas)}</p>` : ""}
      <div class="ficha-prod-cta">
        <p class="ficha-prod-t">Consultanos por este producto</p>
        ${bloqueNumeros(mensajeProducto(p), `Consulta por ${p.nombre}`)}
      </div>
    </div>
  </div>
  ${rel.length ? `<div class="relacionados"><h4>Más en ${esc(nombreSub(p.categoria, p.sub))}</h4>
    <div class="relacionados-grid">${rel.map((r) =>
      `<button class="relacionado" type="button" data-ver="${r.id}">${r.imagen
        ? `<img src="${esc(r.imagen)}" alt="" loading="lazy">`
        : `<span class="sin">${SIN_FOTO}</span>`}<span>${esc(r.nombre)}</span></button>`).join("")}</div></div>` : ""}`;
  abrirCartel("#cartel-producto");
}

const MENSAJES = {
  general: mensajeGeneral,
  reparacion: mensajeReparacion,
  alquiler: mensajeAlquiler,
  presupuesto: mensajePresupuesto,
};

const DETALLES = {
  general: "Contanos qué necesitás y te respondemos.",
  reparacion: "Escribinos con la marca y el modelo de tu máquina.",
  alquiler: "Contanos qué trabajo tenés que hacer.",
  presupuesto: "Mandanos la lista de materiales y te la presupuestamos.",
};

function abrirElegir(mensaje, detalle) {
  $("#elegir-detalle").textContent = detalle;
  /* Si el detalle ya dice por qué es la consulta, sirve de asunto del correo. */
  $("#elegir-numeros").innerHTML = bloqueNumeros(mensaje, /^Consulta/.test(detalle) ? detalle.replace(/\.$/, "") : undefined);
  abrirCartel("#elegir");
}

/* ══════ MENÚ DEL CATÁLOGO ════════════════════════════════ */

const botonMega = $("#boton-catalogo");
const mega = $("#megamenu");
const tapa = $("#megamenu-tapa");

function cerrarMegamenu() {
  mega.hidden = true;
  tapa.hidden = true;
  botonMega.setAttribute("aria-expanded", "false");
}

function alternarMegamenu() {
  const abierto = botonMega.getAttribute("aria-expanded") === "true";
  if (!abierto) cerrarMenu();
  mega.hidden = abierto;
  tapa.hidden = abierto;
  botonMega.setAttribute("aria-expanded", String(!abierto));
}

/* El menú de secciones de las pantallas chicas. */
const abrirMenu = $("#abrir-menu");
const links = $("#tira-links");

function cerrarMenu() {
  links.classList.remove("abierto");
  abrirMenu.setAttribute("aria-expanded", "false");
}

/* ══════ ARRANQUE ═════════════════════════════════════════ */

if (DEMO) $("#demo").hidden = false;

/* Las fotos de fondo se encienden recién cuando el archivo existe. Mientras
   no esté, la sección se queda con su fondo liso y el navegador no insiste
   con una imagen que no está. Subir la foto a public/img/ alcanza. */
for (const [nombre, selector] of [
  ["frente", ".portada"],
]) {
  const prueba = new Image();
  prueba.addEventListener("load", () => {
    /* En un atributo style la dirección se resuelve desde la página, no
       desde la hoja de estilos: por eso va sin "../". */
    const el = $(selector);
    if (!el) return;
    el.style.setProperty("--foto", `url("${rutaFoto(nombre)}")`);
    /* Con foto de verdad, el velo se aclara: la clase lo dice en la hoja. */
    el.classList.add("con-foto");
  });
  prueba.src = rutaFoto(nombre);
}

pintarCabecera();
pintarPortada();
pintarRiel();
pintarIndice();
pintarMegamenu();
pintarCatalogo();
pintarRubros();
pintarAlquiler();
pintarVisitanos();
pintarPie();

/* Estado abierto / cerrado, en la barra de servicio y en la ficha */
const pintarEstado = () => {
  const { abierto, detalle } = estadoActual();
  $$("[data-estado]").forEach((cont) => {
    cont.classList.toggle("abierto", abierto);
    cont.classList.toggle("cerrado", !abierto);
    $("[data-estado-texto]", cont).textContent = abierto ? `Abierto ahora · ${detalle}` : `Cerrado · ${detalle}`;
  });
};
pintarEstado();
setInterval(pintarEstado, 60000);

/* Menú de pantallas chicas */
abrirMenu.addEventListener("click", () => {
  const abre = !links.classList.contains("abierto");
  if (abre) cerrarMegamenu();
  links.classList.toggle("abierto", abre);
  abrirMenu.setAttribute("aria-expanded", String(abre));
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") cerrarMenu();
});
/* Tocar fuera del menú lo cierra, como cualquier desplegable. */
document.addEventListener("click", (e) => {
  if (links.classList.contains("abierto") && !links.contains(e.target) && !abrirMenu.contains(e.target)) cerrarMenu();
});

/* En el celular el buscador es angosto: el texto de ayuda se acorta para que
   no quede cortado a la mitad. */
const angosto = matchMedia("(max-width: 640px)");
const ayudaBuscar = () => {
  $("#buscar").placeholder = angosto.matches ? "Buscar en el catálogo…" : "Buscar producto, marca, modelo o código…";
};
ayudaBuscar();
angosto.addEventListener("change", ayudaBuscar);

botonMega.addEventListener("click", alternarMegamenu);
tapa.addEventListener("click", cerrarMegamenu);

/* Buscador general: busca en todas las categorías a la vez. */
const campo = $("#buscar");
campo.addEventListener("input", (() => {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const antes = estado.q.trim();
      estado.q = campo.value;
      estado.limite = PASO;
      $("#buscar-x").hidden = !estado.q;
      pintarCatalogo();
      /* Al empezar a buscar llevamos la vista al catálogo, una sola vez. */
      if (!antes && estado.q.trim().length >= 2) {
        const caja = $("#catalogo").getBoundingClientRect();
        if (caja.top > innerHeight * 0.6 || caja.bottom < 0) {
          $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 170);
  };
})());

$("#buscar-x").addEventListener("click", () => {
  campo.value = ""; estado.q = ""; estado.limite = PASO;
  $("#buscar-x").hidden = true; pintarCatalogo(); campo.focus();
});

campo.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" }); }
});

$("#volver").addEventListener("click", volverAlIndice);

$("#ver-mas").addEventListener("click", () => {
  const lista = productosFiltrados();
  const desde = estado.limite;
  estado.limite += PASO;
  $("#productos").insertAdjacentHTML("beforeend", lista.slice(desde, estado.limite).map(tarjetaProducto).join(""));
  const faltan = lista.length - estado.limite;
  $("#ver-mas").hidden = faltan <= 0;
  if (faltan > 0) $("#ver-mas").textContent = `Ver más productos (quedan ${faltan})`;
});

document.addEventListener("click", (e) => {
  const t = e.target;

  const subChip = t.closest?.("[data-sub-chip]");
  if (subChip) { estado.sub = subChip.dataset.subChip; estado.limite = PASO; pintarCatalogo(); return; }

  const marcaChip = t.closest?.("[data-marca-chip]");
  if (marcaChip) { estado.marca = marcaChip.dataset.marcaChip; estado.limite = PASO; pintarCatalogo(); return; }

  const grupo = t.closest?.("[data-grupo]");
  if (grupo) { elegirGrupo(grupo.dataset.grupo); return; }

  if (t.closest?.("[data-alq-volver]")) {
    /* Si la categoría se abrió desde las tarjetas, "volver" es un paso atrás
       del historial; si se entró directo con el enlace, se va a las tarjetas. */
    if (history.state?.alquiler) history.back();
    else elegirGrupo(null);
    return;
  }

  const consulta = t.closest?.("[data-consulta]");
  if (consulta) { const c = consulta.dataset.consulta; abrirElegir(MENSAJES[c](), DETALLES[c]); return; }

  const porProducto = t.closest?.("[data-consulta-producto]");
  if (porProducto) {
    const p = CATALOGO.find((x) => x.id === porProducto.dataset.consultaProducto);
    if (p) abrirElegir(mensajeProducto(p), `Consulta por ${p.nombre}.`);
    return;
  }

  const porAlquiler = t.closest?.("[data-consulta-alquiler]");
  if (porAlquiler) {
    const m = EQUIPOS.find((x) => x.id === porAlquiler.dataset.consultaAlquiler);
    if (m) abrirElegir(mensajeAlquilerMaquina(m), `Consulta por el alquiler de ${m.nombre.toLowerCase()}.`);
    return;
  }

  const porCategoria = t.closest?.("[data-consulta-categoria]");
  if (porCategoria) {
    const c = categoriaPorId(porCategoria.dataset.consultaCategoria);
    if (c) abrirElegir(mensajeCategoria(c), `Consulta por ${c.nombre.toLowerCase()}.`);
    return;
  }

  const porRubro = t.closest?.("[data-consulta-rubro]");
  if (porRubro) {
    const r = rubroPorId(porRubro.dataset.consultaRubro);
    if (r) abrirElegir(mensajeRubro(r), `Consulta por ${r.nombre.toLowerCase()}.`);
    return;
  }

  const irRubro = t.closest?.("[data-ir-rubro]");
  if (irRubro) {
    cerrarMegamenu();
    $(`#rubro-${irRubro.dataset.irRubro}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const ir = t.closest?.("[data-ir-categoria]");
  if (ir) { abrirCategoria(ir.dataset.irCategoria); return; }

  const cat = t.closest?.("[data-cat]");
  if (cat) { abrirCategoria(cat.dataset.cat, cat.dataset.sub || "todas"); return; }

  const ver = t.closest?.("[data-ver]");
  if (ver) { abrirFicha(ver.dataset.ver); return; }

  if (t.closest?.("[data-cerrar-elegir]")) { cerrarCartel("#elegir"); return; }
  if (t.closest?.("[data-cerrar-producto]")) { cerrarCartel("#cartel-producto"); return; }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!mega.hidden) { cerrarMegamenu(); botonMega.focus(); return; }
  if (links.classList.contains("abierto")) { cerrarMenu(); abrirMenu.focus(); return; }
  if (!$("#elegir").hidden) cerrarCartel("#elegir");
  else if (!$("#cartel-producto").hidden) cerrarCartel("#cartel-producto");
});

/* Con el teclado, el foco se queda dentro del cartel que está abierto. */
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const hoja = !$("#cartel-producto").hidden
    ? $("#cartel-producto .cartel-hoja")
    : !$("#elegir").hidden ? $("#elegir .cartel-hoja") : null;
  if (!hoja) return;
  const focos = [...hoja.querySelectorAll(ENFOCABLES)].filter((el) => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (!hoja.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
  else if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
});

/* Si la dirección trae #cat-xxx, abrimos esa categoría directamente */
const enDireccion = () => location.hash.match(/^#cat-([a-z]+)$/);
const inicial = enDireccion();
if (inicial) abrirCategoria(inicial[1], "todas", false);
addEventListener("hashchange", () => {
  const h = enDireccion();
  if (h && h[1] !== estado.cat) abrirCategoria(h[1]);
});

/* Alquiler: #alquiler-<rubro> en la dirección abre esa categoría, y el botón
   "atrás" del navegador vuelve de una categoría a las tarjetas. */
const grupoEnDireccion = () => (location.hash.match(/^#alquiler-([a-z]+)$/) || [])[1] || null;
if (grupoEnDireccion() && GRUPOS[grupoEnDireccion()]) elegirGrupo(grupoEnDireccion(), { historial: false });
addEventListener("popstate", () => {
  const g = grupoEnDireccion();
  if (g !== estado.grupo && (g === null || GRUPOS[g])) elegirGrupo(g, { historial: false });
});

/* Sección activa en la tira de navegación */
const enlaces = $$(".tira-links a[href^='#']");
const secciones = enlaces.map((a) => $(a.getAttribute("href"))).filter(Boolean);
if (secciones.length) {
  const spy = new IntersectionObserver((es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      enlaces.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === `#${e.target.id}`));
    }
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  secciones.forEach((s) => spy.observe(s));
}

$$(".wa").forEach((el) => { el.innerHTML = WA_SVG; });
