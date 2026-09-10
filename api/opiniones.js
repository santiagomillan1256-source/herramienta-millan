/**
 * Opiniones de clientes, parte pública.
 *
 * GET  devuelve solamente las aprobadas, más el promedio.
 * POST recibe una opinión nueva, que queda pendiente de aprobación.
 *      Lo que se manda acá NO aparece en la página hasta que se apruebe.
 */

import { listar, crear, HAY_BASE } from "./_almacen.js";
import { json, cuerpoJson, revisarOpinion, versionPublica } from "./_comun.js";

/**
 * En el sitio publicado sin base de datos no hay dónde guardar nada de forma
 * duradera. Antes que aceptar opiniones que se van a perder, preferimos
 * esconder el formulario y decirlo.
 */
const HABILITADO = HAY_BASE || !process.env.VERCEL;

/** A partir de cuántas opiniones aprobadas mostramos la puntuación general. */
const MINIMO_PARA_PROMEDIO = 3;

/* Freno simple para que nadie mande decenas de opiniones seguidas. */
const ESPERA = 60 * 1000;
const MAXIMO = 3;
const ultimas = new Map();

function vaMuyRapido(quien) {
  const ahora = Date.now();
  const previas = (ultimas.get(quien) || []).filter((t) => ahora - t < ESPERA);
  if (previas.length >= MAXIMO) return true;
  previas.push(ahora);
  ultimas.set(quien, previas);
  if (ultimas.size > 500) ultimas.clear();
  return false;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const aprobadas = (await listar()).map(versionPublica);
      const suma = aprobadas.reduce((t, o) => t + o.estrellas, 0);
      return json(res, 200, {
        habilitado: HABILITADO,
        opiniones: aprobadas,
        total: aprobadas.length,
        promedio: aprobadas.length >= MINIMO_PARA_PROMEDIO
          ? Math.round((suma / aprobadas.length) * 10) / 10
          : null,
        destacadas: aprobadas.filter((o) => o.destacada),
      });
    }

    if (req.method === "POST") {
      if (!HABILITADO) {
        return json(res, 503, {
          error: "Todavía no podemos recibir opiniones desde acá. Escribinos por WhatsApp y con gusto te leemos.",
        });
      }
      const quien = String(req.headers["x-forwarded-for"] || "sin-direccion").split(",")[0].trim();
      if (vaMuyRapido(quien)) {
        return json(res, 429, { error: "Esperá un momento antes de mandar otra opinión." });
      }
      const datos = await cuerpoJson(req);
      const { error, opinion } = revisarOpinion(datos);
      if (error) return json(res, 400, { error });

      await crear(opinion);
      return json(res, 201, {
        ok: true,
        mensaje: "¡Gracias! Tu opinión quedó registrada y la vamos a revisar antes de publicarla.",
      });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Método no permitido." });
  } catch (e) {
    return json(res, 500, { error: e.message || "No pudimos procesar la solicitud." });
  }
}
