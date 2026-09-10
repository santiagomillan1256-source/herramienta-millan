/**
 * Panel de moderación. Todo acá pide la clave.
 *
 * GET   lista todas las opiniones, incluidas las pendientes.
 * POST  aplica una acción: aprobar, rechazar, destacar, quitar o borrar.
 */

import { listar, cambiar, borrar } from "./_almacen.js";
import { json, cuerpoJson, autorizado } from "./_comun.js";

const ACCIONES = {
  aprobar: { estado: "aprobada" },
  rechazar: { estado: "rechazada" },
  volver: { estado: "pendiente" },
  destacar: { destacada: true },
  quitar: { destacada: false },
};

export default async function handler(req, res) {
  try {
    if (!autorizado(req, res)) return;

    if (req.method === "GET") {
      const todas = await listar({ todas: true });
      const cuenta = (estado) => todas.filter((o) => o.estado === estado).length;
      return json(res, 200, {
        opiniones: todas.map((o) => ({
          id: o.id,
          nombre: o.nombre,
          estrellas: Number(o.estrellas),
          comentario: o.comentario,
          estado: o.estado,
          destacada: Boolean(o.destacada),
          creada: new Date(o.creada).toISOString(),
        })),
        resumen: {
          total: todas.length,
          pendientes: cuenta("pendiente"),
          aprobadas: cuenta("aprobada"),
          rechazadas: cuenta("rechazada"),
          destacadas: todas.filter((o) => o.destacada && o.estado === "aprobada").length,
        },
      });
    }

    if (req.method === "POST") {
      const { id, accion } = await cuerpoJson(req);
      if (!id) return json(res, 400, { error: "Falta indicar la opinión." });

      if (accion === "borrar") {
        const fue = await borrar(id);
        return fue
          ? json(res, 200, { ok: true })
          : json(res, 404, { error: "Esa opinión ya no está." });
      }

      const campos = ACCIONES[accion];
      if (!campos) return json(res, 400, { error: "Esa acción no existe." });

      /* Destacar sólo tiene sentido sobre una opinión ya aprobada. */
      if (accion === "destacar") {
        const todas = await listar({ todas: true });
        const o = todas.find((x) => x.id === id);
        if (!o) return json(res, 404, { error: "Esa opinión ya no está." });
        if (o.estado !== "aprobada") {
          return json(res, 400, { error: "Primero aprobá la opinión y después destacala." });
        }
      }

      const actualizada = await cambiar(id, campos);
      return actualizada
        ? json(res, 200, { ok: true })
        : json(res, 404, { error: "Esa opinión ya no está." });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Método no permitido." });
  } catch (e) {
    return json(res, 500, { error: e.message || "No pudimos procesar la solicitud." });
  }
}
