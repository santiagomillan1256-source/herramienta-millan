/**
 * FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.
 * Datos del negocio, categorías del catálogo y armado de los productos.
 *
 * ┌─ DÓNDE TOCAR ──────────────────────────────────────────────────────────┐
 * │ Datos del negocio (teléfonos, redes, horarios, dirección) → SITE       │
 * │ Categorías y subcategorías del catálogo                  → CATEGORIAS  │
 * │ Los productos                                            → filas.js    │
 * │ Los equipos de alquiler                                  → alquiler.js │
 * └────────────────────────────────────────────────────────────────────────┘
 */

/* El catálogo se sirve aparte (ver index.html) para no exceder el tamaño de despliegue. */
const FILAS = globalThis.FILAS || {};

/* ── Datos del negocio ────────────────────────────────────── */

export const SITE = {
  /* El nombre completo, tal cual va en la documentación del negocio. */
  nombre: "FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.",
  /* El nombre partido, para el logo y el titular de la portada. */
  marca: "MILLAN",
  antes: "FERRETERIA Y HERRAMIENTAS",
  despues: "S.A.S.",
  bajada: "FERRETERÍA · HERRAMIENTAS",

  /* Los dos números atienden por WhatsApp y por llamada. */
  numeros: [
    {
      persona: "Magalí Millán",
      visible: "264 506-1440",
      wa: "5492645061440",
      tel: "+5492645061440",
    },
    {
      persona: "Marcelo Millán",
      visible: "264 661-9688",
      wa: "5492646619688",
      tel: "+5492646619688",
    },
  ],

  instagram: "https://www.instagram.com/herramientasmillan/",
  instagramUsuario: "@herramientasmillan",
  tiktok: "https://www.tiktok.com/@ferreteriamillan",
  tiktokUsuario: "@ferreteriamillan",

  /* ⚠ PENDIENTE: completar con la dirección real del local.
     Mientras un valor empiece con "[", la página lo muestra marcado
     para que se vea y no quede olvidado. */
  direccion: {
    calle: "[CALLE Y NÚMERO]",
    barrio: "[BARRIO]",
    localidad: "[LOCALIDAD]",
    provincia: "[PROVINCIA]",
    referencia: "[REFERENCIA PARA LLEGAR]",
  },
  /* Enlace corto de Google Maps del local. Cuando esté, el mapa se dibuja solo. */
  comoLlegar: "[ENLACE_COMO_LLEGAR]",
  /* Dirección para el mapa incrustado, con "+" en lugar de espacios.
     Ejemplo: "Ferreteria+Millan+Av.+Libertador+1234+San+Juan" */
  mapa: "",

  /* Franjas horarias en minutos desde las 00:00, por día (0 = domingo).
     480 = 08:00 · 780 = 13:00 · 960 = 16:00 · 990 = 16:30 · 1200 = 20:00 · 1230 = 20:30 */
  horarios: {
    0: [],
    1: [[480, 780], [960, 1230]],
    2: [[480, 780], [960, 1230]],
    3: [[480, 780], [960, 1230]],
    4: [[480, 780], [960, 1230]],
    5: [[480, 780], [960, 1230]],
    6: [[480, 780], [990, 1200]],
  },
  /* Lo mismo, escrito, para el cuadro de la sección Ubicación. */
  horariosTexto: [
    { dia: "Lunes a viernes", horas: "08:00 – 13:00 · 16:00 – 20:30" },
    { dia: "Sábados", horas: "08:00 – 13:00 · 16:30 – 20:00" },
    { dia: "Domingos", horas: "Cerrado" },
  ],
};

/** Un dato todavía sin completar: la página lo muestra marcado. */
export const pendiente = (v) => typeof v === "string" && v.trim().startsWith("[");

