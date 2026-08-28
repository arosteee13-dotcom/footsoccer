/* ============================================================
 * copaAustria.js — Configuracion y ayudantes de la Copa de Austria
 * (ÖFB-Cup).
 *
 * Formato: eliminatoria a partido unico con 64 participantes en la 1ª ronda:
 *   12 Bundesliga (bl1) + 16 2. Bundesliga (bl2) + 36 modesto regionales.
 *   6 rondas: 1/32, 1/16, Octavos, Cuartos, Semifinal, Final.
 *   - Empate a los 90': prorroga (2x15'); si sigue empatado, penaltis.
 *   - Banquillo: maximo 7 suplentes convocados.
 *   - Cambios: maximo 5 en 3 ventanas durante el tiempo regular;
 *     durante la prorroga cada equipo recibe 1 cambio adicional
 *     (+1 sustitucion, total 6) y 1 ventana de sustitucion extra.
 * ============================================================ */
(function () {
  'use strict'

  /* Nombre y logo de la competicion. */
  var CONFIG = {
    id: 'copa_austria',
    countryId: 'austria',
    name: 'Copa de Austria',
    shortName: 'ÖFB-Cup',
    logo: 'https://cdn.resfu.com/media/img/league_logos/copa-austria.png?size=120x&lossy=1',
    trofeo: 'https://cdn.resfu.com/media/img/trophy_pic/cup_nofoto.png?size=120x&lossy=1',
    startTeams: 64,
  }

  /* 6 rondas eliminatorias (64 -> 1 campeon, partido unico).
     Nomenclatura: 1/32 (64), 1/16 (32), Octavos (16), Cuartos (8),
     Semifinal (4), Final (2). Semanas dentro de la temporada austriaca
     (32 jornadas). */
  var SCHEDULE = [
    { week: 3, label: '1/32' },
    { week: 6, label: '1/16' },
    { week: 10, label: 'Octavos' },
    { week: 15, label: 'Cuartos' },
    { week: 21, label: 'Semifinal' },
    { week: 28, label: 'Final' },
  ]

  /* Normas de convocatoria y sustituciones. */
  var SUB_RULES = {
    bench: 7,
    substitution: {
      maxTotal: 5,
      maxWindows: 3,
      extraTime: {
        extraSubs: 1,
        extraWindows: 1,
      },
    },
  }

  /* Devuelve las normas de sustitucion/banquillo para un partido.
   *   { isCup, isExtraTime } ->
   *   { bench, maxSubs, maxWindows }
   * En partidos de copa con prorroga se permite el 6º cambio y la 4ª
   * ventana; en el resto se mantienen 5 cambios en 3 ventanas. */
  function getSubRules(opts) {
    opts = opts || {}
    if (opts.isCup) {
      if (opts.isExtraTime) {
        return {
          bench: SUB_RULES.bench,
          maxSubs: SUB_RULES.substitution.maxTotal + SUB_RULES.substitution.extraTime.extraSubs,
          maxWindows: SUB_RULES.substitution.maxWindows + SUB_RULES.substitution.extraTime.extraWindows,
        }
      }
      return {
        bench: SUB_RULES.bench,
        maxSubs: SUB_RULES.substitution.maxTotal,
        maxWindows: SUB_RULES.substitution.maxWindows,
      }
    }
    return {
      bench: 9,
      maxSubs: SUB_RULES.substitution.maxTotal,
      maxWindows: SUB_RULES.substitution.maxWindows,
    }
  }

  /* Banda de ventana de sustitucion segun el minuto del partido:
   *   0-45   -> 1
   *   45-90  -> 2
   *   90-105 -> 3 (prorroga)
   *   105+   -> 4 (prorroga) */
  function getSubWindow(minute) {
    minute = minute || 0
    if (minute <= 45) return 1
    if (minute <= 90) return 2
    if (minute <= 105) return 3
    return 4
  }

  /* Equipos modesto REGIONALES austriacos (36 clubes) que, junto con la
   * Bundesliga (12) y la 2. Bundesliga (16), completan los 64 participantes
   * de la primera ronda. */
  var REGIONAL_NAMES = [
    'SV Grödig', 'SC Lustenau', 'SV Mattersburg', 'ASK Köflach',
    'USV Allerheiligen', 'SK Austria Klagenfurt Amateure', 'SV Oberwart', 'TSV Hartberg II',
    'SC Wiener Neustadt', 'DSV Leoben', 'SV Spittal/Drau', 'FC Dornbirn 1913',
    'SV Lafnitz', 'SC Rheindorf Altach II', 'SV Horn', 'SC Traiskirchen',
    'FC Blau-Weiß Linz II', 'SK Vorwärts Steyr', 'FC Kitzbühel', 'SV Gols',
    'SCR Altach Amateure', 'SV Seekirchen', 'UFC Fehring', 'SC Bruck/Mur',
    'SV St. Jakob/Rosental', 'ATSV Stadl-Paura', 'SV Wallern', 'SC Schwanenstadt',
    'SV Vöcklamarkt', 'USK Anif', 'SC Weiz', 'SV Allerheiligen II',
    'SK Treibach', 'SV Gloggnitz', 'ASK Voitsberg II', 'SV Leobendorf',
  ]

  /* Inicializa (una sola vez) el mapa global de equipos modesto regionales
   * austriacos para que el resto del juego (nombres, logos, valoraciones)
   * pueda resolver sus ids. */
  function initAustriaModestoMap() {
    if (window._MODESTO_AUSTRIA_MAP) return window._MODESTO_AUSTRIA_MAP
    var map = {}
    var count = Math.min(REGIONAL_NAMES.length, 36)
    for (var i = 0; i < count; i++) {
      var id = 'atr-' + (i + 1)
      map[id] = {
        id: id,
        name: REGIONAL_NAMES[i],
        nombre: REGIONAL_NAMES[i],
        rating: 40 + (i % 9),
        logo: 'https://cdn.resfu.com/media/img/trophy_pic/cup_nofoto.png?size=120x&lossy=1',
      }
    }
    window._MODESTO_AUSTRIA_MAP = map
    return map
  }

  /* Devuelve los ids de los equipos modesto regionales. */
  function getRegionalTeams(count) {
    var map = initAustriaModestoMap()
    var keys = Object.keys(map)
    var n = count == null ? keys.length : Math.min(count, keys.length)
    return keys.slice(0, n)
  }

  window.AustriaCopa = {
    config: CONFIG,
    schedule: SCHEDULE,
    subRules: SUB_RULES,
    getSubRules: getSubRules,
    getSubWindow: getSubWindow,
    initAustriaModestoMap: initAustriaModestoMap,
    getRegionalTeams: getRegionalTeams,
  }

  /* Inicializar el mapa de equipos regionales al cargar el modulo para que
     nombres/logos/valoraciones esten disponibles de inmediato. */
  initAustriaModestoMap()
})()