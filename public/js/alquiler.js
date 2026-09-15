/* ══════════════════════════════════════════════════════════════════════════
   ALQUILER DE EQUIPOS

   Las máquinas que el negocio da en alquiler, agrupadas por el tipo de trabajo
   que resuelven. Una categoría sin equipos cargados no se dibuja.

   PARA CARGAR UNA MÁQUINA, sumá un objeto a ALQUILER:

     {
       id: "martillo-demoledor",        // nombra la foto: img/alq/<id>.webp
       foto: true,                      // false mientras no haya foto
       nombre: "Martillo demoledor",    // qué es la máquina
       grupo: "demolicion",             // una clave de GRUPOS
       descripcion: "Una línea sobre la máquina.",
       caracteristicas: ["Rasgo principal", "Otro rasgo"],
       uso: "Para qué trabajos sirve.",
     }

   En las tarjetas no se muestra marca ni modelo, sólo qué es la máquina y
   para qué sirve: el parque de alquiler se renueva y conviene no atarlo a
   una marca puntual. Las características son las que definen al tipo de
   máquina (peso, capacidad, motor), nunca datos de un modelo en particular.
   ══════════════════════════════════════════════════════════════════════════ */

/** Las máquinas se muestran agrupadas por el tipo de trabajo que resuelven. */
export const GRUPOS = {
  demolicion: {
    nombre: "Demolición y hormigón",
    texto: "Martillos demoledores, hormigonera, vibrador, compactadores y llana: romper, preparar y terminar el material.",
  },
  corte: {
    nombre: "Corte y perforación",
    texto: "Cortadora de piso, amoladoras, sierras, taladros y ahoyadoras para cortar, agujerear y abrir.",
  },
  jardin: {
    nombre: "Jardín y campo",
    texto: "Motosierras, podadora de altura, motoguadaña, cortadora de pasto y motobomba para el trabajo al aire libre.",
  },
  taller: {
    nombre: "Taller y obra",
    texto: "Soldadora, compresores, generadores y equipos de apoyo: energía, aire y calor donde estés trabajando.",
  },
  elevacion: {
    nombre: "Elevación y traslado",
    texto: "Gatos hidráulicos y carretilla para levantar peso y mover material.",
  },
};

export const nombreGrupo = (id) => (GRUPOS[id] || {}).nombre || "Equipos";

