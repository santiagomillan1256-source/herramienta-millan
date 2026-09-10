/* ══════════════════════════════════════════════════════════════════════════
   EL CATÁLOGO — FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.

   Una línea por producto, agrupadas por categoría. Las claves de abajo
   (explosion, electricas, bulones…) son los `id` de CATEGORIAS, en datos.js.

   FORMATO DE CADA LÍNEA
     "codigo|nombre|marca|modelo|subcategoria|foto|caracteristicas"

     codigo          el código interno del producto. También nombra la foto:
                     img/p/<categoria>-<codigo>.webp
     nombre          como se lee en la tarjeta
     marca           la marca del producto (podés dejarlo vacío)
     modelo          si va vacío, se usa el código
     subcategoria    una de las claves `sub` de esa categoría, en datos.js
     foto            vacío = la foto está en img/p/ · "-" = todavía no hay
     caracteristicas texto corto, con las partes separadas por " · "

   EJEMPLO (así se ve una línea cargada):
     "MS250|Motosierra 45 cc espada 18\"|Stihl|MS-250|motosierras||45 cc · Espada 18\" · 2 tiempos"

   REGLA IMPORTANTE
     Si todavía no tenés la foto del producto, poné "-" en el campo `foto`.
     La tarjeta dibuja una herramienta en lugar de mostrar una imagen rota.
     Es preferible una foto que falta a una foto equivocada.

   PARA VER CÓMO QUEDA EL CATÁLOGO LLENO, sin cargar nada todavía:
     abrí la página agregando ?demo=1 al final de la dirección.
     Los productos de ejemplo salen marcados y no forman parte del sitio.
   ══════════════════════════════════════════════════════════════════════════ */

globalThis.FILAS = {
  explosion: [],
  electricas: [],
  bulones: [],
  pinturas: [],
  pvc: [],
  cemento: [],
  manuales: [],
  repuestos: [],
};

/* ── Vista de ejemplo ──────────────────────────────────────────────────────
   Sólo se usa cuando la dirección lleva ?demo=1, para mirar el diseño con el
   catálogo cargado. Estos productos NO son reales y no se muestran nunca en
   la página normal. Se pueden borrar sin que nada deje de funcionar.
   ────────────────────────────────────────────────────────────────────────── */

globalThis.FILAS_EJEMPLO = {
  explosion: [
    "EJ-01|Motosierra 45 cc con espada de 18\"|Marca de ejemplo|MS-45|motosierras|-|45 cc · Espada 18\" · 2 tiempos",
    "EJ-02|Desmalezadora 52 cc manubrio doble|Marca de ejemplo|DM-52|desmalezadoras|-|52 cc · Arnés incluido",
    "EJ-03|Grupo electrógeno 3,5 kVA|Marca de ejemplo|GE-35|generadores|-|3,5 kVA · Arranque manual · 220 V",
    "EJ-04|Motobomba 2\" a nafta|Marca de ejemplo|MB-20|motobombas|-|2\" · Caudal 500 L/min",
    "EJ-05|Hidrolavadora a explosión 2500 psi|Otra marca|HL-25|hidrolavadoras|-|2500 psi · Motor 6,5 HP",
    "EJ-06|Cortadora de césped 20\" a nafta|Otra marca|CC-20|cortadoras|-|Corte 20\" · Recolector 60 L",
  ],
  electricas: [
    "EJ-11|Taladro percutor 810 W|Marca de ejemplo|TP-810|taladros|-|810 W · Mandril 13 mm · Percusión",
    "EJ-12|Amoladora angular 115 mm 900 W|Marca de ejemplo|AA-900|amoladoras|-|900 W · Disco 115 mm",
    "EJ-13|Sierra circular 7 1/4\" 1400 W|Otra marca|SC-1400|sierras|-|1400 W · Disco 184 mm",
    "EJ-14|Atornillador a batería 20 V|Otra marca|AB-20|bateria|-|20 V · 2 baterías · Maletín",
    "EJ-15|Soldadora inverter 200 A|Otra marca|SI-200|soldadoras|-|200 A · Electrodo hasta 3,25 mm",
    "EJ-16|Compresor 50 L 2 HP|Marca de ejemplo|CP-50|compresores|-|50 L · 2 HP · 8 bar",
  ],
  bulones: [
    "EJ-21|Bulón hexagonal 1/2\" x 3\" grado 5|Marca de ejemplo||bulones|-|1/2\" x 3\" · Grado 5 · Zincado",
    "EJ-22|Tuerca hexagonal 1/2\"|Marca de ejemplo||bulones|-|1/2\" · Zincada",
    "EJ-23|Tornillo autoperforante 8 x 1\" (caja x 100)|Marca de ejemplo||tornillos|-|8 x 1\" · Caja x 100",
    "EJ-24|Tarugo con tornillo 8 mm (caja x 50)|Marca de ejemplo||tarugos|-|8 mm · Caja x 50",
  ],
  pinturas: [
    "EJ-31|Látex interior mate 20 L|Marca de ejemplo||latex|-|20 L · Interior · Mate",
    "EJ-32|Esmalte sintético brillante 1 L|Marca de ejemplo||sinteticos|-|1 L · Brillante · Interior y exterior",
    "EJ-33|Rodillo de lana 22 cm con mango|Otra marca||accesorios|-|22 cm · Lana natural",
  ],
  pvc: [
    "EJ-41|Caño de agua fría 3/4\" x 4 m|Marca de ejemplo||canos|-|3/4\" · 4 m · Agua fría",
    "EJ-42|Codo 90° 3/4\"|Marca de ejemplo||conexiones|-|90° · 3/4\"",
    "EJ-43|Llave de paso esférica 1/2\"|Otra marca||llaves|-|1/2\" · Bronce",
  ],
  cemento: [
    "EJ-51|Cemento de albañilería 50 kg|Marca de ejemplo||cemento|-|50 kg · Uso general",
    "EJ-52|Membrana asfáltica 10 m con aluminio|Marca de ejemplo||membranas|-|10 m · 4 mm · Con aluminio",
  ],
  manuales: [
    "EJ-61|Juego de llaves combinadas 8 a 22 mm|Marca de ejemplo||llaves|-|12 piezas · 8 a 22 mm",
    "EJ-62|Pinza universal 8\" aislada|Otra marca||pinzas|-|8\" · Aislada 1000 V",
    "EJ-63|Cinta métrica 5 m|Otra marca||medicion|-|5 m · Traba automática",
  ],
  repuestos: [
    "EJ-71|Disco de corte para hierro 115 mm|Marca de ejemplo||corte|-|115 mm · Hierro y acero",
    "EJ-72|Cadena para motosierra 18\" 72 eslabones|Marca de ejemplo||cadenas|-|18\" · 0,325 · 72 eslabones",
    "EJ-73|Juego de mechas para metal 1 a 10 mm|Otra marca||mechas|-|19 piezas · 1 a 10 mm · HSS",
  ],
};