/* ── Categorías del catálogo ──────────────────────────────────────────────
   Cada categoría es una tarjeta en la portada del catálogo. Sus subcategorías
   son los filtros que aparecen adentro.

   AGREGAR una categoría → sumá un objeto a esta lista y usá el mismo `id`
                           como clave en filas.js.
   SACAR una categoría   → borrá el objeto (y sus filas).
   RENOMBRARLA           → cambiá `nombre`; al `id` conviene no tocarlo,
                           porque nombra las fotos y los enlaces.

   `icono` es una de las claves de ICONOS, más abajo.
   ───────────────────────────────────────────────────────────────────────── */

export const CATEGORIAS = [
  {
    id: "explosion",
    nombre: "Máquinas a explosión",
    lema: "Motosierras, desmalezadoras, generadores y motobombas",
    texto:
      "Máquinas con motor a explosión para el campo, la obra y el jardín. Te asesoramos sobre cilindrada, potencia y uso antes de comprar, y después te acompañamos con repuestos y servicio.",
    icono: "motor",
    sub: {
      motosierras: "Motosierras",
      desmalezadoras: "Desmalezadoras y bordeadoras",
      cortadoras: "Cortadoras de césped",
      motobombas: "Motobombas",
      generadores: "Grupos electrógenos",
      hidrolavadoras: "Hidrolavadoras",
      otras: "Otras máquinas a explosión",
    },
  },
  {
    id: "electricas",
    nombre: "Máquinas eléctricas",
    lema: "Taladros, amoladoras, sierras, soldadoras y herramienta a batería",
    texto:
      "Herramienta eléctrica de red y a batería para el taller, la obra y la casa. Con repuestos y con servicio de reparación propio.",
    icono: "taladro",
    sub: {
      taladros: "Taladros y atornilladores",
      amoladoras: "Amoladoras",
      sierras: "Sierras y caladoras",
      lijadoras: "Lijadoras y pulidoras",
      compresores: "Compresores y aire",
      soldadoras: "Soldadoras",
      bateria: "Herramienta a batería",
      otras: "Otras máquinas eléctricas",
    },
  },
  {
    id: "bulones",
    nombre: "Bulones",
    lema: "Bulones, tornillos, tuercas, arandelas y anclajes",
    texto:
      "Fijaciones por unidad o por caja, en las medidas que se piden todos los días. Traé la pieza y te buscamos la medida exacta en el mostrador.",
    icono: "bulon",
    sub: {
      bulones: "Bulones y tuercas",
      tornillos: "Tornillos",
      arandelas: "Arandelas",
      tarugos: "Tarugos y anclajes",
      clavos: "Clavos y remaches",
      varilla: "Varilla roscada",
    },
  },
  {
    id: "pinturas",
    nombre: "Pinturas",
    lema: "Látex, esmaltes, aerosoles, diluyentes y accesorios",
    texto:
      "Pinturas para interior y exterior, con todo lo que hace falta para aplicarlas: rodillos, pinceles, lijas, masillas y protecciones.",
    icono: "pintura",
    sub: {
      latex: "Látex y pintura de pared",
      sinteticos: "Esmaltes sintéticos",
      aerosoles: "Aerosoles",
      impermeabilizantes: "Impermeabilizantes",
      diluyentes: "Diluyentes y solventes",
      accesorios: "Pinceles, rodillos y bandejas",
      lijas: "Lijas y masillas",
    },
  },
  {
    id: "pvc",
    nombre: "PVC",
    lema: "Caños de agua, conexiones y accesorios",
    texto:
      "Caños, uniones, llaves de paso y todo lo que cierra una instalación de agua o de desagüe. Decinos el diámetro y el tipo de instalación y te armamos la lista.",
    icono: "cano",
    sub: {
      canos: "Caños",
      conexiones: "Conexiones y uniones",
      llaves: "Llaves de paso y válvulas",
      cloacal: "Cloacal y desagüe",
      riego: "Riego",
      pegamentos: "Pegamentos y selladores",
    },
  },
  {
    id: "cemento",
    nombre: "Cemento y membranas",
    lema: "Cemento, cal, mezclas, membranas e hidrófugos",
    texto:
      "Materiales para levantar, revocar, impermeabilizar y terminar. Consultanos por cantidad: para obra manejamos volumen.",
    icono: "obra",
    sub: {
      cemento: "Cemento y cal",
      mezclas: "Mezclas y adhesivos",
      membranas: "Membranas",
      hidrofugos: "Hidrófugos y aditivos",
      hierro: "Hierro y mallas",
    },
  },
  {
    id: "manuales",
    nombre: "Herramientas manuales",
    lema: "Llaves, pinzas, destornilladores, medición y albañilería",
    texto:
      "La herramienta de mano de todos los días, para el oficio y para la casa. Piezas sueltas o juegos completos.",
    icono: "llave",
    sub: {
      llaves: "Llaves y tubos",
      destornilladores: "Destornilladores",
      pinzas: "Pinzas y alicates",
      martillos: "Martillos y mazas",
      medicion: "Medición",
      albanileria: "Albañilería",
      cajas: "Cajas y organización",
    },
  },
  {
    id: "repuestos",
    nombre: "Repuestos y accesorios",
    lema: "Discos, mechas, cadenas, filtros y consumibles",
    texto:
      "Lo que se gasta y lo que se cambia. Traé la pieza usada o el modelo de tu máquina y te decimos si lo tenemos o lo pedimos.",
    icono: "engranaje",
    sub: {
      corte: "Discos y hojas de corte",
      mechas: "Mechas y brocas",
      cadenas: "Espadas, cadenas y limas",
      filtros: "Filtros, bujías y lubricantes",
      tanza: "Cabezales y tanza",
      varios: "Otros repuestos",
    },
  },
];

