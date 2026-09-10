/**
 * Opiniones de clientes: destacadas, listado y formulario.
 * Sólo se muestran las que ya fueron aprobadas desde el panel.
 */

const $ = (s, c = document) => c.querySelector(s);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const ESTRELLA = '<path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"/>';

/** Fila de estrellas, con las llenas en color y las vacías apagadas. */
function estrellas(n, clase = "") {
  const total = 5;
  const svg = (llena) =>
    `<svg class="estrella${llena ? " llena" : ""}" viewBox="0 0 24 24" aria-hidden="true">${ESTRELLA}</svg>`;
  return `<span class="estrellas ${clase}" role="img" aria-label="${n} de ${total} estrellas">${
    Array.from({ length: total }, (_, i) => svg(i < n)).join("")
  }</span>`;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fecha(iso) {
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/* ── Pintado ──────────────────────────────────────────────── */

function tarjetaDestacada(o) {
  return `<figure class="op-destacada">
    ${estrellas(o.estrellas)}
    <blockquote>${esc(o.comentario)}</blockquote>
    <figcaption>${esc(o.nombre)}<span>${fecha(o.creada)}</span></figcaption>
  </figure>`;
}

function tarjeta(o) {
  return `<article class="op-card">
    <header class="op-card-top">
      <span class="op-nombre">${esc(o.nombre)}</span>
      ${estrellas(o.estrellas, "chicas")}
    </header>
    <p class="op-texto">${esc(o.comentario)}</p>
    <p class="op-fecha">${fecha(o.creada)}</p>
  </article>`;
}

/** Saca la sección de la página, junto con los enlaces que llevan a ella. */
function ocultarSeccion() {
  const seccion = $("#opiniones");
  if (seccion) seccion.hidden = true;
  document.querySelectorAll('a[href="#opiniones"]').forEach((a) => a.remove());
}

function pintarResumen({ promedio, total }) {
  const caja = $("#op-resumen");
  if (!promedio) { caja.hidden = true; return; }
  caja.hidden = false;
  caja.innerHTML = `<span class="op-nota">${promedio.toFixed(1).replace(".", ",")}</span>
    ${estrellas(Math.round(promedio))}
    <span class="op-cuenta">sobre ${total} ${total === 1 ? "opinión" : "opiniones"}</span>`;
}

function pintar(datos) {
  const { opiniones, destacadas } = datos;

  /* Si todavía no se pueden recibir opiniones, escondemos el formulario
     en vez de dejar que alguien escriba algo que no vamos a poder guardar.
     Y si además no hay ninguna publicada, la sección entera no aporta nada. */
  const cerrado = datos.habilitado === false;
  const caja = $(".op-form-caja");
  if (caja) caja.hidden = cerrado;
  if (cerrado && opiniones.length === 0) return ocultarSeccion();

  const zonaDestacadas = $("#op-destacadas");
  zonaDestacadas.innerHTML = destacadas.map(tarjetaDestacada).join("");
  $("#op-destacadas-bloque").hidden = destacadas.length === 0;

  const lista = $("#op-lista");
  lista.innerHTML = opiniones.map(tarjeta).join("");
  lista.hidden = opiniones.length === 0;
  $("#op-vacio").hidden = opiniones.length > 0;
  $("#op-titulo-lista").hidden = opiniones.length === 0;

  pintarResumen(datos);
}

async function cargar() {
  try {
    const r = await fetch("/api/opiniones", { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error();
    pintar(await r.json());
  } catch {
    /* Sin respuesta del servidor no hay nada que mostrar ni dónde guardar:
       preferimos que la sección no aparezca antes que dejar un formulario roto. */
    ocultarSeccion();
  }
}

/* ── Formulario ───────────────────────────────────────────── */

function prepararFormulario() {
  const form = $("#op-form");
  if (!form) return;
  const aviso = $("#op-aviso");
  const botones = [...form.querySelectorAll("[data-puntua]")];
  const campoEstrellas = $("#op-estrellas");

  function marcar(n) {
    campoEstrellas.value = String(n);
    botones.forEach((b, i) => {
      const activa = i < n;
      b.classList.toggle("activa", activa);
      b.setAttribute("aria-checked", String(i + 1 === n));
    });
  }
  botones.forEach((b, i) => b.addEventListener("click", () => marcar(i + 1)));
  marcar(5);

  function decir(texto, tipo) {
    aviso.textContent = texto;
    aviso.className = `op-aviso ${tipo}`;
    aviso.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enviar = $("#op-enviar");
    enviar.disabled = true;
    aviso.hidden = true;

    try {
      const r = await fetch("/api/opiniones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: $("#op-nombre").value,
          estrellas: Number(campoEstrellas.value),
          comentario: $("#op-comentario").value,
          web: $("#op-web").value,
        }),
      });
      const datos = await r.json();
      if (!r.ok) { decir(datos.error || "No pudimos enviar tu opinión.", "mal"); return; }
      decir(datos.mensaje, "bien");
      form.reset();
      marcar(5);
    } catch {
      decir("No pudimos conectar. Probá de nuevo en un momento.", "mal");
    } finally {
      enviar.disabled = false;
    }
  });
}

prepararFormulario();
cargar();
