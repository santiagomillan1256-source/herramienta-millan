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

  /* El teléfono fijo del local, tal como figura en la ficha de Google. */
  fijo: { visible: "0264 424-2212", tel: "+542644242212" },

  direccion: {
    calle: "Mendoza Sur 2357",
    barrio: "Villa Krause",
    localidad: "Rawson",
    provincia: "San Juan",
    codigoPostal: "J5425",
    referencia: "",
  },

  /* ── La ficha del local en Google ────────────────────────────────────────
     De acá salen el mapa, el botón de ubicación y las reseñas.
     `placeId` es el identificador del local en Google Maps: si algún día
     cambia la ficha, es el único valor que hay que actualizar.
     ──────────────────────────────────────────────────────────────────────── */
  google: {
    placeId: "ChIJV6PL-ts_gZYRSlwFeKtY-Jk",
    /* El nombre tal cual figura en la ficha. */
    nombre: "Ferretería y herramientas Millán S.A.S",
    /* Enlace corto de la ficha, para el botón "Ver ubicación en Google Maps". */
    ficha: "https://maps.app.goo.gl/td421uqogeY6N42M7",
    /* Para el mapa incrustado: la búsqueda con "+" en lugar de espacios. */
    consultaMapa:
      "Ferreteria+y+herramientas+Millan+S.A.S,+Mendoza+Sur+2357,+Villa+Krause,+San+Juan",
  },

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

/* ── Enlaces a la ficha de Google ─────────────────────────────────────────
   Todos se arman con el mismo `placeId`, así que no hay nada que mantener
   por separado: si cambia la ficha, se cambia el placeId y listo.
   ───────────────────────────────────────────────────────────────────────── */

const LUGAR = SITE.google.placeId;

export const GOOGLE = {
  /** La ficha del local en Google Maps. */
  ubicacion: SITE.google.ficha,
  /** Indicaciones para llegar desde donde esté el cliente. */
  comoLlegar:
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.google.nombre)}` +
    `&destination_place_id=${LUGAR}`,
  /** La ficha en Google Maps, donde se leen todas las opiniones.
   *  (La vieja dirección search.google.com/local/reviews ya da error 404.) */
  resenas:
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.google.nombre)}` +
    `&query_place_id=${LUGAR}`,
  /** El formulario de Google para escribir una opinión. */
  dejarResena: `https://search.google.com/local/writereview?placeid=${LUGAR}`,
  /** El mapa incrustado. No necesita clave de API. */
  mapa: `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${SITE.google.consultaMapa}!6i17!3m1!1ses!5m1!1ses`,
};

/* ── El catálogo con productos ────────────────────────────────────────────
   Máquinas a explosión, máquinas eléctricas y herramientas de mano: son las
   que llevan ficha, foto y buscador. Cada una es una entrada del riel del catálogo y sus
   subcategorías son los filtros de adentro.

   AGREGAR una categoría → sumá el objeto acá y usá el mismo `id` como clave
                           en filas.js.
   SACARLA               → borrá el objeto (y sus filas).
   RENOMBRARLA           → cambiá `nombre`; al `id` no conviene tocarlo,
                           porque nombra las fotos y los enlaces.
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
      banco: "Banco y carpintería",
      jardin: "Jardín",
      limpieza: "Hidrolavadoras y aspiradoras",
      bombas: "Bombas de agua y trasvase",
      otras: "Otras máquinas eléctricas",
    },
  },
  {
    id: "manuales",
    nombre: "Herramientas de mano",
    lema: "Pinzas, llaves, destornilladores, martillos, corte y medición",
    texto:
      "La herramienta de mano de todos los días, para el oficio y para la casa. Si no encontrás la medida que buscás, preguntanos.",
    icono: "llave",
    sub: {
      pinzas: "Pinzas y alicates",
      llaves: "Llaves",
      tubos: "Bocallaves y criques",
      destornilladores: "Destornilladores",
      martillos: "Martillos, mazas y punzones",
      corte: "Corte: tijeras, serruchos y cutters",
      medicion: "Medición y nivelación",
      sujecion: "Morsas y prensas",
      juegos: "Juegos de herramientas",
      otras: "Otras herramientas de mano",
    },
  },
];

/* ── Los otros rubros ─────────────────────────────────────────────────────
   No llevan catálogo de productos: son tarjetas con foto, nombre y un botón
   para consultar. El cliente ve que trabajamos el rubro y escribe.

   La foto de cada uno va en public/img/rubros/<id>.webp y aparece sola al
   subirla. Mientras no esté, la tarjeta se dibuja con su ícono y se ve igual
   de terminada.

   Para sumar un rubro: un objeto más en esta lista. Para sacarlo: borralo.
   ───────────────────────────────────────────────────────────────────────── */