/* Dibujos de las tarjetas de categoría: trazo simple, toman el color del texto.
   Para una categoría nueva, sumá acá su dibujo y nombralo en `icono`. */
export const ICONOS = {
  motor:
    '<path d="M3 15v-4h2l1.6-3H12l2 3h3l3.4 2.2V17h-2.2"/><path d="M3 15v2h13"/><path d="M9 8V5.2h4.4"/><circle cx="7.6" cy="17.4" r="1.6"/><circle cx="17.6" cy="17.4" r="1.6"/>',
  taladro:
    '<path d="M3.5 8.2h9.2v5.2H3.5z"/><path d="M12.7 9.6h4.1l3.7-2.2v6l-3.7-2.2"/><path d="M6 13.4v3.4h3v-3.4"/>',
  bulon:
    '<path d="m12 2.8 7 3.9v8.6l-7 3.9-7-3.9V6.7z"/><circle cx="12" cy="11" r="3.3"/><path d="M9.6 21.4h4.8"/>',
  pintura:
    '<path d="M3.6 3.9h11v6.2h-11z"/><path d="M14.6 5.8h3.2a2 2 0 0 1 2 2v3.1h-5.2"/><path d="M10.6 10.1v3.4a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 0-2.4 2.4v2.6"/>',
  cano:
    '<path d="M2.6 9.2h7v5.6h-7z"/><path d="M14.4 9.2h7v5.6h-7z"/><path d="M9.6 7.4h4.8v9.2H9.6z"/>',
  obra:
    '<path d="M2.8 20.4h18.4"/><path d="M5.2 20.4V9.3L12 4.2l6.8 5.1v11.1"/><path d="M9.2 20.4v-5.8h5.6v5.8"/>',
  llave:
    '<path d="M14.4 6.4a4.1 4.1 0 0 0 5.4 5.4l-8.2 8.2a2.6 2.6 0 0 1-3.7-3.7z"/><path d="m14.4 6.4 2.7-2.7a4.1 4.1 0 0 0-5.1 5.1"/>',
  engranaje:
    '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
  herramienta:
    '<path d="M14.7 6.3a4 4 0 0 0 5.3 5.3l-8 8a2.5 2.5 0 0 1-3.5-3.5z"/><path d="M14.7 6.3 17.3 3.7a4 4 0 0 0-5 5"/>',
};

export const categoriaPorId = (id) => CATEGORIAS.find((c) => c.id === id) || null;

export function nombreSub(catId, subId) {
  const c = categoriaPorId(catId);
  return (c && c.sub[subId]) || "Otros";
}

