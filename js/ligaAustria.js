/* ============================================================
 * ligaAustria.js — Modulo de configuracion y ayudantes de la
 * Bundesliga de Austria (liga 3 fases + playoff europeo).
 *
 * Fase 1: Temporada Regular  J1-J22  (12 equipos, ida+vuelta)
 * Halving: al acabar J22 los puntos se dividen entre 2 (abajo),
 *          el equipo con puntos impares marca redondeadoAbajo.
 * Fase 2: Grupos J23-J32        (Meistergruppe 1-6 / Qualifikationsgruppe 7-12)
 * Playoff Europeo (Conference): al acabar J32
 *     SF  = 7º vs 8º global (1º vs 2º de la Qualifikationsgruppe)
 *     Final = 5º de la Meistergruppe vs ganador de la SF
 *     El ganador obtiene plaza de Fase Previa de la Conference League.
 * ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    id: 'bl1',
    countryId: 'austria',
    name: 'Bundesliga de Austria',
    shortName: 'Admiral Bundesliga',
    totalTeams: 12,

    regularSeason: {
      matchdays: 22,
    },

    halving: {
      enabled: true,
      atMatchday: 22,
      divisor: 2,
      redondear: 'abajo',
    },

    secondPhase: {
      startsAtMatchday: 23,
      totalMatchdays: 32,
      groupSize: 6,
      championship: {
        name: 'Meistergruppe',
        matchdays: 10,
      },
      relegation: {
        name: 'Qualifikationsgruppe',
        matchdays: 10,
      },
    },

    playoffEuropeo: {
      name: 'Playoff Europeo (Conference League)',
      startsAfterMatchday: 32,
      semis: {
        name: 'Semifinal',
        /* 7º global (1º Qualifikationsgruppe) vs 8º global (2º Qualifikationsgruppe) */
        match: '7vs8',
      },
      final: {
        name: 'Final',
        /* 5º de la Meistergruppe (5º global) vs ganador de la semifinal */
        match: '5vsSF',
      },
      prize: 'Fase Previa de la Conference League',
    },
  };

  /* Convierte el numero de jornada en la fase actual.
   *   regular      : 1-22
   *   grupos       : 23-32
   *   playoffEuropeo: >32 (tras acabar la temporada)
   */
  function getAustriaPhase(matchday) {
    if (!matchday) matchday = 0
    if (matchday <= 0) return 'regular'
    if (matchday < CONFIG.secondPhase.startsAtMatchday) return 'regular'
    if (matchday <= CONFIG.secondPhase.totalMatchdays) return 'grupos'
    return 'playoffEuropeo'
  }

  /* Dada la clasificacion completa (ya ordenada y con el halving aplicado)
   * devuelve los ids de los equipos de la Meistergruppe (puestos 1-6). */
  function getCampeonatoTeams(standings) {
    return (standings || []).slice(0, 6).map(function (s) { return s.teamId })
  }

  /* Devuelve los ids de los equipos de la Qualifikationsgruppe (puestos 7-12). */
  function getDescensoTeams(standings) {
    return (standings || []).slice(6, 12).map(function (s) { return s.teamId })
  }

  /* Genera las 10 jornadas (23-32) de un grupo de 6 equipos jugando
   * ida y vuelta entre si. Reutiliza la logica de round-robin: parametro
   * matchdayBase = 22 (J23 = 22+1 ... J32 = 22+10). */
  function buildGrupoFixtures(teamIds, matchdayBase) {
    matchdayBase = matchdayBase || 22
    var n = teamIds.length
    if (n !== 6) return []
    var rounds = n - 1 /* 5 idas */
    var fixtures = []
    var ids = teamIds.slice()
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < n / 2; i++) {
        var home = (r % 2 === 0) ? ids[i] : ids[n - 1 - i]
        var away = (r % 2 === 0) ? ids[n - 1 - i] : ids[i]
        fixtures.push({ matchday: matchdayBase + r + 1, home: home, away: away, homeScore: null, awayScore: null, played: false, grupo: true })
      }
      ids.splice(1, 0, ids.pop())
    }
    var half = rounds
    for (var r2 = 0; r2 < half; r2++) {
      for (var i2 = 0; i2 < n / 2; i2++) {
        var f = fixtures[r2 * (n / 2) + i2]
        fixtures.push({ matchday: matchdayBase + r2 + 1 + half, home: f.away, away: f.home, homeScore: null, awayScore: null, played: false, grupo: true })
      }
    }
    return fixtures
  }

  /* Construye los fixtures de la Fase 2 (J23-J32) para los DOS grupos.
   * `championship` y `relegation` son arrays de teamIds.
   * Devuelve un unico array combinado (ambos grupos). */
  function buildSecondPhaseFixtures(championship, relegation) {
    return buildGrupoFixtures(championship, 22).concat(buildGrupoFixtures(relegation, 22))
  }

  /* Construye el arbol del Playoff Europeo de la Conference.
   * `g7` id del puesto 7 global, `g8` puesto 8 global, `g5` puesto 5 global.
   * Devuelve un objeto state.playoffs con esConferenceAustria=true.
   */
  function buildConferencePlayoff(g5, g7, g8) {
    return {
      round: 'SF',
      esConferenceAustria: true,
      fixtures: [
        { round: 'SF', home: g7, away: g8, homeScore: null, awayScore: null, played: false },
      ],
      fifth: g5,
      winner: null,
    }
  }

  window.AustriaLiga = {
    config: CONFIG,
    getAustriaPhase: getAustriaPhase,
    getCampeonatoTeams: getCampeonatoTeams,
    getDescensoTeams: getDescensoTeams,
    buildGrupoFixtures: buildGrupoFixtures,
    buildSecondPhaseFixtures: buildSecondPhaseFixtures,
    buildConferencePlayoff: buildConferencePlayoff,
  }
})()
