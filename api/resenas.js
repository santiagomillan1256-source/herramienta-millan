/**
 * Reseñas de Google del local.
 *
 * Lee la ficha con la API de Places (New) y devuelve la puntuación y las
 * últimas opiniones. Google entrega hasta cinco por consulta.
 *
 * La clave NUNCA viaja al navegador: vive acá, en una variable de entorno.
 * Si no está configurada, el punto de entrada responde "habilitado: false" y
 * la página muestra igual los botones para ver y escribir reseñas en Google.
 *
 * Variables de entorno (en Vercel → Settings → Environment Variables):
 *   GOOGLE_MAPS_API_KEY   la clave, con la Places API (New) habilitada
 *   GOOGLE_PLACE_ID       opcional; por defecto, el local de Millán
 */

const CLAVE = process.env.GOOGLE_MAPS_API_KEY || "";
const LUGAR = process.env.GOOGLE_PLACE_ID || "ChIJV6PL-ts_gZYRSlwFeKtY-Jk";
const CAMPOS = "rating,userRatingCount,googleMapsUri,reviews";

/* Google cobra por consulta y las opiniones cambian poco: alcanza con
   preguntar cada seis horas y servir lo guardado en el medio. */
const VIGENCIA = 6 * 60 * 60 * 1000;
let guardado = { cuando: 0, datos: null };

function json(res, estado, cuerpo, segundos = 0) {
  res.statusCode = estado;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    segundos ? `public, max-age=${segundos}, s-maxage=${segundos}, stale-while-revalidate=86400` : "no-store"
  );
  res.end(JSON.stringify(cuerpo));
}

/** Deja de cada reseña sólo lo que la página necesita mostrar. */
function limpiar(r) {
  const autor = r.authorAttribution || {};
  return {
    autor: autor.displayName || "Cliente de Google",
    foto: autor.photoUri || "",
    perfil: autor.uri || "",
    estrellas: Number(r.rating) || 0,
    texto: (r.originalText?.text || r.text?.text || "").trim(),
    cuando: r.relativePublishTimeDescription || "",
    enlace: r.googleMapsUri || "",
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Método no permitido." });
  }

  if (!CLAVE) {
    return json(res, 200, {
      habilitado: false,
      motivo: "Falta configurar GOOGLE_MAPS_API_KEY.",
    });
  }

  if (guardado.datos && Date.now() - guardado.cuando < VIGENCIA) {
    return json(res, 200, guardado.datos, 3600);
  }

  try {
    const respuesta = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(LUGAR)}?languageCode=es&regionCode=AR`,
      { headers: { "X-Goog-Api-Key": CLAVE, "X-Goog-FieldMask": CAMPOS } }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("Places API:", respuesta.status, detalle.slice(0, 300));
      /* Si Google falla, mejor servir lo último que sabíamos que un hueco. */
      if (guardado.datos) return json(res, 200, guardado.datos, 300);
      return json(res, 200, { habilitado: false, motivo: "Google no respondió." });
    }

    const ficha = await respuesta.json();
    const datos = {
      habilitado: true,
      promedio: typeof ficha.rating === "number" ? ficha.rating : null,
      total: Number(ficha.userRatingCount) || 0,
      enlace: ficha.googleMapsUri || "",
      resenas: (ficha.reviews || []).map(limpiar).filter((r) => r.texto),
    };

    guardado = { cuando: Date.now(), datos };
    return json(res, 200, datos, 3600);
  } catch (e) {
    console.error(e);
    if (guardado.datos) return json(res, 200, guardado.datos, 300);
    return json(res, 200, { habilitado: false, motivo: "No pudimos consultar Google." });
  }
}