export const RUBROS = [
  {
    id: "bulones",
    nombre: "Bulones",
    texto: "Fijaciones en las medidas que se piden todos los días, por unidad o por caja. Traé la pieza y te buscamos la que va.",
    icono: "bulon",
  },
  {
    id: "pinturas",
    nombre: "Pinturas",
    texto: "Pinturas para interior y exterior, con todo lo que hace falta para aplicarlas.",
    icono: "pintura",
  },
  {
    id: "pvc",
    nombre: "PVC",
    texto: "Caños, conexiones y accesorios para instalaciones de agua y de desagüe.",
    icono: "cano",
  },
  {
    id: "materiales",
    nombre: "Materiales",
    texto: "Materiales para la obra: lo que hace falta para levantar, revocar, impermeabilizar y terminar.",
    icono: "obra",
  },
  {
    id: "repuestos",
    nombre: "Repuestos",
    texto: "Lo que se gasta y lo que se cambia. Traé la pieza usada o el modelo de tu máquina.",
    icono: "engranaje",
  },
];

export const rubroPorId = (id) => RUBROS.find((r) => r.id === id) || null;

/* ── El local por dentro ──────────────────────────────────────────────────
   Las paradas del paseo en video, en el orden en que se recorre el salón.
   `t`    segundo del video (public/video/local.mp4) donde se detiene.
   `x, y` dónde va el punto en la vista general
          (public/img/local/vista-general.webp, 3206 × 308 píxeles).
   ───────────────────────────────────────────────────────────────────────── */

export const PARADAS = [
  { nombre: "Vitrina de la entrada", t: 0, x: 880, y: 135 },
  { nombre: "Palas y herramientas de jardín", t: 8, x: 1000, y: 70 },
  { nombre: "Sanitarios y vitrina", t: 13.75, x: 1110, y: 115 },
  { nombre: "Generadores y cajas de herramientas", t: 22.25, x: 1390, y: 165 },
  { nombre: "Motosierras y pinturas", t: 32.5, x: 85, y: 95 },
  { nombre: "Estantería del fondo", t: 38.75, x: 205, y: 50 },
  { nombre: "Compresores y escaleras", t: 44, x: 215, y: 180 },
  { nombre: "Mostrador y discos", t: 50.5, x: 450, y: 50 },
  { nombre: "Pasillo del fondo", t: 63, x: 1726, y: 95 },
  { nombre: "Herramientas de mano", t: 66.75, x: 1990, y: 70 },
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
   Formato: "codigo|nombre|marca|modelo|subcategoria|foto|caracteristicas|medidas"
   ───────────────────────────────────────────────────────────────────────── */

const clave = (s) => String(s).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9.]+/g, "");

export function armarProductos(filas) {
  return CATEGORIAS.flatMap((cat) =>
    (filas[cat.id] || []).map((fila) => {
      const [sku, nombre, marca, modelo, sub, foto, caracteristicas, medidas] = fila.split("|");
      return {
        // La marca va en el id porque dos marcas pueden usar el mismo código.
        id: `${cat.id}-${clave(marca || "")}-${clave(sku)}`,
        sku,
        nombre,
        marca: marca || "",
        modelo: modelo || "",
        categoria: cat.id,
        categoriaNombre: cat.nombre,
        sub: cat.sub[sub] ? sub : Object.keys(cat.sub)[0],
        // Foto: vacío = img/p/<categoria>-<codigo>.webp · "-" = todavía no hay · otro valor = nombre del archivo.
        imagen: foto === "-" ? "" : `img/p/${foto || `${cat.id}-${sku}.webp`}`,
        caracteristicas: caracteristicas || "",
        // Las medidas del mismo producto, cada una con su código: "codigo=medida;codigo=medida".
        medidas: (medidas || "").split(";").filter(Boolean).map((m) => {
          const [codigo, ...resto] = m.split("=");
          return { codigo, detalle: resto.join("=") };
        }),
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
    p.modelo ? `Modelo: ${p.modelo}` : null,
    p.medidas.length > 1 ? null : `Código: ${p.sku}`,
    p.medidas.length > 1 ? `Medida que necesito: ` : null,
    ``,
    `¿Tienen disponibilidad?`,
  ].filter((linea) => linea !== null).join("\n");
}

export function mensajeCategoria(cat) {
  return `Hola, ${SITE.nombre}. Quería consultar por ${cat.nombre.toLowerCase()}.`;
}

export function mensajeRubro(rubro) {
  return `Hola, ${SITE.nombre}. Quería consultar por ${rubro.nombre.toLowerCase()}.`;
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
