/**
 * Panel de moderación de opiniones.
 * La clave vive sólo mientras la pestaña esté abierta.
 */

const $ = (s, c = document) => c.querySelector(s);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const GUARDADO = "millan-clave-panel";
let clave = sessionStorage.getItem(GUARDADO) || "";
let filtro = "pendiente";
let datos = { opiniones: [], resumen: {} };

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fecha(iso) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}, ${hh}:${mm}`;
}

const ESTRELLA = '<path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"/>';

function estrellas(n) {
  return `<span class="estrellas chicas" role="img" aria-label="${n} de 5 estrellas">${
    Array.from({ length: 5 }, (_, i) =>
      `<svg class="estrella${i < n ? " llena" : ""}" viewBox="0 0 24 24" aria-hidden="true">${ESTRELLA}</svg>`
    ).join("")
  }</span>`;
}

/* ── Llamadas ─────────────────────────────────────────────── */

async function pedir(opciones = {}) {
  const r = await fetch("/api/panel", {
    ...opciones,
    headers: { ...(opciones.headers || {}), Authorization: `Bearer ${clave}` },
  });
  const cuerpo = await r.json().catch(() => ({}));
  if (r.status === 401) {
    salir();
    throw new Error("La clave no es correcta.");
  }
  if (!r.ok) throw new Error(cuerpo.error || "No pudimos completar la operación.");
  return cuerpo;
}

function mostrarError(texto) {
  const p = $("#error");
  p.textContent = texto;
  p.hidden = !texto;
}

/* ── Pintado ──────────────────────────────────────────────── */

const FILTROS = [
  { id: "pendiente", txt: "Pendientes", cuenta: (r) => r.pendientes },
  { id: "aprobada", txt: "Aprobadas", cuenta: (r) => r.aprobadas },
  { id: "rechazada", txt: "Rechazadas", cuenta: (r) => r.rechazadas },
  { id: "todas", txt: "Todas", cuenta: (r) => r.total },
];

function pintarResumen(r) {
  $("#resumen").innerHTML = `
    <div class="pn-dato${r.pendientes ? " urgente" : ""}"><b>${r.pendientes}</b><span>Pendientes</span></div>
    <div class="pn-dato"><b>${r.aprobadas}</b><span>Aprobadas</span></div>
    <div class="pn-dato"><b>${r.destacadas}</b><span>Destacadas</span></div>
    <div class="pn-dato"><b>${r.total}</b><span>En total</span></div>`;

  $("#filtros").innerHTML = FILTROS.map((f) =>
    `<button class="chip${f.id === filtro ? " activa" : ""}" type="button" data-filtro="${f.id}"
      aria-pressed="${f.id === filtro}">${f.txt}<span class="n">${f.cuenta(r)}</span></button>`
  ).join("");
}

function botones(o) {
  const b = [];
  if (o.estado !== "aprobada") b.push(`<button class="pn-accion si" data-id="${o.id}" data-accion="aprobar">Aprobar</button>`);
  if (o.estado !== "rechazada") b.push(`<button class="pn-accion no" data-id="${o.id}" data-accion="rechazar">Rechazar</button>`);
  if (o.estado === "aprobada") {
    b.push(o.destacada
      ? `<button class="pn-accion" data-id="${o.id}" data-accion="quitar">Quitar de destacadas</button>`
      : `<button class="pn-accion" data-id="${o.id}" data-accion="destacar">Destacar</button>`);
  }
  b.push(`<button class="pn-accion no" data-id="${o.id}" data-accion="borrar">Borrar</button>`);
  return b.join("");
}

function fila(o) {
  return `<article class="pn-fila ${o.estado}">
    <div class="pn-fila-top">
      <b>${esc(o.nombre)}</b>
      ${estrellas(o.estrellas)}
      <span class="pn-etiqueta et-${o.estado}">${o.estado}</span>
      ${o.destacada ? '<span class="pn-etiqueta et-destacada">destacada</span>' : ""}
    </div>
    <p class="pn-texto">${esc(o.comentario)}</p>
    <div class="pn-pie">
      <span class="pn-fecha">${fecha(o.creada)}</span>
      ${botones(o)}
    </div>
  </article>`;
}

function pintar() {
  pintarResumen(datos.resumen);
  const lista = filtro === "todas"
    ? datos.opiniones
    : datos.opiniones.filter((o) => o.estado === filtro);
  $("#lista").innerHTML = lista.map(fila).join("");
  $("#vacio").hidden = lista.length > 0;
}

async function cargar() {
  try {
    mostrarError("");
    datos = await pedir();
    pintar();
  } catch (e) {
    mostrarError(e.message);
  }
}

/* ── Entrar y salir ───────────────────────────────────────── */

function entrar() {
  $("#entrar").hidden = true;
  $("#panel").hidden = false;
  cargar();
}

function salir() {
  clave = "";
  sessionStorage.removeItem(GUARDADO);
  $("#panel").hidden = true;
  $("#entrar").hidden = false;
}

$("#form-entrar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const error = $("#error-entrar");
  error.hidden = true;
  clave = $("#clave").value;
  try {
    datos = await pedir();
    sessionStorage.setItem(GUARDADO, clave);
    $("#clave").value = "";
    entrar();
  } catch (err) {
    clave = "";
    error.textContent = err.message;
    error.hidden = false;
  }
});

$("#salir").addEventListener("click", salir);

$("#filtros").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filtro]");
  if (!b) return;
  filtro = b.dataset.filtro;
  pintar();
});

$("#lista").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-accion]");
  if (!b) return;
  const { id, accion } = b.dataset;
  if (accion === "borrar" && !confirm("¿Borrar esta opinión? No se puede deshacer.")) return;

  b.disabled = true;
  try {
    await pedir({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accion }),
    });
    await cargar();
  } catch (err) {
    mostrarError(err.message);
    b.disabled = false;
  }
});

if (clave) entrar();
