/* ===================================================================
   MATCH ENGINE — Motor de simulación por MINUTOS (probabilidad 2 niveles)
   Fútbol manager profesional.
   Módulo puro: sin DOM ni estado global. Recibe equipos, un
   effectiveSkillFn (calcularMediaEnPosicion) y los GAME_PLANS.
   =================================================================== */

var MatchEngine = (function () {
  'use strict'

  /* --- Constantes del modelo probabilístico por minuto --- */
  var BASE_EVENT  = 0.10    // ocasiones por minuto (base, con equipos equilibrados)
  var BASE_GOAL   = 0.35    // conversión base de una ocasión
  var ASSIST_PROB = 0.70    // probabilidad de que un gol tenga asistencia
  var YELLOW_PROB = 0.025   // amarilla por equipo y minuto
  var RED_PROB    = 0.0015  // roja por equipo y minuto
  var INJURY_PROB = 0.00035  // lesión por equipo y minuto (≈3% por partido y equipo)
  var PEN_PROB    = 0.00085  // penalti por equipo y minuto (~1 penalti cada 3 partidos)
  var PEN_CONV    = 0.78     // conversión base de un penalti
  var MAX_GOALS   = 12      // tope de seguridad por marcador

  /* --- Clasificación de roles por línea --- */
  var ROL_GK = ['portero']
  var ROL_DEF = ['defensa_central', 'lateral_izq', 'lateral_der', 'carrilero_izq', 'carrilero_der', 'medio_def']
  var ROL_MID = ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_izq', 'medio_der']
  var ROL_ATA = ['extremo_izq', 'extremo_der', 'delantero', 'medio_ofensivo']

  /* Sigla -> posición completa (acepta jugadores con position en formato abreviado) */
  var ABBR2FULL = {
    POR: 'portero', DFC: 'defensa_central', LI: 'lateral_izq', LD: 'lateral_der',
    CAI: 'carrilero_izq', CAD: 'carrilero_der', MCD: 'medio_def', MC: 'mediocentro',
    MCO: 'medio_ofensivo', MI: 'medio_izq', MD: 'medio_der', EI: 'extremo_izq',
    ED: 'extremo_der', DC: 'delantero', DEL: 'delantero',
  }

  /* Estilo de juego del equipo -> multiplicadores { attack, concede }
     De Ofensivo {1.15, 1.10} a Defensivo {0.85, 0.90}. */
  function styleStats(team) {
    var plan = (team && team.gamePlan) || 'pesado'
    if (plan === 'extremo') return { attack: 1.15, concede: 1.10 }  // Ofensivo
    if (plan === 'suave')   return { attack: 0.85, concede: 0.90 }  // Defensivo
    return                       { attack: 1.00, concede: 1.00 }    // Equilibrado (pesado)
  }

  /* Grupo posicional de un jugador: POR / DEF / MED / DEL */
  function groupOf(pos) {
    pos = ABBR2FULL[pos] || pos
    if (pos === 'portero') return 'POR'
    if (ROL_DEF.indexOf(pos) !== -1) return 'DEF'
    if (ROL_MID.indexOf(pos) !== -1) return 'MED'
    return 'DEL'
  }

  /* OVR del jugador (en este juego: skill) */
  function ovrOf(p) {
    if (!p) return 50
    return (p.skill != null ? p.skill : p.ovr) || 50
  }

  function inList(list, role) { return list.indexOf(role) >= 0 }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v }

  function round2(v) { return Math.round(v * 100) / 100 }

  function rand01(lo, hi) { return lo + Math.random() * (hi - lo) }

  function pickWeighted(arr, weightFn) {
    var total = 0
    for (var i = 0; i < arr.length; i++) total += weightFn(arr[i])
    if (total <= 0) return arr[Math.floor(Math.random() * arr.length)]
    var r = Math.random() * total
    for (var j = 0; j < arr.length; j++) {
      r -= weightFn(arr[j])
      if (r <= 0) return arr[j]
    }
    return arr[arr.length - 1]
  }

  /* Selecciona el XI de un equipo CPU (greedy por rol, mejor skill efectivo) */
  function seleccionarXI(players, formation, effFn, rolesMap) {
    if (!players || players.length === 0) return []
    var fRoles = FORMATIONS_FALLBACK(formation, rolesMap)
    var pool = players.filter(function (p) {
      return p && !p.injury && !p._suspended && !(p.onLoan && p.loanTo)
    })
    if (pool.length === 0) return []
    var used = {}
    var xi = []
    for (var i = 0; i < fRoles.length; i++) {
      var role = fRoles[i]
      var best = null, bestScore = -1
      for (var j = 0; j < pool.length; j++) {
        var p = pool[j]
        if (used[p.id]) continue
        var s = effFn(p, role)
        if (s > bestScore) { bestScore = s; best = p }
      }
      if (!best) break
      used[best.id] = true
      xi.push({ player: best, role: role, eff: bestScore })
    }
    return xi
  }

  function FORMATIONS_FALLBACK(formation, rolesMap) {
    var roles = null
    if (rolesMap) roles = rolesMap[formation] || rolesMap['4-3-3']
    if (!roles && typeof window !== 'undefined' && window.SLOT_ROLES) roles = window.SLOT_ROLES[formation] || window.SLOT_ROLES['4-3-3']
    if (!roles) roles = ['portero', 'lateral_izq', 'defensa_central', 'defensa_central', 'lateral_der', 'mediocentro', 'medio_def', 'mediocentro', 'extremo_izq', 'delantero', 'extremo_der']
    return roles
  }

  /* ============ 1. PODER NETO (Net Rating) ============ */
  function calcularPoderNeto(team, opts) {
    opts = opts || {}
    var effFn = opts.effectiveSkillFn || function (p) { return p.skill || 0 }
    var formation = team.formation || opts.formation || '4-3-3'
    var xi = opts.xi || seleccionarXI(team.players, formation, effFn, opts.formationRoles)
    if (xi.length === 0) {
      return { mediaXI: 0, portero: 0, defensa: 0, centro: 0, ataque: 0, xi: [] }
    }

    /* Localía: bono estático +3% a +5% a la media global (y a los duelos) */
    var homeFactor = opts.isHome ? (1.03 + Math.random() * 0.02) : 1
    var effs = []
    var line = { portero: [], defensa: [], centro: [], ataque: [] }
    for (var i = 0; i < xi.length; i++) {
      var item = xi[i]
      var e = effFn(item.player, item.role)
      e = Math.round(e * homeFactor)
      item.eff = e
      effs.push(e)
      if (inList(ROL_GK, item.role)) line.portero.push(e)
      if (inList(ROL_DEF, item.role)) line.defensa.push(e)
      if (inList(ROL_MID, item.role)) line.centro.push(e)
      if (inList(ROL_ATA, item.role)) line.ataque.push(e)
    }

    function mean(a) { if (!a.length) return 0; var s = 0; for (var k = 0; k < a.length; k++) s += a[k]; return s / a.length }
    var mediaXI = mean(effs)
    return {
      mediaXI: Math.round(mediaXI * 10) / 10,
      portero: Math.round(mean(line.portero) * 10) / 10,
      defensa: Math.round(mean(line.defensa) * 10) / 10,
      centro: Math.round(mean(line.centro) * 10) / 10,
      ataque: Math.round(mean(line.ataque) * 10) / 10,
      xi: xi
    }
  }

  /* ============ 2. GOLES: MODELO PROBABILÍSTICO POR MINUTO ============

     Cada uno de los 90 minutos lanza un dado `eventRate` (≈0.10 con equipos
     equilibrados → ~9 ocasiones por partido):
       1er nivel: ¿hay ocasión este minuto?  (probabilístico)
          → ¿de qué equipo?  homeChance (OVR medio del XI × estilo × +5% local)
       2º nivel: ¿la ocasión es gol?  conversion = BASE_GOAL × ataque(atacante) × concede(defensor)
     Si se marca, el goleador se elige con pickScorer (prioriza delanteros, luego
     centrocampistas, ponderado por OVR).  La asistencia sale al 70% (pickAssister).
     Además se resuelven por minuto amarillas, rojas y lesiones.
  ======================================================================= */

  /* grupológico del goleador: DEL > MED > resto (nunca portero) */
  function pickScorer(starters) {
    var del = [], med = [], field = []
    for (var i = 0; i < starters.length; i++) {
      var g = groupOf(starters[i].player.position)
      if (g === 'DEL') del.push(starters[i])
      else if (g === 'MED') med.push(starters[i])
      else if (g !== 'POR') field.push(starters[i])
    }
    var pool = del.length ? del : (med.length ? med : field)
    if (pool.length === 0) return null
    return pickWeighted(pool, function (x) { return ovrOf(x.player) })
  }

  /* asistente: prioriza centrocampistas, luego ataque, ponderado por OVR */
  function pickAssister(starters, scorer) {
    var med = [], del = [], field = []
    for (var i = 0; i < starters.length; i++) {
      var p = starters[i].player
      if (scorer && p.id === scorer.id) continue
      var g = groupOf(p.position)
      if (g === 'MED') med.push(starters[i])
      else if (g === 'DEL') del.push(starters[i])
      else if (g !== 'POR') field.push(starters[i])
    }
    var pool = med.length ? med : (del.length ? del : field)
    if (pool.length === 0) return null
    return pickWeighted(pool, function (x) { return ovrOf(x.player) }).player
  }

  /* Suplente para auto-sustitución por lesión: mejor eff en el mismo rol */
  function pickSub(team, starters, role, effFn) {
    var inIds = {}
    for (var i = 0; i < starters.length; i++) inIds[starters[i].player.id] = true
    var pool = (team.players || []).filter(function (p) {
      return p && !inIds[p.id] && !p.injury && !p._suspended
    })
    if (pool.length === 0) return null
    var best = null, bestScore = -1
    for (var j = 0; j < pool.length; j++) {
      var p = pool[j]
      if (p.position === 'portero' || p.position === 'POR') continue
      var s = effFn(p, role)
      if (s > bestScore) { bestScore = s; best = p }
    }
    return best
  }

  function simularPartidoMotor(home, away, opts) {
    opts = opts || {}
    var effFn = opts.effectiveSkillFn || function (p) { return p.skill || 0 }
    var formationRoles = opts.formationRoles || null

    var emptyRes = { homeScore: 0, awayScore: 0, possessionHome: 50, xgHome: 0, xgAway: 0, events: [], goalsHome: [], goalsAway: [], minutesPlayed: {}, upsetApplied: false }

    var homeNet = calcularPoderNeto(home, { effectiveSkillFn: effFn, formation: home.formation, isHome: false, xi: opts.xiHome, formationRoles: formationRoles })
    var awayNet = calcularPoderNeto(away, { effectiveSkillFn: effFn, formation: away.formation, isHome: false, xi: opts.xiAway, formationRoles: formationRoles })
    if (homeNet.xi.length === 0 || awayNet.xi.length === 0) return emptyRes

    /* --- Probabilidades del partido (1 sola vez) --- */
    var hs = styleStats(home)
    var as = styleStats(away)
    var homeOv = 0, awayOv = 0
    for (var v = 0; v < homeNet.xi.length; v++) homeOv += homeNet.xi[v].eff
    for (var w = 0; w < awayNet.xi.length; w++) awayOv += awayNet.xi[w].eff
    homeOv = homeNet.xi.length ? homeOv / homeNet.xi.length : 0
    awayOv = awayNet.xi.length ? awayOv / awayNet.xi.length : 0

    var homePower = homeOv * hs.attack * 1.05        /* +5% factor campo del local */
    var awayPower = awayOv * as.attack
    var totalPower = homePower + awayPower
    var homeChance = totalPower ? (homePower / totalPower) * 100 : 50
    var eventRate = BASE_EVENT * ((hs.attack + as.attack) / 2)

    /* --- Estado mutable del once --- */
    var homeStarters = homeNet.xi.slice()
    var awayStarters = awayNet.xi.slice()
    var minutesPlayed = {}
    function initMinutes(starters) {
      for (var k = 0; k < starters.length; k++) {
        starters[k]._start = 1
        minutesPlayed[starters[k].player.id] = 0
      }
    }
    initMinutes(homeStarters)
    initMinutes(awayStarters)

    var homeGoals = 0, awayGoals = 0
    var events = [], goalsHome = [], goalsAway = []
    var yc = {}   // amarillas por jugador en este partido (2ª amarilla = expulsión)

    for (var minute = 1; minute <= 90; minute++) {
      /* --- Tarjetas por minuto (por equipo) --- */
      ;[homeStarters, awayStarters].forEach(function (starters, idx) {
        var isHomeSide = idx === 0
        var team = isHomeSide ? home : away
        if (Math.random() < YELLOW_PROB && starters.length) {
          var yp = pickWeighted(starters, function (x) { return ovrOf(x.player) })
          if (yc[yp.player.id]) {
            /* 2ª amarilla → expulsión (juega con 10) */
            delete yc[yp.player.id]
            minutesPlayed[yp.player.id] = Math.max(minutesPlayed[yp.player.id] || 0, (minute - 1) - (yp._start || 1))
            stripStarters(starters, yp.player.id)
            events.push({ minute: minute, side: isHomeSide ? 'home' : 'away', type: 'red', secondYellow: true, player: yp.player })
          } else {
            yc[yp.player.id] = 1
            events.push({ minute: minute, side: isHomeSide ? 'home' : 'away', type: 'yellow', player: yp.player })
          }
        }
        if (Math.random() < RED_PROB && starters.length) {
          var rp = pickWeighted(starters, function (x) { return ovrOf(x.player) })
          delete yc[rp.player.id]
          minutesPlayed[rp.player.id] = Math.max(minutesPlayed[rp.player.id] || 0, (minute - 1) - (rp._start || 1))
          stripStarters(starters, rp.player.id)
          events.push({ minute: minute, side: isHomeSide ? 'home' : 'away', type: 'red', player: rp.player })
        }
        /* --- Lesión por minuto (con auto-sustitución) --- */
        if (Math.random() < INJURY_PROB && starters.length > 1) {
          var field = starters.filter(function (x) { return groupOf(x.player.position) !== 'POR' })
          if (field.length) {
            var inj = field[Math.floor(Math.random() * field.length)]
            minutesPlayed[inj.player.id] = Math.max(minutesPlayed[inj.player.id] || 0, (minute - 1) - (inj._start || 1))
            events.push({ minute: minute, side: isHomeSide ? 'home' : 'away', type: 'injury', player: inj.player })
            var sub = pickSub(team, starters, inj.role, effFn)
            if (sub) {
              var idx = starters.indexOf(inj)
              delete yc[inj.player.id]
              starters[idx] = { player: sub, role: inj.role, eff: effFn(sub, inj.role), _start: minute }
            } else {
              stripStarters(starters, inj.player.id)
            }
          }
        }
      })

      /* --- Penalti por minuto (1 tirada, lado decidido por homeChance) --- */
      if (Math.random() < PEN_PROB) {
        var penIsHome = Math.random() * 100 < homeChance
        var penStarters = penIsHome ? homeStarters : awayStarters
        var penTaker = pickScorer(penStarters)
        if (penTaker) {
          var penSkill = ovrOf(penTaker.player)
          var convPen = Math.max(0.55, Math.min(0.92, PEN_CONV + (penSkill - 70) * 0.004))
          var penScored = Math.random() < convPen
          var penGk = (penIsHome ? awayStarters : homeStarters).filter(function (x) { return groupOf(x.player.position) === 'POR' })[0]
          events.push({ minute: minute, side: penIsHome ? 'home' : 'away', type: 'pen', player: penTaker.player, scored: penScored, gk: penGk ? penGk.player : null, xg: round2(convPen) })
          if (penScored) {
            var penGoal = { minute: minute, side: penIsHome ? 'home' : 'away', scorer: penTaker.player, assist: null, xg: round2(convPen), pen: true }
            events.push(penGoal)
            if (penIsHome) { homeGoals++; goalsHome.push(penGoal) }
            else { awayGoals++; goalsAway.push(penGoal) }
          }
        }
      }

      /* --- 1er nivel: ¿hay ocasión este minuto? --- */
      if (Math.random() < eventRate) {
        var isHome = Math.random() * 100 < homeChance
        var attackStarters = isHome ? homeStarters : awayStarters
        var attackStyle = isHome ? hs : as
        var defendStyle = isHome ? as : hs
        var scorerItem = pickScorer(attackStarters)
        if (scorerItem) {
          /* --- 2º nivel: ¿la ocasión es gol? --- */
          var conversion = BASE_GOAL * attackStyle.attack * defendStyle.concede
          if (Math.random() < conversion) {
            var scorer = scorerItem.player
            var assist = null
            if (Math.random() < ASSIST_PROB) assist = pickAssister(attackStarters, scorer)
            var goal = { minute: minute, side: isHome ? 'home' : 'away', scorer: scorer, assist: assist, xg: round2(conversion) }
            events.push(goal)
            if (isHome) { homeGoals++; goalsHome.push(goal) }
            else { awayGoals++; goalsAway.push(goal) }
          } else {
            /* ocasión fallada → tiro fallado (+0.15 valoración al lanzador) */
            events.push({ minute: minute, side: isHome ? 'home' : 'away', type: 'miss', player: scorerItem.player })
          }
        }
      }
    }

    homeStarters.forEach(function (x) { minutesPlayed[x.player.id] = 90 - (x._start || 1) })
    awayStarters.forEach(function (x) { minutesPlayed[x.player.id] = 90 - (x._start || 1) })
    homeGoals = Math.min(MAX_GOALS, homeGoals)
    awayGoals = Math.min(MAX_GOALS, awayGoals)

    var xgHome = 0, xgAway = 0
    for (var gh = 0; gh < goalsHome.length; gh++) xgHome += goalsHome[gh].xg
    for (var ga = 0; ga < goalsAway.length; ga++) xgAway += goalsAway[ga].xg

    return {
      homeScore: homeGoals,
      awayScore: awayGoals,
      possessionHome: Math.round(homeChance),
      xgHome: round2(xgHome),
      xgAway: round2(xgAway),
      events: events,
      goalsHome: goalsHome,
      goalsAway: goalsAway,
      minutesPlayed: minutesPlayed,
      upsetApplied: false
    }
  }

  /* Elimina a un jugador del once (roja) o tras lesión sin suplente */
  function stripStarters(starters, playerId) {
    for (var i = 0; i < starters.length; i++) {
      if (starters[i].player.id === playerId) { starters.splice(i, 1); return }
    }
  }

  /* ====== VALORACIÓN EN VIVO (1.0 - 10.0) ======
     Un paso por minuto. opts: { skill, sideDiff(>0=gana), eventDelta }.
     Combina fluctuación base por GRL, ruido dinámico (5.8-7.2),
     inercia por marcador (goleada incl.) y el bonus/penalización del minuto. */
  function siguienteValoracion(current, opts) {
    opts = opts || {}
    var skill = opts.skill == null ? 70 : opts.skill
    var sDiff = opts.sideDiff || 0
    var eventDelta = opts.eventDelta || 0
    if (current == null || isNaN(current)) current = 6.0
    /* Factor GRL: piso más alto para los mejores */
    var target = clamp(5.7 + (skill - 55) * 0.04, 5.9, 7.4)
    /* Fluctuación dinámica base: reversión a la media + ruido */
    var drift = (target - current) * 0.14 + (Math.random() - 0.5) * 0.26
    /* Inercia por marcador */
    var inertia = 0
    if (sDiff >= 1) inertia = 0.30 + Math.min(0.50, (sDiff - 1) * 0.15)
    else if (sDiff <= -1) inertia = -(0.30 + Math.min(0.50, (Math.abs(sDiff) - 1) * 0.15))
    if (Math.abs(sDiff) > 2) inertia *= 1.3
    var base = current + drift + inertia * 0.10
    /* Sin eventos clave, mantiene la nota en un rango realista */
    if (eventDelta === 0) base = clamp(base, 5.8, 7.2)
    return clamp(base + eventDelta, 1, 10)
  }

  return {
    seleccionarXI: seleccionarXI,
    calcularPoderNeto: calcularPoderNeto,
    simularPartidoMotor: simularPartidoMotor,
    styleStats: styleStats,
    pickScorer: pickScorer,
    siguienteValoracion: siguienteValoracion,
    CONSTANTS: { BASE_EVENT: BASE_EVENT, BASE_GOAL: BASE_GOAL, ASSIST_PROB: ASSIST_PROB, YELLOW_PROB: YELLOW_PROB, RED_PROB: RED_PROB, INJURY_PROB: INJURY_PROB, PEN_PROB: PEN_PROB, PEN_CONV: PEN_CONV }
  }
})()

if (typeof window !== 'undefined') window.MatchEngine = MatchEngine
if (typeof module !== 'undefined' && module.exports) module.exports = MatchEngine