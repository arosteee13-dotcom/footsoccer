/* ============================================================
   ZONA DEL CLUB — Núcleo (estado, config, obras, modales)
   Cargado antes de app.js. Las pantallas dedicadas viven en
   zonaClubCards.js (tarjetas), instalacionesView.js y
   estadioView.js; este módulo exporta helpers y la navegación.
   ============================================================ */

var ZC_MAX_LEVEL = 15
var ZC_MAX_ZONA_LEVEL = 15
var ZC_PRECIO_MIN = 5
var ZC_PRECIO_MAX = 60

var ZC_ICONO_ESTADIO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 1 9 9v9H3v-9a9 9 0 0 1 9-9z"/><path d="M3 12h18"/><path d="M12 3v9"/><path d="M3 21h18"/><path d="M8 21v-3"/><path d="M16 21v-3"/></svg>'

var ZC_INSTALACIONES_CONFIG = {
entrenamiento: {
    nombre: 'Instalaciones de Entrenamiento',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="3" height="8" rx="1.5"/><rect x="7" y="10" width="2" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><rect x="15" y="10" width="2" height="4" rx="1"/><rect x="18" y="8" width="3" height="8" rx="1.5"/></svg>',
    descCorta: 'Velocidad de desarrollo de los jugadores jóvenes.',
    efecto: 'Aumenta la velocidad de desarrollo de los jugadores jóvenes (hasta +14 puntos en la progresión de fin de temporada).',
    niveles: [500000, 800000, 1200000, 1700000, 2200000, 2800000, 3500000, 4300000, 5200000, 6200000, 7300000, 8500000, 9800000, 11200000],
    semanas: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
  },
  cantera: {
    nombre: 'Instalaciones de Cantera',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',
    descCorta: 'Mejora la media y el potencial del Sub-18.',
    efecto: 'Mejora la media y el potencial de los jugadores del Sub-18 (los nuevos canteranos entran con hasta +14 puntos de media).',
    niveles: [400000, 650000, 900000, 1250000, 1700000, 2200000, 2800000, 3500000, 4300000, 5200000, 6200000, 7300000, 8500000, 9800000],
    semanas: [3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
  }
}

var ZC_ZONAS_BASE = [
  { id: 'esquina1', tipo: 'esquina', nombre: 'Esquina Norte' },
  { id: 'esquina2', tipo: 'esquina', nombre: 'Esquina Sur' },
  { id: 'esquina3', tipo: 'esquina', nombre: 'Esquina Este' },
  { id: 'esquina4', tipo: 'esquina', nombre: 'Esquina Oeste' },
  { id: 'tribuna1', tipo: 'tribuna', nombre: 'Tribuna Lateral Norte' },
  { id: 'tribuna2', tipo: 'tribuna', nombre: 'Tribuna Lateral Sur' },
  { id: 'fondo1', tipo: 'fondo', nombre: 'Fondo Norte' },
  { id: 'fondo2', tipo: 'fondo', nombre: 'Fondo Sur' }
]

var ZC_TIPO_ZONA = {
  esquina: { label: 'Esquina', base: 1000, paso: 2500, costes: [120000, 160000, 210000, 280000, 370000, 490000, 640000, 840000, 1100000, 1450000, 1900000, 2500000, 3300000, 4300000], semanas: 3 },
  tribuna: { label: 'Tribuna', base: 4000, paso: 5000, costes: [450000, 600000, 800000, 1050000, 1400000, 1850000, 2450000, 3200000, 4200000, 5500000, 7200000, 9500000, 12500000, 16000000], semanas: 6 },
  fondo:   { label: 'Fondo',   base: 3000, paso: 4000, costes: [260000, 340000, 450000, 590000, 780000, 1020000, 1340000, 1750000, 2300000, 3000000, 3900000, 5100000, 6700000, 8700000], semanas: 5 }
}

/* ---------- Config inicial por club (partidas nuevas) ----------
   Niveles iniciales de cada una de las 8 zonas (1–15), capacidad real
   del estadio, nombre y nivel de instalaciones. Los clubes no listados
   arrancan con la base actual (zonas a 0, capacidad por fórmula). */

var ZC_CLUBES_INICIAL = {
  'b-dortmund': { nombre: 'Signal Iduna Park', capacidad: 81365, precioMin: 22, precioMax: 85, entrenamiento: 14, cantera: 15, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 15, fondo1: 13, fondo2: 15 } },
  'bayern-munchen': { nombre: 'Allianz Arena', capacidad: 75024, precioMin: 30, precioMax: 90, entrenamiento: 15, cantera: 14, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 14, tribuna2: 14, fondo1: 13, fondo2: 14 } },
  'schalke-04': { nombre: 'Veltins-Arena', capacidad: 62271, precioMin: 20, precioMax: 70, entrenamiento: 12, cantera: 15, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 12, tribuna2: 12, fondo1: 13, fondo2: 11 } },
  'stuttgart': { nombre: 'MHPArena', capacidad: 60441, precioMin: 18, precioMax: 70, entrenamiento: 12, cantera: 14, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 13 } },
  'hamburger-sv': { nombre: 'Volksparkstadion', capacidad: 57000, precioMin: 18, precioMax: 60, entrenamiento: 11, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 12, fondo2: 10 } },
  'b-monchengladbach': { nombre: 'Borussia-Park', capacidad: 54057, precioMin: 16, precioMax: 60, entrenamiento: 11, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 10, fondo1: 12, fondo2: 10 } },
  'eintracht-frankfurt': { nombre: 'Deutsche Bank Park', capacidad: 51500, precioMin: 20, precioMax: 68, entrenamiento: 12, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 12, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'koln': { nombre: 'RheinEnergieStadion', capacidad: 50000, precioMin: 16, precioMax: 58, entrenamiento: 11, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 12 } },
  'rb-leipzig': { nombre: 'Red Bull Arena', capacidad: 47069, precioMin: 15, precioMax: 65, entrenamiento: 14, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 10, tribuna2: 10, fondo1: 11, fondo2: 9 } },
  'werder-bremen': { nombre: 'Weserstadion', capacidad: 42100, precioMin: 15, precioMax: 55, entrenamiento: 10, cantera: 11, zonas: { esquina1: 9, esquina2: 9, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 9, fondo1: 9, fondo2: 9 } },
  'sc-freiburg': { nombre: 'Europa-Park Stadion', capacidad: 34700, precioMin: 14, precioMax: 50, entrenamiento: 11, cantera: 14, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 10 } },
  'mainz-05': { nombre: 'Mewa Arena', capacidad: 34000, precioMin: 12, precioMax: 48, entrenamiento: 11, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 10 } },
  'fc-augsburg': { nombre: 'WWK Arena', capacidad: 30660, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 9 } },
  'b-leverkusen': { nombre: 'BayArena', capacidad: 30210, precioMin: 20, precioMax: 75, entrenamiento: 14, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 9, fondo2: 7 } },
  'hoffenheim': { nombre: 'PreZero Arena', capacidad: 30150, precioMin: 10, precioMax: 45, entrenamiento: 14, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 8 } },
  'union-berlin': { nombre: 'Stadion An der Alten F\u00f6rsterei', capacidad: 22012, precioMin: 12, precioMax: 40, entrenamiento: 10, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 6, tribuna2: 7, fondo1: 7, fondo2: 7 } },
  'paderborn': { nombre: 'Home Deluxe Arena', capacidad: 15306, precioMin: 10, precioMax: 35, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 4, tribuna2: 4, fondo1: 5, fondo2: 4 } },
  'sv-elversberg': { nombre: 'Waldstadion an der Kaiserlinde', capacidad: 10000, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 1, fondo1: 3, fondo2: 1 } },
  'hertha-berlin': { nombre: 'Olympiastadion Berlin', capacidad: 74649, precioMin: 18, precioMax: 65, entrenamiento: 12, cantera: 14, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 14, tribuna2: 14, fondo1: 13, fondo2: 13 } },
  'nurnberg': { nombre: 'Max-Morlock-Stadion', capacidad: 50000, precioMin: 14, precioMax: 50, entrenamiento: 10, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'kaiserslautern': { nombre: 'Fritz-Walter-Stadion', capacidad: 49850, precioMin: 15, precioMax: 55, entrenamiento: 10, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'hannover-96': { nombre: 'Heinz von Heiden Arena', capacidad: 49000, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 10, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 11, fondo2: 10 } },
  'dynamo-dresden': { nombre: 'Stadion Dresden', capacidad: 32066, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 9 } },
  'magdeburg': { nombre: 'Avnet Arena', capacidad: 30098, precioMin: 12, precioMax: 44, entrenamiento: 9, cantera: 9, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 9, fondo2: 7 } },
  'wolfsburg': { nombre: 'Volkswagen-Arena', capacidad: 30000, precioMin: 12, precioMax: 45, entrenamiento: 13, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 7 } },
  'st-pauli': { nombre: 'Millerntor-Stadion', capacidad: 29546, precioMin: 16, precioMax: 48, entrenamiento: 10, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 8 } },
  'arminia-bielefeld': { nombre: 'Sch\u00fccoArena', capacidad: 26515, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 8 } },
  'vfl-bochum': { nombre: 'Vonovia Ruhrstadion', capacidad: 26000, precioMin: 12, precioMax: 42, entrenamiento: 10, cantera: 11, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 7 } },
  'eintracht-braunschweig': { nombre: 'Eintracht-Stadion', capacidad: 25000, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 8, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'energie-cottbus': { nombre: 'LEAG Energie Stadion', capacidad: 22528, precioMin: 10, precioMax: 35, entrenamiento: 8, cantera: 9, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 6, fondo2: 5 } },
  'darmstadt-98': { nombre: 'Merck-Stadion am B\u00f6llenfalltor', capacidad: 17400, precioMin: 10, precioMax: 36, entrenamiento: 9, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 5, fondo2: 5 } },
  'vfl-osnabruck': { nombre: 'Stadion an der Bremer Br\u00fccke', capacidad: 16130, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 5, fondo2: 5 } },
  'greuther-furth': { nombre: 'Sportpark Ronhof Thomas Sommer', capacidad: 15606, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 5, fondo1: 5, fondo2: 4 } },
  'karlsruher-sc': { nombre: 'BBBank Wildpark', capacidad: 15330, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 11, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  'heidenheim': { nombre: 'Voith-Arena', capacidad: 15000, precioMin: 9, precioMax: 30, entrenamiento: 10, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 4, fondo2: 4 } },
  'holstein-kiel': { nombre: 'Holstein-Stadion', capacidad: 11522, precioMin: 8, precioMax: 28, entrenamiento: 9, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 3, tribuna2: 3, fondo1: 3, fondo2: 3 } },
  'e16': { nombre: 'Santiago Bernab\u00e9u', capacidad: 81044, precioMin: 35, precioMax: 120, entrenamiento: 15, cantera: 14, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 15, fondo1: 14, fondo2: 14 } },
  'e7': { nombre: 'Spotify Camp Nou', capacidad: 99354, precioMin: 35, precioMax: 120, entrenamiento: 14, cantera: 15, zonas: { esquina1: 14, esquina2: 14, esquina3: 14, esquina4: 14, tribuna1: 15, tribuna2: 15, fondo1: 15, fondo2: 15 } },
  'e2': { nombre: 'Riyadh Air Metropolitano', capacidad: 70460, precioMin: 30, precioMax: 90, entrenamiento: 13, cantera: 13, zonas: { esquina1: 12, esquina2: 12, esquina3: 12, esquina4: 12, tribuna1: 14, tribuna2: 14, fondo1: 12, fondo2: 13 } },
  'e1': { nombre: 'San Mam\u00e9s', capacidad: 53332, precioMin: 25, precioMax: 80, entrenamiento: 12, cantera: 15, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 13, fondo1: 12, fondo2: 11 } },
  'e15': { nombre: 'Estadio de La Cartuja', capacidad: 60000, precioMin: 20, precioMax: 70, entrenamiento: 12, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 12, tribuna2: 12, fondo1: 10, fondo2: 10 } },
  'e19': { nombre: 'Mestalla', capacidad: 49430, precioMin: 20, precioMax: 75, entrenamiento: 11, cantera: 14, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 11, fondo1: 10, fondo2: 11 } },
  'e18': { nombre: 'Ram\u00f3n S\u00e1nchez-Pizju\u00e1n', capacidad: 43883, precioMin: 20, precioMax: 70, entrenamiento: 11, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'e6': { nombre: 'RCDE Stadium', capacidad: 40500, precioMin: 18, precioMax: 65, entrenamiento: 11, cantera: 13, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 10, tribuna2: 10, fondo1: 9, fondo2: 10 } },
  'e17': { nombre: 'Anoeta', capacidad: 40000, precioMin: 20, precioMax: 68, entrenamiento: 12, cantera: 14, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 10, tribuna2: 10, fondo1: 9, fondo2: 11 } },
  'e5': { nombre: 'Estadio Mart\u00ednez Valero', capacidad: 33732, precioMin: 12, precioMax: 48, entrenamiento: 9, cantera: 9, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'e14': { nombre: 'Estadio ABANCA-RIAZOR', capacidad: 32912, precioMin: 15, precioMax: 55, entrenamiento: 10, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 8 } },
  'e10': { nombre: 'Estadio La Rosaleda', capacidad: 30044, precioMin: 14, precioMax: 52, entrenamiento: 10, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'e9': { nombre: 'Ciutat de Val\u00e8ncia', capacidad: 25354, precioMin: 12, precioMax: 45, entrenamiento: 9, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'e3': { nombre: 'Abanca Bala\u00eddos', capacidad: 24870, precioMin: 12, precioMax: 50, entrenamiento: 11, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 7, fondo1: 7, fondo2: 6 } },
  'e11': { nombre: 'Estadio El Sadar', capacidad: 23516, precioMin: 15, precioMax: 55, entrenamiento: 10, cantera: 13, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 9 } },
  'e20': { nombre: 'Estadio de la Cer\u00e1mica', capacidad: 23000, precioMin: 15, precioMax: 58, entrenamiento: 13, cantera: 14, zonas: { esquina1: 8, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'e12': { nombre: 'Campos de Sport de El Sardinero', capacidad: 22308, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 6 } },
  'e4': { nombre: 'Mendizorroza', capacidad: 19940, precioMin: 12, precioMax: 44, entrenamiento: 10, cantera: 9, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 7 } },
  'e8': { nombre: 'Estadio Coliseum', capacidad: 17700, precioMin: 10, precioMax: 42, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'e13': { nombre: 'Estadio de Vallecas', capacidad: 14505, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 9, zonas: { esquina1: 0, esquina2: 0, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 0, fondo2: 5 } },
  'e42': { nombre: 'Estadio de Gran Canaria', capacidad: 32400, precioMin: 15, precioMax: 55, entrenamiento: 11, cantera: 12, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 10, fondo1: 9, fondo2: 9 } },
  'e37': { nombre: 'Carlos Tartiere', capacidad: 30500, precioMin: 14, precioMax: 52, entrenamiento: 10, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 8 } },
  'e39': { nombre: 'Estadio El Molin\u00f3n-Enrique Castro Quini', capacidad: 30000, precioMin: 15, precioMax: 54, entrenamiento: 11, cantera: 13, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 9 } },
  'e40': { nombre: 'Estadio Jos\u00e9 Zorrilla', capacidad: 27618, precioMin: 14, precioMax: 50, entrenamiento: 10, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'e25': { nombre: 'Nuevo Mirandilla', capacidad: 25033, precioMin: 14, precioMax: 50, entrenamiento: 10, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 8 } },
  'e28': { nombre: 'Abanca Bala\u00eddos', capacidad: 24870, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 7, fondo1: 7, fondo2: 6 } },
  'e36': { nombre: 'Estadi Mallorca Son Moix', capacidad: 23142, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'e41': { nombre: 'Estadio Heliodoro Rodr\u00edguez L\u00f3pez', capacidad: 22824, precioMin: 12, precioMax: 48, entrenamiento: 10, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'e29': { nombre: 'Bahrain Victorious Nuevo Arc\u00e1ngel', capacidad: 21822, precioMin: 12, precioMax: 46, entrenamiento: 9, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 8, tribuna2: 7, fondo1: 7, fondo2: 7 } },
  'e34': { nombre: 'Nuevo Los C\u00e1rmenes', capacidad: 19336, precioMin: 12, precioMax: 48, entrenamiento: 11, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'e23': { nombre: 'Power Horse Stadium', capacidad: 18331, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'e22': { nombre: 'Carlos Belmonte', capacidad: 17200, precioMin: 10, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'e26': { nombre: 'SkyFi Castalia', capacidad: 15700, precioMin: 10, precioMax: 40, entrenamiento: 9, cantera: 9, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'e35': { nombre: 'Ontime Butarque', capacidad: 12454, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  'e24': { nombre: 'Municipal de El Plant\u00edo', capacidad: 12194, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  'e27': { nombre: 'Nova Creu Alta', capacidad: 11908, precioMin: 9, precioMax: 35, entrenamiento: 8, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e33': { nombre: 'Municipal Montilivi', capacidad: 11810, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 11, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e30': { nombre: 'Municipal de Ipur\u00faa', capacidad: 8164, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'e32': { nombre: 'Nou Estadi d\u2019Encamp', capacidad: 5500, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e21': { nombre: 'Municipal Alfonso Murube', capacidad: 5294, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'e31': { nombre: 'Municipal Nuevo Pepico Amat', capacidad: 4036, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 2 } },
  'e38': { nombre: 'Zubieta', capacidad: 2500, precioMin: 5, precioMax: 20, entrenamiento: 12, cantera: 14, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e77': { nombre: 'Estadio Enrique Roca de Murcia', capacidad: 31179, precioMin: 14, precioMax: 52, entrenamiento: 10, cantera: 9, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 10, fondo1: 9, fondo2: 9 } },
  'e72': { nombre: 'Jos\u00e9 Rico P\u00e9rez', capacidad: 29500, precioMin: 14, precioMax: 50, entrenamiento: 9, cantera: 9, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 9 } },
  'e78': { nombre: 'Nueva Romareda', capacidad: 20100, precioMin: 15, precioMax: 55, entrenamiento: 12, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'e59': { nombre: 'Las Gaunas', capacidad: 16000, precioMin: 10, precioMax: 40, entrenamiento: 9, cantera: 8, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'e70': { nombre: 'Estadio Cartagonova', capacidad: 15105, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'e71': { nombre: 'Nou Estadi Costa Daurada', capacidad: 14591, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'e43': { nombre: 'Estadio Romano Jos\u00e9 Fouto', capacidad: 14600, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'e51': { nombre: 'Estadio Reino de Le\u00f3n', capacidad: 13451, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'e76': { nombre: 'Estadio Municipal La Victoria', capacidad: 12569, precioMin: 9, precioMax: 35, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  'e56': { nombre: 'Estadio de A Malata', capacidad: 12043, precioMin: 10, precioMax: 36, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e48': { nombre: 'Francisco de la Hera', capacidad: 11580, precioMin: 9, precioMax: 35, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e55': { nombre: 'Municipal de Pasar\u00f3n', capacidad: 10500, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e73': { nombre: 'Estadio El Alcoraz', capacidad: 9100, precioMin: 10, precioMax: 35, entrenamiento: 10, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'e54': { nombre: 'Municipal El Toral\u00edn', capacidad: 8400, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'e45': { nombre: 'Nuevo Lasesarre', capacidad: 7960, precioMin: 9, precioMax: 30, entrenamiento: 8, cantera: 8, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'e49': { nombre: 'Estadio Anxo Carro', capacidad: 8168, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 2 } },
  'e62': { nombre: 'Estadio Ruta de la Plata', capacidad: 7813, precioMin: 8, precioMax: 30, entrenamiento: 8, cantera: 7, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'e65': { nombre: 'Nuevo Mirador', capacidad: 7200, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 7, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'e50': { nombre: 'Estadio Pr\u00edncipe Felipe', capacidad: 7000, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 7, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 3, fondo2: 2 } },
  'e81': { nombre: 'Narc\u00eds Sala', capacidad: 6563, precioMin: 9, precioMax: 26, entrenamiento: 7, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 3, fondo2: 2 } },
  'e79': { nombre: 'Estadio Alfredo Di St\u00e9fano', capacidad: 6000, precioMin: 5, precioMax: 15, entrenamiento: 15, cantera: 14, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e80': { nombre: 'Estadi Palladium Can Misses', capacidad: 6000, precioMin: 10, precioMax: 30, entrenamiento: 8, cantera: 7, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e66': { nombre: 'Estadio El Maul\u00ed', capacidad: 6000, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e53': { nombre: 'Estadio Municipal de Anduva', capacidad: 5759, precioMin: 10, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 3 } },
  'e60': { nombre: 'Estadio Municipal de O Couto', capacidad: 5659, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e58': { nombre: 'Stadium Gal', capacidad: 5500, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e57': { nombre: 'Rom\u00e1n Su\u00e1rez Puerta', capacidad: 5400, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e64': { nombre: 'Estadio Santo Domingo', capacidad: 5100, precioMin: 10, precioMax: 30, entrenamiento: 9, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e61': { nombre: 'Estadio Municipal Reina Sof\u00eda', capacidad: 5000, precioMin: 9, precioMax: 28, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'e82': { nombre: 'Ciudad Deportiva Jos\u00e9 Manuel Llaneza', capacidad: 5000, precioMin: 5, precioMax: 15, entrenamiento: 13, cantera: 14, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'e63': { nombre: 'Estadio El Rubial', capacidad: 4000, precioMin: 8, precioMax: 24, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'e75': { nombre: 'Cerro del Espino', capacidad: 3900, precioMin: 8, precioMax: 25, entrenamiento: 10, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'e44': { nombre: 'Municipal de Fadura', capacidad: 3500, precioMin: 8, precioMax: 24, entrenamiento: 7, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'e68': { nombre: 'Estadio de Pinilla', capacidad: 3000, precioMin: 8, precioMax: 22, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e47': { nombre: 'Estadio La Isla', capacidad: 3000, precioMin: 8, precioMax: 22, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e74': { nombre: 'Municipal El Pozuelo', capacidad: 3000, precioMin: 8, precioMax: 22, entrenamiento: 6, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e69': { nombre: 'Can Drag\u00f3', capacidad: 3000, precioMin: 8, precioMax: 24, entrenamiento: 7, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e67': { nombre: 'Centro Deportivo C\u00edvitas', capacidad: 2700, precioMin: 5, precioMax: 15, entrenamiento: 12, cantera: 13, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'e46': { nombre: 'Instalaciones de Lezama', capacidad: 2500, precioMin: 5, precioMax: 15, entrenamiento: 12, cantera: 15, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'e52': { nombre: 'Ciudad Deportiva de Abegondo', capacidad: 1200, precioMin: 5, precioMax: 12, entrenamiento: 10, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'salzburg': { nombre: 'Red Bull Arena', capacidad: 30188, precioMin: 15, precioMax: 55, entrenamiento: 15, cantera: 15, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'rapid-wien': { nombre: 'Allianz Stadion', capacidad: 28345, precioMin: 14, precioMax: 52, entrenamiento: 12, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 6, fondo2: 8 } },
  'lask': { nombre: 'Raiffeisen Arena', capacidad: 20235, precioMin: 12, precioMax: 48, entrenamiento: 12, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'austria-wien': { nombre: 'Generali Arena', capacidad: 17656, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 12, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'wsg-tirol': { nombre: 'Tivoli Stadion Tirol', capacidad: 17400, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'sturm-graz': { nombre: 'Stadion Graz-Liebenau', capacidad: 16364, precioMin: 12, precioMax: 46, entrenamiento: 11, cantera: 12, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'grazer-ak': { nombre: 'Stadion Graz-Liebenau', capacidad: 16364, precioMin: 11, precioMax: 44, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 6, fondo2: 5 } },
  'scr-altach': { nombre: 'CASHPOINT Arena', capacidad: 8900, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'austria-lustenau': { nombre: 'SUN MINIMEAL Arena', capacidad: 8800, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 3, fondo2: 3 } },
  'wolfsberger-ac': { nombre: 'Lavanttal Arena', capacidad: 8000, precioMin: 8, precioMax: 32, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'sv-ried': { nombre: 'Josko Arena', capacidad: 7680, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'tsv-hartberg': { nombre: 'Profertil Arena Hartberg', capacidad: 5400, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'rapid-wien-ii': { nombre: 'Allianz Stadion', capacidad: 28345, precioMin: 5, precioMax: 18, entrenamiento: 12, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 6, fondo2: 8 } },
  'austria-wien-ii': { nombre: 'Generali Arena', capacidad: 17656, precioMin: 5, precioMax: 15, entrenamiento: 11, cantera: 12, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'wacker-innsbruck': { nombre: 'Tivoli Stadion Tirol', capacidad: 17400, precioMin: 11, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'admira-wacker': { nombre: 'Datenpol Arena', capacidad: 12000, precioMin: 10, precioMax: 35, entrenamiento: 10, cantera: 11, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'sw-bregenz': { nombre: 'ImmoAgentur Stadion', capacidad: 12000, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'kapfenberger-sv': { nombre: 'Franz-Fekete-Stadion', capacidad: 12000, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'skn-st-poelten': { nombre: 'NV ARENA', capacidad: 8000, precioMin: 10, precioMax: 34, entrenamiento: 10, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 4 } },
  'first-vienna': { nombre: 'Stadion Hohe Warte', capacidad: 6000, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 2, fondo1: 3, fondo2: 1 } },
  'blau-weiss-linz': { nombre: 'Hofmann Personal Stadion', capacidad: 5595, precioMin: 10, precioMax: 35, entrenamiento: 10, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'liefering': { nombre: 'Untersberg-Arena', capacidad: 4638, precioMin: 5, precioMax: 15, entrenamiento: 15, cantera: 15, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'sku-amstetten': { nombre: 'Ertl-Glas-Stadion', capacidad: 3000, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 1 } },
  'hertha-wels': { nombre: 'Huber Arena', capacidad: 3000, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'fac-wien': { nombre: 'FAC-Platz', capacidad: 3000, precioMin: 8, precioMax: 28, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 2 } },
  'sv-austria-salzburg': { nombre: 'Max-Aicher-Stadion', capacidad: 1566, precioMin: 8, precioMax: 25, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 2, fondo2: 1 } },
  'club-brugge': { nombre: 'Jan Breydelstadion', capacidad: 29042, precioMin: 15, precioMax: 55, entrenamiento: 13, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 8 } },
  'standard-liege': { nombre: 'Stade Maurice Dufrasne', capacidad: 27670, precioMin: 15, precioMax: 54, entrenamiento: 11, cantera: 13, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 9 } },
  'cercle-brugge': { nombre: 'Jan Breydelstadion', capacidad: 29042, precioMin: 14, precioMax: 50, entrenamiento: 11, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 8, fondo1: 8, fondo2: 7 } },
  'genk': { nombre: 'Cegeka Arena', capacidad: 24604, precioMin: 14, precioMax: 52, entrenamiento: 13, cantera: 15, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 8 } },
  'anderlecht': { nombre: 'Lotto Park', capacidad: 21500, precioMin: 16, precioMax: 55, entrenamiento: 14, cantera: 15, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'kaa-gent': { nombre: 'Planet Group Arena', capacidad: 20175, precioMin: 14, precioMax: 50, entrenamiento: 12, cantera: 11, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'antwerp': { nombre: 'Bosuilstadion', capacidad: 16649, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 11, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 7, tribuna2: 5, fondo1: 5, fondo2: 7 } },
  'kv-mechelen': { nombre: 'Achter de Kazerne', capacidad: 16672, precioMin: 12, precioMax: 46, entrenamiento: 10, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 6 } },
  'charleroi': { nombre: 'Stade du Pays de Charleroi', capacidad: 15000, precioMin: 11, precioMax: 45, entrenamiento: 9, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'sint-truiden': { nombre: 'Daio Wasabi Stayen Stadium', capacidad: 14600, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 11, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 4 } },
  'sk-beveren': { nombre: 'Freethiel-Stadion', capacidad: 13290, precioMin: 10, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'zulte-waregem': { nombre: 'Elindus Arena', capacidad: 11250, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'oh-leuven': { nombre: 'The King Power At Den Dreef Stadium', capacidad: 10020, precioMin: 11, precioMax: 40, entrenamiento: 11, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 5, fondo1: 3, fondo2: 4 } },
  'raal-la-louviere': { nombre: 'Easi Arena', capacidad: 10000, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'union-saint-gilloise': { nombre: 'Stade Joseph Mari\u00ebn', capacidad: 9400, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 5, tribuna2: 2, fondo1: 2, fondo2: 4 } },
  'kv-kortrijk': { nombre: 'Guldensporen Stadion', capacidad: 9399, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 4 } },
  'kvc-westerlo': { nombre: 'Het Kuipje', capacidad: 8035, precioMin: 10, precioMax: 36, entrenamiento: 10, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'lommel-sk': { nombre: 'Soevereinstadion', capacidad: 8000, precioMin: 9, precioMax: 35, entrenamiento: 11, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'om': { nombre: 'Orange V\u00e9lodrome', capacidad: 67000, precioMin: 30, precioMax: 90, entrenamiento: 13, cantera: 12, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 13, fondo1: 13, fondo2: 14 } },
  'ol': { nombre: 'Groupama Stadium', capacidad: 59186, precioMin: 25, precioMax: 85, entrenamiento: 14, cantera: 15, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 13, fondo1: 12, fondo2: 11 } },
  'lille': { nombre: 'Decathlon Arena Stade Pierre-Mauroy', capacidad: 50000, precioMin: 20, precioMax: 75, entrenamiento: 13, cantera: 12, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 12, tribuna2: 12, fondo1: 10, fondo2: 11 } },
  'psg': { nombre: 'Parc des Princes', capacidad: 48583, precioMin: 35, precioMax: 120, entrenamiento: 15, cantera: 14, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 12, fondo1: 11, fondo2: 10 } },
  'lens': { nombre: 'Stade Bollaert-Delelis', capacidad: 38223, precioMin: 18, precioMax: 65, entrenamiento: 11, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 11, tribuna2: 13, fondo1: 10, fondo2: 10 } },
  'nice': { nombre: 'Allianz Riviera', capacidad: 36100, precioMin: 15, precioMax: 60, entrenamiento: 12, cantera: 12, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 10, fondo1: 8, fondo2: 9 } },
  'toulouse': { nombre: 'Stadium de Toulouse', capacidad: 33150, precioMin: 12, precioMax: 55, entrenamiento: 11, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 8 } },
  'rennes': { nombre: 'Roazhon Park', capacidad: 29778, precioMin: 15, precioMax: 58, entrenamiento: 12, cantera: 14, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 7, fondo2: 8 } },
  'strasbourg': { nombre: 'Stade de la Meinau', capacidad: 27500, precioMin: 12, precioMax: 50, entrenamiento: 11, cantera: 11, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 8 } },
  'le_havre': { nombre: 'Stade Oc\u00e9ane', capacidad: 25178, precioMin: 11, precioMax: 45, entrenamiento: 10, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'le_mans': { nombre: 'Stade Marie-Marvingt', capacidad: 25064, precioMin: 10, precioMax: 42, entrenamiento: 9, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'troyes': { nombre: "Stade de l'Aube", capacidad: 21684, precioMin: 10, precioMax: 42, entrenamiento: 11, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'paris_fc': { nombre: 'Stade Jean Bouin', capacidad: 19904, precioMin: 11, precioMax: 40, entrenamiento: 10, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'angers': { nombre: 'Stade Raymond-Kopa', capacidad: 18752, precioMin: 10, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 6, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  'auxerre': { nombre: "Stade de l'Abb\u00e9 Deschamps", capacidad: 18541, precioMin: 11, precioMax: 40, entrenamiento: 10, cantera: 12, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 5, fondo2: 5 } },
  'monaco': { nombre: 'Stade Louis-II', capacidad: 18523, precioMin: 15, precioMax: 60, entrenamiento: 13, cantera: 14, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 3, fondo2: 3 } },
  'lorient': { nombre: 'Stade du Moustoir', capacidad: 18110, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 11, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 5, fondo1: 5, fondo2: 3 } },
  'brest': { nombre: 'Stade Francis-Le Bl\u00e9', capacidad: 15220, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 5, tribuna2: 4, fondo1: 4, fondo2: 4 } },
  'saint_etienne': { nombre: 'Stade Geoffroy-Guichard', capacidad: 42000, precioMin: 15, precioMax: 55, entrenamiento: 12, cantera: 13, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 11 } },
  'nantes': { nombre: 'Stade de la Beaujoire', capacidad: 35322, precioMin: 14, precioMax: 52, entrenamiento: 12, cantera: 14, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 10, fondo1: 8, fondo2: 10 } },
  'montpellier': { nombre: 'Stade de la Mosson', capacidad: 32900, precioMin: 12, precioMax: 48, entrenamiento: 11, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 8, fondo1: 6, fondo2: 9 } },
  'metz': { nombre: 'Stade Saint-Symphorien', capacidad: 28786, precioMin: 12, precioMax: 50, entrenamiento: 11, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 7 } },
  'reims': { nombre: 'Stade Auguste-Delaune', capacidad: 21029, precioMin: 12, precioMax: 46, entrenamiento: 12, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'sochaux': { nombre: 'Stade Auguste-Bonal', capacidad: 20005, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'grenoble': { nombre: 'Stade des Alpes', capacidad: 20068, precioMin: 10, precioMax: 40, entrenamiento: 10, cantera: 10, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'nancy': { nombre: 'Stade Marcel Picot', capacidad: 20087, precioMin: 10, precioMax: 40, entrenamiento: 9, cantera: 11, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'guingamp': { nombre: 'Stade du Roudourou', capacidad: 18363, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'dijon': { nombre: 'Stade Gaston G\u00e9rard', capacidad: 15995, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'annecy': { nombre: 'Parc des Sports', capacidad: 15714, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'boulogne': { nombre: 'Stade de la Lib\u00e9ration', capacidad: 15242, precioMin: 9, precioMax: 35, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 4, fondo1: 3, fondo2: 4 } },
  'clermont': { nombre: 'Stade Gabriel Montpied', capacidad: 13000, precioMin: 11, precioMax: 36, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 5, tribuna2: 3, fondo1: 3, fondo2: 3 } },
  'laval': { nombre: 'Stade Francis Le Basser', capacidad: 11107, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'red_star': { nombre: 'Stade Bauer', capacidad: 10000, precioMin: 10, precioMax: 35, entrenamiento: 9, cantera: 11, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 4, fondo2: 4 } },
  'rodez': { nombre: 'Stade Paul-Lignon', capacidad: 10000, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'dunkerque': { nombre: 'Stade Marcel-Tribut', capacidad: 4200, precioMin: 8, precioMax: 26, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'pau': { nombre: 'Nouste Camp', capacidad: 4031, precioMin: 8, precioMax: 25, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'manchester-united': { nombre: 'Old Trafford', capacidad: 74140, precioMin: 35, precioMax: 120, entrenamiento: 14, cantera: 14, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 14, fondo1: 13, fondo2: 13 } },
  'tottenham': { nombre: 'Tottenham Hotspur Stadium', capacidad: 62850, precioMin: 35, precioMax: 120, entrenamiento: 15, cantera: 13, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 15, fondo1: 12, fondo2: 15 } },
  'arsenal': { nombre: 'Emirates Stadium', capacidad: 60355, precioMin: 35, precioMax: 120, entrenamiento: 14, cantera: 14, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 14, tribuna2: 14, fondo1: 12, fondo2: 12 } },
  'manchester-city': { nombre: 'Etihad Stadium', capacidad: 55017, precioMin: 30, precioMax: 90, entrenamiento: 15, cantera: 15, zonas: { esquina1: 12, esquina2: 12, esquina3: 12, esquina4: 12, tribuna1: 13, tribuna2: 13, fondo1: 11, fondo2: 12 } },
  'liverpool': { nombre: 'Anfield', capacidad: 54074, precioMin: 30, precioMax: 90, entrenamiento: 14, cantera: 13, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 14, tribuna2: 11, fondo1: 12, fondo2: 14 } },
  'everton': { nombre: 'Everton Stadium', capacidad: 52888, precioMin: 25, precioMax: 80, entrenamiento: 12, cantera: 12, zonas: { esquina1: 12, esquina2: 12, esquina3: 12, esquina4: 12, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 14 } },
  'newcastle': { nombre: "St. James' Park", capacidad: 52000, precioMin: 25, precioMax: 80, entrenamiento: 11, cantera: 11, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 14, tribuna2: 10, fondo1: 11, fondo2: 11 } },
  'sunderland': { nombre: 'Stadium of Light', capacidad: 49000, precioMin: 18, precioMax: 65, entrenamiento: 11, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 11, fondo2: 11 } },
  'aston-villa': { nombre: 'Villa Park', capacidad: 42788, precioMin: 20, precioMax: 75, entrenamiento: 12, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 12 } },
  'chelsea': { nombre: 'Stamford Bridge', capacidad: 40834, precioMin: 25, precioMax: 85, entrenamiento: 14, cantera: 15, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'leeds-united': { nombre: 'Elland Road', capacidad: 37792, precioMin: 18, precioMax: 68, entrenamiento: 11, cantera: 12, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 11, tribuna2: 9, fondo1: 10, fondo2: 10 } },
  'coventry-city': { nombre: 'Coventry Building Society Arena', capacidad: 32609, precioMin: 14, precioMax: 50, entrenamiento: 9, cantera: 10, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'brighton': { nombre: 'Amex Stadium', capacidad: 31800, precioMin: 15, precioMax: 58, entrenamiento: 13, cantera: 12, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 8, fondo1: 8, fondo2: 8 } },
  'nottingham-forest': { nombre: 'The City Ground', capacidad: 30445, precioMin: 14, precioMax: 55, entrenamiento: 10, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 8, fondo1: 8, fondo2: 8 } },
  'ipswich-town': { nombre: 'Portman Road Stadium', capacidad: 30311, precioMin: 14, precioMax: 52, entrenamiento: 10, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 8 } },
  'crystal-palace': { nombre: 'Selhurst Park', capacidad: 25486, precioMin: 15, precioMax: 55, entrenamiento: 11, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 7, fondo1: 7, fondo2: 7 } },
  'fulham': { nombre: 'Craven Cottage', capacidad: 25700, precioMin: 20, precioMax: 75, entrenamiento: 11, cantera: 12, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 9, tribuna2: 6, fondo1: 7, fondo2: 7 } },
  'hull-city': { nombre: 'MKM Stadium', capacidad: 25400, precioMin: 12, precioMax: 48, entrenamiento: 9, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'brentford': { nombre: 'Gtech Community Stadium', capacidad: 17250, precioMin: 12, precioMax: 48, entrenamiento: 11, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'bournemouth': { nombre: 'Vitality Stadium', capacidad: 11464, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'inter': { nombre: 'Stadio Giuseppe Meazza', capacidad: 80018, precioMin: 35, precioMax: 120, entrenamiento: 14, cantera: 14, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 15, fondo1: 14, fondo2: 13 } },
  'milan': { nombre: 'Stadio Giuseppe Meazza', capacidad: 80018, precioMin: 35, precioMax: 120, entrenamiento: 14, cantera: 13, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 15, tribuna2: 15, fondo1: 13, fondo2: 14 } },
  'roma': { nombre: 'Stadio Olimpico di Roma', capacidad: 70634, precioMin: 30, precioMax: 90, entrenamiento: 13, cantera: 14, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 14, tribuna2: 14, fondo1: 11, fondo2: 14 } },
  'lazio': { nombre: 'Stadio Olimpico di Roma', capacidad: 70634, precioMin: 25, precioMax: 85, entrenamiento: 12, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 14, tribuna2: 14, fondo1: 14, fondo2: 11 } },
  'napoli': { nombre: 'Stadio Diego Armando Maradona', capacidad: 60240, precioMin: 25, precioMax: 85, entrenamiento: 11, cantera: 11, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 12, tribuna2: 11, fondo1: 12, fondo2: 12 } },
  'fiorentina': { nombre: 'Stadio Artemio Franchi', capacidad: 43147, precioMin: 20, precioMax: 75, entrenamiento: 14, cantera: 13, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 11, tribuna2: 11, fondo1: 11, fondo2: 10 } },
  'juventus': { nombre: 'Allianz Stadium', capacidad: 41507, precioMin: 30, precioMax: 90, entrenamiento: 14, cantera: 14, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 12, tribuna2: 12, fondo1: 10, fondo2: 12 } },
  'lecce': { nombre: 'Stadio Via del Mare', capacidad: 40670, precioMin: 14, precioMax: 55, entrenamiento: 9, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 10, tribuna2: 10, fondo1: 10, fondo2: 9 } },
  'bologna': { nombre: "Stadio Renato Dall'Ara", capacidad: 38279, precioMin: 15, precioMax: 58, entrenamiento: 11, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 10, tribuna2: 9, fondo1: 10, fondo2: 9 } },
  'genoa': { nombre: 'Stadio Luigi Ferraris', capacidad: 36599, precioMin: 16, precioMax: 60, entrenamiento: 10, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 11, fondo2: 10 } },
  'parma': { nombre: 'Stadio Ennio Tardini', capacidad: 28783, precioMin: 12, precioMax: 48, entrenamiento: 11, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 7 } },
  'torino': { nombre: 'Stadio Olimpico Grande Torino', capacidad: 28177, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 8, fondo2: 7 } },
  'udinese': { nombre: 'Bluenergy Stadium', capacidad: 25144, precioMin: 12, precioMax: 48, entrenamiento: 12, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 7, tribuna2: 8, fondo1: 7, fondo2: 6 } },
  'sassuolo': { nombre: 'MAPEI Stadium', capacidad: 21525, precioMin: 11, precioMax: 45, entrenamiento: 12, cantera: 12, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'atalanta': { nombre: 'Gewiss Stadium', capacidad: 21000, precioMin: 15, precioMax: 55, entrenamiento: 13, cantera: 14, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 7, fondo1: 7, fondo2: 7 } },
  'monza': { nombre: 'U-Power Stadium', capacidad: 18568, precioMin: 11, precioMax: 42, entrenamiento: 11, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 7, tribuna2: 5, fondo1: 5, fondo2: 6 } },
  'cagliari': { nombre: 'Unipol Domus', capacidad: 16416, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 11, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 5, fondo2: 5 } },
  'frosinone': { nombre: 'Stadio Benito Stirpe', capacidad: 16227, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 5, fondo1: 5, fondo2: 5 } },
  'como': { nombre: 'Stadio Giuseppe Sinigaglia', capacidad: 13602, precioMin: 12, precioMax: 45, entrenamiento: 11, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 4, fondo1: 4, fondo2: 3 } },
  'venezia': { nombre: 'Stadio Pierluigi Penzo', capacidad: 7450, precioMin: 12, precioMax: 40, entrenamiento: 10, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 2 } },
  'hellas-verona': { nombre: 'Stadio Marcantonio Bentegodi', capacidad: 39211, precioMin: 15, precioMax: 52, entrenamiento: 10, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 10, tribuna2: 10, fondo1: 9, fondo2: 11 } },
  'palermo-fc': { nombre: 'Stadio Renzo Barbera', capacidad: 37242, precioMin: 15, precioMax: 54, entrenamiento: 11, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 10, tribuna2: 10, fondo1: 11, fondo2: 10 } },
  'sampdoria': { nombre: 'Stadio Luigi Ferraris', capacidad: 36599, precioMin: 16, precioMax: 55, entrenamiento: 11, cantera: 12, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 11 } },
  'padova': { nombre: 'Stadio Comunale Euganeo', capacidad: 32420, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'avellino': { nombre: 'Stadio Partenio-Adriano Lombardi', capacidad: 26308, precioMin: 11, precioMax: 45, entrenamiento: 8, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 9 } },
  'cesena': { nombre: 'Stadio Dino Manuzzi', capacidad: 23860, precioMin: 12, precioMax: 45, entrenamiento: 9, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 9 } },
  'mantova': { nombre: 'Stadio Danilo Martelli', capacidad: 21000, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 8, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 7, tribuna2: 6, fondo1: 5, fondo2: 7 } },
  'vicenza': { nombre: 'Stadio Romeo Menti', capacidad: 20920, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 8 } },
  'ascoli': { nombre: 'Stadio Cino e Lillo Del Duca', capacidad: 20853, precioMin: 10, precioMax: 40, entrenamiento: 9, cantera: 9, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 8, fondo2: 6 } },
  'cremonese': { nombre: 'Stadio Giovanni Zini', capacidad: 20641, precioMin: 12, precioMax: 44, entrenamiento: 10, cantera: 10, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 5, fondo2: 8 } },
  'modena': { nombre: 'Stadio Alberto Braglia', capacidad: 20507, precioMin: 11, precioMax: 40, entrenamiento: 9, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 5, fondo2: 8 } },
  'benevento': { nombre: 'Stadio Ciro Vigorito', capacidad: 18900, precioMin: 11, precioMax: 40, entrenamiento: 9, cantera: 9, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 8 } },
  'pisa-sc': { nombre: 'Arena Garibaldi - Romeo Anconetani', capacidad: 17500, precioMin: 10, precioMax: 38, entrenamiento: 8, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 7, fondo2: 5 } },
  'empoli': { nombre: 'Stadio Carlo Castellani', capacidad: 16800, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 13, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 6, tribuna2: 4, fondo1: 4, fondo2: 6 } },
  'catanzaro': { nombre: 'Stadio Nicola Ceravolo', capacidad: 14650, precioMin: 10, precioMax: 36, entrenamiento: 7, cantera: 8, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 7 } },
  'ss-arezzo': { nombre: 'Stadio Citt\u00e0 di Arezzo', capacidad: 13128, precioMin: 9, precioMax: 34, entrenamiento: 8, cantera: 8, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 6 } },
  'carrarese': { nombre: 'Stadio dei Marmi', capacidad: 9500, precioMin: 9, precioMax: 32, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 3, fondo2: 4 } },
  'juve-stabia': { nombre: 'Stadio Comunale Romeo Menti', capacidad: 7642, precioMin: 8, precioMax: 30, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 3, fondo2: 5 } },
  'virtus-entella': { nombre: 'Stadio Enrico Sannazzari', capacidad: 5535, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 3 } },
  'fc-sudtirol': { nombre: 'Stadio Marco Druso', capacidad: 3463, precioMin: 10, precioMax: 32, entrenamiento: 11, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p3': { nombre: 'Enea Stadion', capacidad: 42837, precioMin: 18, precioMax: 60, entrenamiento: 14, cantera: 15, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 11 } },
  'p8': { nombre: 'Tarczy\u0144ski Arena', capacidad: 42771, precioMin: 16, precioMax: 58, entrenamiento: 12, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 10, fondo2: 11 } },
  'p1': { nombre: 'Synerise Arena', capacidad: 33326, precioMin: 15, precioMax: 55, entrenamiento: 11, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 10, fondo2: 10 } },
  'p18': { nombre: 'Synerise Arena', capacidad: 33326, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 10, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 9, fondo2: 9 } },
  'p2': { nombre: 'Stadion Wojska Polskiego', capacidad: 31800, precioMin: 20, precioMax: 65, entrenamiento: 14, cantera: 14, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 11, tribuna2: 11, fondo1: 11, fondo2: 10 } },
  'p6': { nombre: 'Arena Zabrze', capacidad: 28236, precioMin: 12, precioMax: 48, entrenamiento: 10, cantera: 12, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 9, fondo2: 8 } },
  'p7': { nombre: 'Chorten Arena', capacidad: 22432, precioMin: 12, precioMax: 46, entrenamiento: 10, cantera: 11, zonas: { esquina1: 8, esquina2: 8, esquina3: 8, esquina4: 8, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'p5': { nombre: 'Stadion Florian Krygier', capacidad: 21163, precioMin: 14, precioMax: 50, entrenamiento: 11, cantera: 12, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'p13': { nombre: 'Stadion Widzewa \u0141\u00f3d\u017a', capacidad: 18018, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 10, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 8 } },
  'p11': { nombre: 'Stadion Zag\u0142\u0119bia Lubin', capacidad: 16086, precioMin: 11, precioMax: 42, entrenamiento: 12, cantera: 13, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 7, fondo2: 6 } },
  'p14': { nombre: 'EXBUD Arena', capacidad: 15550, precioMin: 10, precioMax: 40, entrenamiento: 9, cantera: 10, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'p17': { nombre: 'Arena Lublin', capacidad: 15500, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p10': { nombre: 'Stadion Cracovii im. J\u00f3zefa Pi\u0142sudskiego', capacidad: 15016, precioMin: 11, precioMax: 42, entrenamiento: 10, cantera: 11, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p9': { nombre: 'Arena Katowice', capacidad: 15000, precioMin: 11, precioMax: 40, entrenamiento: 11, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p15': { nombre: 'Orlen Stadion im. Kazimierza G\u00f3rskiego', capacidad: 15004, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p16': { nombre: 'Stadion im. Braci Czachor\u00f3w', capacidad: 14440, precioMin: 9, precioMax: 36, entrenamiento: 8, cantera: 8, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 5 } },
  'p12': { nombre: 'Stadion Miejski w Gliwicach', capacidad: 9913, precioMin: 10, precioMax: 35, entrenamiento: 9, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'p4': { nombre: 'Estadio Municipal de Cz\u0119stochowa', capacidad: 5500, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p22': { nombre: 'Polsat Plus Arena Gda\u0144sk', capacidad: 41620, precioMin: 12, precioMax: 45, entrenamiento: 12, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 11 } },
  'p30': { nombre: 'Stadion \u015al\u0105ski', capacidad: 55211, precioMin: 12, precioMax: 45, entrenamiento: 10, cantera: 12, zonas: { esquina1: 9, esquina2: 9, esquina3: 9, esquina4: 9, tribuna1: 13, tribuna2: 13, fondo1: 11, fondo2: 11 } },
  'p19': { nombre: 'Stadion Miejski w Gdyni', capacidad: 15139, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'p23': { nombre: 'Stadion Miejski im. W\u0142adys\u0142awa Kr\u00f3la', capacidad: 18029, precioMin: 11, precioMax: 40, entrenamiento: 11, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 8, tribuna2: 8, fondo1: 7, fondo2: 7 } },
  'p32': { nombre: 'Stadion Miejski w Rzeszowie', capacidad: 12700, precioMin: 9, precioMax: 34, entrenamiento: 10, cantera: 11, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 6, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'p31': { nombre: 'Stadion Miejski w Mielcu', capacidad: 6864, precioMin: 9, precioMax: 35, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p36': { nombre: 'Enea Stadion', capacidad: 42837, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 11, fondo2: 11 } },
  'p28': { nombre: 'Stadion im. gen. Kazimierza Sosnkowskiego', capacidad: 7150, precioMin: 9, precioMax: 36, entrenamiento: 9, cantera: 11, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 4 } },
  'p24': { nombre: 'Stadion Miejski im. Or\u0142a Bia\u0142ego', capacidad: 6156, precioMin: 8, precioMax: 32, entrenamiento: 9, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p29': { nombre: 'Stadion Miejski w Grodzisku Wielkopolskim', capacidad: 5383, precioMin: 9, precioMax: 32, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p26': { nombre: 'Stadion Miejski w Bielsku-Bia\u0142ej', capacidad: 15076, precioMin: 9, precioMax: 35, entrenamiento: 9, cantera: 9, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p33': { nombre: 'Stadion Termaliki', capacidad: 4660, precioMin: 8, precioMax: 30, entrenamiento: 10, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p25': { nombre: 'Stadion Miejski w Opolu', capacidad: 11600, precioMin: 10, precioMax: 36, entrenamiento: 10, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'p20': { nombre: 'Stadion im. Braci G\u0142adysz\u00f3w', capacidad: 2817, precioMin: 7, precioMax: 25, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p27': { nombre: 'Stadion Miejski w Siedlcach', capacidad: 2901, precioMin: 7, precioMax: 25, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p34': { nombre: 'Stadion Polonii Bytom', capacidad: 2220, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p21': { nombre: 'GKS Stadion', capacidad: 1000, precioMin: 6, precioMax: 20, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p35': { nombre: 'Stadion Miejski w Skierniewicach', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p46': { nombre: 'Stadion Miejski w Bydgoszczy', capacidad: 20247, precioMin: 10, precioMax: 36, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  'p37': { nombre: 'Stadion Miejski w Tychach', capacidad: 15150, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 6, esquina2: 6, esquina3: 6, esquina4: 6, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 7 } },
  'p40': { nombre: 'Stadion Miejski w Nowym S\u0105czu', capacidad: 8111, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 9, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'p38': { nombre: 'Stadion G\u00f3rnika \u0141\u0119czna', capacidad: 7495, precioMin: 9, precioMax: 34, entrenamiento: 9, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p51': { nombre: 'Tarczy\u0144ski Arena', capacidad: 42771, precioMin: 5, precioMax: 12, entrenamiento: 12, cantera: 11, zonas: { esquina1: 10, esquina2: 10, esquina3: 10, esquina4: 10, tribuna1: 12, tribuna2: 12, fondo1: 10, fondo2: 11 } },
  'p45': { nombre: 'Podkarpackie Centrum Pi\u0142ki No\u017cnej', capacidad: 3760, precioMin: 8, precioMax: 26, entrenamiento: 10, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p44': { nombre: 'Stadion Miejski w Grudzi\u0105dzu', capacidad: 5323, precioMin: 8, precioMax: 25, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p43': { nombre: 'Stadion Chojniczanki', capacidad: 3500, precioMin: 8, precioMax: 25, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p39': { nombre: 'Stadion Suche Stawy', capacidad: 6000, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'p50': { nombre: 'Legia Training Center', capacidad: 1000, precioMin: 5, precioMax: 10, entrenamiento: 14, cantera: 14, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p41': { nombre: 'Stadion Resovii', capacidad: 3400, precioMin: 8, precioMax: 25, entrenamiento: 8, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p42': { nombre: 'Stadion Znicza Pruszk\u00f3w', capacidad: 1977, precioMin: 8, precioMax: 24, entrenamiento: 8, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p48': { nombre: 'Stadion Rekordu Bielsko-Bia\u0142a', capacidad: 2000, precioMin: 7, precioMax: 22, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p47': { nombre: 'Stadion im. Pi\u0142sudskiego', capacidad: 2500, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p49': { nombre: 'Stadion Miejski w \u015awidniku', capacidad: 2900, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p54': { nombre: 'Stadion OSIR w Zielonej G\u00f3rze', capacidad: 2900, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p52': { nombre: 'Stadion Miejski w Kleczewie', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p53': { nombre: 'Stadion \u015awitu Skolwin', capacidad: 1000, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p66': { nombre: 'Stadion Miejski', capacidad: 3400, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p62': { nombre: 'Stadion Miejski', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'p70': { nombre: 'Stadion Miejski', capacidad: 3060, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p59': { nombre: 'Stadion Miejski', capacidad: 3500, precioMin: 6, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p64': { nombre: 'Stadion Miejski', capacidad: 4000, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p56': { nombre: 'Stadion Marymont', capacidad: 1000, precioMin: 6, precioMax: 15, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p55': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 10, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p58': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 11, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p69': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 10, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p71': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 9, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p57': { nombre: 'Stadion Miejski w Lidzbarku Warmi\u0144skim', capacidad: 1200, precioMin: 5, precioMax: 16, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p60': { nombre: 'Stadion Miejski im. Budowlanych', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p61': { nombre: 'Stadion Miejski w M\u0142awie', capacidad: 2000, precioMin: 6, precioMax: 20, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p63': { nombre: 'Stadion Miejski w Zambrowie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p65': { nombre: 'Stadion im. Rozmusa', capacidad: 2000, precioMin: 6, precioMax: 20, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p67': { nombre: 'Stadion w Troszynie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p68': { nombre: 'Stadion OSiR w Sieradzu', capacidad: 1200, precioMin: 5, precioMax: 16, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p72': { nombre: 'Campo de Entrenamiento', capacidad: 2000, precioMin: 5, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p78': { nombre: 'Stadion Miejski', capacidad: 8166, precioMin: 9, precioMax: 30, entrenamiento: 9, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p87': { nombre: 'Stadion Miejski', capacidad: 4300, precioMin: 8, precioMax: 25, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'p74': { nombre: 'Stadion Miejski', capacidad: 6000, precioMin: 8, precioMax: 24, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'p73': { nombre: 'Stadion im. Stanis\u0142awa Figasa', capacidad: 4000, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p82': { nombre: 'Amica Wronki', capacidad: 2500, precioMin: 5, precioMax: 12, entrenamiento: 14, cantera: 15, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
'p75': { nombre: 'Stadion im. Cieslewicza', capacidad: 4000, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p76': { nombre: 'Stadion Gedanii', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p77': { nombre: 'Stadion w Nowym Stawie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p79': { nombre: 'Stadion Miejski w Stargardzie', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p80': { nombre: 'Stadion w K\u00f3rniku', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p81': { nombre: 'GOSiR Luzino', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p83': { nombre: 'Stadion w St\u0119szewie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p84': { nombre: 'Stadion Miejski w Czarnkowie', capacidad: 1200, precioMin: 5, precioMax: 16, entrenamiento: 7, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p85': { nombre: 'Stadion \u015aredzki', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p86': { nombre: 'Stadion OSiR Wyspiarz', capacidad: 3070, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p89': { nombre: 'Stadion Miejski we Wrze\u015bni', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p90': { nombre: 'Stadion Miejski w \u015awieciu', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p108': { nombre: 'ArcelorMittal Park', capacidad: 11600, precioMin: 10, precioMax: 35, entrenamiento: 11, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'p104': { nombre: 'Stadion OSiR', capacidad: 8000, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p105': { nombre: 'Stadion OSiR', capacidad: 8000, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 8, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p100': { nombre: 'Stadion Miejski', capacidad: 10304, precioMin: 8, precioMax: 30, entrenamiento: 8, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p96': { nombre: 'Stadion Miejski', capacidad: 4325, precioMin: 8, precioMax: 26, entrenamiento: 9, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'p99': { nombre: 'Stadion Miejski', capacidad: 3500, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p98': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 9, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p107': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 12, cantera: 13, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
'p91': { nombre: 'Stadion w Su\u0142owie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p92': { nombre: 'Stadion Rapidu', capacidad: 1200, precioMin: 6, precioMax: 16, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p93': { nombre: 'Stadion w Bytomiu Odrza\u0144skim', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p94': { nombre: 'Stadion Miejski w Gubinie', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p95': { nombre: 'Gminny Stadion w Gocza\u0142kowicach', capacidad: 1000, precioMin: 6, precioMax: 16, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p97': { nombre: 'Stadion Miejski w Jeleniej G\u00f3rze', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p103': { nombre: 'Stadion MOSiR w Brzegu', capacidad: 2000, precioMin: 6, precioMax: 20, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p115': { nombre: 'Stadion Miejski', capacidad: 8500, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'p120': { nombre: 'Stadion Miejski', capacidad: 3770, precioMin: 8, precioMax: 26, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  'p111': { nombre: 'Stadion OSiR', capacidad: 7000, precioMin: 7, precioMax: 24, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  'p125': { nombre: 'Stadion Miejski', capacidad: 4000, precioMin: 7, precioMax: 24, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 2 } },
  'p114': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p122': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 11, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p124': { nombre: 'Campo de Entrenamiento', capacidad: 1000, precioMin: 4, precioMax: 10, entrenamiento: 11, cantera: 12, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p109': { nombre: 'Stadion Miejski w Che\u0142mie', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p110': { nombre: 'Stadion Miejski w Po\u0142a\u0144cu', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p112': { nombre: 'Stadion Miejski w Jaros\u0142awiu', capacidad: 2000, precioMin: 6, precioMax: 20, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p113': { nombre: 'Stadion w Kolbuszowej', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p116': { nombre: 'Stadion w Morawicy', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p117': { nombre: 'Stadion Miejski w J\u0119drzejowie', capacidad: 1200, precioMin: 5, precioMax: 16, entrenamiento: 7, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p118': { nombre: 'Stadion Miejski w Bia\u0142ej Podlaskiej', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p119': { nombre: 'Stadion Miejski w Lubaczowie', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p121': { nombre: 'Stadion Miejski w Starachowicach', capacidad: 3000, precioMin: 7, precioMax: 22, entrenamiento: 8, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p123': { nombre: 'Stadion w Ja\u015bkowicach', capacidad: 1000, precioMin: 5, precioMax: 15, entrenamiento: 6, cantera: 6, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'p126': { nombre: 'Stadion Miejski w Busku-Zdroju', capacidad: 1500, precioMin: 6, precioMax: 18, entrenamiento: 7, cantera: 7, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  'pt1': { nombre: 'Est\u00e1dio da Luz', capacidad: 68100, precioMin: 30, precioMax: 90, entrenamiento: 15, cantera: 15, zonas: { esquina1: 13, esquina2: 13, esquina3: 13, esquina4: 13, tribuna1: 14, tribuna2: 14, fondo1: 13, fondo2: 13 } },
  'pt3': { nombre: 'Est\u00e1dio Jos\u00e9 Alvalade', capacidad: 50095, precioMin: 25, precioMax: 85, entrenamiento: 14, cantera: 15, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 13, fondo1: 11, fondo2: 12 } },
  'pt2': { nombre: 'Est\u00e1dio Do Drag\u00e3o', capacidad: 50033, precioMin: 25, precioMax: 85, entrenamiento: 13, cantera: 14, zonas: { esquina1: 11, esquina2: 11, esquina3: 11, esquina4: 11, tribuna1: 13, tribuna2: 13, fondo1: 11, fondo2: 12 } },
  'pt4': { nombre: 'Est\u00e1dio Municipal de Braga', capacidad: 30286, precioMin: 15, precioMax: 55, entrenamiento: 14, cantera: 14, zonas: { esquina1: 0, esquina2: 0, esquina3: 0, esquina4: 0, tribuna1: 10, tribuna2: 10, fondo1: 0, fondo2: 0 } },
  'pt5': { nombre: 'Est\u00e1dio Dom Afonso Henriques', capacidad: 30029, precioMin: 14, precioMax: 52, entrenamiento: 11, cantera: 11, zonas: { esquina1: 7, esquina2: 7, esquina3: 7, esquina4: 7, tribuna1: 9, tribuna2: 9, fondo1: 8, fondo2: 8 } },
  'pt18': { nombre: 'Est\u00e1dio Municipal do Fontelo', capacidad: 14368, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'pt15': { nombre: 'Est\u00e1dio de S\u00e3o Miguel', capacidad: 13277, precioMin: 11, precioMax: 40, entrenamiento: 9, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'pt9': { nombre: 'Est\u00e1dio dos Arcos', capacidad: 13000, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 11, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 3 } },
  'pt11': { nombre: 'Est\u00e1dio Cidade de Barcelos', capacidad: 12504, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'pt14': { nombre: 'Est\u00e1dio Jos\u00e9 Gomes', capacidad: 9288, precioMin: 10, precioMax: 36, entrenamiento: 9, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 4 } },
  'pt12': { nombre: 'Est\u00e1dio Comendador Joaquim de Almeida Freitas', capacidad: 9000, precioMin: 9, precioMax: 35, entrenamiento: 8, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  'pt16': { nombre: 'Est\u00e1dio dos Barreiros', capacidad: 8992, precioMin: 11, precioMax: 42, entrenamiento: 9, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  'pt7': { nombre: 'Est\u00e1dio Ant\u00f3nio Coimbra da Mota', capacidad: 8000, precioMin: 10, precioMax: 35, entrenamiento: 9, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 4, fondo1: 2, fondo2: 3 } },
  'pt17': { nombre: 'Complexo Desportivo do FC Alverca', capacidad: 7700, precioMin: 8, precioMax: 30, entrenamiento: 8, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'pt8': { nombre: 'Est\u00e1dio Municipal de Rio Maior', capacidad: 7000, precioMin: 10, precioMax: 34, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'pt13': { nombre: 'Est\u00e1dio da Madeira', capacidad: 5586, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'pt6': { nombre: 'Est\u00e1dio Municipal 22 de Junho', capacidad: 5307, precioMin: 11, precioMax: 36, entrenamiento: 10, cantera: 11, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  'pt10': { nombre: 'Est\u00e1dio Municipal de Arouca', capacidad: 5000, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 2 } },
  's2-17': { nombre: 'Est\u00e1dio Dr. Magalh\u00e3es Pessoa', capacidad: 23888, precioMin: 10, precioMax: 38, entrenamiento: 10, cantera: 10, zonas: { esquina1: 4, esquina2: 4, esquina3: 4, esquina4: 4, tribuna1: 6, tribuna2: 6, fondo1: 5, fondo2: 4 } },
  's2-1': { nombre: 'Est\u00e1dio Cidade de Coimbra', capacidad: 29622, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 11, zonas: { esquina1: 5, esquina2: 5, esquina3: 5, esquina4: 5, tribuna1: 7, tribuna2: 7, fondo1: 6, fondo2: 6 } },
  's2-6': { nombre: 'Est\u00e1dio de S\u00e3o L\u00fais', capacidad: 12000, precioMin: 11, precioMax: 40, entrenamiento: 9, cantera: 10, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 5 } },
  's2-5': { nombre: 'Est\u00e1dio Municipal de Chaves', capacidad: 12000, precioMin: 10, precioMax: 38, entrenamiento: 9, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 5, tribuna2: 5, fondo1: 4, fondo2: 4 } },
  's2-12': { nombre: 'Est\u00e1dio do Portimonense', capacidad: 9544, precioMin: 10, precioMax: 36, entrenamiento: 9, cantera: 10, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 5, fondo1: 3, fondo2: 4 } },
  's2-9': { nombre: 'Est\u00e1dio do Mar', capacidad: 9766, precioMin: 9, precioMax: 35, entrenamiento: 9, cantera: 11, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  's2-3': { nombre: 'Est\u00e1dio do CD Aves', capacidad: 8560, precioMin: 10, precioMax: 35, entrenamiento: 10, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  's2-18': { nombre: 'Est\u00e1dio do FC Vizela', capacidad: 6100, precioMin: 9, precioMax: 34, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 3 } },
  's2-15': { nombre: 'Est\u00e1dio Jo\u00e3o Cardoso', capacidad: 5000, precioMin: 9, precioMax: 32, entrenamiento: 9, cantera: 9, zonas: { esquina1: 3, esquina2: 3, esquina3: 3, esquina4: 3, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  's2-7': { nombre: 'Est\u00e1dio Marcolino de Castro', capacidad: 5466, precioMin: 8, precioMax: 30, entrenamiento: 9, cantera: 10, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  's2-11': { nombre: 'Est\u00e1dio Municipal 25 de Abril', capacidad: 5230, precioMin: 8, precioMax: 30, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 2 } },
  's2-4': { nombre: 'Est\u00e1dio do Benfica Campus', capacidad: 2720, precioMin: 4, precioMax: 10, entrenamiento: 15, cantera: 15, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 1, fondo2: 1 } },
  's2-13': { nombre: 'Est\u00e1dio Jorge Sampaio', capacidad: 8267, precioMin: 4, precioMax: 10, entrenamiento: 13, cantera: 14, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 4, fondo1: 3, fondo2: 3 } },
  's2-14': { nombre: 'Est\u00e1dio Aur\u00e9lio Pereira', capacidad: 1180, precioMin: 4, precioMax: 10, entrenamiento: 14, cantera: 15, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 1, tribuna2: 1, fondo1: 1, fondo2: 1 } },
  's2-16': { nombre: 'Est\u00e1dio Manuel Marques', capacidad: 4000, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 9, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 2, tribuna2: 2, fondo1: 2, fondo2: 2 } },
  's2-8': { nombre: 'Est\u00e1dio Dr. Machado de Matos', capacidad: 7540, precioMin: 8, precioMax: 28, entrenamiento: 8, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 4, tribuna2: 3, fondo1: 2, fondo2: 2 } },
  's2-10': { nombre: 'Est\u00e1dio do Lusit\u00e2nia', capacidad: 8000, precioMin: 8, precioMax: 30, entrenamiento: 8, cantera: 9, zonas: { esquina1: 2, esquina2: 2, esquina3: 2, esquina4: 2, tribuna1: 4, tribuna2: 3, fondo1: 3, fondo2: 3 } },
  's2-2': { nombre: 'Est\u00e1dio Municipal de Amarante', capacidad: 5000, precioMin: 7, precioMax: 25, entrenamiento: 7, cantera: 8, zonas: { esquina1: 1, esquina2: 1, esquina3: 1, esquina4: 1, tribuna1: 3, tribuna2: 2, fondo1: 1, fondo2: 1 } }
}

/* ---------- Estado ---------- */

function zcClamp(v, min, max) {
  var n = parseInt(v, 10)
  if (isNaN(n)) return min
  return Math.max(min, Math.min(max, n))
}

function legacyCapacidadZonas(zonas) {
  var total = 0
  ZC_ZONAS_BASE.forEach(function(z) {
    var t = ZC_TIPO_ZONA[z.tipo]
    total += t.base + t.paso * (zonas[z.id] || 0)
  })
  return total
}

/* Reparte la capacidad total entre las 8 zonas proporcionalmente a su
   peso (base + paso*nivel). Redondeo por resto mayor: la suma es exacta. */
function repartirCapacidadZonas(zonas, capacidad) {
  var pesos = {}
  var sumaPesos = 0
  ZC_ZONAS_BASE.forEach(function(z) {
    var t = ZC_TIPO_ZONA[z.tipo]
    var p = t.base + t.paso * (zonas[z.id] || 0)
    pesos[z.id] = p
    sumaPesos += p
  })
  if (sumaPesos <= 0 || !capacidad) {
    var base = {}
    ZC_ZONAS_BASE.forEach(function(z) { base[z.id] = 0 })
    return base
  }
  var seats = {}
  var asignados = 0
  ZC_ZONAS_BASE.forEach(function(z) {
    var v = Math.floor(capacidad * pesos[z.id] / sumaPesos)
    seats[z.id] = v
    asignados += v
  })
  var resto = capacidad - asignados
  while (resto > 0) {
    var mejor = null
    var mejorFra = -1
    ZC_ZONAS_BASE.forEach(function(z) {
      var fra = capacidad * pesos[z.id] / sumaPesos - seats[z.id]
      if (fra > mejorFra) { mejorFra = fra; mejor = z.id }
    })
    if (mejor == null) break
    seats[mejor]++
    resto--
  }
  return seats
}

function initZonaClub() {
  if (state.zonaClub) return getZonaClub()
  var cfg = (state.teamId && ZC_CLUBES_INICIAL[state.teamId]) || null
  var zonas = {}
  ZC_ZONAS_BASE.forEach(function(z) {
    zonas[z.id] = cfg ? zcClamp(cfg.zonas[z.id], 0, ZC_MAX_ZONA_LEVEL) : 0
  })
  var nombre = cfg && cfg.nombre
    ? cfg.nombre
    : ((typeof state.team === 'string' && state.team) ? 'Estadio Municipal de ' + state.team : 'Estadio Municipal')
  var capacidad = cfg ? cfg.capacidad : legacyCapacidadZonas(zonas)
  state.zonaClub = {
    entrenamiento: zcClamp(cfg ? cfg.entrenamiento : 1, 1, ZC_MAX_LEVEL),
    cantera: zcClamp(cfg ? cfg.cantera : 1, 1, ZC_MAX_LEVEL),
    estadio: { nombre: nombre, precioEntrada: getPrecioPerfecto(), capacidad: capacidad, zonas: zonas, zonasSeats: repartirCapacidadZonas(zonas, capacidad) },
    obraEnCurso: null
  }
  return state.zonaClub
}

function getZonaClub() {
  if (typeof state === 'undefined' || !state) return null
  if (!state.zonaClub) initZonaClub()
  if (!state.zonaClub.estadio) {
    var zonas = {}
    ZC_ZONAS_BASE.forEach(function(z) { zonas[z.id] = 0 })
    state.zonaClub.estadio = { nombre: '', precioEntrada: 15, zonas: zonas }
  }
  if (!state.zonaClub.estadio.zonas) {
    state.zonaClub.estadio.zonas = {}
    ZC_ZONAS_BASE.forEach(function(z) { state.zonaClub.estadio.zonas[z.id] = 0 })
  }
  if (!state.zonaClub.estadio.nombre) {
    state.zonaClub.estadio.nombre = (typeof state.team === 'string' && state.team) ? 'Estadio Municipal de ' + state.team : 'Estadio Municipal'
  }
  Object.keys(state.zonaClub.estadio.zonas).forEach(function(zid) {
    state.zonaClub.estadio.zonas[zid] = zcClamp(state.zonaClub.estadio.zonas[zid], 0, ZC_MAX_ZONA_LEVEL)
  })
  if (state.zonaClub.estadio.capacidad == null) {
    state.zonaClub.estadio.capacidad = legacyCapacidadZonas(state.zonaClub.estadio.zonas)
  }
  if (!state.zonaClub.estadio.zonasSeats) {
    state.zonaClub.estadio.zonasSeats = repartirCapacidadZonas(state.zonaClub.estadio.zonas, state.zonaClub.estadio.capacidad || 0)
  }
  if (state.zonaClub.entrenamiento == null) state.zonaClub.entrenamiento = 1
  if (state.zonaClub.cantera == null) state.zonaClub.cantera = 1
  state.zonaClub.entrenamiento = zcClamp(state.zonaClub.entrenamiento, 1, ZC_MAX_LEVEL)
  state.zonaClub.cantera = zcClamp(state.zonaClub.cantera, 1, ZC_MAX_LEVEL)
  if (state.zonaClub.obraEnCurso == null) state.zonaClub.obraEnCurso = null
  return state.zonaClub
}

/* ---------- Costes, plazos y capacidades ---------- */

function getCosteMejoraInstalacion(clave) {
  var zc = getZonaClub()
  if (!zc || !ZC_INSTALACIONES_CONFIG[clave]) return null
  var nivel = zc[clave] || 1
  if (nivel >= ZC_MAX_LEVEL) return null
  return ZC_INSTALACIONES_CONFIG[clave].niveles[nivel - 1]
}

function getSemanasMejoraInstalacion(clave) {
  if (!ZC_INSTALACIONES_CONFIG[clave]) return 0
  var nivel = (getZonaClub()[clave] || 1)
  return ZC_INSTALACIONES_CONFIG[clave].semanas[nivel - 1]
}

function getCosteMejoraZona(zonaId) {
  var zc = getZonaClub()
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === zonaId })[0]
  if (!zc || !z) return null
  var nivel = zc.estadio.zonas[zonaId] || 0
  if (nivel >= ZC_MAX_ZONA_LEVEL) return null
  var idx = Math.max(0, nivel - 1)
  return ZC_TIPO_ZONA[z.tipo].costes[idx]
}

function getSemanasMejoraZona(zonaId) {
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === zonaId })[0]
  if (!z) return 0
  return ZC_TIPO_ZONA[z.tipo].semanas
}

function getCapacidadEstadio() {
  var zc = getZonaClub()
  if (!zc) return 0
  if (zc.estadio.zonasSeats) {
    var total = 0
    ZC_ZONAS_BASE.forEach(function(z) { total += zc.estadio.zonasSeats[z.id] || 0 })
    return total
  }
  return zc.estadio.capacidad || 0
}

function getCapacidadMaxEstadio() {
  var zc = getZonaClub()
  if (!zc) return 0
  var extra = 0
  ZC_ZONAS_BASE.forEach(function(z) {
    var nivel = zc.estadio.zonas[z.id] || 0
    if (nivel < ZC_MAX_ZONA_LEVEL) {
      extra += ZC_TIPO_ZONA[z.tipo].paso * (ZC_MAX_ZONA_LEVEL - nivel)
    }
  })
  return (zc.estadio.capacidad || 0) + extra
}

function getPrecioEntrada() {
  var zc = getZonaClub()
  return zc && zc.estadio ? (zc.estadio.precioEntrada || 15) : 15
}

/* Rango de precio recomendado del club (min/max del slider) */
function getPrecioMinClub() {
  var cfg = (state && state.teamId) ? ZC_CLUBES_INICIAL[state.teamId] : null
  return (cfg && cfg.precioMin) || ZC_PRECIO_MIN
}

function getPrecioMaxClub() {
  var cfg = (state && state.teamId) ? ZC_CLUBES_INICIAL[state.teamId] : null
  return (cfg && cfg.precioMax) || ZC_PRECIO_MAX
}

/* 'Precio perfecto': precio del rango que maximiza ingreso esperado
   (asistencia × precio) dentro del tramo elástico de la curva, es decir
   hasta donde la ocupación aún desciende (ignora el tramo donde ya está
   al suelo, que inflaría el ingreso con el precio). */
function getPrecioPerfecto(min, max) {
  var lo = min == null ? getPrecioMinClub() : min
  var hi = max == null ? getPrecioMaxClub() : max
  var mejor = lo
  var mejorV = -1
  for (var p = lo; p <= hi; p++) {
    var f = getFactorOcupacion(p)
    if (f <= 0.28) break
    var v = p * f
    if (v > mejorV) { mejorV = v; mejor = p }
  }
  return mejor
}

/* Curva de demanda: la ocupación cae al subir el precio.
   precio 5€ ≈ 97% · 15€ ≈ 90% · 30€ ≈ 72% · 45€ ≈ 54% · 60€ ≈ 36% */
function getFactorOcupacion(precio) {
  var p = precio == null ? getPrecioEntrada() : precio
  var f = 1.08 - (p * 0.012)
  return Math.max(0.28, Math.min(0.97, f))
}

function getAsistenciaPartido(precio) {
  return Math.round(getCapacidadEstadio() * getFactorOcupacion(precio))
}

function getIngresosEstimadosPartido(precio) {
  var p = precio == null ? getPrecioEntrada() : precio
  return getAsistenciaPartido(p) * p
}

function getIncrementoIngresosZona(zonaId) {
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === zonaId })[0]
  if (!z) return 0
  var p = getPrecioEntrada()
  return Math.round(ZC_TIPO_ZONA[z.tipo].paso * getFactorOcupacion(p)) * p
}

function getCapacidadZona(zonaId) {
  var zc = getZonaClub()
  if (!zc) return 0
  if (zc.estadio.zonasSeats && zc.estadio.zonasSeats[zonaId] != null) return zc.estadio.zonasSeats[zonaId]
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === zonaId })[0]
  if (!z) return 0
  var t = ZC_TIPO_ZONA[z.tipo]
  return t.base + t.paso * (zc.estadio.zonas[zonaId] || 0)
}

/* Taquilla de partido en casa: ahora depende del estadio */
function getTaquillaEstadio() {
  try {
    var zc = getZonaClub()
    if (zc && zc.estadio && getCapacidadEstadio() > 0) return getIngresosEstimadosPartido()
  } catch (e) {}
  return Math.round(state.presupuestoInicial * 0.0015)
}

/* ---------- Efectos de las instalaciones ---------- */

/* Bonus en la progresión de fin de temporada para jugadores jóvenes */
function getBonusEntrenamiento(nivelOverride) {
  var zc = getZonaClub()
  if (!zc) return 0
  var nivel = nivelOverride != null ? nivelOverride : (zc.entrenamiento || 1)
  return Math.max(0, nivel - 1)
}

/* Bonus de media/potencial aplicado a los canteranos del Sub-18 al generarse */
function getBonusCantera(nivelOverride) {
  var zc = getZonaClub()
  if (!zc) return 0
  var nivel = nivelOverride != null ? nivelOverride : (zc.cantera || 1)
  return Math.max(0, nivel - 1)
}

function getMediaSub18() {
  var sq = state.filial2Squad || []
  if (!sq.length) return 0
  return Math.round(sq.reduce(function(s, p) { return s + (p.skill || 0) }, 0) / sq.length)
}

/* ---------- Obras ---------- */

function getNombreObra(tipo, clave) {
  if (tipo === 'instalacion') {
    return (ZC_INSTALACIONES_CONFIG[clave] || {}).nombre || clave
  }
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === clave })[0]
  return z ? 'Zona: ' + z.nombre : clave
}

function getMensajeObraEnCurso() {
  var zc = getZonaClub()
  if (!zc || !zc.obraEnCurso) return ''
  return 'Construcci\u00f3n en curso (' + zc.obraEnCurso.semanas + ' semana' + (zc.obraEnCurso.semanas === 1 ? '' : 's') + ' restantes)'
}

function zcObraBannerHtml(zc) {
  if (!zc || !zc.obraEnCurso) return ''
  return '<div class="zc-obra-banner">' +
    '<strong>Construcci\u00f3n en curso:</strong> ' + getNombreObra(zc.obraEnCurso.tipo, zc.obraEnCurso.clave) +
    ' <span class="zc-obra-semanas">(' + zc.obraEnCurso.semanas + ' semana' + (zc.obraEnCurso.semanas === 1 ? '' : 's') + ' restantes)</span>' +
  '</div>'
}

function iniciarObra(tipo, clave) {
  var zc = getZonaClub()
  if (!zc) return
  if (zc.obraEnCurso) {
    alert(getMensajeObraEnCurso())
    return
  }
  var coste = tipo === 'instalacion' ? getCosteMejoraInstalacion(clave) : getCosteMejoraZona(clave)
  var semanas = tipo === 'instalacion' ? getSemanasMejoraInstalacion(clave) : getSemanasMejoraZona(clave)
  if (coste == null) { alert('Ya est\u00e1 en su nivel m\u00e1ximo') ; return }
  if (!state.finances || state.finances.balance < coste) {
    alert('Presupuesto insuficiente: te faltan ' + formatMoney(coste - (state.finances ? state.finances.balance : 0)))
    return
  }
  state.finances.balance -= coste
  state.finances.history.push({ reason: 'Construcci\u00f3n: ' + getNombreObra(tipo, clave), amount: -coste })
  zc.obraEnCurso = { tipo: tipo, clave: clave, semanas: semanas }
  try { addNotification('general', 'Obra iniciada', getNombreObra(tipo, clave) + ' \u00b7 ' + semanas + ' semana' + (semanas === 1 ? '' : 's') + ' (' + formatMoney(coste) + ')') } catch (e) {}
  closeZonaClubModals()
  if (typeof showTeamInfo === 'function') showTeamInfo(state.teamId)
}

/* Tick semanal: se llama junto a procesarEconomiaSemanal al avanzar jornada.
   Una sola construcción a la vez obligatoria a nivel de club. */
function procesarObrasClub() {
  var zc = getZonaClub()
  if (!zc || !zc.obraEnCurso) return
  zc.obraEnCurso.semanas--
  if (zc.obraEnCurso.semanas > 0) return
  var ob = zc.obraEnCurso
  zc.obraEnCurso = null
  if (ob.tipo === 'instalacion') {
    zc[ob.clave] = Math.min(ZC_MAX_LEVEL, (zc[ob.clave] || 1) + 1)
  } else if (zc.estadio.zonas[ob.clave] !== undefined) {
    zc.estadio.zonas[ob.clave] = Math.min(ZC_MAX_ZONA_LEVEL, (zc.estadio.zonas[ob.clave] || 0) + 1)
    var tipoZona = ZC_ZONAS_BASE.filter(function(x) { return x.id === ob.clave })[0]
    if (tipoZona) {
      var pasoObra = ZC_TIPO_ZONA[tipoZona.tipo].paso
      zc.estadio.capacidad = (zc.estadio.capacidad || 0) + pasoObra
      zc.estadio.zonasSeats = zc.estadio.zonasSeats || {}
      zc.estadio.zonasSeats[ob.clave] = (zc.estadio.zonasSeats[ob.clave] || 0) + pasoObra
    }
  }
  try {
    addNotification('general', 'Obra completada', getNombreObra(ob.tipo, ob.clave) + ' ya est\u00e1 operativa.')
  } catch (e) {}
}

/* ---------- Navegación de las pantallas dedicadas ---------- */

function openZonaClubView(screen) {
  if (!state || !state.teamId) return
  if (['entrenamiento', 'cantera', 'estadio'].indexOf(screen) < 0) return
  state.zcScreen = screen
  if (typeof showTeamInfo === 'function') showTeamInfo(state.teamId)
}

function closeZonaClubView() {
  if (!state) return
  state.zcScreen = null
  if (typeof showTeamInfo === 'function') showTeamInfo(state.teamId)
}

/* Renderiza la pantalla dedicada en #team-view-content (solo equipo del usuario) */
function renderZonaClubScreen() {
  var screen = state.zcScreen
  if (screen === 'estadio' && typeof renderEstadioScreen === 'function') return renderEstadioScreen()
  if ((screen === 'entrenamiento' || screen === 'cantera') && typeof renderInstalacionesScreen === 'function') return renderInstalacionesScreen(screen)
  return ''
}

/* Tarjeta resumen para la pestaña General (usa renderZonaClubCards) */
function renderZonaClubSection() {
  var zc = getZonaClub()
  if (!zc) return ''
  var html = '<div class="tactics-subsection-label" style="margin-top:14px">Zona del Club</div>'
  html += zcObraBannerHtml(zc)
  html += (typeof renderZonaClubCards === 'function') ? renderZonaClubCards() : ''
  return html
}

/* ---------- Helpers de UI compartidos ---------- */

function zcNivelDots(nivel, maximo) {
  var out = '<div class="zc-dots">'
  for (var i = 1; i <= (maximo || ZC_MAX_LEVEL); i++) {
    out += '<span class="zc-dot' + (i <= nivel ? ' active' : '') + '"></span>'
  }
  out += '</div>'
  return out
}

function zcScreenHead(titulo, subtitulo) {
  return '<div class="zc-screen-head">' +
    '<div class="zc-screen-head-text">' +
      '<div class="zc-screen-title">' + titulo + '</div>' +
      (subtitulo ? '<div class="zc-screen-sub">' + subtitulo + '</div>' : '') +
    '</div>' +
    '<span class="zc-btn zc-btn-ghost" onclick="closeZonaClubView()">\u2190 Volver</span>' +
  '</div>'
}

/* ---------- Modal de preview de zona (confirmación) ---------- */

function closeZonaClubModals() {
  var o = document.getElementById('zc-modal-overlay')
  if (o) o.remove()
}

function crearModalZonaClub() {
  closeZonaClubModals()
  var overlay = document.createElement('div')
  overlay.id = 'zc-modal-overlay'
  overlay.className = 'zc-modal-overlay'
  overlay.onclick = function(e) { if (e.target === overlay) closeZonaClubModals() }
  document.body.appendChild(overlay)
  return overlay
}

function zcModalShell(titulo, bodyHtml) {
  return '<div class="zc-modal">' +
    '<div class="zc-modal-head">' + titulo + '<span class="zc-modal-close" onclick="closeZonaClubModals()">\u00d7</span></div>' +
    '<div class="zc-modal-body">' + bodyHtml + '</div>' +
  '</div>'
}

function renderZonaPreviewModal(zonaId) {
  var zc = getZonaClub()
  var z = ZC_ZONAS_BASE.filter(function(x) { return x.id === zonaId })[0]
  if (!z) return
  var t = ZC_TIPO_ZONA[z.tipo]
  var nivel = zc.estadio.zonas[zonaId] || 0
  var coste = getCosteMejoraZona(zonaId)
  var semanas = getSemanasMejoraZona(zonaId)
  var capZona = getCapacidadZona(zonaId)
  var capAct = getCapacidadEstadio()
  var capN = capAct + t.paso
  var deltaIng = getIncrementoIngresosZona(zonaId)
  var ingActual = getIngresosEstimadosPartido()

  var cuerpo =
    '<div class="zc-preview-title">' + z.nombre + '</div>' +
    '<div class="zc-preview-tipo">' + t.label + ' \u00b7 Nivel ' + nivel + '/' + ZC_MAX_ZONA_LEVEL + '</div>' +
    '<div class="zc-preview-fila"><span>Capacidad de la zona</span><b>' + capZona.toLocaleString('es-ES') + '</b></div>' +
    '<div class="zc-preview-fila"><span>Capacidad actual del estadio</span><b>' + capAct.toLocaleString('es-ES') + '</b></div>' +
    '<div class="zc-preview-fila zc-preview-fila-add"><span>Asientos a a\u00f1adir</span><b>+' + t.paso.toLocaleString('es-ES') + '</b></div>' +
    '<div class="zc-preview-fila"><span>Nueva capacidad</span><b>' + capN.toLocaleString('es-ES') + '</b></div>' +
    '<div class="zc-preview-fila"><span>Coste</span><b>' + formatMoney(coste) + '</b></div>' +
    '<div class="zc-preview-fila"><span>Duraci\u00f3n</span><b>' + semanas + ' semana' + (semanas === 1 ? '' : 's') + '</b></div>' +
    '<div class="zc-preview-fila zc-preview-fila-add"><span>Ingresos extra por partido (est.)</span><b>+' + formatMoney(deltaIng) + '</b></div>' +
    '<div class="zc-preview-fila"><span>Nuevos ingresos por partido</span><b>' + formatMoney(ingActual + deltaIng) + '</b></div>'

  var acciones
  if (zc.obraEnCurso) {
    acciones = '<div class="zc-preview-lock">' + getMensajeObraEnCurso() + '</div>' +
      '<span class="zc-btn zc-btn-off zc-btn-block">Confirmar mejora</span>' +
      '<span class="zc-btn zc-btn-ghost zc-btn-block" onclick="closeZonaClubModals()">Volver</span>'
  } else if (!state.finances || state.finances.balance < coste) {
    acciones = '<div class="zc-preview-lock">Presupuesto insuficiente: te faltan ' + formatMoney(coste - (state.finances ? state.finances.balance : 0)) + '</div>' +
      '<span class="zc-btn zc-btn-off zc-btn-block">Confirmar mejora</span>' +
      '<span class="zc-btn zc-btn-ghost zc-btn-block" onclick="closeZonaClubModals()">Volver</span>'
  } else {
    acciones = '<span class="zc-btn zc-btn-on zc-btn-block" onclick="iniciarObra(\'estadio\',\'' + zonaId + '\')">Confirmar mejora</span>' +
      '<span class="zc-btn zc-btn-ghost zc-btn-block" onclick="closeZonaClubModals()">Volver</span>'
  }

  var overlay = crearModalZonaClub()
  overlay.innerHTML = zcModalShell(z.nombre, cuerpo + acciones)
}

/* ============================================================
   ZONA DEL CLUB — Vista de solo lectura de equipos ajenos
   (perfil en partida y preview antes de elegir equipo).
   No muta state ni crea obras; usa ZC_CLUBES_INICIAL.
   ============================================================ */

var ZC_VISTA = null

function getZonaClubDe(teamId) {
  var cfg = (teamId && ZC_CLUBES_INICIAL[teamId]) || null
  if (!cfg) return null
  var zonas = {}
  ZC_ZONAS_BASE.forEach(function(z) {
    zonas[z.id] = zcClamp(cfg.zonas[z.id], 0, ZC_MAX_ZONA_LEVEL)
  })
  var capacidad = cfg.capacidad || legacyCapacidadZonas(zonas)
  var pMin = cfg.precioMin || ZC_PRECIO_MIN
  var pMax = cfg.precioMax || ZC_PRECIO_MAX
  return {
    entrenamiento: zcClamp(cfg.entrenamiento, 1, ZC_MAX_LEVEL),
    cantera: zcClamp(cfg.cantera, 1, ZC_MAX_LEVEL),
    estadio: {
      nombre: cfg.nombre || 'Estadio Municipal',
      capacidad: capacidad,
      precioMin: pMin,
      precioMax: pMax,
      precioEntrada: getPrecioPerfecto(pMin, pMax),
      zonas: zonas,
      zonasSeats: repartirCapacidadZonas(zonas, capacidad)
    },
    obraEnCurso: null
  }
}

function getCapacidadEstadioDe(modelo) {
  if (!modelo || !modelo.estadio || !modelo.estadio.zonasSeats) return 0
  var total = 0
  ZC_ZONAS_BASE.forEach(function(z) { total += modelo.estadio.zonasSeats[z.id] || 0 })
  return total
}

function getCapacidadZonaDe(modelo, zonaId) {
  if (modelo && modelo.estadio && modelo.estadio.zonasSeats && modelo.estadio.zonasSeats[zonaId] != null) {
    return modelo.estadio.zonasSeats[zonaId]
  }
  return 0
}

function zcVistaPreviewActiva() {
  try {
    var pv = document.getElementById('view-team-preview')
    return !!(pv && pv.classList && pv.classList.contains('active'))
  } catch (e) { return false }
}

function openZonaClubViewDe(teamId, screen) {
  if (!getZonaClubDe(teamId)) return
  if (['entrenamiento', 'cantera', 'estadio'].indexOf(screen) < 0) return
  ZC_VISTA = { teamId: teamId, screen: screen }
  if (zcVistaPreviewActiva() && typeof showTeamPreview === 'function') showTeamPreview(teamId)
  else if (typeof showTeamInfo === 'function') showTeamInfo(teamId)
}

function closeZonaClubViewDe(teamId) {
  ZC_VISTA = null
  if (zcVistaPreviewActiva() && typeof showTeamPreview === 'function') showTeamPreview(teamId)
  else if (typeof showTeamInfo === 'function') showTeamInfo(teamId)
}

/* Sección resumen (tarjetas) read-only para un equipo ajeno */
function renderZonaClubSectionDe(teamId) {
  var modelo = getZonaClubDe(teamId)
  if (!modelo) return ''
  var html = '<div class="tactics-subsection-label" style="margin-top:14px">Zona del Club</div>'
  html += '<div class="zc-cards">'
  html += zcCardMini(
    ZC_INSTALACIONES_CONFIG.entrenamiento.icono,
    'Instalaciones de Entrenamiento',
    ZC_INSTALACIONES_CONFIG.entrenamiento.descCorta,
    'Nivel ' + modelo.entrenamiento + '/' + ZC_MAX_LEVEL,
    'openZonaClubViewDe(\'' + teamId + '\',\'entrenamiento\')'
  )
  html += zcCardMini(
    ZC_INSTALACIONES_CONFIG.cantera.icono,
    'Instalaciones de Cantera',
    ZC_INSTALACIONES_CONFIG.cantera.descCorta,
    'Nivel ' + modelo.cantera + '/' + ZC_MAX_LEVEL,
    'openZonaClubViewDe(\'' + teamId + '\',\'cantera\')'
  )
  var capDe = getCapacidadEstadioDe(modelo)
  html += zcCardMini(
    ZC_ICONO_ESTADIO,
    modelo.estadio.nombre,
    'Asistencia media seg\u00fan el precio de la entrada.',
    'Capacidad ' + capDe.toLocaleString('es-ES'),
    'openZonaClubViewDe(\'' + teamId + '\',\'estadio\')'
  )
  html += '</div>'
  return html
}

/* Pantalla read-only actual (según ZC_VISTA) */
function renderZonaClubScreenDe(teamId) {
  if (!ZC_VISTA || ZC_VISTA.teamId !== teamId) return ''
  if (ZC_VISTA.screen === 'estadio' && typeof renderEstadioScreenDe === 'function') return renderEstadioScreenDe(teamId)
  if ((ZC_VISTA.screen === 'entrenamiento' || ZC_VISTA.screen === 'cantera') && typeof renderInstalacionesScreenDe === 'function') return renderInstalacionesScreenDe(teamId, ZC_VISTA.screen)
  return ''
}

function renderInstalacionesScreenDe(teamId, clave) {
  var modelo = getZonaClubDe(teamId)
  var cfg = ZC_INSTALACIONES_CONFIG[clave]
  if (!modelo || !cfg) return ''
  var nivel = modelo[clave] || 1
  var beneficio = clave === 'entrenamiento'
    ? 'Jugadores \u2264 23 a\u00f1os reciben hasta +' + getBonusEntrenamiento(nivel) + ' en su progresi\u00f3n de fin de temporada.'
    : 'Los canteranos del Sub-18 se generan con +' + getBonusCantera(nivel) + ' puntos de media y potencial.'
  var html = ''
  html += zcScreenHeadDe(cfg.nombre, cfg.efecto, teamId)
  html += '<div class="zc-panel">' +
    '<div class="zc-panel-nivel">' +
      '<div class="zc-inst-level">Nivel ' + nivel + '/' + ZC_MAX_LEVEL + '</div>' +
    '</div>' +
    '<div class="zc-panel-fila"><span>Beneficio actual</span><b>' + beneficio + '</b></div>' +
    '<div class="zc-panel-fila"><span>Nivel m\u00e1ximo</span><b>' + ZC_MAX_LEVEL + '</b></div>' +
  '</div>'
  return html
}

function renderEstadioScreenDe(teamId) {
  var modelo = getZonaClubDe(teamId)
  if (!modelo) return ''
  var capDe = getCapacidadEstadioDe(modelo)
  var pMin = modelo.estadio.precioMin
  var pMax = modelo.estadio.precioMax
  var pIni = modelo.estadio.precioEntrada
  var html = ''
  html += zcScreenHeadDe('Estadio', modelo.estadio.nombre, teamId)
  html += '<div class="zc-panel">' +
    '<div class="zc-row zc-row-strong"><span class="zc-row-label">Nombre</span><span class="zc-row-value">' + modelo.estadio.nombre + '</span></div>' +
    '<div class="zc-row"><span class="zc-row-label">Capacidad total</span><span class="zc-row-value">' + capDe.toLocaleString('es-ES') + '</span></div>' +
    '<div class="zc-row"><span class="zc-row-label">Precio de entrada</span><span class="zc-row-value">' + pIni + ' \u20ac (rango ' + pMin + '\u2013' + pMax + ' \u20ac)</span></div>' +
  '</div>'
  html += '<div class="tactics-subsection-label">Zonas del estadio</div>'
  html += '<div class="zc-zones-grid">'
  ZC_ZONAS_BASE.forEach(function(z) {
    var nivel = modelo.estadio.zonas[z.id] || 0
    var capZ = getCapacidadZonaDe(modelo, z.id)
    html += '<div class="zc-zone-tile">' +
      '<div class="zc-zone-name">' + z.nombre + '</div>' +
      '<div class="zc-zone-nivel">Nivel ' + nivel + '</div>' +
      '<div class="zc-zone-seats">' + capZ.toLocaleString('es-ES') + ' asientos</div>' +
    '</div>'
  })
  html += '</div>'
  return html
}

function zcScreenHeadDe(titulo, subtitulo, teamId) {
  return '<div class="zc-screen-head">' +
    '<div class="zc-screen-head-text">' +
      '<div class="zc-screen-title">' + titulo + '</div>' +
      (subtitulo ? '<div class="zc-screen-sub">' + subtitulo + '</div>' : '') +
    '</div>' +
    '<span class="zc-btn zc-btn-ghost" onclick="closeZonaClubViewDe(\'' + teamId + '\')">\u2190 Volver</span>' +
  '</div>'
}