/* ── Productos ────────────────────────────────────────────────────────────
   Las filas de filas.js se convierten acá en objetos.
   Formato: "codigo|nombre|marca|modelo|subcategoria|foto|caracteristicas"
   ───────────────────────────────────────────────────────────────────────── */

export function armarProductos(filas) {
  return CATEGORIAS.flatMap((cat) =>
    (filas[cat.id] || []).map((fila) => {
      const [sku, nombre, marca, modelo, sub, foto, caracteristicas] = fila.split("|");
      return {
        id: `${cat.id}-${String(sku).toLowerCase()}`,
        sku,
        nombre,
        marca: marca || "",
        modelo: modelo || sku,
        categoria: cat.id,
        categoriaNombre: cat.nombre,
        sub: cat.sub[sub] ? sub : Object.keys(cat.sub)[0],
        // El sexto campo lleva "-" cuando todavía no tenemos foto del producto.
        imagen: foto === "-" ? "" : `img/p/${cat.id}-${sku}.webp`,
        caracteristicas: caracteristicas || "",
      };
    })
  );
}

export const PRODUCTOS = armarProductos(FILAS);

export const productosDe = (catId, lista = PRODUCTOS) =>
  lista.filter((p) => p.categoria === catId);

/** Las marcas que aparecen en una categoría, para el filtro de marca. */
export function marcasDe(catId, lista = PRODUCTOS) {
  return [...new Set(productosDe(catId, lista).map((p) => p.marca).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
}

/* ── Consultas ────────────────────────────────────────────── */

/** Enlace de WhatsApp a uno de los dos números, con el mensaje ya escrito. */
export function waLink(numero, mensaje) {
  return `https://wa.me/${numero.wa}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeGeneral() {
  return `Hola, ${SITE.nombre}. Quería hacerles una consulta.`;
}

export function mensajeProducto(p) {
  return [
    `Hola, ${SITE.nombre}.`,
    ``,
    `Quería consultar por este producto:`,
    ``,
    `Producto: ${p.nombre}`,
    p.marca ? `Marca: ${p.marca}` : null,
    `Modelo: ${p.modelo}`,
    `Código: ${p.sku}`,
    ``,
    `¿Tienen disponibilidad?`,
  ].filter((linea) => linea !== null).join("\n");
}

export function mensajeCategoria(cat) {
  return `Hola, ${SITE.nombre}. Quería consultar por ${cat.nombre.toLowerCase()}.`;
}

export function mensajeReparacion() {
  return `Hola, ${SITE.nombre}. Quería consultar por el servicio de reparación de una máquina.`;
}

export function mensajeAlquiler() {
  return `Hola, ${SITE.nombre}. Quería consultar por el alquiler de un equipo.`;
}

export function mensajePresupuesto() {
  return `Hola, ${SITE.nombre}. Quería pedirles un presupuesto por una lista de materiales.`;
}

/* ── Abierto / cerrado en este momento ────────────────────── */

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function estadoActual(ahora = new Date()) {
  const arg = new Date(
    ahora.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
  );
  const dia = arg.getDay();
  const min = arg.getHours() * 60 + arg.getMinutes();
  const franjas = SITE.horarios[dia] || [];

  for (const [desde, hasta] of franjas) {
    if (min >= desde && min < hasta) return { abierto: true, detalle: `Cierra ${hora(hasta)}` };
  }

  const masTarde = franjas.find(([desde]) => min < desde);
  if (masTarde) return { abierto: false, detalle: `Abre ${hora(masTarde[0])}` };

  // Ya cerró por hoy: buscamos el próximo día con atención.
  for (let salto = 1; salto <= 7; salto++) {
    const proximo = (dia + salto) % 7;
    const deEseDia = SITE.horarios[proximo] || [];
    if (!deEseDia.length) continue;
    const cuando = salto === 1 ? "mañana" : `el ${DIAS[proximo]}`;
    return { abierto: false, detalle: `Abre ${cuando} ${hora(deEseDia[0][0])}` };
  }
  return { abierto: false, detalle: "Consultanos por WhatsApp" };
}

function hora(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