export const ALQUILER = [
  /* ── Demolición y hormigón ── */
  {
    id: "martillo-20",
    foto: true,
    nombre: "Martillo demoledor de 20 kg",
    grupo: "demolicion",
    descripcion: "El martillo más pesado del parque, pensado para trabajo continuo de demolición.",
    caracteristicas: ["Peso: 20 kg", "Eléctrico, se usa en posición vertical", "Trabaja con punta o cincel"],
    uso: "Romper losas de hormigón, pisos gruesos, bases y contrapisos.",
  },
  {
    id: "martillo-15",
    foto: true,
    nombre: "Martillo demoledor de 15 kg",
    grupo: "demolicion",
    descripcion: "Potencia alta con un peso todavía manejable durante la jornada.",
    caracteristicas: ["Peso: 15 kg", "Eléctrico, a dos manos", "Trabaja con punta o cincel"],
    uso: "Demoler paredes de material, veredas y pisos de espesor medio.",
  },
  {
    id: "martillo-10",
    foto: true,
    nombre: "Martillo demoledor de 10 kg",
    grupo: "demolicion",
    descripcion: "El punto medio: rinde en demolición sin cansar como los más pesados.",
    caracteristicas: ["Peso: 10 kg", "Eléctrico, a dos manos", "Trabaja con punta o cincel"],
    uso: "Picar revoques, abrir canaletas anchas y levantar cerámicos y carpetas.",
  },
  {
    id: "martillo-7",
    foto: true,
    nombre: "Martillo demoledor de 7 kg",
    grupo: "demolicion",
    descripcion: "Liviano: se maneja con comodidad también en pared, en posición horizontal.",
    caracteristicas: ["Peso: 7 kg", "Eléctrico, liviano", "Sirve para trabajo en pared"],
    uso: "Trabajos de precisión: canaletas, pases de caños y demolición en pared.",
  },
  {
    id: "hormigonera-130",
    foto: true,
    nombre: "Hormigonera de 130 litros",
    grupo: "demolicion",
    descripcion: "Trompo con motor eléctrico para preparar la mezcla en la obra.",
    caracteristicas: ["Capacidad del tambor: 130 litros", "Motor eléctrico", "Sobre ruedas para moverla"],
    uso: "Hacer hormigón, mortero y mezcla de asiento sin amasar a pala.",
  },
  {
    id: "vibrador-hormigon",
    foto: true,
    nombre: "Vibrador de hormigón",
    grupo: "demolicion",
    descripcion: "Motor con manguera flexible y aguja que compacta el hormigón recién colado.",
    caracteristicas: ["Aguja vibradora en la punta", "Manguera flexible", "Se usa con el hormigón fresco"],
    uso: "Sacar el aire de columnas, vigas y plateas para que el hormigón quede parejo.",
  },
  {
    id: "placa-compactadora",
    foto: true,
    nombre: "Placa compactadora",
    grupo: "demolicion",
    descripcion: "Placa vibratoria que avanza sola y compacta por superficie.",
    caracteristicas: ["Placa vibratoria de base plana", "Avanza sola al vibrar", "Manija de guía"],
    uso: "Asentar suelo, arena y ripio antes de contrapisos, veredas y adoquines.",
  },
  {
    id: "canguro-compactador",
    foto: true,
    nombre: "Canguro compactador",
    grupo: "demolicion",
    descripcion: "Compactador de golpe vertical: entra donde la placa no llega.",
    caracteristicas: ["Compacta a golpes, de arriba hacia abajo", "Zapata angosta", "Motor a explosión"],
    uso: "Compactar zanjas, rellenos angostos y fondos de cimiento.",
  },
  {
    id: "llana-mecanica-90",
    foto: true,
    nombre: "Llana mecánica de 90",
    grupo: "demolicion",
    descripcion: "Alisadora de aspas con motor a explosión para pisos de hormigón.",
    caracteristicas: ["Diámetro de trabajo: 90 cm", "Motor a explosión de 6 HP", "Aspas giratorias con aro de protección"],
    uso: "Alisar y dar terminación a pisos de hormigón de superficie grande.",
  },

  /* ── Corte y perforación ── */
  {
    id: "cortadora-concreto",
    foto: true,
    nombre: "Cortadora de concreto de piso",
    grupo: "corte",
    descripcion: "Carro con disco de corte que se apoya y avanza sobre el piso.",
    caracteristicas: ["Disco de corte montado en carro", "Se empuja sobre ruedas", "Corte en línea recta"],
    uso: "Cortar hormigón y asfalto: juntas, zanjas y pases de caño.",
  },
  {
    id: "amoladora-45",
    foto: true,
    nombre: "Amoladora de 4,5",
    grupo: "corte",
    descripcion: "Amoladora angular chica, de una mano, para corte y desbaste.",
    caracteristicas: ["Disco de 4,5 pulgadas (115 mm)", "Eléctrica, liviana", "Empuñadura lateral"],
    uso: "Cortar hierro, cerámica y perfiles; limpiar soldaduras y rebabas.",
  },
  {
    id: "amoladora-9",
    foto: true,
    nombre: "Amoladora de 9",
    grupo: "corte",
    descripcion: "Amoladora grande, de dos manos, con mucha más profundidad de corte.",
    caracteristicas: ["Disco de 9 pulgadas (230 mm)", "Eléctrica, a dos manos", "Mayor profundidad de corte"],
    uso: "Cortar mampostería, losetas, caños de buen diámetro y hierro grueso.",
  },
  {
    id: "circular-mano",
    foto: true,
    nombre: "Circular de mano",
    grupo: "corte",
    descripcion: "Sierra circular portátil con guía de profundidad y de ángulo.",
    caracteristicas: ["Hoja circular dentada", "Profundidad de corte regulable", "Base inclinable para cortes en bisel"],
    uso: "Cortar tablas, placas y tirantes, derecho o en bisel.",
  },
  {
    id: "ingleteadora",
    foto: true,
    nombre: "Ingleteadora",
    grupo: "corte",
    descripcion: "Sierra de banco con cabezal que gira e inclina para cortar en ángulo.",
    caracteristicas: ["Cabezal que gira para cortes a inglete", "Base con escala de ángulos", "Cortes repetidos y exactos"],
    uso: "Cortes prolijos en zócalos, marcos, molduras y machimbre.",
  },
  {
    id: "caladora",
    foto: true,
    nombre: "Caladora",
    grupo: "corte",
    descripcion: "Sierra de hoja fina que sigue curvas y arranca desde un agujero.",
    caracteristicas: ["Hoja fina de movimiento vertical", "Base apoyada sobre la pieza", "Hace cortes curvos"],
    uso: "Cortes curvos y calados en madera, melamina, chapa fina y plástico.",
  },
  {
    id: "roto-percutor",
    foto: true,
    nombre: "Roto percutor SDS Plus",
    grupo: "corte",
    descripcion: "Taladro con golpe y mecha de encastre rápido; también sirve para picar.",
    caracteristicas: ["Encastre SDS Plus", "Perfora con percusión", "Modo para picar"],
    uso: "Perforar hormigón y ladrillo, y hacer canaletas o pases livianos.",
  },
  {
    id: "taladro-13",
    foto: true,
    nombre: "Taladro común de 13 milímetros",
    grupo: "corte",
    descripcion: "Taladro eléctrico de mandril de 13 mm, para agujerear distintos materiales.",
    caracteristicas: ["Mandril de 13 mm", "Eléctrico", "Admite mechas para madera, metal y pared"],
    uso: "Agujerear madera, chapa, plástico y pared.",
  },
  {
    id: "ahoyadora-1",
    foto: true,
    nombre: "Ahoyadora de una persona",
    grupo: "corte",
    descripcion: "Ahoyadora con motor a explosión que maneja un solo operario.",
    caracteristicas: ["La opera una sola persona", "Motor a explosión", "Mecha helicoidal"],
    uso: "Hacer pozos para postes, plantas y alambrados.",
  },
  {
    id: "ahoyadora-2",
    foto: true,
    nombre: "Ahoyadora de 2 personas",
    grupo: "corte",
    descripcion: "Ahoyadora con manijas a los dos lados, pensada para operarla entre dos.",
    caracteristicas: ["La operan dos personas", "Motor a explosión", "Manijas a ambos lados"],
    uso: "Pozos más profundos o de mayor diámetro, y terreno más duro.",
  },

  /* ── Jardín y campo ── */
  {
    id: "motosierra-45",
    foto: true,
    nombre: "Motosierra de 45 cc",
    grupo: "jardin",
    descripcion: "Motosierra a explosión de cilindrada media.",
    caracteristicas: ["Cilindrada: 45 cc", "Motor a explosión", "Espada y cadena de corte"],
    uso: "Voltear y trozar árboles, cortar leña y ramas gruesas.",
  },
  {
    id: "motosierra-38",
    foto: true,
    nombre: "Motosierra de 38 cc",
    grupo: "jardin",
    descripcion: "Motosierra a explosión más liviana, cómoda para cortes donde importa el peso.",
    caracteristicas: ["Cilindrada: 38 cc", "Motor a explosión", "Más liviana que la de 45 cc"],
    uso: "Poda, ramas medianas y cortes de leña livianos.",
  },
  {
    id: "podadora-altura",
    foto: true,
    nombre: "Podadora de altura de explosión",
    grupo: "jardin",
    descripcion: "Motor a explosión con espada de corte en la punta de una pértiga larga.",
    caracteristicas: ["Motor a explosión", "Pértiga larga", "Espada y cadena en la punta"],
    uso: "Podar ramas altas desde el piso, sin escalera.",
  },
  {
    id: "motoguadana-52",
    foto: true,
    nombre: "Motoguadaña de 52 cc",
    grupo: "jardin",
    descripcion: "Desmalezadora a explosión, con hilo o cuchilla.",
    caracteristicas: ["Cilindrada: 52 cc", "Motor a explosión", "Corta con tanza o cuchilla"],
    uso: "Cortar pasto alto, yuyo y maleza en terrenos que la cortadora no toma.",
  },
  {
    id: "cortadora-pasto",
    foto: true,
    nombre: "Cortadora de pasto carrito",
    grupo: "jardin",
    descripcion: "Cortadora de empuje sobre ruedas.",
    caracteristicas: ["Tipo carrito, sobre cuatro ruedas", "Se empuja con manija", "Cuchilla bajo la carcasa"],
    uso: "Mantener el césped parejo en jardines y patios.",
  },
  {
    id: "motobomba",
    foto: true,
    nombre: "Motobomba",
    grupo: "jardin",
    descripcion: "Bomba de agua con motor propio: no necesita conexión eléctrica.",
    caracteristicas: ["Motor a explosión", "Entrada y salida para mangueras", "No necesita electricidad"],
    uso: "Mover agua: riego, llenado y vaciado de pozos, piletas y tanques.",
  },

  /* ── Taller y obra ── */
  {
    id: "soldadora-inverter",
    foto: true,
    nombre: "Soldadora inverter",
    grupo: "taller",
    descripcion: "Equipo de soldar compacto y liviano, de arco estable.",
    caracteristicas: ["Tecnología inverter", "Suelda con electrodo", "Compacta y fácil de trasladar"],
    uso: "Soldar hierro: estructuras, rejas, portones y reparaciones.",
  },
  {
    id: "compresor-50",
    foto: true,
    nombre: "Compresor de 50 litros",
    grupo: "taller",
    descripcion: "Compresor de aire con tanque de 50 litros, fácil de mover.",
    caracteristicas: ["Tanque de 50 litros", "Eléctrico", "Manómetro y salida de aire"],
    uso: "Pintar, soplar, inflar y usar herramientas de aire en trabajos cortos.",
  },
  {
    id: "compresor-100",
    foto: true,
    nombre: "Compresor de 100 litros",
    grupo: "taller",
    descripcion: "Compresor con tanque de 100 litros: aguanta más tiempo sin recargar.",
    caracteristicas: ["Tanque de 100 litros", "Eléctrico", "Más reserva de aire que el de 50"],
    uso: "Pintado de superficies grandes y herramientas neumáticas de uso seguido.",
  },
  {
    id: "termofusora",
    foto: true,
    nombre: "Termofusora",
    grupo: "taller",
    descripcion: "Plancha calefactora con boquillas de distintas medidas.",
    caracteristicas: ["Plancha que calienta caño y accesorio", "Boquillas intercambiables", "Eléctrica"],
    uso: "Unir caños y accesorios de polipropileno en instalaciones de agua.",
  },
  {
    id: "pistola-calor",
    foto: true,
    nombre: "Pistola de calor",
    grupo: "taller",
    descripcion: "Sopladora de aire caliente, eléctrica y de mano.",
    caracteristicas: ["Sopla aire caliente", "Eléctrica, de una mano", "Boquilla de salida"],
    uso: "Ablandar pintura vieja, termocontraer, descongelar y curvar plásticos.",
  },
  {
    id: "generador-mono",
    foto: true,
    nombre: "Generador monofásico",
    grupo: "taller",
    descripcion: "Grupo electrógeno con motor a explosión que entrega corriente monofásica.",
    caracteristicas: ["Salida monofásica (220 V)", "Motor a explosión", "Portátil"],
    uso: "Dar luz y corriente donde no hay red, o durante un corte.",
  },
  {
    id: "generador-tri",
    foto: true,
    nombre: "Generador trifásico",
    grupo: "taller",
    descripcion: "Grupo electrógeno que además entrega corriente trifásica.",
    caracteristicas: ["Salida trifásica", "Motor a explosión", "Para equipos que piden trifásica"],
    uso: "Alimentar máquinas y equipos de obra que trabajan con trifásica.",
  },
  {
    id: "cargador-arrancador",
    foto: true,
    nombre: "Cargador y arrancador de batería",
    grupo: "taller",
    descripcion: "Carga la batería y, en modo arranque, da el pique para encender el motor.",
    caracteristicas: ["Modo carga", "Modo arranque", "Pinzas para los bornes"],
    uso: "Recuperar y arrancar baterías de autos, camionetas y maquinaria.",
  },

  /* ── Elevación y traslado ── */
  {
    id: "gato-20",
    foto: true,
    nombre: "Gato de botella de 20 toneladas",
    grupo: "elevacion",
    descripcion: "Gato hidráulico vertical, chico y de mucha capacidad.",
    caracteristicas: ["Capacidad: 20 toneladas", "Hidráulico, tipo botella", "Se acciona con palanca"],
    uso: "Levantar vehículos pesados, vigas y cargas de hasta 20 toneladas.",
  },
  {
    id: "gato-30",
    foto: true,
    nombre: "Gato de botella de 30 toneladas",
    grupo: "elevacion",
    descripcion: "La versión más grande, para cargas que el de 20 no toma.",
    caracteristicas: ["Capacidad: 30 toneladas", "Hidráulico, tipo botella", "Se acciona con palanca"],
    uso: "Elevar camiones, maquinaria y estructuras de hasta 30 toneladas.",
  },
  {
    id: "carretilla",
    foto: true,
    nombre: "Carretilla",
    grupo: "elevacion",
    descripcion: "Carretilla de obra de una rueda.",
    caracteristicas: ["Una rueda", "Batea para cargar material", "Dos manijas"],
    uso: "Trasladar mezcla, escombro, arena y materiales dentro de la obra.",
  },
];

/* ── Vista de ejemplo (?demo=1) ────────────────────────────────────────────
   Con la lista real cargada, la vista de ejemplo muestra los mismos equipos.
   ────────────────────────────────────────────────────────────────────────── */

export const ALQUILER_EJEMPLO = ALQUILER;

export function mensajeAlquilerMaquina(maquina) {
  return `Hola, quería consultar por el alquiler de: ${maquina.nombre}. ¿Está disponible?`;
}
