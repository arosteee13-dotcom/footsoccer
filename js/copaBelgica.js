/* ============================================================
 * copaBelgica.js — Configuracion y ayudantes de la Copa de Bélgica
 * (Croky Cup).
 *
 * Formato: cuadro eliminatorio flexible. El numero de rondas se
 * adapta al total de clubes presentes en el pais en los datos
 * (hoy solo la Jupiler Pro League, l1b). El limite maximo del
 * cuadro belga es 1/1024: si en el futuro hay mas ligas/clubes,
 * el cuadro se ensancha automaticamente hasta ese tope; las
 * casillas vacias (rounds sin equipos suficientes) no se juegan
 * (byes automaticos directos a la siguiente ronda).
 *
 *   - Empate a los 90': prorroga (2x15'); si sigue empatado, penaltis.
 *   - Convocatoria: 21 jugadores (11 titulares + 10 suplentes).
 *   - Cambios: maximo 5 en 3 ventanas en tiempo regular; en prorroga
 *     (desde 1/16 de final) cada equipo recibe 1 cambio adicional
 *     (total 6) y 1 ventana de sustitucion extra.
 * ============================================================ */
(function () {
  'use strict'

  /* Nombre y logo de la competicion. */
  var CONFIG = {
    id: 'copa_belgica',
    countryId: 'belgium',
    name: 'Copa de Bélgica',
    shortName: 'Croky Cup',
    logo: 'https://cdn.resfu.com/media/img/league_logos/copa-belgica.png?size=120x&lossy=1',
    trofeo: 'https://cdn.resfu.com/img_data/competiciones/copa/651.png?size=120x&lossy=1',
    maxRoundDenominator: 1024,
  }

  /* Semanas fijas para las rondas "limite" del cuadro (tope 1/1024).
     Se reutilizan secuencialmente hacia atras segun cuantas rondas
     hagan falta. */
  var WEEK_MAP = [
    { den: 1024, week: 2 },
    { den: 512, week: 3 },
    { den: 256, week: 4 },
    { den: 128, week: 5 },
    { den: 64, week: 6 },
    { den: 32, week: 7 },
    { den: 16, week: 10 },
    { den: 8, week: 15 },
    { den: 4, week: 20 },
    { den: 2, week: 25 },
    { den: 1, week: 35 },
  ]

  function roundLabel(den) {
    if (den === 8) return 'Octavos'
    if (den === 4) return 'Cuartos'
    if (den === 2) return 'Semifinal'
    if (den === 1) return 'Final'
    return '1/' + den
  }

  /* Calcula el esquema del cuadro segun el numero de clubes presentes.
   *   nTeams = total de equipos inscritos (todas las ligas belgas).
   *   Devuelve [ { week, label, teams }, ... ] empezando en la ronda
   *   minima necesaria para albergar a todos (potencia de 2 >= nTeams),
   *   con tope 1/1024. */
  function getCupBlueprint(nTeams) {
    if (!nTeams || nTeams < 2) nTeams = 18
    var firstDen = 1
    while (firstDen < nTeams) firstDen = firstDen * 2
    firstDen = Math.min(firstDen, CONFIG.maxRoundDenominator)
    var sched = []
    var den = firstDen
    while (den >= 1) {
      var w = WEEK_MAP.find(function(x) { return x.den === den })
      sched.push({ week: w ? w.week : 35, label: roundLabel(den), teams: den })
      if (den === 1) break
      den = den / 2
    }
    return sched
  }

  /* Cuenta los equipos belgas inscritos en los datos (todas las ligas). */
  function getBelgiumTeamCount() {
    if (typeof getLeagueTeams === 'function') {
      var l1b = getLeagueTeams('l1b') || []
      return l1b.length
    }
    return 18
  }

  /* Devuelve el schedule dinamico de la Croky Cup basado en el
     numero real de clubes presentes. */
  function getSchedule() {
    return getCupBlueprint(getBelgiumTeamCount())
  }

  /* La prorroga (y por tanto el 6º cambio + 4ª ventana) solo se aplica
     a partir de los 1/16 de final. Recibe el indice de ronda actual y
     devuelve true si esa ronda admite prorroga (teams <= 16). */
  function hasExtraTime(roundIdx) {
    var sched = getSchedule()
    var entry = sched[roundIdx]
    if (!entry) return false
    return entry.teams <= 16
  }

  /* Normas de convocatoria y sustituciones.
   *   { isCup, isExtraTime } ->
   *   { bench, maxSubs, maxWindows }
   * En copa con prorroga (desde 1/16) se permite el 6º cambio y la 4ª
   * ventana; en el resto se mantienen 5 cambios en 3 ventanas. */
  function getSubRules(opts) {
    opts = opts || {}
    if (opts.isCup) {
      if (opts.isExtraTime) {
        return { bench: 10, maxSubs: 6, maxWindows: 4 }
      }
      return { bench: 10, maxSubs: 5, maxWindows: 3 }
    }
    return { bench: 10, maxSubs: 5, maxWindows: 3 }
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

  /* Sanciones independientes de la Copa (solo Croky Cup).
   * El sistema de tarjetas de la Copa es limpio e independiente de la
   * Liga: acumular 2 amarillas en eliminatorias distintas suspende al
   * jugador para el siguiente partido de Copa. Las rojas directas se
   * procesan aparte (procesarSuspensiones) y pueden afectar a la Liga.
   *
   * Se llama al terminar un partido de Copa belga:
   *   1) "Sirve" la sancion pendiente (la exclusion ya ocurrio al armar
   *      el once en el partido anterior) y limpia el contador.
   *   2) Registra las amarillas recibidas en este partido; al llegar a
   *      2 amarrillas acumuladas marca _cupSuspended para la siguiente
   *      eliminatoria. */
  function processCupYellowCards(players) {
    ;(players || []).forEach(function(p) { p._cupSuspended = false })
    ;(players || []).forEach(function(p) {
      if (!p || !p._yellowThisMatch) return
      p._cupYellowCards = (p._cupYellowCards || 0) + 1
      if (p._cupYellowCards >= 2) {
        p._cupSuspended = true
        p._cupYellowCards = 0
      }
    })
  }

  /* Indica si un jugador esta suspendido por acumulacion de amarillas
   * de la Copa (actua solo como filtro en los partidos de Copa). */
  function isCupSuspended(p) {
    return !!(p && p._cupSuspended)
  }

  window.BelgiumCopa = {
    config: CONFIG,
    getCupBlueprint: getCupBlueprint,
    getBelgiumTeamCount: getBelgiumTeamCount,
    getSchedule: getSchedule,
    hasExtraTime: hasExtraTime,
    getSubRules: getSubRules,
    getSubWindow: getSubWindow,
    processCupYellowCards: processCupYellowCards,
    isCupSuspended: isCupSuspended,
  }
})()