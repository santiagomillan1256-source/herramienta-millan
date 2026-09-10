/**
 * Guardado de las opiniones.
 *
 * En el sitio publicado usa la base de datos (variable POSTGRES_URL o
 * DATABASE_URL). Si no hay ninguna configurada —por ejemplo mientras se
 * prueba en la máquina— guarda en un archivo, así todo se puede probar
 * igual sin depender de la base.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const CADENA = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
export const HAY_BASE = Boolean(CADENA);

/* ── Base de datos ────────────────────────────────────────── */

let grupo = null;
let preparada = false;

async function conectar() {
  if (!grupo) {
    const { Pool } = await import("pg");
    grupo = new Pool({
      connectionString: CADENA,
      ssl: CADENA.includes("localhost") ? false : { rejectUnauthorized: false },
      max: 1,
    });
  }
  if (!preparada) {
    await grupo.query(`
      CREATE TABLE IF NOT EXISTS opiniones (
        id          TEXT PRIMARY KEY,
        nombre      TEXT        NOT NULL,
        estrellas   SMALLINT    NOT NULL,
        comentario  TEXT        NOT NULL,
        estado      TEXT        NOT NULL DEFAULT 'pendiente',
        destacada   BOOLEAN     NOT NULL DEFAULT FALSE,
        creada      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    preparada = true;
  }
  return grupo;
}

/* ── Archivo, para pruebas sin base ───────────────────────── */

const ARCHIVO = join(process.env.TMPDIR || process.env.TEMP || "/tmp", "opiniones-millan.json");

async function leerArchivo() {
  try { return JSON.parse(await readFile(ARCHIVO, "utf8")); }
  catch { return []; }
}

async function escribirArchivo(lista) {
  await mkdir(dirname(ARCHIVO), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(lista, null, 1));
}

/* ── Operaciones ──────────────────────────────────────────── */

const ordenar = (a, b) => new Date(b.creada) - new Date(a.creada);

/** Devuelve las opiniones. Sin argumentos, sólo las aprobadas. */
export async function listar({ todas = false } = {}) {
  if (HAY_BASE) {
    const bd = await conectar();
    const { rows } = todas
      ? await bd.query("SELECT * FROM opiniones ORDER BY creada DESC")
      : await bd.query("SELECT * FROM opiniones WHERE estado = 'aprobada' ORDER BY creada DESC");
    return rows;
  }
  const lista = await leerArchivo();
  return (todas ? lista : lista.filter((o) => o.estado === "aprobada")).sort(ordenar);
}

export async function crear({ nombre, estrellas, comentario }) {
  const opinion = {
    id: randomUUID(),
    nombre,
    estrellas,
    comentario,
    estado: "pendiente",
    destacada: false,
    creada: new Date().toISOString(),
  };
  if (HAY_BASE) {
    const bd = await conectar();
    await bd.query(
      "INSERT INTO opiniones (id, nombre, estrellas, comentario) VALUES ($1, $2, $3, $4)",
      [opinion.id, nombre, estrellas, comentario]
    );
    return opinion;
  }
  const lista = await leerArchivo();
  lista.push(opinion);
  await escribirArchivo(lista);
  return opinion;
}

export async function cambiar(id, campos) {
  const permitidos = { estado: "estado", destacada: "destacada" };
  const entradas = Object.entries(campos).filter(([k]) => permitidos[k]);
  if (!entradas.length) return null;

  if (HAY_BASE) {
    const bd = await conectar();
    const asignaciones = entradas.map(([k], i) => `${permitidos[k]} = $${i + 2}`).join(", ");
    const { rows } = await bd.query(
      `UPDATE opiniones SET ${asignaciones} WHERE id = $1 RETURNING *`,
      [id, ...entradas.map(([, v]) => v)]
    );
    return rows[0] || null;
  }
  const lista = await leerArchivo();
  const o = lista.find((x) => x.id === id);
  if (!o) return null;
  for (const [k, v] of entradas) o[k] = v;
  await escribirArchivo(lista);
  return o;
}

export async function borrar(id) {
  if (HAY_BASE) {
    const bd = await conectar();
    const { rowCount } = await bd.query("DELETE FROM opiniones WHERE id = $1", [id]);
    return rowCount > 0;
  }
  const lista = await leerArchivo();
  const quedan = lista.filter((x) => x.id !== id);
  if (quedan.length === lista.length) return false;
  await escribirArchivo(quedan);
  return true;
}
