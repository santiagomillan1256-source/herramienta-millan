/* ══════════════════════════════════════════════════════════════════════════
   EL CATÁLOGO — FERRETERIA Y HERRAMIENTAS MILLAN S.A.S.

   Una línea por producto, agrupadas por categoría. Las dos claves de abajo
   son los `id` de CATEGORIAS, en datos.js: las máquinas son las únicas que
   llevan catálogo con ficha, foto y buscador. Los demás rubros (bulones,
   pinturas, PVC, materiales, herramientas manuales y repuestos) son tarjetas
   con foto y botón de consulta, y se configuran en RUBROS.

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
};
