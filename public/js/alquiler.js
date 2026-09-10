/* ══════════════════════════════════════════════════════════════════════════
   ALQUILER DE EQUIPOS

   Las categorías (GRUPOS) ya están armadas. La lista de máquinas (ALQUILER)
   arranca vacía a propósito: acá sólo van los equipos que el negocio alquila
   de verdad. Una categoría sin equipos cargados no se dibuja.

   PARA CARGAR UNA MÁQUINA, sumá un objeto a ALQUILER:

     {
       id: "martillo-demoledor",        // nombra la foto: img/alq/<id>.webp
       foto: false,                     // true cuando la foto ya esté cargada
       nombre: "Martillo demoledor",    // qué es la máquina
       grupo: "demolicion",             // una clave de GRUPOS
       descripcion: "Una línea sobre la máquina.",
       uso: "Para qué trabajos sirve.",
     }

   En las tarjetas no se muestra marca ni modelo, sólo qué es la máquina y
   para qué sirve: el parque de alquiler se renueva y conviene no atarlo a
   una marca puntual.

   PARA VER CÓMO QUEDA LA SECCIÓN LLENA, abrí la página con ?demo=1.
   ══════════════════════════════════════════════════════════════════════════ */

/** Las máquinas se muestran agrupadas por el tipo de trabajo que resuelven. */
export const GRUPOS = {
  demolicion: {
    nombre: "Demolición y hormigón",
    texto: "Martillos, hormigoneras y compactadores: romper, preparar y terminar el material.",
  },
  corte: {
    nombre: "Corte y perforación",
    texto: "Cortadoras, sierras, amoladoras y ahoyadoras para cortar, agujerear y abrir.",
  },
  jardin: {
    nombre: "Jardín y campo",
    texto: "Motosierras, motoguadañas, cortadoras de pasto y motobombas para el trabajo al aire libre.",
  },
  taller: {
    nombre: "Taller y obra",
    texto: "Soldadoras, compresores y generadores: energía y aire donde estés trabajando.",
  },
  elevacion: {
    nombre: "Elevación y traslado",
    texto: "Equipos para levantar peso y mover material dentro de la obra.",
  },
};

export const nombreGrupo = (id) => (GRUPOS[id] || {}).nombre || "Equipos";

/* Los equipos que se alquilan. Vacío hasta cargar el listado real. */
export const ALQUILER = [];

/* ── Vista de ejemplo (?demo=1) ────────────────────────────────────────────
   Equipos inventados, sólo para mirar el diseño de la sección. No se
   muestran nunca en la página normal.
   ────────────────────────────────────────────────────────────────────────── */

export const ALQUILER_EJEMPLO = [
  {
    id: "ej-martillo",
    foto: false,
    nombre: "Martillo demoledor",
    grupo: "demolicion",
    descripcion: "Equipo pesado para trabajo continuo de demolición.",
    uso: "Romper losas de hormigón, pisos gruesos, bases y contrapisos.",
  },
  {
    id: "ej-hormigonera",
    foto: false,
    nombre: "Hormigonera",
    grupo: "demolicion",
    descripcion: "Tambor con motor eléctrico para preparar mezcla en obra.",
    uso: "Hacer hormigón y mortero sin mezclar a pala.",
  },
  {
    id: "ej-cortadora",
    foto: false,
    nombre: "Cortadora de pisos",
    grupo: "corte",
    descripcion: "Máquina rodante con disco diamantado.",
    uso: "Cortar carpetas, veredas y pisos de hormigón.",
  },
  {
    id: "ej-motosierra",
    foto: false,
    nombre: "Motosierra",
    grupo: "jardin",
    descripcion: "Motosierra a explosión de cilindrada media.",
    uso: "Voltear y trozar árboles, cortar leña y ramas gruesas.",
  },
  {
    id: "ej-soldadora",
    foto: false,
    nombre: "Soldadora inverter",
    grupo: "taller",
    descripcion: "Equipo de soldar liviano, de arco estable.",
    uso: "Soldar hierro con electrodo: rejas, portones y reparaciones.",
  },
  {
    id: "ej-carretilla",
    foto: false,
    nombre: "Carretilla de obra",
    grupo: "elevacion",
    descripcion: "Carretilla reforzada de una rueda.",
    uso: "Trasladar mezcla, escombro, arena y materiales.",
  },
];

export function mensajeAlquilerMaquina(maquina) {
  return `Hola, quería consultar por el alquiler de ${maquina.nombre.toLowerCase()}. ¿Está disponible?`;
}
