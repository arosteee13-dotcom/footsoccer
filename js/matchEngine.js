/* ===================================================================
   MATCH ENGINE — Motor de simulación basado en posesiones y duelos
   Fútbol manager profesional.
   Módulo puro: sin DOM ni estado global. Recibe equipos, un
   effectiveSkillFn (calcularMediaEnPosicion) y los GAME_PLANS.
   =================================================================== */

var MatchEngine = (function () {
  'use strict'

  /* --- Clasificación de roles por línea --- */
  var ROL_GK = ['portero']
  var ROL_DEF = ['defensa_central', 'lateral_izq', 'lateral_der', 'carrilero_izq', 'carrilero_der', 'medio_def']
  var ROL_MID = ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_izq', 'medio_der']
  var ROL_ATA = ['extremo_izq', 'extremo_der', 'delantero', 'medio_ofensivo']

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

  /* ============ 2-4. MOTOR DE POSESIONES ============ */
  var POSSESSIONS = 14

  function simularPartidoMotor(home, away, opts) {
    opts = opts || {}
    var effFn = opts.effectiveSkillFn || function (p) { return p.skill || 0 }
    var scoreFn = opts.scoringWeightFn || function (pos, skill) { return pos === 'delantero' || pos === 'extremo_der' || pos === 'extremo_izq' ? 10 : 5 }
    var plans = opts.gamePlans || { pesado: { attack: 1.3, defense: 1.3, events: 1.15 }, extremo: { attack: 1.5, defense: 0.8, events: 1.30 }, suave: { attack: 0.8, defense: 1.1, events: 0.80 } }

    var homePlan = home.gamePlan || 'pesado'
    var awayPlan = away.gamePlan || 'pesado'

    var homeNet = calcularPoderNeto(home, { effectiveSkillFn: effFn, formation: home.formation, isHome: true, xi: opts.xiHome, formationRoles: opts.formationRoles })
    var awayNet = calcularPoderNeto(away, { effectiveSkillFn: effFn, formation: away.formation, isHome: false, xi: opts.xiAway, formationRoles: opts.formationRoles })

    if (homeNet.xi.length === 0 || awayNet.xi.length === 0) {
      return { homeScore: 0, awayScore: 0, possessionHome: 50, xgHome: 0, xgAway: 0, events: [], goalsHome: [], goalsAway: [], upsetApplied: false }
    }

    /* Gap de calidad (positivo = mejor local) */
    var gap = homeNet.mediaXI - awayNet.mediaXI

    /* Dominio del centro del campo → probabilidad de posesión local */
    var m = (homeNet.centro - awayNet.centro) + 0.5 * gap + 0.5
    var bias = 0
    if (awayPlan === 'suave') bias += 1.5   /* el autobús cede la pelota */
    if (homePlan === 'suave') bias -= 1.5
    if (awayPlan === 'extremo') bias -= 0.8  /* la presión alta roba y ataca */
    if (homePlan === 'extremo') bias += 0.8
    var pHome = 1 / (1 + Math.exp(-(m + bias) / 12))
    pHome = clamp(pHome, 0.15, 0.78)
    /* Autobús: renuncia a la posesión (25-35%) */
    if (awayPlan === 'suave') pHome = clamp(pHome, 0.65, 0.75)
    if (homePlan === 'suave') pHome = clamp(pHome, 0.25, 0.35)

    var homeScore = 0, awayScore = 0
    var goalsHome = [], goalsAway = [], events = []
    var possessionCount = 0

    function pickAttacker(net, side) {
      var pool = net.xi.filter(function (x) { return inList(ROL_ATA, x.role) })
      if (pool.length === 0) pool = net.xi.filter(function (x) { return x.role !== 'portero' })
      if (pool.length === 0) return null
      return pickWeighted(pool, function (x) { return (x.eff || 1) + 1 })
    }

    function pickDefender(net, side) {
      var pool = net.xi.filter(function (x) { return inList(ROL_DEF, x.role) })
      if (pool.length === 0) pool = net.xi.filter(function (x) { return x.role !== 'portero' })
      if (pool.length === 0) return null
      return pickWeighted(pool, function (x) { return (x.eff || 1) + 1 })
    }

    function pickAssist(net, scorerId) {
      var pool = net.xi.filter(function (x) { return x.player.id !== scorerId && x.role !== 'portero' })
      if (pool.length === 0) return null
      return pickWeighted(pool, function (x) { return (x.eff || 1) + 1 }).player
    }

    for (var i = 1; i <= POSSESSIONS; i++) {
      var minute = Math.min(90, Math.round(i * 90 / POSSESSIONS))
      var attackerHome = Math.random() < pHome
      var attackNet = attackerHome ? homeNet : awayNet
      var defendNet = attackerHome ? awayNet : homeNet
      var attackPlan = attackerHome ? homePlan : awayPlan
      var defendPlan = attackerHome ? awayPlan : homePlan

      if (attackerHome) possessionCount++

      var myScore = attackerHome ? homeScore : awayScore
      var theirScore = attackerHome ? awayScore : homeScore
      var lead = myScore - theirScore

      /* Freno dinámico: gestión de ventaja en el tramo final */
      var attackMult = 1
      if (lead >= 2 && i >= 9) attackMult *= 0.80
      if (lead >= 3 && i >= 8) attackMult *= 0.85
      if (lead >= 4) attackMult *= 0.75
      if (myScore >= 5) attackMult *= 0.3

      var attacker = pickAttacker(attackNet, attackerHome ? 'home' : 'away')
      var defender = pickDefender(defendNet, attackerHome ? 'away' : 'home')
      if (!attacker || !defender) continue

      var gkSlot = defendNet.xi.filter(function (x) { return inList(ROL_GK, x.role) })[0] || null

      var gp = plans[attackPlan] || { attack: 1, defense: 1, events: 1 }
      var gpd = plans[defendPlan] || { attack: 1, defense: 1, events: 1 }

      var atk = attacker.eff * gp.attack * attackMult * rand01(0.9, 1.1)
      var def = defender.eff * gpd.defense * rand01(0.9, 1.1)

      /* Autobús: el equipo en 'suave' bloquea las ocasiones claras */
      if (defendPlan === 'suave') def *= 1.15

      /* Choque táctico: el modesto en presión extrema roba alto (gol sorpresa) */
      var surprise = 0
      var modestAttacks = attackNet.mediaXI < defendNet.mediaXI
      var gapAbs = Math.abs(gap)
      if (attackPlan === 'extremo' && modestAttacks && gapAbs > 8) surprise = 0.02

      var ratio = atk / def
      var chance = clamp(0.24 + (ratio - 1) * 0.22, 0.05, 0.42) * (gp.events || 1)
      chance += surprise

      /* El superior contra un 'extremo' débil (gap abismal) tiene vía libre al contragolpe */
      var strongAttacksWeak = !modestAttacks && gapAbs > 8
      if (defendPlan === 'extremo' && strongAttacksWeak) chance = Math.min(0.58, chance * 1.8)

      /* El gap de calidad domina las ocasiones por defecto */
      if (modestAttacks && gapAbs >= 9) chance = Math.max(0.04, chance - Math.min(0.05, gapAbs * 0.002))
      if (strongAttacksWeak && gapAbs >= 9) chance = Math.min(0.48, chance + Math.min(0.05, gapAbs * 0.003))

      /* El autobús anula las ocasiones claras del rival */
      if (defendPlan === 'suave') chance *= 0.6

      chance = clamp(chance, 0.02, 0.48)

      if (Math.random() >= chance) {
        events.push({ minute: minute, side: attackerHome ? 'home' : 'away', type: 'block' })
        continue
      }

      /* Resolución del tiro: delantero vs portero */
      var shot = attacker.eff * attackMult * rand01(0.9, 1.1)
      var gkStat = gkSlot ? gkSlot.eff * rand01(0.9, 1.1) : 45
      var conv = 1 / (1 + Math.exp(-(shot - gkStat) / 10))
      conv = clamp(conv, 0.12, 0.60)

      if (Math.random() < conv) {
        var scorer = attacker.player
        var assist = null
        if (Math.random() < 0.4) assist = pickAssist(attackNet, scorer.id)
        events.push({ minute: minute, side: attackerHome ? 'home' : 'away', type: 'goal', scorer: scorer, assist: assist, xg: round2(chance) })
        if (attackerHome) {
          homeScore++
          goalsHome.push({ minute: minute, scorer: scorer, assist: assist, xg: round2(chance) })
        } else {
          awayScore++
          goalsAway.push({ minute: minute, scorer: scorer, assist: assist, xg: round2(chance) })
        }
      } else {
        events.push({ minute: minute, side: attackerHome ? 'home' : 'away', type: 'save' })
      }
    }

    /* Factor sorpresa (5-10%): el modesto gana/empata gracias a un evento afortunado */
    var upsetApplied = false
    if (Math.abs(gap) >= 9) {
      var modestLosingOrTied = gap >= 9 ? (awayScore <= homeScore) : (homeScore <= awayScore)
      if (modestLosingOrTied && Math.random() < 0.07) {
        if (gap >= 9) awayScore++; else homeScore++
        upsetApplied = true
      }
    }

    homeScore = Math.min(10, homeScore)
    awayScore = Math.min(10, awayScore)

    var xgHome = 0, xgAway = 0
    for (var gh = 0; gh < goalsHome.length; gh++) xgHome += goalsHome[gh].xg
    for (var ga = 0; ga < goalsAway.length; ga++) xgAway += goalsAway[ga].xg

    return {
      homeScore: homeScore,
      awayScore: awayScore,
      possessionHome: Math.round(possessionCount / POSSESSIONS * 100),
      xgHome: round2(xgHome),
      xgAway: round2(xgAway),
      events: events,
      goalsHome: goalsHome,
      goalsAway: goalsAway,
      upsetApplied: upsetApplied
    }
  }

  return {
    seleccionarXI: seleccionarXI,
    calcularPoderNeto: calcularPoderNeto,
    simularPartidoMotor: simularPartidoMotor,
    POSSESSIONS: POSSESSIONS
  }
})()

if (typeof window !== 'undefined') window.MatchEngine = MatchEngine
if (typeof module !== 'undefined' && module.exports) module.exports = MatchEngine
