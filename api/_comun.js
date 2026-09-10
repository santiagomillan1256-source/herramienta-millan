/** Utilidades compartidas por los puntos de entrada de la API. */

export function json(res, estado, cuerpo) {
  res.statusCode = estado;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(cuerpo));
}

/** Lee el cuerpo de la petición, con un tope para que nadie mande de más. */
export async function cuerpoJson(req, tope = 8 * 1024) {
  if (req.body && typeof req.body === "object") return req.body;
  let crudo = "";
  for await (const trozo of req) {
    crudo += trozo;
    if (crudo.length > tope) throw new Error("El mensaje es demasiado largo.");
  }
  if (!crudo) return {};
  try { return JSON.parse(crudo); }
  catch { throw new Error("No pudimos leer los datos enviados."); }
}

const LARGO_NOMBRE = 60;
const LARGO_COMENTARIO = 600;

/** Revisa lo que llega del formulario y lo deja limpio, o explica qué falta. */
export function revisarOpinion(datos) {
  const nombre = String(datos?.nombre ?? "").trim().replace(/\s+/g, " ");
  const comentario = String(datos?.comentario ?? "").trim();
  const estrellas = Number(datos?.estrellas);

  if (nombre.length < 2) return { error: "Escribí tu nombre." };
  if (nombre.length > LARGO_NOMBRE) return { error: `El nombre no puede pasar de ${LARGO_NOMBRE} caracteres.` };
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5)
    return { error: "Elegí una puntuación de 1 a 5 estrellas." };
  if (comentario.length < 10) return { error: "Contanos un poco más: al menos 10 caracteres." };
  if (comentario.length > LARGO_COMENTARIO)
    return { error: `El comentario no puede pasar de ${LARGO_COMENTARIO} caracteres.` };
  /* Campo señuelo: los formularios automáticos lo completan, las personas no. */
  if (String(datos?.web ?? "").trim()) return { error: "No pudimos enviar tu opinión." };

  return { opinion: { nombre, estrellas, comentario } };
}

/** Quita de una opinión lo que no tiene por qué ver el público. */
export function versionPublica(o) {
  return {
    id: o.id,
    nombre: o.nombre,
    estrellas: Number(o.estrellas),
    comentario: o.comentario,
    destacada: Boolean(o.destacada),
    creada: new Date(o.creada).toISOString(),
  };
}

/* ── Acceso al panel ──────────────────────────────────────── */

const CLAVE = process.env.CLAVE_PANEL || "";
export const HAY_CLAVE = Boolean(CLAVE);

/** Compara sin delatar por el tiempo de respuesta cuántos caracteres coinciden. */
export function claveCorrecta(recibida) {
  const a = String(recibida ?? "");
  if (!CLAVE || a.length !== CLAVE.length) return false;
  let diferencia = 0;
  for (let i = 0; i < CLAVE.length; i++) diferencia |= a.charCodeAt(i) ^ CLAVE.charCodeAt(i);
  return diferencia === 0;
}

/** Deja pasar sólo a quien manda la clave del panel. */
export function autorizado(req, res) {
  if (!HAY_CLAVE) {
    json(res, 503, { error: "El panel todavía no tiene clave configurada." });
    return false;
  }
  const cabecera = req.headers["authorization"] || "";
  const clave = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : "";
  if (!claveCorrecta(clave)) {
    json(res, 401, { error: "Clave incorrecta." });
    return false;
  }
  return true;
}
