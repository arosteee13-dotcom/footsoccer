/* ===================================================================
   FOOTSOCCER — v2
   =================================================================== */

/* ============ DATA ============ */
const POSITIONS = {
  portero:         { label: 'POR', color: '#9B59B6' },
  lateral_der:     { label: 'LD',  color: '#E74C3C' },
  lateral_izq:     { label: 'LI',  color: '#E74C3C' },
  carrilero_der:   { label: 'CAD', color: '#E74C3C' },
  carrilero_izq:   { label: 'CAI', color: '#E74C3C' },
  defensa_central: { label: 'DFC', color: '#E74C3C' },
  medio_def:       { label: 'MCD', color: '#F39C12' },
  mediocentro:     { label: 'MC',  color: '#F39C12' },
  medio_ofensivo:  { label: 'MCO', color: '#F39C12' },
  medio_der:       { label: 'MD',  color: '#F39C12' },
  medio_izq:       { label: 'MI',  color: '#F39C12' },
  extremo_der:     { label: 'ED',  color: '#2ECC71' },
  extremo_izq:     { label: 'EI',  color: '#2ECC71' },
  delantero:       { label: 'DC',  color: '#2ECC71' },
}

const POS_ORDER = ['portero', 'cierre', 'ala', 'pivot', 'defensa_central', 'lateral_izq', 'lateral_der', 'carrilero_izq', 'carrilero_der', 'medio_def', 'mediocentro', 'medio_ofensivo', 'medio_izq', 'medio_der', 'extremo_izq', 'extremo_der', 'delantero']

const FORMATIONS = {
  '4-3-3': { label: '4-3-3', roles: ['portero', 'lateral_izq', 'defensa_central', 'defensa_central', 'lateral_der', 'mediocentro', 'medio_def', 'mediocentro', 'extremo_izq', 'delantero', 'extremo_der'], multiplier: 1.0 },
  '4-4-2': { label: '4-4-2', roles: ['portero', 'lateral_izq', 'defensa_central', 'defensa_central', 'lateral_der', 'medio_izq', 'mediocentro', 'mediocentro', 'medio_der', 'delantero', 'delantero'], multiplier: 0.95 },
  '4-2-3-1': { label: '4-2-3-1', roles: ['portero', 'lateral_izq', 'defensa_central', 'defensa_central', 'lateral_der', 'medio_def', 'medio_def', 'extremo_izq', 'medio_ofensivo', 'extremo_der', 'delantero'], multiplier: 1.05 },
  '3-5-2': { label: '3-5-2', roles: ['portero', 'defensa_central', 'defensa_central', 'defensa_central', 'carrilero_izq', 'mediocentro', 'medio_ofensivo', 'mediocentro', 'carrilero_der', 'delantero', 'delantero'], multiplier: 0.9 },
  '4-1-4-1': { label: '4-1-4-1', roles: ['portero', 'lateral_izq', 'defensa_central', 'defensa_central', 'lateral_der', 'medio_izq', 'mediocentro', 'medio_def', 'mediocentro', 'medio_der', 'delantero'], multiplier: 0.95 },
  '3-4-3': { label: '3-4-3', roles: ['portero', 'defensa_central', 'defensa_central', 'defensa_central', 'carrilero_izq', 'medio_def', 'medio_def', 'carrilero_der', 'extremo_izq', 'delantero', 'extremo_der'], multiplier: 0.95 },
  '3-4-2-1': { label: '3-4-2-1', roles: ['portero', 'defensa_central', 'defensa_central', 'defensa_central', 'carrilero_izq', 'medio_def', 'medio_def', 'carrilero_der', 'medio_ofensivo', 'medio_ofensivo', 'delantero'], multiplier: 1.0 },
}

const POS_ABBR = { portero: 'POR', cierre: 'DFC', ala: 'MC', pivot: 'DC', lateral_der: 'LD', lateral_izq: 'LI', carrilero_der: 'CAD', carrilero_izq: 'CAI', defensa_central: 'DFC', medio_def: 'MCD', mediocentro: 'MC', medio_ofensivo: 'MCO', medio_der: 'MD', medio_izq: 'MI', extremo_der: 'ED', extremo_izq: 'EI', delantero: 'DC' }

const SIGLA_TO_POS = Object.fromEntries(Object.entries(POS_ABBR).map(([k, v]) => [v, k]))

function getGoalWeight(position) {
  var fwds = ['delantero', 'extremo_der', 'extremo_izq']
  var mids = ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_der', 'medio_izq']
  if (fwds.includes(position)) return 10
  if (mids.includes(position)) return 5
  return 2
}

function getCardProb(position, gamePlan) {
  var defs = ['defensa_central', 'lateral_der', 'lateral_izq', 'carrilero_der', 'carrilero_izq']
  var mids = ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_der', 'medio_izq']
  var yellowBase = 0.10, redBase = 0.01
  if (defs.indexOf(position) >= 0) { yellowBase = 0.12; redBase = 0.015 }
  else if (mids.indexOf(position) >= 0) { yellowBase = 0.10; redBase = 0.01 }
  else { yellowBase = 0.08; redBase = 0.005 }
  if (gamePlan === 'pesado') { yellowBase += 0.03; redBase += 0.005 }
  else if (gamePlan === 'suave') { yellowBase -= 0.02; redBase -= 0.003 }
  return { yellow: Math.max(0.01, yellowBase), red: Math.max(0.003, redBase) }
}

function asignarTarjetasJugador(p, gamePlan) {
  var probs = getCardProb(p.position, gamePlan)
  var yaAmarilla = p._yellowThisMatch

  if (Math.random() < probs.yellow) {
    if (yaAmarilla) {
      p._redThisMatch = true
      p._redType = 'doubleYellow'
      p.redCards = (p.redCards || 0) + 1
    } else {
      p.yellowCards = (p.yellowCards || 0) + 1
      p._yellowThisMatch = true
    }
  }

  if (Math.random() < probs.red) {
    if (yaAmarilla || p._yellowThisMatch) {
      if (!p._redType) {
        p._redType = 'doubleYellow'
        p.redCards = (p.redCards || 0) + 1
        p._redThisMatch = true
      }
    } else {
      p._redType = Math.random() < 0.3 ? 'directGrave' : 'directLight'
      p.redCards = (p.redCards || 0) + 1
      p._redThisMatch = true
    }
  }
}

function pickWeightedRandom(arr, weightFn) {
  var total = 0
  for (var i = 0; i < arr.length; i++) total += weightFn(arr[i])
  var r = Math.random() * total
  for (var i = 0; i < arr.length; i++) {
    r -= weightFn(arr[i])
    if (r <= 0) return arr[i]
  }
  return arr[arr.length - 1]
}

function getPowerBadgeStyle(skill) {
  if (skill >= 90) return 'background:#fff;color:#B28100;border:2px solid #B28100'
  if (skill >= 75) return 'background:#000;color:#fff;border:2px solid #175A00'
  if (skill >= 65) return 'background:#000;color:#fff;border:2px solid #8ACD26'
  if (skill >= 55) return 'background:#000;color:#fff;border:2px solid #FD8303'
  return 'background:#000;color:#fff;border:2px solid #7D2200'
}

const TRANSFER_WINDOW_SUMMER_START = 1
const TRANSFER_WINDOW_SUMMER_END = 6
const TRANSFER_WINDOW_WINTER_START = 15
const TRANSFER_WINDOW_WINTER_END = 20
const MIN_SQUAD_SIZE = 23
const MIN_GK = 2
const MIN_DC = 2
const MIN_MC = 2
const MIN_FW = 2

const GAME_PLANS = {
  pesado:     { label: 'Pesada',     desc: 'Presión intensa y constante sobre el rival.', attack: 1.3, defense: 1.3, drain: 15, events: 1.15 },
  extremo:    { label: 'Extrema',    desc: 'Estilo muy intenso, todo o nada.', attack: 1.5, defense: 0.8, drain: 18, events: 1.30 },
  suave:      { label: 'Suave',      desc: 'Estilo relajado, prioriza la conservación de energía.', attack: 0.8, defense: 1.1, drain: 6, events: 0.80 },
}

const MAX_SQUAD = 30
const MAX_CONVOCADOS = 18
const MAX_TITULARES = 11
const MAX_BENCH = 7
const MAX_RESERVES = 10

const INJURIES = [
  { type: 'sprain',    description: 'Esguince de tobillo',     duration: 2, recoveryEnergy: 20 },
  { type: 'strain',    description: 'Rotura fibrilar',          duration: 4, recoveryEnergy: 10 },
  { type: 'contusion', description: 'Contusión muscular',       duration: 1, recoveryEnergy: 30 },
  { type: 'fracture',  description: 'Fractura de dedo',         duration: 3, recoveryEnergy: 15 },
  { type: 'meniscus',  description: 'Lesión de menisco',        duration: 5, recoveryEnergy: 10 },
  { type: 'hamstring', description: 'Lesión en el isquiotibial',duration: 3, recoveryEnergy: 15 },
  { type: 'ankle',     description: 'Torcedura de tobillo',     duration: 2, recoveryEnergy: 25 },
]

const FILIAL_MAP = {
  '1041': 's24',
  /* España */
  'e3': 'e28',   /* Celta de Vigo → Celta Fortuna */
  'e17': 'e38',  /* Real Sociedad → Real Sociedad B */
  'e1': 'e46',   /* Athletic Club → Bilbao Ath. */
  'e14': 'e52',  /* RC Deportivo → Deportivo Fabril */
  'e2': 'e67',   /* Atlético de Madrid → Atlético Madrileño */
  'e16': 'e79',  /* Real Madrid → RM Castilla */
  'e20': 'e82',  /* Villarreal CF → Villarreal B */
  /* Portugal */
  'pt1': 's2-4',  /* Benfica → Benfica II */
  'pt2': 's2-13', /* Porto → Porto II */
  'pt3': 's2-14', /* Sporting CP → Sporting CP II */
  /* Polonia */
  'p2': 'p50',   'p8': 'p51',   'p7': 'p55',
  'p23': 'p58',  'p13': 'p69',  'p15': 'p71',
  'p3': 'p82',   'p24': 'p98',  'p11': 'p107',
  'p14': 'p114', 'p18': 'p122', 'p1': 'p124',
}

const B_TEAM_MAP = {
  /* España */
  'e28': 'e3',   /* Celta Fortuna → Celta de Vigo */
  'e38': 'e17',  /* Real Sociedad B → Real Sociedad */
  'e46': 'e1',   /* Bilbao Ath. → Athletic Club */
  'e52': 'e14',  /* Deportivo Fabril → RC Deportivo */
  'e67': 'e2',   /* Atlético Madrileño → Atlético de Madrid */
  'e79': 'e16',  /* RM Castilla → Real Madrid */
  'e82': 'e20',  /* Villarreal B → Villarreal CF */
  /* Portugal */
  's2-4': 'pt1',  /* Benfica II → Benfica */
  's2-13': 'pt2',  /* Porto II → Porto */
  's2-14': 'pt3',  /* Sporting CP II → Sporting CP */
  /* Polonia */
  'p50': 'p2',   /* Legia Warszawa II → Legia Warszawa */
  'p51': 'p8',   /* Śląsk Wrocław II → Śląsk Wrocław */
  'p55': 'p7',   /* Jagiellonia II → Jagiellonia */
  'p58': 'p23',  /* LKS Łódź II → ŁKS Łódź */
  'p69': 'p13',  /* Widzew Łódź II → Widzew Łódź */
  'p71': 'p15',  /* Wisła Płock II → Wisła Płock */
  'p82': 'p3',   /* Lech Poznań II → Lech Poznań */
  'p98': 'p24',  /* Miedź Legnica II → Miedź Legnica */
  'p107': 'p11', /* Zagłębie Lubin II → Zagłębie Lubin */
  'p114': 'p14', /* Korona Kielce II → Korona Kielce */
  'p122': 'p18', /* Wieczysta Kraków II → Wieczysta Kraków */
  'p124': 'p1',  /* Wisła Kraków II → Wisła Kraków */
}

var GROUPED_LEAGUES = {
  lpl4g: { name: '4\u00aa Divisi\u00f3n Polaca', groups: ['lpl4g1','lpl4g2','lpl4g3','lpl4g4'], groupNames: ['Grupo 1','Grupo 2','Grupo 3','Grupo 4'] },
  l3sg:  { name: 'Primera RFEF', groups: ['l3sg1','l3sg2'], groupNames: ['Grupo 1','Grupo 2'] },
}

function isGroupedLeague(lid) { return lid && (lid.startsWith('lpl4g') || lid.startsWith('l3sg')) }

function getGroupedConfig(lid) {
  if (!lid) return null
  for (var key in GROUPED_LEAGUES) { if (lid.startsWith(key)) return GROUPED_LEAGUES[key] }
  return null
}

function getVisibleLeagueCount(countryId) {
  var data = window.DB[countryId]
  if (!data || !data.country.leagues) return 0
  var count = 0
  var seen = {}
  for (var i = 0; i < data.country.leagues.length; i++) {
    var lid = data.country.leagues[i].id
    if (lid && isGroupedLeague(lid)) {
      var cfg = getGroupedConfig(lid)
      if (cfg && !seen[cfg.name]) { seen[cfg.name] = true; count++ }
    } else {
      count++
    }
  }
  return count
}

function getBTeamParent(bTeamId) { return B_TEAM_MAP[bTeamId] || null }
function getFilialId(teamId) { return FILIAL_MAP[teamId] || null }
function getParentTeamId(filialId) { return Object.keys(FILIAL_MAP).find(k => FILIAL_MAP[k] === filialId) || null }
function findBTeamOf(parentId) { return Object.keys(B_TEAM_MAP).find(k => B_TEAM_MAP[k] === parentId) || null }

function isPlayerFromMyFilial(player) {
  var fid = getFilialId(state.teamId)
  if (!fid) return false
  if (state.filialSquad && state.filialSquad.some(function(p) { return p.id === player.id })) return true
  return player.teamId === fid || false
}

function isPlayerFromMyParent(player) {
  var pid = getBTeamParent(state.teamId)
  if (!pid) return false
  if (player.teamId === pid) return true
  /* Also check CPU team squads */
  for (var i = 0; i < state.leagueTeams.length; i++) {
    var t = state.leagueTeams[i]
    if (t.teamId === pid && t.players.some(function(p) { return p.id === player.id })) return true
  }
  return false
}

/* Pool de nombres españoles para CPU */
const NOPHOTO = 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
const NAME_POOLS = {
  portero: ['Álex Ruiz', 'David Molina', 'Jesús Serrano', 'Manuel Blanco', 'Pablo Morales', 'Raúl Gil', 'Sergio Ramos', 'Víctor Navarro'],
  cierre: ['Alberto Torres', 'Carlos Domínguez', 'Daniel Vázquez', 'Fernando Romero', 'Jorge Álvarez', 'Juan Díaz', 'Luis Moreno', 'Miguel Jiménez'],
  ala: ['Adrián Sánchez', 'Alejandro Ramírez', 'Álvaro Hernández', 'Andrés Pérez', 'Antonio López', 'Diego González', 'Francisco Martínez', 'Iván Rodríguez', 'Javier García', 'José Sánchez', 'Marcos López', 'Pedro González', 'Rafael Hernández', 'Rubén Pérez'],
  pivot: ['Alfredo Martínez', 'Emilio Rodríguez', 'Enrique García', 'Gonzalo López', 'Hugo Sánchez', 'Ismael Pérez', 'Marc González', 'Pau Rodríguez', 'Vicente López'],
}

const SURNAMES = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Moreno', 'Jiménez', 'Ruiz', 'Díaz', 'Álvarez', 'Romero', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Serrano', 'Blanco', 'Molina', 'Morales']

const STAFF_FIRST = {
  es: ['Álex', 'Alberto', 'Alejandro', 'Álvaro', 'Andrés', 'Antonio', 'Carlos', 'Daniel', 'David', 'Diego', 'Fernando', 'Francisco', 'Hugo', 'Iván', 'Javier', 'Jorge', 'José', 'Juan', 'Luis', 'Manuel', 'Marc', 'Marcos', 'Miguel', 'Pablo', 'Pau', 'Pedro', 'Rafael', 'Raúl', 'Rubén', 'Sergio', 'Vicente', 'Víctor'],
  pt: ['João', 'Pedro', 'Rui', 'Carlos', 'José', 'António', 'Manuel', 'Fernando', 'Luís', 'Miguel', 'André', 'Ricardo', 'Paulo', 'Nuno', 'Hugo', 'Tiago', 'Bruno', 'Fábio', 'Diogo', 'Rafael'],
  it: ['Marco', 'Luca', 'Giuseppe', 'Andrea', 'Paolo', 'Roberto', 'Stefano', 'Francesco', 'Alessandro', 'Fabio', 'Michele', 'Simone', 'Riccardo', 'Daniele', 'Antonio'],
  br: ['Carlos', 'José', 'Pedro', 'João', 'Antônio', 'Francisco', 'Luís', 'Paulo', 'Roberto', 'Marcos', 'Eduardo', 'Fábio', 'André', 'Diego', 'Rafael', 'Bruno', 'Thiago', 'Gustavo'],
  ar: ['Juan', 'Diego', 'Pablo', 'Carlos', 'José', 'Martín', 'Luis', 'Gustavo', 'Hernán', 'Mario', 'Sergio', 'Jorge', 'Alejandro', 'Gabriel', 'Leandro', 'Federico', 'Lautaro', 'Matías', 'Nicolás', 'Facundo'],
  pl: ['Jakub', 'Kacper', 'Mateusz', 'Michał', 'Piotr', 'Szymon', 'Bartosz', 'Dawid', 'Wojciech', 'Adam', 'Filip', 'Jan', 'Marcin', 'Tomasz', 'Łukasz', 'Rafał', 'Krzysztof', 'Paweł', 'Grzegorz', 'Artur'],
  no: ['Erik', 'Lars', 'Magnus', 'Olav', 'Sander', 'Henrik', 'Jonas', 'Anders', 'Morten', 'Kristian', 'Thomas', 'Petter', 'Simen', 'Markus', 'Håkon'],
  sk: ['Ján', 'Peter', 'Michal', 'Martin', 'Tomáš', 'Marek', 'Lukáš', 'Filip', 'Adam', 'Samuel', 'Patrik', 'Oliver', 'Jakub', 'Matej', 'Dávid'],
  ee: ['Marten', 'Ragnar', 'Karl', 'Andres', 'Tarmo', 'Rain', 'Indrek', 'Ainar', 'Vladimir', 'Sergei', 'Dmitri', 'Mihkel', 'Sander', 'Henri', 'Markus'],
  nl: ['Jan', 'Piet', 'Dirk', 'Bram', 'Thijs', 'Lars', 'Sander', 'Tim', 'Thomas', 'Jasper', 'Wout', 'Daan', 'Milan', 'Jesse', 'Ruben'],
  by: ['Aleksei', 'Dzmitry', 'Ivan', 'Mikhail', 'Yahor', 'Pavel', 'Syarhey', 'Mikita', 'Uladzislau', 'Andrey', 'Artsyom', 'Maksim', 'Yevgeniy', 'Valeriy', 'Raman'],
  ch: ['Lukas', 'Noah', 'Nico', 'Leandro', 'Fabian', 'Yannick', 'Kevin', 'Roman', 'Silvan', 'Raphael', 'Dominik', 'Manuel', 'Sven', 'Marco', 'Patrick'],
  at: ['Lukas', 'David', 'Michael', 'Christoph', 'Stefan', 'Andreas', 'Thomas', 'Philipp', 'Markus', 'Daniel', 'Alexander', 'Martin', 'Florian', 'Manuel', 'Patrick'],
  ng: ['Emeka', 'Chinedu', 'Ola', 'Segun', 'Tunde', 'Kayode', 'Musa', 'Adekunle', 'Femi', 'Chidi', 'Uche', 'Kelechi', 'Ebuka', 'Ifeanyi', 'Nnamdi'],
  fr: ['Lucas', 'Hugo', 'Gabriel', 'Léo', 'Raphaël', 'Louis', 'Arthur', 'Jules', 'Adam', 'Maël', 'Ethan', 'Nathan', 'Clément', 'Antoine', 'Alexandre'],
  ro: ['Andrei', 'Mihai', 'Ionut', 'Alexandru', 'Cristian', 'Marius', 'George', 'Florin', 'Dan', 'Cosmin', 'Bogdan', 'Vlad', 'Adrian', 'Stefan', 'Razvan'],
  hr: ['Luka', 'Ivan', 'Mateo', 'Marko', 'Ante', 'Josip', 'Tomislav', 'Dominik', 'Mislav', 'Mario', 'Petar', 'Duje', 'Filip', 'Borna', 'Lovro'],
  si: ['Luka', 'Jan', 'Nejc', 'Miha', 'Zan', 'Tim', 'Matic', 'Alen', 'Jaka', 'Domen', 'Mitja', 'Blaz', 'Rene', 'Vid', 'Gasper'],
  am: ['Armen', 'Arman', 'Hayk', 'Gor', 'Artur', 'Vahan', 'Narek', 'Tigran', 'Sargis', 'David', 'Erik', 'Hovhannes', 'Varuzhan', 'Arsen', 'Gevorg'],
  dk: ['Mads', 'Christian', 'Rasmus', 'Andreas', 'Emil', 'Mathias', 'Kasper', 'Mikkel', 'Nikolaj', 'Oliver', 'Victor', 'Jonas', 'Simon', 'Alexander', 'Frederik'],
  se: ['Erik', 'Lars', 'Karl', 'Anders', 'Mikael', 'Johan', 'Henrik', 'Gustav', 'Magnus', 'Fredrik', 'Emil', 'Oskar', 'Victor', 'Simon', 'Anton'],
  gh: ['Kwame', 'Yaw', 'Kofi', 'Emmanuel', 'Samuel', 'Michael', 'Daniel', 'David', 'Joseph', 'John', 'Stephen', 'Isaac', 'Godwin', 'Eric', 'Patrick'],
  hn: ['Carlos', 'Jose', 'Luis', 'Rony', 'Alberth', 'Brayan', 'Kevin', 'Jorge', 'Danilo', 'Oscar', 'Angel', 'Edwin', 'Jonathan', 'Ramon', 'Marcelo'],
  ir: ['Ali', 'Mohammad', 'Reza', 'Amir', 'Hossein', 'Saeid', 'Mehdi', 'Majid', 'Hamid', 'Kaveh', 'Omid', 'Ehsan', 'Saman', 'Mojtaba', 'Payam'],
  ci: ['Didier', 'Yaya', 'Kolo', 'Salomon', 'Gervais', 'Wilfried', 'Serge', 'Frank', 'Cheick', 'Seydou', 'Lacina', 'Moussa', 'Bakari', 'Abou', 'Igor'],
  fi: ['Mika', 'Jussi', 'Teemu', 'Markus', 'Petri', 'Antti', 'Jukka', 'Mikko', 'Sami', 'Jari', 'Timo', 'Janne', 'Ville', 'Toni', 'Jarkko'],
  is: ['Aron', 'Birkir', 'Jon', 'Gylfi', 'Hordur', 'Ragnar', 'Alfreð', 'Runar', 'Johann', 'Kari', 'Haukur', 'Elias', 'Sveinn', 'Olafur', 'Bjorn'],
}

const SURNAMES_BY_COUNTRY = {
  es: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Moreno', 'Jiménez', 'Ruiz', 'Díaz', 'Álvarez', 'Romero', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Serrano', 'Blanco', 'Molina', 'Morales'],
  pt: ['Silva', 'Santos', 'Pereira', 'Costa', 'Sousa', 'Oliveira', 'Rodrigues', 'Martins', 'Fernandes', 'Gonçalves', 'Lopes', 'Marques', 'Almeida', 'Ribeiro', 'Pinto', 'Carvalho', 'Teixeira', 'Moreira', 'Correia', 'Mendes'],
  it: ['Rossi', 'Bianchi', 'Verdi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Gallo', 'Conti', 'Mancini', 'Costa', 'Moretti', 'Fontana', 'Marino', 'Rinaldi', 'Caruso', 'Greco', 'Barbieri', 'Fabbri', 'Martini'],
  br: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Costa', 'Almeida', 'Rodrigues', 'Nascimento', 'Araújo', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Barbosa', 'Rocha', 'Dias', 'Moreira', 'Teixeira'],
  ar: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Fernández', 'Pérez', 'Sánchez', 'Romero', 'Torres', 'Álvarez', 'Díaz', 'Ruiz', 'Moreno', 'Muñoz', 'Sosa', 'Acosta', 'Medina', 'Castillo', 'Giménez'],
  pl: ['Kowalski', 'Wiśniewski', 'Dąbrowski', 'Lewandowski', 'Wójcik', 'Kamiński', 'Kowalczyk', 'Zieliński', 'Szymański', 'Woźniak', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowicz', 'Grabowski', 'Pawlak', 'Zając', 'Nowak'],
  no: ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Johnsen', 'Eriksen', 'Berg', 'Haugen', 'Bakke'],
  sk: ['Horváth', 'Kováč', 'Varga', 'Tóth', 'Nagy', 'Baláž', 'Szabó', 'Molnár', 'Németh', 'Farkaš', 'Lukáč', 'Krajčovič', 'Hudák', 'Oravec', 'Polák'],
  ee: ['Tamm', 'Saar', 'Mägi', 'Sepp', 'Kask', 'Kull', 'Mets', 'Koppel', 'Aas', 'Pärn', 'Kuusk', 'Luik', 'Vaher', 'Ilves', 'Allik'],
  nl: ['de Jong', 'Jansen', 'de Vries', 'van Dijk', 'Bakker', 'Visser', 'Smit', 'Meijer', 'Mulder', 'de Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Dekker'],
  by: ['Ivanou', 'Kozlov', 'Volkov', 'Navitski', 'Klimovich', 'Petrov', 'Sidorov', 'Mikhailov', 'Kuznetsov', 'Smirnov', 'Popov', 'Belavusau', 'Karpovich', 'Savin', 'Bondar'],
  ch: ['Müller', 'Schmid', 'Keller', 'Weber', 'Huber', 'Baumann', 'Fischer', 'Gerber', 'Stocker', 'Lehmann', 'Brunner', 'Frei', 'Arnold', 'Burkhardt', 'Roth'],
  at: ['Gruber', 'Huber', 'Bauer', 'Wagner', 'Müller', 'Pichler', 'Steiner', 'Moser', 'Hofer', 'Leitner', 'Berger', 'Fuchs', 'Eder', 'Fischer', 'Schneider'],
  ng: ['Okafor', 'Nwosu', 'Adeyemi', 'Ogunleye', 'Okonkwo', 'Eze', 'Nnamdi', 'Olawale', 'Chukwu', 'Okafor', 'Nwachukwu', 'Ibrahim', 'Abubakar', 'Adegoke', 'Okoro'],
  fr: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia'],
  ro: ['Popescu', 'Ionescu', 'Dumitrescu', 'Stoica', 'Dinu', 'Gheorghiu', 'Radu', 'Constantin', 'Stan', 'Marinescu', 'Munteanu', 'Petrescu', 'Barbu', 'Diaconu', 'Nicolae'],
  hr: ['Horvat', 'Kovačević', 'Babić', 'Novak', 'Knežević', 'Petrović', 'Lovrić', 'Bošnjak', 'Marić', 'Vuković', 'Tomić', 'Blažević', 'Grgić', 'Vidović', 'Pavlović'],
  si: ['Novak', 'Horvat', 'Krajnc', 'Kovačič', 'Zupančič', 'Potočnik', 'Mlakar', 'Kos', 'Vidmar', 'Hribar', 'Koren', 'Božič', 'Rozman', 'Golob', 'Turk'],
  am: ['Hakobyan', 'Sargsyan', 'Petrosyan', 'Mkrtchyan', 'Grigoryan', 'Karapetyan', 'Avetisyan', 'Harutyunyan', 'Stepanyan', 'Khachatryan', 'Vardanyan', 'Simonyan', 'Ohanyan', 'Movsesyan', 'Ghazaryan'],
  dk: ['Jensen', 'Nielsen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen', 'Rasmussen', 'Jørgensen', 'Madsen', 'Petersen', 'Olsen', 'Thomsen', 'Kristensen'],
  se: ['Johansson', 'Andersson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Hansson', 'Bengtsson', 'Lindqvist'],
  gh: ['Mensah', 'Asante', 'Agyeman', 'Owusu', 'Osei', 'Boateng', 'Adomah', 'Nkrumah', 'Annan', 'Quaye', 'Agyapong', 'Tetteh', 'Amankwah', 'Sarpong', 'Kwarteng'],
  hn: ['Lopez', 'Garcia', 'Hernandez', 'Martinez', 'Rodriguez', 'Gonzalez', 'Flores', 'Cruz', 'Valle', 'Reyes', 'Mejia', 'Diaz', 'Castro', 'Vargas', 'Ramos'],
  ir: ['Ahmadi', 'Mohammadi', 'Hosseini', 'Rezaei', 'Karimi', 'Mousavi', 'Jafari', 'Ghasemi', 'Akbari', 'Taghavi', 'Moradi', 'Mirzaei', 'Ebrahimi', 'Hedayati', 'Salehi'],
  ci: ['Traoré', 'Touré', 'Koné', 'Cissé', 'Diallo', 'Bamba', 'Coulibaly', 'Zakri', 'Sangaré', 'Fofana', 'Kamara', 'Ouattara', 'Konaté', 'Keita', 'Dembélé'],
  fi: ['Korhonen', 'Virtanen', 'Mäkinen', 'Nieminen', 'Mäkelä', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen', 'Salminen', 'Nurmi', 'Järvinen', 'Lehtonen', 'Salo', 'Rantanen'],
  is: ['Jónsson', 'Guðmundsson', 'Sigurðsson', 'Kristjánsson', 'Björnsson', 'Magnússon', 'Pálsson', 'Ólafsson', 'Einarsson', 'Harðarson', 'Þorvaldsson', 'Þórðarson', 'Víkingsson', 'Þráinsson', 'Þórarinsson'],
}

const NATIONALITIES = {
  es: { flag: '🇪🇸', name: 'España', label: '🇪🇸 España' },
  pt: { flag: '🇵🇹', name: 'Portugal', label: '🇵🇹 Portugal' },
  it: { flag: '🇮🇹', name: 'Italia', label: '🇮🇹 Italia' },
  br: { flag: '🇧🇷', name: 'Brasil', label: '🇧🇷 Brasil' },
  ar: { flag: '🇦🇷', name: 'Argentina', label: '🇦🇷 Argentina' },
  pl: { flag: '🇵🇱', name: 'Polonia', label: '🇵🇱 Polonia' },
  no: { flag: '🇳🇴', name: 'Noruega', label: '🇳🇴 Noruega' },
  sk: { flag: '🇸🇰', name: 'Eslovaquia', label: '🇸🇰 Eslovaquia' },
  ee: { flag: '🇪🇪', name: 'Estonia', label: '🇪🇪 Estonia' },
  nl: { flag: '🇳🇱', name: 'Países Bajos', label: '🇳🇱 Países Bajos' },
  by: { flag: '🇧🇾', name: 'Bielorrusia', label: '🇧🇾 Bielorrusia' },
  /* Aliases para data file IDs */
  poland: { flag: '🇵🇱', name: 'Polonia', label: '🇵🇱 Polonia' },
  spain: { flag: '🇪🇸', name: 'España', label: '🇪🇸 España' },
  portugal: { flag: '🇵🇹', name: 'Portugal', label: '🇵🇹 Portugal' },
  italy: { flag: '🇮🇹', name: 'Italia', label: '🇮🇹 Italia' },
  brazil: { flag: '🇧🇷', name: 'Brasil', label: '🇧🇷 Brasil' },
  argentina: { flag: '🇦🇷', name: 'Argentina', label: '🇦🇷 Argentina' },
  ch: { flag: '🇨🇭', name: 'Suiza', label: '🇨🇭 Suiza' },
  at: { flag: '🇦🇹', name: 'Austria', label: '🇦🇹 Austria' },
  ng: { flag: '🇳🇬', name: 'Nigeria', label: '🇳🇬 Nigeria' },
  fr: { flag: '🇫🇷', name: 'Francia', label: '🇫🇷 Francia' },
  ro: { flag: '🇷🇴', name: 'Rumanía', label: '🇷🇴 Rumanía' },
  hr: { flag: '🇭🇷', name: 'Croacia', label: '🇭🇷 Croacia' },
  si: { flag: '🇸🇮', name: 'Eslovenia', label: '🇸🇮 Eslovenia' },
  am: { flag: '🇦🇲', name: 'Armenia', label: '🇦🇲 Armenia' },
  dk: { flag: '🇩🇰', name: 'Dinamarca', label: '🇩🇰 Dinamarca' },
  se: { flag: '🇸🇪', name: 'Suecia', label: '🇸🇪 Suecia' },
  gh: { flag: '🇬🇭', name: 'Ghana', label: '🇬🇭 Ghana' },
  hn: { flag: '🇭🇳', name: 'Honduras', label: '🇭🇳 Honduras' },
  ir: { flag: '🇮🇷', name: 'Irán', label: '🇮🇷 Irán' },
  ci: { flag: '🇨🇮', name: 'Costa de Marfil', label: '🇨🇮 Costa de Marfil' },
  fi: { flag: '🇫🇮', name: 'Finlandia', label: '🇫🇮 Finlandia' },
  is: { flag: '🇮🇸', name: 'Islandia', label: '🇮🇸 Islandia' },
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calcValue(skill) {
  return skill * 80 + randInt(0, 2000)
}

function generateStaffMember(teamName, countryId, role) {
  const noface = 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
  const nat = NATIONALITIES[countryId] || NATIONALITIES.es
  const first = pickRandom(STAFF_FIRST[countryId] || STAFF_FIRST.es)
  const surname = pickRandom(SURNAMES_BY_COUNTRY[countryId] || SURNAMES_BY_COUNTRY.es)
  const now = new Date().toLocaleDateString('es-ES')
  return {
    name: `${first} ${surname}`,
    nationality: nat.label,
    role: role || 'headCoach',
    avatar: noface,
    career: [{ team: teamName || '—', from: now, to: 'Actualidad', matches: 0, won: 0, drawn: 0, lost: 0 }],
  }
}

function generateStaff(teamName, countryId) {
  const cid = countryId || 'es'
  return [ generateStaffMember(teamName, cid, 'headCoach') ]
}

function generateCpuPlayer(teamId, countryId, teamRating, position, overrides) {
  const cid = countryId || 'es'
  const minS = Math.max(30, (teamRating || 70) - 15)
  const maxS = Math.min(99, (teamRating || 70))
  const nat = NATIONALITIES[cid] || NATIONALITIES.es
  const firstPool = STAFF_FIRST[cid] || STAFF_FIRST.es
  const surPool = SURNAMES_BY_COUNTRY[cid] || SURNAMES_BY_COUNTRY.es
  const first = pickRandom(firstPool)
  const sur = pickRandom(surPool)
  const skill = overrides && overrides.skill != null ? overrides.skill : randInt(minS, maxS)
  const age = overrides && overrides.age != null ? overrides.age : randInt(20, 35)
  const foot = overrides && overrides.foot ? overrides.foot : pickRandom(['DER', 'IZQ'])
  return {
    id: `${teamId}-cpu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `${first} ${sur}`,
    position: position,
    skill: skill,
    energy: randInt(70, 100),
    number: 99,
    nationality: nat.label,
    goals: 0, matches: 0,
    value: calcValue(skill),
    transferListed: false, transferPrice: 0, loanListed: false,
    assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [],
    avatar: NOPHOTO,
    enPista: false, minutosEnPista: 0, convocado: false, titular: false,
    injury: null, age: age, foot: foot,
    contractUntil: '30/06/' + (2027 + randInt(0, 2)),
    onLoan: false, loanFrom: null, loanUntil: null,
    _suspended: null,
    _redType: null,
  }
}

function normalizarPlantillas() {
  rebuildGlobalPlayerPool()
}

function procesarFichajesIniciales() {
  for (var ti = 0; ti < state.leagueTeams.length; ti++) {
    var team = state.leagueTeams[ti]
    if (team.teamId === state.teamId) continue
    procesarIAFichajes(team)
    if (team.players.length < MIN_SQUAD_SIZE) procesarIAFichajes(team)
    if (team.players.length < MIN_SQUAD_SIZE) procesarIAFichajes(team)
  }
  rebuildGlobalPlayerPool()
}

function teamRating() {
  const lt = state.leagueTeams.find(t => t.teamId === state.teamId)
  return lt ? lt.rating : 50
}

function rebuildGlobalPlayerPool() {
  state.globalPlayers = []
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data || !data.country) continue
    const countryFlag = data.country.flag || ''
    for (const l of data.country.leagues || []) {
      for (const t of l.teams || []) {
        const teamObj = getTeamObj(t.id)
        if (!teamObj || !teamObj.players) continue
        for (const p of teamObj.players) {
          if (p.onLoan && p.loanFrom) continue
          if (state.boughtPlayerIds && state.boughtPlayerIds.indexOf(p.id) >= 0) continue
          state.globalPlayers.push({
            ...p, teamName: teamObj.name, teamId: teamObj.teamId,
            countryFlag: countryFlag, leagueId: l.id,
          })
        }
      }
    }
  }
}

function generateCpuSquad(teamId, countryId, teamRating) {
  const cid = countryId || 'es'
  const minS = Math.max(30, (teamRating || 70) - 15)
  const maxS = Math.min(99, (teamRating || 70))
  const nat = NATIONALITIES[cid] || NATIONALITIES.es
  const firstPool = STAFF_FIRST[cid] || STAFF_FIRST.es
  const surPool = SURNAMES_BY_COUNTRY[cid] || SURNAMES_BY_COUNTRY.es
  const players = []
  let pid = 1
  const countPerPos = { portero: 3, lateral_der: 2, lateral_izq: 2, carrilero_der: 1, carrilero_izq: 1, defensa_central: 4, medio_def: 2, mediocentro: 3, medio_ofensivo: 2, medio_der: 2, medio_izq: 2, extremo_der: 2, extremo_izq: 2, delantero: 3 }
  for (const pos of POS_ORDER) {
    const count = countPerPos[pos]
    for (let i = 0; i < count; i++) {
      const first = pickRandom(firstPool)
      const sur = pickRandom(surPool)
      const name = `${first} ${sur}`
      const skill = randInt(minS, maxS)
      const value = calcValue(skill)
      players.push({
        id: `${teamId}-cpu-${pid++}`,
        name, position: pos, skill,
        energy: randInt(70, 100), number: pid,
        nationality: nat.label,
        goals: 0, matches: 0,
        value, transferListed: false, transferPrice: 0, loanListed: false, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [],
        avatar: NOPHOTO,
        enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']),
        contractUntil: '30/06/' + (2027 + randInt(0, 2)),
        onLoan: false, loanFrom: null, loanUntil: null,
      })
    }
  }
  return players
}

const COUNTRIES = [
  { id: 'poland', name: 'Polonia', flag: '🇵🇱' },
  { id: 'spain', name: 'España', flag: '🇪🇸' },
  { id: 'portugal', name: 'Portugal', flag: '🇵🇹' },
]

window.DB = window.DB || {}

const TEAM_NAMES = {
  spain: ['FC Barcelona', 'Real Madrid', 'Atlético Madrid', 'Sevilla', 'Valencia', 'Athletic Club', 'Real Sociedad', 'Villarreal', 'Betis', 'Espanyol', 'Getafe', 'Celta', 'Mallorca', 'Osasuna', 'Granada', 'Rayo Vallecano', 'Alavés', 'Girona', 'Valladolid', 'Elche', 'Levante', 'Cádiz', 'Huesca', 'Tenerife', 'Zaragoza', 'Oviedo', 'Sporting Gijón', 'Eibar', 'Albacete', 'Lugo'],
  portugal: ['SL Benfica', 'FC Porto', 'Sporting CP', 'SC Braga', 'Vitória SC', 'Rio Ave', 'Famalicão', 'Boavista', 'Portimonense', 'Gil Vicente', 'Estoril', 'Paços Ferreira', 'Santa Clara', 'Marítimo', 'Nacional', 'Belenenses', 'Chaves', 'Farense', 'Arouca', 'Académica'],
  italy: ['Juventus', 'AC Milan', 'Inter Milan', 'Roma', 'Napoli', 'Lazio', 'Atalanta', 'Fiorentina', 'Torino', 'Bologna', 'Sampdoria', 'Udinese', 'Genoa', 'Cagliari', 'Verona', 'Sassuolo', 'Empoli', 'Lecce', 'Spezia', 'Venezia', 'Cremonese', 'Monza', 'Salernitana', 'Parma', 'Bari'],
  brazil: ['Flamengo', 'Palmeiras', 'Santos', 'Corinthians', 'São Paulo', 'Grêmio', 'Internacional', 'Cruzeiro', 'Vasco da Gama', 'Botafogo', 'Fluminense', 'Bahia', 'Atlético Mineiro', 'Athletico Paranaense', 'Fortaleza', 'Ceará', 'Goiás', 'Sport Recife', 'Coritiba', 'Chapecoense'],
  argentina: ['Boca Juniors', 'River Plate', 'Independiente', 'Racing Club', 'San Lorenzo', 'Vélez Sarsfield', 'Estudiantes', 'Rosario Central', 'Newell\'s Old Boys', 'Lanús', 'Talleres', 'Defensa y Justicia', 'Argentinos Juniors', 'Colón', 'Banfield', 'Godoy Cruz', 'Huracán', 'Gimnasia', 'Unión', 'Platense'],
  poland: ['Legia Warszawa', 'Lech Poznań', 'Raków Częstochowa', 'Pogoń Szczecin', 'Śląsk Wrocław', 'Lechia Gdańsk', 'Wisła Kraków', 'Górnik Zabrze', 'Cracovia', 'Jagiellonia', 'Radomiak', 'Warta Poznań', 'Zagłębie Lubin', 'Stal Mielec', 'Korona Kielce', 'Miedź Legnica', 'Widzew Łódź', 'ŁKS Łódź', 'GKS Katowice', 'Piast Gliwice'],
}

const LEAGUE_NAMES = {
  spain: ['Primera División', 'Segunda División'],
  portugal: ['Primeira Liga', 'Segunda Liga'],
  italy: ['Serie A', 'Serie B'],
  brazil: ['Brasileirão Série A', 'Brasileirão Série B'],
  argentina: ['Primera División', 'Primera Nacional'],
  poland: ['Primera División', 'Segunda División'],
}

function generateDummyLeagues(countryId) {
  var data = window.DB[countryId]
  if (!data) return
  if (data.country.leagues && data.country.leagues.length > 0) return

  var names = TEAM_NAMES[countryId] || []
  if (names.length === 0) {
    for (var i = 1; i <= 30; i++) names.push('FC ' + countryId.charAt(0).toUpperCase() + countryId.slice(1) + ' ' + i)
  }
  var shuffled = names.slice().sort(function() { return Math.random() - 0.5 })

  var div1Count = Math.min(18, Math.max(12, Math.floor(shuffled.length * 0.55)))
  var div1Teams = shuffled.slice(0, div1Count)
  var div2Teams = shuffled.slice(div1Count, div1Count + Math.min(18, shuffled.length - div1Count))

  var leagueNames = LEAGUE_NAMES[countryId] || ['Liga 1', 'Liga 2']
  var ligas = [
    { id: countryId + '1', name: leagueNames[0], logo: '', teams: [] },
    { id: countryId + '2', name: leagueNames[1], logo: '', teams: [] },
  ]

  ligas[0].teams = div1Teams.map(function(name, i) {
    return createDummyTeam(name, countryId + '_t' + (i + 1), countryId)
  })
  ligas[1].teams = div2Teams.map(function(name, i) {
    return createDummyTeam(name, countryId + '_t' + (div1Count + i + 1), countryId)
  })

  data.country.leagues = ligas
}

function createDummyTeam(name, id, countryId) {
  var positions = ['POR', 'DFC', 'LD', 'LI', 'CAD', 'CAI', 'MCD', 'MC', 'MCO', 'MI', 'MD', 'EI', 'ED', 'DC']
  var natCode = getNatCodeForCountry(countryId)
  var players = []
  var count = 20 + Math.floor(Math.random() * 5)

  for (var i = 0; i < count; i++) {
    var pos = positions[i % positions.length]
    var edad = 18 + Math.floor(Math.random() * 18)
    var skill = Math.round(40 + Math.random() * 45)
    var nombre = generateName(natCode)
    players.push({
      id: id + '_p' + (i + 1),
      name: nombre,
      age: edad,
      skill: skill,
      position: pos,
      value: calcValue(skill),
      avatar: '',
      nationality: natCode,
      matches: 0, goals: 0, assists: 0, injured: false, injuryWeeks: 0,
      enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, energy: 100,
      mainPct: pos === 'POR' ? 100 : pos.startsWith('D') ? 90 : pos.startsWith('M') ? 85 : 80,
      otherPositions: {}, foot: Math.random() < 0.5 ? 'Diestro' : 'Zurdo',
    })
  }

  return { id: id, name: name, logo: '', players: players, staff: [] }
}

function getNatCodeForCountry(countryId) {
  var map = { spain: 'es', portugal: 'pt', italy: 'it', brazil: 'br', argentina: 'ar', poland: 'pl' }
  return map[countryId] || 'es'
}

function generateName(natCode) {
  var namesList = STAFF_FIRST[natCode]
  var surnamesList = SURNAMES_BY_COUNTRY[natCode]
  if (!namesList || !surnamesList) return 'Jugador ' + Math.floor(Math.random() * 999)
  return namesList[Math.floor(Math.random() * namesList.length)] + ' ' + surnamesList[Math.floor(Math.random() * surnamesList.length)]
}

function ensureCountryLeagues(countryId) {
  var data = window.DB[countryId]
  if (!data) return
  if (!data.country.leagues || data.country.leagues.length === 0) {
    generateDummyLeagues(countryId)
  }
}

function loadCountryData(countryId, callback) {
  if (window.DB[countryId]) { callback(window.DB[countryId]); return }
  const script = document.createElement('script')
  script.src = `js/data/${countryId}.js`
  script.onload = () => {
    if (window.DB[countryId]) {
      callback(window.DB[countryId])
    } else {
      callback(null)
    }
  }
  script.onerror = () => {
    console.error('Error al cargar datos de', countryId)
    const msg = document.getElementById('ng-error-msg')
    if (msg) { msg.textContent = 'Error al cargar los datos. Verifica que los archivos de datos existen.'; msg.classList.remove('hidden') }
    callback(null)
  }
  document.head.appendChild(script)
}

/* ============ ENGINE ============ */
const EVENTS_POOL = {
  goal: [
    { text: (t) => `${t} recibe en el área, gira y dispara... ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} fusila al portero desde la frontal. ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} aprovecha un rebote y empuja a la red. ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} ejecuta una falta directa. ¡GOL!`, type: 'goal' },
  ],
  save: [
    { text: (t) => `${t} dispara pero el portero desvía a córner.`, type: 'save' },
    { text: (t) => `${t} prueba suerte desde lejos, atrapado.`, type: 'save' },
  ],
  miss: [
    { text: (t) => `${t} dispara desviado, balón fuera.`, type: 'miss' },
    { text: (t) => `${t} intenta el pase filtrado, cortado.`, type: 'miss' },
    { text: (t) => `${t} su disparo se estrella en el palo.`, type: 'miss' },
    { text: (t) => `${t} no logra controlar el balón.`, type: 'miss' },
  ],
  foul: [
    { text: (t) => `Falta de ${t}. Tiro libre peligroso.`, type: 'foul' },
    { text: (t) => `¡ ${t} comete falta táctica!`, type: 'foul' },
  ],
}

function avgSkill(players) {
  return players.reduce((sum, p) => sum + p.skill, 0) / players.length
}

function avgEnergy(players) {
  return players.reduce((sum, p) => sum + p.energy, 0) / players.length
}

function calcTacticMultiplier(formation, gamePlan) {
  const f = FORMATIONS[formation]
  const m = GAME_PLANS[gamePlan]
  if (!f || !m) return 1
  return f.multiplier * m.attack
}

/* ============ STATE ============ */
const STORAGE_KEY = 'futsal_saves'
const TACTICS_KEY = 'futsal_tactics'

const state = {
  coach: '', team: '', teamId: '', teamLogo: '', countryId: '', leagueId: '',
  gameId: null,
  matchdaySquad: [], startingFive: [], subsBench: [], convocatoriaValidada: false,
  stats: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
  players: [],
  tactic: { formation: '4-3-3', gamePlan: 'pesado' },
  finances: { balance: 5000, history: [] },
  leagueTeams: [],
  currentMatchday: 1,
  totalMatchdays: 0,
  fixtures: [],
  allLeagueData: {},
  currentTab: 'club',
  clubSubTab: 'squad',
  marketTab: 'buy',
  globalPlayers: [],
  staff: [],
  tacticsSlots: [],
  benchIds: [],
  reserveIds: [],
  selectedPlayerId: null,
  captainId: null,
  inbox: [],
  soundEnabled: true,
  filialSquad: [],
  leagueViewCountry: '',
  trophies: [],
  seasonNumber: 1,
  transferWindowOpen: false,
  loanPool: [],
  boughtPlayerIds: [],
  presupuestoInicial: 0,
  cup: null,
  supercopa: null,
  cupChampion: null,
  cupRunnerUp: null,
  leagueChampion: null,
  leagueRunnerUp: null,
}

/* ============ HELPERS ============ */
function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

function formatMoney(amount) {
  const fmt = Math.abs(amount).toLocaleString('es-ES', { useGrouping: true })
  return amount >= 0 ? `${fmt} €` : `-${fmt} €`
}

/* ============ COPA / CUP SYSTEM ============ */
var COPA_SCHEDULE = [
  { week: 6, label: '1\u00aa Ronda' },
  { week: 10, label: '2\u00aa Ronda' },
  { week: 15, label: 'Dieciseisavos' },
  { week: 18, label: 'SUPERCOPA', isSupercopa: true },
  { week: 21, label: 'Octavos' },
  { week: 25, label: 'Cuartos' },
  { week: 30, label: 'Semifinales' },
  { week: 35, label: 'Final' },
]

function getCupReward(roundIdx) {
  var rewards = [5000, 10000, 20000, 0, 50000, 100000, 200000, 500000]
  return rewards[roundIdx] || 0
}

function getCupRewardLoss(roundIdx) {
  var losses = [0, 0, 0, 0, 0, 0, 0, 100000]
  return losses[roundIdx] || 0
}

function getCupLabel(roundIdx) {
  var labels = ['1\u00aa Ronda', '2\u00aa Ronda', 'Dieciseisavos', 'Supercopa', 'Octavos', 'Cuartos', 'Semifinales', 'Final']
  return labels[roundIdx] || 'Copa'
}

function getSupercopaTeams() {
  if (state.seasonNumber === 1) {
    return ['e16', 'e7', 'e2', 'e1'] /* Real Madrid, Barcelona, Atl\u00e9tico, Athletic */
  }
  var teams = []
  if (state.leagueChampion) teams.push(state.leagueChampion)
  if (state.cupChampion && state.cupChampion !== state.leagueChampion) teams.push(state.cupChampion)
  if (state.leagueRunnerUp) teams.push(state.leagueRunnerUp)
  if (state.cupRunnerUp && teams.length < 4) teams.push(state.cupRunnerUp)
  /* Fill remaining with top teams if needed */
  while (teams.length < 4) {
    var standings = updateLeagueStandings()
    for (var si = 0; si < standings.length && teams.length < 4; si++) {
      if (teams.indexOf(standings[si].teamId) < 0) teams.push(standings[si].teamId)
    }
  }
  return teams.slice(0, 4)
}

function getCopaTeamsForRound(roundIdx) {
  var allTeams = []
  if (roundIdx === 0) {
    /* R1: Segunda + Primera RFEF + Segunda B */
    var l2s = getLeagueTeams('l2s')
    var l3sg1 = getLeagueTeams('l3sg1')
    var l3sg2 = getLeagueTeams('l3sg2')
    var l2bTeams = []
    for (var gi = 1; gi <= 6; gi++) l2bTeams = l2bTeams.concat(getLeagueTeams('l2b' + gi))
    allTeams = (l2s || []).concat(l3sg1 || []).concat(l3sg2 || []).concat(l2bTeams)
    allTeams = allTeams.filter(function(t) { return t.id !== 'e79' && t.id !== 'e67' && t.id !== 'e82' })
    return allTeams
  }
  if (roundIdx === 1) {
    var l1s = getLeagueTeams('l1s')
    var superTeams = getSupercopaTeams()
    return (l1s || []).filter(function(t) { return superTeams.indexOf(t.id) < 0 })
  }
  if (roundIdx === 2) {
    return getSupercopaTeams().map(function(id) { return { id: id } })
  }
  return []
}

/* Generate ONLY the current round's cup fixtures, knowing winners from previous round */
function generarRondaCopa(roundIdx, previousWinners, cupState) {
  var entry = COPA_SCHEDULE[roundIdx]
  if (!entry || entry.isSupercopa) return []
  var roundTeams = []

  if (roundIdx === 0) {
    roundTeams = getCopaTeamsForRound(0).sort(function() { return Math.random() - 0.5 })
    /* R1 con bye: 62 equipos → 1 bye + 30 partidos + 1 suelto = 32 clasificados */
    var byeTeam = roundTeams.pop()
    if (cupState) cupState._byeR1 = byeTeam.id
    var fixtures = []
    for (var fi = 0; fi < 30; fi++) {
      var home = roundTeams[fi * 2].id
      var away = roundTeams[fi * 2 + 1].id
      if (!home || !away) continue
      fixtures.push({ round: 'R' + roundIdx, label: entry.label, week: entry.week, home: home, away: away, homeScore: null, awayScore: null, played: false })
    }
    /* El 61º equipo que quedó sin emparejar también pasa */
    if (cupState && roundTeams.length > 60) {
      cupState._extraR1 = roundTeams[60].id
    }
    return fixtures
  }

  if (roundIdx === 1) {
    roundTeams = getCopaTeamsForRound(1)
    var l1s = getLeagueTeams('l1s')
    var inL1s = (previousWinners || []).filter(function(id) { return l1s.some(function(t) { return t.id === id }) })
    roundTeams = roundTeams.concat(inL1s.map(function(id) { return { id: id } }))
  } else if (roundIdx === 2) {
    var superTeams = getCopaTeamsForRound(2)
    roundTeams = (previousWinners || []).map(function(id) { return { id: id } }).concat(superTeams)
  } else {
    roundTeams = (previousWinners || []).map(function(id) { return { id: id } })
  }

  roundTeams = roundTeams.sort(function() { return Math.random() - 0.5 })
  var fixtures = []
  for (var fi = 0; fi < Math.floor(roundTeams.length / 2); fi++) {
    var home = roundTeams[fi * 2].id
    var away = roundTeams[fi * 2 + 1].id
    if (!home || !away) continue
    fixtures.push({ round: 'R' + roundIdx, label: entry.label, week: entry.week, home: home, away: away, homeScore: null, awayScore: null, played: false })
  }
  return fixtures
}

/* Initial cup setup: generate only R1, rest are generated on-demand */
function generarCopa() {
  var cupState = { schedule: COPA_SCHEDULE, roundIdx: 0, allFixtures: [], eliminated: [], advancing: [] }
  var r1 = generarRondaCopa(0, [], cupState)
  cupState.allFixtures = r1.slice()
  return cupState
}

/* Advance to next cup round: generate next round from winners */
function avanzarRondaCopa() {
  if (!state.cup) return
  var ri = state.cup.roundIdx
  /* Collect winners from current round */
  var currentFixtures = state.cup.allFixtures.filter(function(f) { return f.week === COPA_SCHEDULE[ri].week })
  var winners = []
  var eliminated = state.cup.eliminated || []
  currentFixtures.forEach(function(f) {
    if (!f.played) return
    var winner = f.homeScore > f.awayScore ? f.home : f.away
    winners.push(winner)
    eliminated.push(winner === f.home ? f.away : f.home)
  })
  /* R1: añadir el bye y el extra que pasaron directos */
  if (ri === 0) {
    if (state.cup._byeR1) { winners.push(state.cup._byeR1); delete state.cup._byeR1 }
    if (state.cup._extraR1) { winners.push(state.cup._extraR1); delete state.cup._extraR1 }
  }
  state.cup.eliminated = eliminated

  var nextRi = ri + 1
  while (nextRi < COPA_SCHEDULE.length && COPA_SCHEDULE[nextRi].isSupercopa) { nextRi++ }
  if (nextRi >= COPA_SCHEDULE.length) {
    /* Tournament finished */
    if (winners.length === 1) {
      state.cupChampion = winners[0]
    }
    state.cup.roundIdx = -1
    return
  }

  var fixtures = generarRondaCopa(nextRi, winners, state.cup)
  fixtures.forEach(function(f) { state.cup.allFixtures.push(f) })
  state.cup.roundIdx = nextRi

  /* Auto-simulate if user not in this round */
  var userInRound = fixtures.some(function(f) { return f.home === state.teamId || f.away === state.teamId })
  if (!userInRound) {
    fixtures.forEach(function(f) {
      var r = autoSimulateOtherMatch(f.home, f.away)
      f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
    })
    /* Keep advancing until user is in a round or tournament ends */
    avanzarRondaCopa()
  }
}

function generarSupercopa() {
  var teams = getSupercopaTeams()
  if (teams.length < 4) return null
  var sf1 = { round: 'SF', label: 'Semifinal', week: 18, home: teams[0], away: teams[1], homeScore: null, awayScore: null, played: false }
  var sf2 = { round: 'SF', label: 'Semifinal', week: 18, home: teams[2], away: teams[3], homeScore: null, awayScore: null, played: false }
  return { week: 18, fixtures: [sf1, sf2], final: null, winner: null }
}

function avanzarSupercopa() {
  if (!state.supercopa || state.supercopa.final) return
  var sf1 = state.supercopa.fixtures[0]
  var sf2 = state.supercopa.fixtures[1]
  if (!sf1.played || !sf2.played) return
  var w1 = sf1.homeScore > sf1.awayScore ? sf1.home : sf1.away
  var w2 = sf2.homeScore > sf2.awayScore ? sf2.home : sf2.away
  state.supercopa.final = { round: 'F', label: 'Final', week: 18, home: w1, away: w2, homeScore: null, awayScore: null, played: false }
}

function formatValue(val) {
  return `${val.toLocaleString('es-ES', { useGrouping: true })} €`
}

function formatShort(val) {
  if (!val) return '0'
  if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B'
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return String(val)
}

function formatTimestamp(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatTime(minute) {
  const half = minute <= 20 ? 1 : 2
  const m = minute <= 20 ? minute : minute - 20
  return `${half}T ${m}:00`
}

/* ============ SAVE / LOAD ============ */
var _memorySaves = null

/* IndexedDB wrapper */
function openDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open('FootsoccerDB', 1)
    req.onupgradeneeded = function(e) {
      var db = e.target.result
      if (!db.objectStoreNames.contains('saves')) db.createObjectStore('saves')
    }
    req.onsuccess = function(e) { resolve(e.target.result) }
    req.onerror = function(e) { reject(e.target.error) }
  })
}

function idbSet(key, value) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('saves', 'readwrite')
      tx.objectStore('saves').put(value, key)
      tx.oncomplete = function() { db.close(); resolve(true) }
      tx.onerror = function(e) { db.close(); reject(e.target.error) }
    })
  })
}

function idbGet(key) {
  return openDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('saves', 'readonly')
      var req = tx.objectStore('saves').get(key)
      req.onsuccess = function() { db.close(); resolve(req.result) }
      req.onerror = function(e) { db.close(); reject(e.target.error) }
    })
  })
}

/* Sync memory update + async IndexedDB write. Returns true immediately. */
function persistSaves(saves) {
  _memorySaves = saves
  /* Guardar también metadata en localStorage para acceso rápido */
  var meta = saves.map(function(s) { return { id: s.id, meta: s.meta, teamId: s.teamId, leagueId: s.leagueId, matchday: s.matchday } })
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(meta)) } catch(e) { /* localStorage no disponible o lleno */ }
  /* Guardar datos completos en IndexedDB (sin límite de tamaño) */
  idbSet(STORAGE_KEY, saves).then(function() { console.log('[SAVE] IndexedDB OK') }).catch(function(e) { console.warn('[SAVE] IndexedDB falló:', e) })
  return true
}

/* Load saves from IndexedDB first, then try localStorage fallback */
function initSaves() {
  return new Promise(function(resolve) {
    idbGet(STORAGE_KEY).then(function(data) {
      if (data && Array.isArray(data)) { _memorySaves = data; console.log('[SAVE] Cargado desde IndexedDB'); resolve(); return }
      /* Fallback: cargar metadatos desde localStorage */
      try {
        var raw = localStorage.getItem(STORAGE_KEY)
        if (raw) { var p = JSON.parse(raw); if (Array.isArray(p)) { _memorySaves = p; console.log('[SAVE] Cargado desde localStorage (meta)'); resolve(); return } }
      } catch(e) {}
      _memorySaves = []
      resolve()
    }).catch(function() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY)
        if (raw) { var p = JSON.parse(raw); if (Array.isArray(p)) { _memorySaves = p; resolve(); return } }
      } catch(e) {}
      _memorySaves = []
      resolve()
    })
  })
}

function getSaves() {
  return _memorySaves || []
}

function setSaves(saves) {
  persistSaves(saves)
  console.log('[SAVE] OK -', saves.length, 'partidas')
  return true
}

function getTop11Average(players) {
  if (!players || players.length === 0) return 0
  const top = [...players].sort((a, b) => (b.skill || 0) - (a.skill || 0)).slice(0, 11)
  return Math.round(top.reduce((s, p) => s + (p.skill || 0), 0) / top.length)
}

function getTop11EnergyFactor(players) {
  if (!players || players.length === 0) return 1
  const top = [...players].sort((a, b) => (b.skill || 0) - (a.skill || 0)).slice(0, 11)
  var avgE = top.reduce(function(s, p) { return s + (p.energy || 80) }, 0) / top.length
  return 0.5 + 0.5 * (avgE / 100)
}

const MAX_SLOTS = 4

function timeAgo(iso) {
  if (!iso) return ''
  const now = Date.now()
  const diff = now - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

window.SaveSystem = {
  saveGame() {
    try {
      const gameId = state.gameId || Date.now()
      state.gameId = gameId
      let saves = getSaves()
      if (saves.length >= MAX_SLOTS) saves = saves.slice(0, MAX_SLOTS - 1)
      const idx = saves.findIndex(s => Number(s.id) === Number(gameId))
      const matchday = state.stats.wins + state.stats.draws + state.stats.losses + 1
      const cleanup = p => {
        try {
          if (!p || typeof p !== 'object') return {}
          const { enPista, minutosEnPista, convocado, titular, _yellowThisMatch, _redThisMatch, _goalsInMatch, _assistThisMatch, ...rest } = p
          if (rest.positionExperience) rest.positionExperience = Object.assign({}, rest.positionExperience)
          return rest
        } catch(ce) { console.warn('[SAVE] Cleanup error for player:', ce); return { name: '?', skill: 1 } }
      }
      const teamLogoUrl = state.teamLogo || ''
      const db = window.DB[state.countryId]
      let leagueName = ''
      if (db) {
        const league = db.country.leagues.find(l => l.id === state.leagueId)
        if (league) leagueName = league.name
      }
      const data = {
        id: Number(gameId),
        meta: {
          managerName: state.coach || 'Manager',
          nationality: state.staff && state.staff[0] ? state.staff[0].nationality || '' : '',
          teamName: state.team || 'Equipo',
          teamLogo: teamLogoUrl,
          leagueName: leagueName,
          countryDatabase: state.countryId || '',
          gameDate: `Jornada ${matchday}`,
          saveDate: new Date().toISOString(),
        },
        coach: state.coach, team: state.team, teamId: state.teamId, teamLogo: teamLogoUrl,
        countryId: state.countryId, leagueId: state.leagueId,
        date: new Date().toISOString(), matchday,
        players: (state.players || []).map(cleanup),
        tactic: state.tactic,
        finances: state.finances, stats: state.stats,
        leagueTeams: (state.leagueTeams || []).map(t => ({
          teamId: t.teamId, name: t.name, logo: t.logo || '', formation: t.formation, gamePlan: t.gamePlan, players: (t.players || []).map(cleanup), staff: t.staff
        })),
        currentMatchday: state.currentMatchday, totalMatchdays: state.totalMatchdays, fixtures: state.fixtures,
        allLeagueData: state.allLeagueData,
        tacticsSlots: state.tacticsSlots,
        captainId: state.captainId,
        benchIds: state.benchIds,
        reserveIds: state.reserveIds,
        staff: state.staff,
        inbox: state.inbox,
        soundEnabled: state.soundEnabled,
        filialSquad: (state.filialSquad || []).map(cleanup),
        globalPlayers: (state.globalPlayers || []).map(cleanup),
        trophies: state.trophies,
        seasonNumber: state.seasonNumber,
        loanPool: state.loanPool || [],
        boughtPlayerIds: state.boughtPlayerIds || [],
        presupuestoInicial: state.presupuestoInicial || 0,
        cup: state.cup,
        supercopa: state.supercopa,
        cupChampion: state.cupChampion,
        cupRunnerUp: state.cupRunnerUp,
        leagueChampion: state.leagueChampion,
        leagueRunnerUp: state.leagueRunnerUp,
      }
      if (idx >= 0) saves[idx] = data; else saves.unshift(data)
      var saveOk = setSaves(saves)
      if (!saveOk) return
      autoSaveTactics()
      var verify = getSaves()
      if (verify.length === 0) { console.warn('[SAVE] Verification failed - saves appear empty after write'); }
      else { console.log('[SAVE] OK - slot:', saves.indexOf(data), 'gameId:', gameId, '- total saves:', verify.length, '(' + (_storageMode || 'memory') + ')') }
    } catch(e) { console.warn('[SAVE] Error:', e) }
  },

  loadGame(id) {
    const saves = getSaves()
    const data = saves.find(s => Number(s.id) === Number(id))
    if (!data) { console.warn('[LOAD] Not found:', id); return null }
    return data
  },

  deleteGame(id) {
    let saves = getSaves()
    saves = saves.filter(s => Number(s.id) !== Number(id))
    setSaves(saves)
    showLoadMenu()
  },

  listGames() { return getSaves() },

  getEmptySlots() {
    const saves = getSaves()
    const slots = []
    for (let i = 0; i < MAX_SLOTS; i++) {
      slots.push(saves[i] || null)
    }
    return slots
  }
}

function saveGame() { window.SaveSystem.saveGame() }
function autoSave() { saveGame() }
function deleteSave(id) { window.SaveSystem.deleteGame(id) }

function autoSaveTactics() {
  if (!state.gameId) return
  const data = { formation: state.tactic.formation, gamePlan: state.tactic.gamePlan, tacticsSlots: state.tacticsSlots, captainId: state.captainId, benchIds: state.benchIds, reserveIds: state.reserveIds }
  var json = JSON.stringify(data)
  try { localStorage.setItem(TACTICS_KEY, json); return } catch(e) {}
  try { sessionStorage.setItem(TACTICS_KEY, json) } catch(e) {}
}

function loadTactics() {
  if (!state.gameId) return
  try {
    var raw = null
    try { raw = localStorage.getItem(TACTICS_KEY) } catch(e) {}
    if (!raw) { try { raw = sessionStorage.getItem(TACTICS_KEY) } catch(e) {} }
    const all = raw ? JSON.parse(raw) : {}
    const data = all[state.gameId]
      if (data) {
        state.tactic.formation = data.formation || state.tactic.formation
        state.tactic.gamePlan = data.gamePlan || state.tactic.gamePlan
        if (data.captainId) state.captainId = data.captainId
        if (!state.tacticsSlots || state.tacticsSlots.length === 0) {
        state.tacticsSlots = data.tacticsSlots || []
      }
      if (!state.benchIds || state.benchIds.length === 0) {
        state.benchIds = data.benchIds || []
      }
      if (!state.reserveIds || state.reserveIds.length === 0) {
        state.reserveIds = data.reserveIds || []
      }
    }
  } catch {}
}

/* ============ LEAGUE / FIXTURES ============ */
/* ============ MATCH ENGINE ============ */
window.MatchEngine = {
  generateCalendar(teamsList) {
    return generateFixtures(teamsList)
  },
  MAX_CHANGES: 5,
  getMaxSubs(leagueId) {
    if (!leagueId) return 9
    if (leagueId === 'lpl' || leagueId === 'lpl2' || leagueId === 'l1s' || leagueId === 'l2s' || leagueId === 'l1p' || leagueId === 'l2p') return 12
    if (leagueId.startsWith('lnfs') || leagueId.startsWith('l2b')) return 12
    return 9
  }
}

function getEffectiveMaxBench() {
  return window.MatchEngine.getMaxSubs(state.leagueId)
}

function generateFixtures(teamIds) {
  const n = teamIds.length
  const rounds = n % 2 === 0 ? n - 1 : n
  const fixtures = []
  const ids = [...teamIds]
  if (n % 2 !== 0) ids.push(null)
  const m = ids.length
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < m / 2; i++) {
      const home = (r % 2 === 0) ? ids[i] : ids[m - 1 - i]
      const away = (r % 2 === 0) ? ids[m - 1 - i] : ids[i]
      if (home !== null && away !== null)
        fixtures.push({ matchday: r + 1, home, away, homeScore: null, awayScore: null, played: false })
    }
    ids.splice(1, 0, ids.pop())
  }
  const half = rounds
  for (let r = 0; r < half; r++) {
    for (let i = 0; i < m / 2; i++) {
      const f = fixtures[r * (m / 2) + i]
      fixtures.push({ matchday: r + 1 + half, home: f.away, away: f.home, homeScore: null, awayScore: null, played: false })
    }
  }
  return fixtures
}

function getFixtureForUser(matchday) {
  return state.fixtures.find(f => f.matchday === matchday && (f.home === state.teamId || f.away === state.teamId))
}

function getTeamName(id) {
  if (id === state.teamId) return state.team
  let t = state.leagueTeams.find(x => x.teamId === id)
  if (t) return t.name
  const db = getBaseDato(id)
  if (db) return db.nombre
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      t = l.teams.find(x => x.id === id)
      if (t) return t.name
    }
  }
  return id
}

function getTeamLogo(id) {
  if (id === state.teamId) return state.teamLogo
  /* Search in window.DB (static country data) */
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const t = l.teams.find(x => x.id === id)
      if (t && t.logo) return t.logo
    }
  }
  /* Fallback: search in leagueTeams (AI teams in user's league) */
  const lt = state.leagueTeams && state.leagueTeams.find(x => x.teamId === id)
  if (lt && lt.logo) return lt.logo
  /* Fallback: search in other countries' baseDatos */
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (data && data.baseDatos) {
      const entry = data.baseDatos.find(e => e.id === id)
      if (entry && entry.logo) return entry.logo
    }
  }
  return ''
}

function getTeamRating(id) {
  if (id === state.teamId) return Math.round(avgSkill(state.players))
  const t = getBaseDato(id)
  return t ? t.rating : 70
}

function getTeamFormation(id) {
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const team = l.teams.find(x => x.id === id)
      if (team && team.formation) return team.formation
    }
  }
  return '4-3-3'
}

function getTeamObj(id) {
  if (id === state.teamId) return { name: state.team, players: state.players, teamId: state.teamId, staff: state.staff }
  const filialId = getFilialId(state.teamId)
  if (filialId && id === filialId && state.filialSquad) {
    return { name: getTeamName(id), players: state.filialSquad, teamId: id }
  }
  let t = state.leagueTeams.find(x => x.teamId === id)
  if (t) return t
  /* Check persistent teams from other leagues (allLeagueData) */
  for (const [lid, d] of Object.entries(state.allLeagueData || {})) {
    if (d.teams) {
      const found = d.teams.find(function(x) { return x.teamId === id })
      if (found) return found
    }
  }
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const team = l.teams.find(x => x.id === id)
      if (team) {
        if (getRealSquad(team.id)) {
          return { name: team.name, players: getRealSquad(team.id).filter(function(p) { return !state.boughtPlayerIds || state.boughtPlayerIds.indexOf(p.id) < 0 }).map(function(p) { return { ...p } }), teamId: team.id, staff: team.staff, formation: team.formation, gamePlan: team.gamePlan, logo: team.logo }
        }
        const rating = team.rating || getBaseDato(id)?.rating || 70
        return { name: team.name, players: generateCpuSquad(id, state.countryId, rating).filter(function(p) { return !state.boughtPlayerIds || state.boughtPlayerIds.indexOf(p.id) < 0 }), teamId: id, staff: team.staff || generateStaff(team.name, state.countryId), formation: team.formation, gamePlan: team.gamePlan, logo: team.logo }
      }
    }
  }
  return null
}

function autoSimulateOtherMatch(homeId, awayId) {
  const home = getTeamObj(homeId)
  const away = getTeamObj(awayId)
  if (!home || !away) return { homeScore: 0, awayScore: 0 }
  const homeTact = calcTacticMultiplier(home.formation, home.gamePlan)
  const awayTact = calcTacticMultiplier(away.formation, away.gamePlan)
  const homePower = getTop11Average(home.players) * getTop11EnergyFactor(home.players)
  const awayPower = getTop11Average(away.players) * getTop11EnergyFactor(away.players)
  const homeSkill = homePower * randInt(80, 120) / 100 * 1.05 * homeTact
  const awaySkill = awayPower * randInt(80, 120) / 100 * awayTact
  let homeScore = 0, awayScore = 0
  for (let m = 0; m < 40; m++) {
    if (Math.random() > 0.35) continue
    const prob = (Math.random() < 0.5 ? homeSkill : awaySkill) / 100 * 0.3
    if (Math.random() < prob) {
      if (Math.random() < 0.5) homeScore++; else awayScore++
    }
  }
  /* Track pre-match stats for AI rating computation */
  home.players.forEach(function(p) { p._preGoals = p.goals || 0; p._preYC = p.yellowCards || 0; p._preRC = p.redCards || 0 })
  away.players.forEach(function(p) { p._preGoals = p.goals || 0; p._preYC = p.yellowCards || 0; p._preRC = p.redCards || 0 })
  /* Assign stats to AI players with position experience tracking */
  assignAIStats(home.players, homeScore, home.formation, home.gamePlan)
  syncTeamStatsForTeam(home.players, homeId)
  assignAIStats(away.players, awayScore, away.formation, away.gamePlan)
  syncTeamStatsForTeam(away.players, awayId)
  /* Compute and store match ratings for AI starters and apply fatigue */
  ;[home, away].forEach(function(team, idx) {
    var teamScore = idx === 0 ? homeScore : awayScore
    var rivalScore = idx === 0 ? awayScore : homeScore
    var rivalName = idx === 0 ? getTeamName(awayId) : getTeamName(homeId)
    var gkPool = team.players.filter(function(p) { return p.position === 'POR' && !p.injury && !p._suspended })
    var fieldPlayers = team.players.filter(function(p) { return p.position !== 'POR' && !p.injury && !p._suspended })
    gkPool.sort(function(a, b) {
      var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
      var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
      return bEff - aEff
    })
    fieldPlayers.sort(function(a, b) {
      var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
      var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
      return bEff - aEff
    })
    var starters = gkPool.slice(0, 1).concat(fieldPlayers.slice(0, 10))
    var gamePlan = team.gamePlan || 'extremo'
    starters.forEach(function(p) {
      var matchGoals = (p.goals || 0) - (p._preGoals || 0)
      var matchYC = (p.yellowCards || 0) - (p._preYC || 0)
      var matchRC = (p.redCards || 0) - (p._preRC || 0)
      var winBonus = teamScore > rivalScore ? 0.5 : teamScore === rivalScore ? 0.2 : 0
      var goalBonus = (matchGoals || 0) * 1.2
      var yellowPen = matchYC > 0 ? -0.5 : 0
      var redPen = matchRC > 0 ? -2.0 : 0
      var cleanBonus = (matchYC === 0 && matchRC === 0) ? 0.2 : 0
      var csBonus = 0
      if (rivalScore === 0 && (p.position === 'POR' || p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq')) csBonus = 0.5
      var randomFactor = (Math.random() - 0.5) * 0.6
      var rating = Math.min(10, Math.max(1, 6.2 + winBonus + goalBonus + yellowPen + redPen + cleanBonus + csBonus + randomFactor))
      if (!p.matchHistory) p.matchHistory = []
      p.matchHistory.push({ matchday: state.currentMatchday, rival: rivalName, minutes: 90, rating: rating, goals: matchGoals, yellow: matchYC > 0, red: matchRC > 0 })
      if (p.matchHistory.length > 30) p.matchHistory = p.matchHistory.slice(-30)
      /* Apply fatigue */
      p.energy = Math.max(10, (p.energy != null ? p.energy : 80) - (GAME_PLANS[gamePlan]?.drain || 10))
    })
  })
  /* Clean up temp properties */
  home.players.forEach(function(p) { delete p._preGoals; delete p._preYC; delete p._preRC })
  away.players.forEach(function(p) { delete p._preGoals; delete p._preYC; delete p._preRC })
  return { homeScore, awayScore }
}

function assignAIStats(players, goals, formation, gamePlan) {
  var fieldPlayers = players.filter(function(p) { return p.position !== 'POR' })
  if (fieldPlayers.length === 0) return

  /* Track matches for starters: top GK + top 10 field players, filtering injuries/suspensions and considering fatigue */
  var gkPool = players.filter(function(p) { return p.position === 'POR' && !p.injury && !p._suspended })
  gkPool.sort(function(a, b) {
    var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
    var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
    return bEff - aEff
  })
  fieldPlayers = players.filter(function(p) { return p.position !== 'POR' && !p.injury && !p._suspended })
  fieldPlayers.sort(function(a, b) {
    var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
    var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
    return bEff - aEff
  })
  var matchPlayers = gkPool.slice(0, 1).concat(fieldPlayers.slice(0, 10))
  matchPlayers.forEach(function(p) { p.matches = (p.matches || 0) + 1 })

  /* Track position experience for AI players */
  if (formation && FORMATIONS[formation]) {
    var roles = FORMATIONS[formation].roles.filter(function(r) { return r !== 'portero' })
    var assigned = []
    var used = new Set()
    for (var ri = 0; ri < roles.length; ri++) {
      var role = roles[ri]
      var best = null, bestScore = -1
      for (var pi = 0; pi < fieldPlayers.length; pi++) {
        var p = fieldPlayers[pi]
        if (used.has(p.id)) continue
        var naturalKey = SIGLA_TO_POS[p.position] || p.position
        var mult
        if (naturalKey === role) mult = 1.0
        else if (p.otherPositions && p.otherPositions.some(function(o) { return o.pos === role })) mult = 0.85
        else mult = 0.6
        var score = p.skill * mult
        if (score > bestScore) { bestScore = score; best = p }
      }
      if (best) {
        used.add(best.id)
        assigned.push({ player: best, role: role })
      }
    }
    for (var ai = 0; ai < assigned.length; ai++) {
      var a = assigned[ai]
      var nKey = SIGLA_TO_POS[a.player.position] || a.player.position
      if (!a.player.positionExperience) a.player.positionExperience = {}
      if (nKey === a.role) {
        if (a.player.mainPct == null) a.player.mainPct = 99
        if (a.player.mainPct < 100) {
          a.player.mainPct = Math.min(100, a.player.mainPct + 0.25)
        }
      } else {
        a.player.positionExperience[a.role] = (a.player.positionExperience[a.role] || 0) + 1
        if (!a.player.otherPositions) a.player.otherPositions = []
        var existing = a.player.otherPositions.find(function(o) { return o.pos === a.role })
        var newPct = Math.min(100, a.player.positionExperience[a.role] * 3)
        if (!existing) a.player.otherPositions.push({ pos: a.role, pct: newPct })
        else existing.pct = Math.max(existing.pct, newPct)
      }
    }
  }

  var scored = 0
  while (scored < goals) {
    var scorer = pickWeightedRandom(fieldPlayers, function(p) { return getGoalWeight(p.position) })
    scorer.goals = (scorer.goals || 0) + 1
    scored++
    if (Math.random() < 0.55) {
      var candidates = fieldPlayers.filter(function(p) { return p.id !== scorer.id })
      if (candidates.length > 0) {
        var assister = candidates[Math.floor(Math.random() * candidates.length)]
        assister.assists = (assister.assists || 0) + 1
      }
    }
  }

  /* Assign cards to AI players */
  var cardGP = gamePlan || 'extremo'
  for (var ci = 0; ci < fieldPlayers.length; ci++) {
    asignarTarjetasJugador(fieldPlayers[ci], cardGP)
  }
}

function assignAIStatsSimple(players, goals) {
  assignAIStats(players, goals, null, null)
}

function syncTeamStatsForTeam(players, teamId) {
  if (!players || !teamId) return
  for (var i = 0; i < players.length; i++) {
    var p = players[i]
    if (!p.teamStats) p.teamStats = {}
    p.teamStats[teamId] = {
      matches: p.matches || 0,
      goals: p.goals || 0,
      assists: p.assists || 0,
      yellowCards: p.yellowCards || 0,
      redCards: p.redCards || 0,
    }
  }
}

function simularJornadaTodasLigas(matchday) {
  for (const [lid, data] of Object.entries(state.allLeagueData)) {
    if (lid === state.leagueId || lid === state.playoffs?.esTercera) continue
    const dayFixtures = data.fixtures.filter(f => f.matchday === matchday && !f.played)
    for (const f of dayFixtures) {
      const r = simularPartidoPorRating(f.home, f.away)
      f.homeScore = r.homeScore
      f.awayScore = r.awayScore
      f.played = true
    }
    data.currentMatchday = matchday
  }
}

function computeStandings(fixtures, leagueId) {
  const teamIds = new Set()
  for (const f of fixtures) { teamIds.add(f.home); teamIds.add(f.away) }
  const s = {}
  for (const id of teamIds) {
    const t = getLeagueTeams(leagueId).find(x => x.id === id) || {}
    s[id] = { teamId: id, name: t.name || id, logo: t.logo || '', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }
  }
  for (const f of fixtures) {
    if (!f.played) continue
    const h = s[f.home]; const a = s[f.away]
    if (!h || !a) continue
    h.played++; a.played++
    h.gf += f.homeScore; h.ga += f.awayScore
    a.gf += f.awayScore; a.ga += f.homeScore
    if (f.homeScore > f.awayScore) { h.won++; a.lost++; h.pts += 3 }
    else if (f.homeScore < f.awayScore) { a.won++; h.lost++; a.pts += 3 }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  return Object.values(s).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

function updateLeagueStandings() {
  const standings = {}
  const allIds = [state.teamId, ...state.leagueTeams.map(t => t.teamId)]
  for (const id of allIds) {
    standings[id] = { teamId: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }
  }
  for (const f of state.fixtures) {
    if (!f.played) continue
    const h = standings[f.home]
    const a = standings[f.away]
    if (!h || !a) continue
    h.played++; a.played++
    h.gf += f.homeScore; h.ga += f.awayScore
    a.gf += f.awayScore; a.ga += f.homeScore
    if (f.homeScore > f.awayScore) { h.won++; a.lost++; h.pts += 3 }
    else if (f.homeScore < f.awayScore) { a.won++; h.lost++; a.pts += 3 }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  const userStanding = standings[state.teamId]
  if (userStanding) {
    state.stats.wins = userStanding.won
    state.stats.draws = userStanding.drawn
    state.stats.losses = userStanding.lost
    state.stats.goalsFor = userStanding.gf
    state.stats.goalsAgainst = userStanding.ga
  }
  return Object.values(standings).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

function simularPartidoPorRating(homeId, awayId) {
  const homeR = getTeamRating(homeId)
  const awayR = getTeamRating(awayId)
  if (!homeR || !awayR) return { homeScore: 0, awayScore: 0 }
  const homeStrength = homeR * (0.8 + Math.random() * 0.4)
  const awayStrength = awayR * (0.8 + Math.random() * 0.4)
  const total = homeStrength + awayStrength
  const goals = 2 + Math.round(Math.random() * 4)
  const homeScore = Math.min(10, Math.round((homeStrength / total) * goals))
  const awayScore = Math.min(10, Math.round((awayStrength / total) * goals))
  /* Track individual player stats for CPU teams (use persistent teams from allLeagueData) */
  var home = null, away = null
  for (const [lid, d] of Object.entries(state.allLeagueData || {})) {
    if (!home && d.teams) home = d.teams.find(function(t) { return t.teamId === homeId })
    if (!away && d.teams) away = d.teams.find(function(t) { return t.teamId === awayId })
  }
  if (!home) home = getTeamObj(homeId)
  if (!away) away = getTeamObj(awayId)
  if (home && home.players) {
    home.players.forEach(function(p) { p._preGoals = p.goals || 0; p._preYC = p.yellowCards || 0; p._preRC = p.redCards || 0 })
    assignAIStats(home.players, homeScore, null, null)
    syncTeamStatsForTeam(home.players, homeId)
  }
  if (away && away.players) {
    away.players.forEach(function(p) { p._preGoals = p.goals || 0; p._preYC = p.yellowCards || 0; p._preRC = p.redCards || 0 })
    assignAIStats(away.players, awayScore, null, null)
    syncTeamStatsForTeam(away.players, awayId)
  }
  /* Match ratings and fatigue */
  ;[home, away].forEach(function(team, idx) {
    if (!team || !team.players) return
    var teamScore = idx === 0 ? homeScore : awayScore
    var rivalScore = idx === 0 ? awayScore : homeScore
    var rivalName = idx === 0 ? getTeamName(awayId) : getTeamName(homeId)
    var gkPool = team.players.filter(function(p) { return p.position === 'POR' && !p.injury && !p._suspended })
    var fieldPlayers = team.players.filter(function(p) { return p.position !== 'POR' && !p.injury && !p._suspended })
    gkPool.sort(function(a, b) {
      var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
      var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
      return bEff - aEff
    })
    fieldPlayers.sort(function(a, b) {
      var aEff = (a.skill || 0) * Math.min(1, (a.energy != null ? a.energy : 80) / 100)
      var bEff = (b.skill || 0) * Math.min(1, (b.energy != null ? b.energy : 80) / 100)
      return bEff - aEff
    })
    var starters = gkPool.slice(0, 1).concat(fieldPlayers.slice(0, 10))
    starters.forEach(function(p) {
      var matchGoals = (p.goals || 0) - (p._preGoals || 0)
      var matchYC = (p.yellowCards || 0) - (p._preYC || 0)
      var matchRC = (p.redCards || 0) - (p._preRC || 0)
      var winBonus = teamScore > rivalScore ? 0.5 : teamScore === rivalScore ? 0.2 : 0
      var goalBonus = (matchGoals || 0) * 1.2
      var yellowPen = matchYC > 0 ? -0.5 : 0
      var redPen = matchRC > 0 ? -2.0 : 0
      var cleanBonus = (matchYC === 0 && matchRC === 0) ? 0.2 : 0
      var csBonus = 0
      if (rivalScore === 0 && (p.position === 'POR' || p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq')) csBonus = 0.5
      var randomFactor = (Math.random() - 0.5) * 0.6
      var rating = Math.min(10, Math.max(1, 6.2 + winBonus + goalBonus + yellowPen + redPen + cleanBonus + csBonus + randomFactor))
      if (!p.matchHistory) p.matchHistory = []
      p.matchHistory.push({ matchday: state.currentMatchday, rival: rivalName, minutes: 90, rating: rating, goals: matchGoals, yellow: matchYC > 0, red: matchRC > 0 })
      if (p.matchHistory.length > 30) p.matchHistory = p.matchHistory.slice(-30)
      p.energy = Math.max(10, (p.energy != null ? p.energy : 80) - 10)
    })
  })
  if (home && home.players) home.players.forEach(function(p) { delete p._preGoals; delete p._preYC; delete p._preRC })
  if (away && away.players) away.players.forEach(function(p) { delete p._preGoals; delete p._preYC; delete p._preRC })
  return { homeScore, awayScore }
}

function computeStandings(fixtures, teamIds) {
  const s = {}
  for (const id of teamIds) {
    s[id] = { teamId: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }
  }
  for (const f of fixtures) {
    if (!f.played) continue
    const h = s[f.home]
    const a = s[f.away]
    if (!h || !a) continue
    h.played++; a.played++
    h.gf += f.homeScore; h.ga += f.awayScore
    a.gf += f.awayScore; a.ga += f.homeScore
    if (f.homeScore > f.awayScore) { h.won++; a.lost++; h.pts += 3 }
    else if (f.homeScore < f.awayScore) { a.won++; h.lost++; a.pts += 3 }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  return Object.values(s).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

function simularJornadaEnTodasLasLigas(matchday) {
  if (!state.allLeagueData) return
  for (const [lid, data] of Object.entries(state.allLeagueData)) {
    if (lid === state.leagueId) continue
    if (!data || !data.fixtures) continue
    try {
      const dayFixtures = data.fixtures.filter(f => f.matchday === matchday && !f.played)
      for (const f of dayFixtures) {
        const r = simularPartidoPorRating(f.home, f.away)
        f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
      }
      data.currentMatchday = matchday
    } catch (e) { console.warn('[SIM] Error simulating', lid, 'matchday', matchday, e) }
  }
}

function initAllLeagueData() {
  if (!state.allLeagueData) state.allLeagueData = {}
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      if (state.allLeagueData[l.id] && state.allLeagueData[l.id].teams) continue
      const teamIds = l.teams.map(t => t.id)
      if (teamIds.length < 2) continue
      try {
        var leagueTeams = l.teams.map(function(t) {
          var squad = getRealSquad(t.id)
          var _cid = l.country ? l.country.id : 'es'
          var players
          if (squad) {
            players = squad.map(function(p) { return { ...p } })
          } else {
            var rating = t.rating || (getBaseDato(t.id) ? getBaseDato(t.id).rating : null) || 70
            players = generateCpuSquad(t.id, _cid, rating)
          }
          return { teamId: t.id, name: t.name, players: players, formation: t.formation, gamePlan: t.gamePlan, logo: t.logo }
        })
        if (state.allLeagueData[l.id]) {
          state.allLeagueData[l.id].teams = leagueTeams
        } else {
          var fx = generateFixtures(teamIds)
          state.allLeagueData[l.id] = { fixtures: fx, currentMatchday: 0, totalMatchdays: Math.max(...fx.map(function(f) { return f.matchday })), teams: leagueTeams }
        }
      } catch (e) { console.warn('[INIT] Error generating data for', l.id, e) }
    }
  }
}

/* ============ CLUB VIEW ============ */
function renderSquad(players) {
  const container = document.getElementById('club-squad-content')
  if (!container) return
  if (!state.squadView) state.squadView = 'info'
  let html = `<div class="sq-toggle">
    <button class="sq-tab${state.squadView === 'info' ? ' active' : ''}" data-sq="info">Info</button>
    <button class="sq-tab${state.squadView === 'performance' ? ' active' : ''}" data-sq="performance">Rendimiento</button>
  </div>`
  container.innerHTML = html
  if (state.squadView === 'info') renderSquadInfo(players)
  else renderPerformance(players)
  container.querySelectorAll('.sq-tab').forEach(btn => {
    btn.onclick = () => {
      state.squadView = btn.dataset.sq
      renderSquad(state.players)
    }
  })
}

function renderSquadInfo(players) {
  const container = document.getElementById('club-squad-content')
  if (!container) return
  const ordered = [...players].sort((a, b) => {
    const posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    const posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })
  document.getElementById('club-player-count').textContent = `${players.length}/${MAX_SQUAD} jugadores`
  let html = ''
  const roleLabels = { headCoach: 'Entrenador', assistantCoach: '2º Entrenador', delegate: 'Delegado', goalkeeperCoach: 'Entrenador de porteros', fitnessCoach: 'Preparador físico' }
  if (state.staff && state.staff.length > 0) {
    html += `<div class="tactics-subsection-label">Staff técnico (${state.staff.length})</div>`
    state.staff.forEach(s => {
      const avatar = s.avatar || 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
      const avatarStyle = `background-image:url(${avatar});background-size:cover;background-position:center;background-color:var(--bg-surface)`
      html += `<div class="staff-card"><div class="staff-card-avatar" style="${avatarStyle}"></div><div class="staff-card-info"><div class="staff-card-name">${s.name}</div><div class="staff-card-meta">${s.nationality}</div></div><span class="staff-card-role" data-role="${s.role}">${roleLabels[s.role] || s.role}</span></div>`
    })
  }
  container.innerHTML += html
  html = `<div class="tactics-subsection-label" style="margin-top:4px">PLANTILLA (${players.length})</div>
    <div class="tp-table-header" style="padding:6px 14px">
      <span class="tp-th-pos">Pos</span>
      <span class="tp-th-name">Nombre</span>
      <span class="tp-th-age">Edad</span>
      <span class="tp-th-value">Valor</span>
      <span class="tp-th-power">Pod</span>
    </div>
    <div class="tp-list">`
  html += ordered.map(p => {
    const posColor = ((POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280')
    const valShort = formatShort(p.value || calcValue(p.skill))
    return `<div class="tp-row" data-player-id="${p.id}">
      <span class="tp-cell-pos-badge" style="background:${posColor};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''} ${p._suspended ? '<span class="player-badge badge-lt" style="font-size:8px;background:#EF4444">SUS</span>' : ''} ${p.transferListed ? '<span class="player-badge badge-lt" style="font-size:8px">TR</span>' : ''}${p.loanListed ? '<span class="player-badge badge-lc" style="font-size:8px">CED</span>' : ''}</span>
        </div>
      </div>
      <span class="tp-cell-age">${p.age || '-'}</span>
      <span class="tp-cell-market">${valShort}</span>
      <span class="tp-cell-power" style="${getPowerBadgeStyle(p.skill)}">${p.skill}</span>
    </div>`
  }).join('')
  html += '</div>'
  container.innerHTML += html
  container.querySelectorAll('.tp-row').forEach(row => {
    row.onclick = () => {
      const pid = row.dataset.playerId
      const player = state.players.find(p => p.id === pid)
      if (player) openPlayerDetail(player)
    }
  })

  updateTeamStatusBar()
}

function renderPerformance(players) {
  const container = document.getElementById('club-squad-content')
  if (!container) return
  const ordered = [...players].sort((a, b) => {
    const posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    const posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })
  let html = `<div class="tactics-subsection-label">RENDIMIENTO (${players.length})</div>
    <div class="tp-table-header" style="padding:6px 14px">
      <span class="tp-th-name">Nombre</span>
      <span class="tp-th-pos">Pos</span>
      <span style="width:28px;text-align:center">PJ</span>
      <span style="width:38px;text-align:center">⚽</span>
      <span style="width:38px;text-align:center">👟</span>
      <span style="width:30px;text-align:center">🟨</span>
      <span style="width:28px;text-align:center">🟥</span>
    </div>
    <div class="tp-list">`
  html += ordered.map(p => {
    const posColor = ((POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280')
    return `<div class="tp-row" data-player-id="${p.id}">
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''}</span>
        </div>
      </div>
      <span class="tp-cell-pos-badge" style="background:${posColor};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">${p.matches || 0}</span>
      <span style="width:38px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">${p.goals || 0}</span>
      <span style="width:38px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">${p.assists || 0}</span>
      <span style="width:30px;text-align:center;font-size:12px;font-weight:600;color:#F59E0B">${p.yellowCards || 0}</span>
      <span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:#EF4444">${p.redCards || 0}</span>
    </div>`
  }).join('')
  html += '</div>'
  container.innerHTML += html
  container.querySelectorAll('.tp-row').forEach(row => {
    row.onclick = () => {
      const pid = row.dataset.playerId
      const player = state.players.find(p => p.id === pid)
      if (player) openPlayerDetail(player)
    }
  })
}

/* ============ TACTICS ============ */
const formationRoles = {
  '4-3-3': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_def', label: 'MCD' }, { role: 'mediocentro', label: 'MC' }, { role: 'extremo_der', label: 'ED' }, { role: 'delantero', label: 'DC' }, { role: 'extremo_izq', label: 'EI' }],
  '4-4-2': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_izq', label: 'MI' }, { role: 'delantero', label: 'DC' }, { role: 'delantero', label: 'DC' }],
  '4-2-3-1': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_def', label: 'MCD' }, { role: 'medio_def', label: 'MCD' }, { role: 'extremo_der', label: 'ED' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'extremo_izq', label: 'EI' }, { role: 'delantero', label: 'DC' }],
  '3-5-2': [{ role: 'portero', label: 'POR' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'carrilero_der', label: 'CAD' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'medio_izq', label: 'MI' }, { role: 'delantero', label: 'DC' }, { role: 'delantero', label: 'DC' }],
  '4-1-4-1': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_def', label: 'MCD' }, { role: 'extremo_der', label: 'ED' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'extremo_izq', label: 'EI' }, { role: 'delantero', label: 'DC' }],
}

function renderHome() {
  const container = document.getElementById('home-content')
  if (!container) return
  const standings = updateLeagueStandings()
  const userPos = standings.findIndex(s => s.teamId === state.teamId) + 1
  const isPlayoffs = state.playoffs && state.playoffs.fixtures && state.playoffs.fixtures.length > 0

  /* Detect cup/supercopa fixture pending */
  var cupNext = null
  var cupLabel = ''
  if (state.cup && !isPlayoffs) {
    cupNext = state.cup.allFixtures.find(function(f) { return !f.played && (f.home === state.teamId || f.away === state.teamId) })
    if (cupNext) cupLabel = '\ud83c\udfc6 Copa del Rey - ' + cupNext.label
  }
  if (!cupNext && state.supercopa && !isPlayoffs) {
    cupNext = state.supercopa.fixtures.find(function(f) { return !f.played && (f.home === state.teamId || f.away === state.teamId) })
    if (cupNext) cupLabel = '\ud83c\udfc6 Supercopa - ' + cupNext.label
    if (!cupNext && state.supercopa.final && !state.supercopa.final.played && (state.supercopa.final.home === state.teamId || state.supercopa.final.away === state.teamId)) { cupNext = state.supercopa.final; cupLabel = '\ud83c\udfc6 Supercopa - Final' }
  }
  var cupActive = cupNext !== null

  /* Show cup match first if pending, otherwise league match */
  const fixture = isPlayoffs
    ? state.playoffs.fixtures.find(function(f) { return !f.played && (f.home === state.teamId || f.away === state.teamId) })
    : (cupActive ? cupNext : state.fixtures.find(function(f) { return f.played === false && (f.home === state.teamId || f.away === state.teamId) }))
  const rivalId = fixture ? (fixture.home === state.teamId ? fixture.away : fixture.home) : null
  const rivalName = rivalId ? getTeamName(rivalId) : '—'
  const isHome = fixture ? fixture.home === state.teamId : false
  const rivalPos = rivalId ? (standings.findIndex(s => s.teamId === rivalId) + 1) : '—'
  const rivalLogo = rivalId ? getTeamLogo(rivalId) : ''
  const nextMatchday = fixture ? fixture.matchday : state.currentMatchday
  const last5 = state.fixtures
    .filter(f => f.played && (f.home === state.teamId || f.away === state.teamId))
    .sort((a, b) => b.matchday - a.matchday)
    .slice(0, 5)
    .map(f => {
      const us = f.home === state.teamId ? f.homeScore : f.awayScore
      const them = f.home === state.teamId ? f.awayScore : f.homeScore
      return us > them ? 'V' : us < them ? 'D' : 'E'
    })
  const injured = state.players.filter(p => p.injury)
  var roundNames = { QF: 'Cuartos de final', SF: 'Semifinal', F: 'Final' }

  console.log('[RENDER] renderHome ejecutada, fixture:', !!fixture, 'cupActive:', cupActive)
  /* Single match card — shows cup info line if it is a cup week */
  var matchHtml = ''
  if (fixture) {
    var mIsHome = fixture.home === state.teamId
    var mRivalId = mIsHome ? fixture.away : fixture.home
    var mRivalName = getTeamName(mRivalId)
    var mRivalLogo = getTeamLogo(mRivalId)
    var mRivalPos = standings.findIndex(function(s) { return s.teamId === mRivalId }) + 1
    var cupInfo = (cupActive && cupNext === fixture) ? '<div class="home-cup-indicator">\ud83c\udfc6 ' + cupLabel + ' \ud83d\udfe3 Mi\u00e9rcoles</div>' : ''
    matchHtml = '<div class="home-card home-match' + (cupActive && cupNext === fixture ? ' home-cup-card' : '') + '">' +
      '<div class="home-section-title">' + (isPlayoffs ? (roundNames[state.playoffs.round] || 'Eliminatoria') : 'Pr\u00f3ximo encuentro') + '</div>' +
      cupInfo +
      '<div class="home-match-teams">' +
        '<div class="home-team-side">' +
          '<img class="home-team-logo" src="' + (state.teamLogo || '') + '" alt="">' +
          '<div class="home-team-label">' + state.team + '</div>' +
          '<div class="home-team-pos">' + userPos + '\u00ba \u00b7 ' + getTeamFormation(state.teamId) + '</div>' +
        '</div>' +
        '<div class="home-vs">VS</div>' +
        '<div class="home-team-side" style="cursor:pointer" onclick="showTeamInfo(\'' + mRivalId + '\')">' +
          '<img class="home-team-logo" src="' + mRivalLogo + '" alt="">' +
          '<div class="home-team-label">' + mRivalName + '</div>' +
          '<div class="home-team-pos">' + mRivalPos + '\u00ba \u00b7 ' + getTeamFormation(mRivalId) + '</div>' +
        '</div>' +
      '</div>' +
      (isPlayoffs ? '<div class="home-matchday-label">Eliminatoria</div>' : '<div class="home-matchday-label">Jornada ' + (fixture.matchday || state.currentMatchday) + ' de ' + state.totalMatchdays + ' \u00b7 ' + (fixture.horario || '') + '</div>') +
      '<div class="home-match-location">' + (mIsHome ? '\ud83c\udfe1 Local' : '\u2708\ufe0f Visitante') + '</div>' +
      '<button class="btn-home-simulate" id="btn-home-simulate"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>Simular Partido</button>' +
    '</div>'
  }

  container.innerHTML = '<div class="home-card">' +
    '<div class="home-avatar-wrap">' + (state.teamLogo ? '<img class="home-logo" src="' + state.teamLogo + '" alt="">' : '') + '</div>' +
    '<div class="home-team-name">' + state.team + '</div>' +
    '<div class="home-stats">' +
      '<div class="home-stat"><span class="home-stat-icon">\ud83c\udfc6</span><span>' + userPos + '\u00ba de ' + standings.length + '</span></div>' +
      '<div class="home-stat"><span class="home-stat-icon">\ud83d\udcb0</span><span>' + formatMoney(state.finances.balance) + '</span></div>' +
      '<div class="home-stat"><span class="home-stat-icon">\ud83d\udc65</span><span>' + state.players.length + '/' + MAX_SQUAD + '</span></div>' +
      '<div class="home-stat"><span class="home-stat-icon">\ud83d\udcca</span><span>' + state.stats.wins + 'V ' + state.stats.draws + 'E ' + state.stats.losses + 'D</span></div>' +
    '</div>' +
    '<div class="home-form-row">' +
      (last5.length > 0 ? last5.map(function(r) { return '<span class="home-form-dot forma-' + (r === 'V' ? 'v' : r === 'E' ? 'e' : 'd') + '"></span>' }).join('') : '<span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span>') +
    '</div>' +
    '<div class="home-injury-text">\ud83d\ude91 Bajas para hoy: ' + (injured.length > 0 ? injured.map(function(p) { return p.name }).join(', ') : 'Ninguna') + '</div>' +
  '</div>' +
  (matchHtml || '<div class="home-card home-match"><div class="home-section-title">\ud83c\udfc6 Temporada completada</div></div>')

  var simBtn = document.getElementById('btn-home-simulate')
  if (simBtn) simBtn.onclick = function() {
    console.log('[SIM] Click - fixture:', !!fixture, 'rivalId:', rivalId, 'cupActive:', cupActive)
    if (!rivalId) { alert('\u26a0\ufe0f Error: No se encontr\u00f3 rival. Revisa la alineaci\u00f3n o los datos del equipo.'); return }
    if (cupActive && cupNext === fixture) {
      simularPartidoCopa(fixture, rivalId, cupLabel.indexOf('Supercopa') >= 0)
    } else {
      simularPartidoRapido(fixture, rivalId)
    }
  }
  console.log('[RENDER] onclick configurado para boton simulate - simBtn:', !!simBtn, 'rivalId:', rivalId)
}
function renderClub() {
  const titleEl = document.getElementById('club-title')
  if (titleEl) titleEl.textContent = state.team
  const logoEl = document.getElementById('club-logo')
  if (logoEl) {
    logoEl.innerHTML = state.teamLogo ? `<img class="team-logo" src="${state.teamLogo}" alt="${state.team}">` : ''
  }
  /* Team stats panel */
  const displayPower = getTop11Average(state.players)
  const reputation = displayPower < 42 ? 1 : displayPower < 58 ? 2 : displayPower < 72 ? 3 : displayPower < 85 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const countryFlag = window.DB[state.countryId]?.country.flag || ''
  const totalVal = state.players.reduce((s, p) => s + (p.value || 0), 0)
  document.getElementById('club-team-info').innerHTML = `
    <div class="tp-stats" style="margin-bottom:6px">
      <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">\u2014</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Reputación</span><span class="tp-stat-stars">${stars}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">País</span><span class="tp-stat-flag">${countryFlag}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
    </div>
    <div class="tp-stats" style="margin-bottom:12px">
      <div class="tp-stat"><span class="tp-stat-label">Formación</span><span class="tp-stat-value">${state.tactic.formation || '\u2014'}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Presión</span><span class="tp-stat-value">${(GAME_PLANS[state.tactic.gamePlan] || {}).label || state.tactic.gamePlan || '\u2014'}</span></div>
      <div class="tp-stat" style="flex:2"></div>
    </div>`

  document.getElementById('club-squad-content').classList.add('hidden')
  document.getElementById('club-tactics-content').classList.add('hidden')
  document.getElementById('club-inbox-content').classList.add('hidden')
  document.getElementById('club-calendar-content').classList.add('hidden')
  document.getElementById('club-palmares-content').classList.add('hidden')
  document.querySelectorAll('#view-club .sub-tab').forEach(b => b.classList.toggle('active', b.dataset.subtab === state.clubSubTab))
  if (state.clubSubTab === 'squad') {
    document.getElementById('club-squad-content').classList.remove('hidden')
    renderSquad(state.players)
  } else if (state.clubSubTab === 'tactics') {
    document.getElementById('club-tactics-content').classList.remove('hidden')
    renderTactics(state.tactic)
  } else if (state.clubSubTab === 'inbox') {
    document.getElementById('club-inbox-content').classList.remove('hidden')
    hideInboxDetail()
    renderInbox()
  } else if (state.clubSubTab === 'calendar') {
    document.getElementById('club-calendar-content').classList.remove('hidden')
    renderCalendar()
  } else if (state.clubSubTab === 'palmares') {
    document.getElementById('club-palmares-content').classList.remove('hidden')
    renderPalmares()
  }
}

function renderBenchCard(player, extraClass) {
  const pos = POSITIONS[player.position]
  const avatarStyle = `background-image:url(${player.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
  return `<div class="bench-card ${extraClass}" data-player-id="${player.id}">
    <div class="bc-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
    <div class="bc-info">
      <div class="bc-name-row">
        <span class="bc-name">${player.name}</span>
        <span class="bc-pos" style="background:${pos.color}">${pos.label}</span>
      </div>
      <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
    </div>
  </div>`
}

/* ============ TÁCTICA + CONVOCATORIA ============ */
function getEneColor(energy) {
  if (energy > 70) return '#10B981'
  if (energy >= 50) return '#F59E0B'
  return '#EF4444'
}

const POS_MULTIPLIER = {
  portero:         { portero: 1.0, lateral_der: 0.2, lateral_izq: 0.2, carrilero_der: 0.2, carrilero_izq: 0.2, defensa_central: 0.3, medio_def: 0.2, mediocentro: 0.2, medio_ofensivo: 0.2, medio_der: 0.2, medio_izq: 0.2, extremo_der: 0.1, extremo_izq: 0.1, delantero: 0.2 },
  lateral_der:     { portero: 0.2, lateral_der: 1.0, lateral_izq: 0.5, carrilero_der: 0.7, carrilero_izq: 0.4, defensa_central: 0.6, medio_def: 0.4, mediocentro: 0.3, medio_ofensivo: 0.3, medio_der: 0.5, medio_izq: 0.3, extremo_der: 0.4, extremo_izq: 0.3, delantero: 0.3 },
  lateral_izq:     { portero: 0.2, lateral_der: 0.5, lateral_izq: 1.0, carrilero_der: 0.4, carrilero_izq: 0.7, defensa_central: 0.6, medio_def: 0.4, mediocentro: 0.3, medio_ofensivo: 0.3, medio_der: 0.3, medio_izq: 0.5, extremo_der: 0.3, extremo_izq: 0.4, delantero: 0.3 },
  carrilero_der:   { portero: 0.1, lateral_der: 0.6, lateral_izq: 0.3, carrilero_der: 1.0, carrilero_izq: 0.3, defensa_central: 0.4, medio_def: 0.4, mediocentro: 0.4, medio_ofensivo: 0.4, medio_der: 0.6, medio_izq: 0.3, extremo_der: 0.5, extremo_izq: 0.3, delantero: 0.3 },
  carrilero_izq:   { portero: 0.1, lateral_der: 0.3, lateral_izq: 0.6, carrilero_der: 0.3, carrilero_izq: 1.0, defensa_central: 0.4, medio_def: 0.4, mediocentro: 0.4, medio_ofensivo: 0.4, medio_der: 0.3, medio_izq: 0.6, extremo_der: 0.3, extremo_izq: 0.5, delantero: 0.3 },
  defensa_central: { portero: 0.3, lateral_der: 0.5, lateral_izq: 0.5, carrilero_der: 0.3, carrilero_izq: 0.3, defensa_central: 1.0, medio_def: 0.5, mediocentro: 0.3, medio_ofensivo: 0.2, medio_der: 0.3, medio_izq: 0.3, extremo_der: 0.2, extremo_izq: 0.2, delantero: 0.2 },
  medio_def:       { portero: 0.2, lateral_der: 0.4, lateral_izq: 0.4, carrilero_der: 0.4, carrilero_izq: 0.4, defensa_central: 0.5, medio_def: 1.0, mediocentro: 0.7, medio_ofensivo: 0.5, medio_der: 0.5, medio_izq: 0.5, extremo_der: 0.3, extremo_izq: 0.3, delantero: 0.4 },
  mediocentro:     { portero: 0.1, lateral_der: 0.3, lateral_izq: 0.3, carrilero_der: 0.3, carrilero_izq: 0.3, defensa_central: 0.3, medio_def: 0.6, mediocentro: 1.0, medio_ofensivo: 0.7, medio_der: 0.6, medio_izq: 0.6, extremo_der: 0.4, extremo_izq: 0.4, delantero: 0.5 },
  medio_ofensivo:  { portero: 0.1, lateral_der: 0.3, lateral_izq: 0.3, carrilero_der: 0.3, carrilero_izq: 0.3, defensa_central: 0.2, medio_def: 0.4, mediocentro: 0.6, medio_ofensivo: 1.0, medio_der: 0.5, medio_izq: 0.5, extremo_der: 0.6, extremo_izq: 0.6, delantero: 0.6 },
  medio_der:       { portero: 0.1, lateral_der: 0.5, lateral_izq: 0.3, carrilero_der: 0.5, carrilero_izq: 0.3, defensa_central: 0.3, medio_def: 0.4, mediocentro: 0.6, medio_ofensivo: 0.5, medio_der: 1.0, medio_izq: 0.4, extremo_der: 0.6, extremo_izq: 0.3, delantero: 0.4 },
  medio_izq:       { portero: 0.1, lateral_der: 0.3, lateral_izq: 0.5, carrilero_der: 0.3, carrilero_izq: 0.5, defensa_central: 0.3, medio_def: 0.4, mediocentro: 0.6, medio_ofensivo: 0.5, medio_der: 0.4, medio_izq: 1.0, extremo_der: 0.3, extremo_izq: 0.6, delantero: 0.4 },
  extremo_der:     { portero: 0.1, lateral_der: 0.4, lateral_izq: 0.2, carrilero_der: 0.4, carrilero_izq: 0.2, defensa_central: 0.2, medio_def: 0.2, mediocentro: 0.3, medio_ofensivo: 0.5, medio_der: 0.5, medio_izq: 0.2, extremo_der: 1.0, extremo_izq: 0.3, delantero: 0.6 },
  extremo_izq:     { portero: 0.1, lateral_der: 0.2, lateral_izq: 0.4, carrilero_der: 0.2, carrilero_izq: 0.4, defensa_central: 0.2, medio_def: 0.2, mediocentro: 0.3, medio_ofensivo: 0.5, medio_der: 0.2, medio_izq: 0.5, extremo_der: 0.3, extremo_izq: 1.0, delantero: 0.6 },
  delantero:       { portero: 0.1, lateral_der: 0.2, lateral_izq: 0.2, carrilero_der: 0.2, carrilero_izq: 0.2, defensa_central: 0.2, medio_def: 0.3, mediocentro: 0.4, medio_ofensivo: 0.5, medio_der: 0.3, medio_izq: 0.3, extremo_der: 0.5, extremo_izq: 0.5, delantero: 1.0 },
}

const SLOT_ROLES = {
  '4-3-3': FORMATIONS['4-3-3'].roles,
  '4-4-2': FORMATIONS['4-4-2'].roles,
  '4-2-3-1': FORMATIONS['4-2-3-1'].roles,
  '3-5-2': FORMATIONS['3-5-2'].roles,
  '4-1-4-1': FORMATIONS['4-1-4-1'].roles,
  '3-4-3': FORMATIONS['3-4-3'].roles,
  '3-4-2-1': FORMATIONS['3-4-2-1'].roles,
}

function getPositionMultiplier(naturalPosition, assignedRole) {
  const row = POS_MULTIPLIER[naturalPosition]
  return row ? row[assignedRole] || 0.3 : 1
}

function renderTactics(tactic) {
  var container = document.getElementById('club-tactics-content')
  if (!container) return

  var roles = SLOT_ROLES[tactic.formation]
  if (!state.tacticsSlots || state.tacticsSlots.length !== roles.length) {
    state.tacticsSlots = roles.map(function() { return null })
  } else {
    var oldRoles = SLOT_ROLES[tactic.formation] || roles
    if (oldRoles.length !== roles.length) {
      state.tacticsSlots = roles.map(function(r) {
        var idx = oldRoles.indexOf(r)
        return idx >= 0 ? state.tacticsSlots[idx] : null
      })
    }
  }

  var slots = state.tacticsSlots
  var assignedIds = slots.filter(Boolean)
  var available = state.players.filter(function(p) { return !assignedIds.includes(p.id) })

  state.benchIds = state.benchIds.filter(function(id) { return state.players.find(function(p) { return p.id === id }) })
  var maxBench = getEffectiveMaxBench()
  if (state.benchIds.length > maxBench) state.benchIds = state.benchIds.slice(0, maxBench)
  var bench = state.benchIds.map(function(id) { return state.players.find(function(p) { return p.id === id }) }).filter(Boolean)
  var restPool = available.filter(function(p) { return !state.benchIds.includes(p.id) })
  /* Auto-fill empty bench slots with available players */
  while (state.benchIds.length < maxBench && restPool.length > 0) {
    var fillPlayer = restPool.shift()
    state.benchIds.push(fillPlayer.id)
    bench.push(fillPlayer)
  }
  var rest = restPool

  var complete = slots.every(Boolean)
  var hasGK = slots.some(function(id) { if (!id) return false; var pp = state.players.find(function(x) { return x.id === id }); return pp && pp.position === 'portero' })
  var enoughAvailable = available.length >= 11

  function renderPlayerCard(player, dataset, dataVal, posColorOverride, roleAbbrOverride, effectiveSkill) {
    var posKey = SIGLA_TO_POS[player.position] || player.position
    var pos = POSITIONS[posKey]
    if (!pos) { pos = POS_ABBR[posKey] ? { label: POS_ABBR[posKey], color: '#6B7280' } : { label: '?', color: '#6B7280' } }
    var posColor = posColorOverride || pos.color
    var posAbbr = roleAbbrOverride || (POS_ABBR[posKey] || player.position)
    var cls = player.injury ? ' unavailable' : ''
    var avatarStyle = 'background-image:url(' + (player.avatar || NOPHOTO) + ');background-size:cover;background-position:center;background-color:var(--bg-card)'
    var eneColor = player.energy >= 60 ? '#22C55E' : player.energy >= 30 ? '#F59E0B' : '#EF4444'
    var displaySkill = effectiveSkill || player.skill
    var isOutOfPosition = effectiveSkill && effectiveSkill < player.skill
    return '<div class="tp-player-card' + cls + '" data-' + dataset + '="' + dataVal + '" style="--pos-color:' + posColor + '">' +
      '<div class="tp-card-top"><span style="display:flex;align-items:center;gap:2px">' + (isOutOfPosition ? '<span style="font-size:9px">\u26a0\ufe0f</span>' : '') + '<span class="tp-stat-skill" style="' + getPowerBadgeStyle(displaySkill) + '">' + displaySkill + '</span></span><span class="tp-card-pos" style="color:' + posColor + '">' + posAbbr + '</span></div>' +
      '<div class="tp-card-avatar" style="position:relative;' + avatarStyle + '">' + (player._suspended ? '<span class="tp-card-susp-overlay"><span class="tp-susp-card">' + player._suspended + '</span></span>' : '') + '</div>' +
      '<span class="tp-card-name">' + (player.injury ? '\ud83d\udeb9 ' : '') + player.name.split(' ').slice(-1)[0] + '</span>' +
      '<div class="tp-energy-bar"><div class="tp-energy-fill" style="width:' + player.energy + '%;background:' + eneColor + '"></div></div>' +
      (player.injury ? '<div class="tp-injury-badge">\ud83d\udfe1 ' + player.injury.remaining + 'j</div>' : '') +
    '</div>'
  }

  function emptyCard(dataset, dataVal, label) {
    return '<div class="tp-player-card tp-empty" data-' + dataset + '="' + dataVal + '">' +
      '<div class="tp-card-top"><span class="tp-stat-skill" style="opacity:0">00</span><span class="tp-card-pos" style="color:rgba(255,255,255,0.4)">' + label + '</span></div>' +
      '<div class="tp-card-avatar tp-empty-avatar">+</div>' +
      '<span class="tp-card-name" style="color:rgba(255,255,255,0.5)"></span>' +
    '</div>'
  }

  try {
    var PITCH_POS = {
      'POR': [50, 85], 'DFC': [50, 68], 'LD': [80, 68], 'LI': [20, 68],
      'CAD': [80, 52], 'CAI': [20, 52], 'MCD': [50, 52],
      'MD': [80, 38], 'MI': [20, 38], 'MC': [50, 38], 'MCO': [50, 22],
      'ED': [80, 15], 'EI': [20, 15], 'DC': [50, 15],
    }

    var html = ''

    /* 1. Top cards */
    var captainId = state.captainId || slots[0]
    var captain = state.players.find(function(p) { return p.id === captainId })
    var gpLabel = GAME_PLANS[tactic.gamePlan] ? GAME_PLANS[tactic.gamePlan].label : tactic.gamePlan
    html += '<div class="tc-top-cards">' +
      '<div class="tc-card" id="tc-captain-btn" style="cursor:pointer"><span class="tc-card-label">Capit\u00e1n</span><span class="tc-card-value">' + (captain ? captain.name.split(' ').slice(-1)[0] : '---') + '</span></div>' +
      '<div class="tc-card" id="tc-pressure-btn" style="cursor:pointer"><span class="tc-card-label">Presi\u00f3n</span><span class="tc-card-value tc-accent">' + gpLabel + '</span></div>' +
      '<div class="tc-card" id="tc-formation-btn" style="cursor:pointer"><span class="tc-card-label">Formaci\u00f3n</span><span class="tc-card-value tc-accent">' + tactic.formation + '</span></div>' +
    '</div>'

    /* 2. Pitch */
    html += '<div class="tc-pitch-wrap"><div class="tc-pitch">' +
      '<div class="tc-pitch-bg"></div>'

    for (var i = 0; i < roles.length; i++) {
      var role = roles[i]
      var abbr = POS_ABBR[role] || role.substring(0, 3).toUpperCase()
      var posData = PITCH_POS[abbr] || [50, 50]
      var left = posData[0]
      var bottom = posData[1]
      /* Offset overlapping players with same abbreviation */
      var sameCount = 0
      var totalAbbr = 0
      for (var k = 0; k < roles.length; k++) {
        var rk = roles[k]
        var ak = POS_ABBR[rk] || rk.substring(0, 3).toUpperCase()
        if (ak === abbr) totalAbbr++
        if (k < i && ak === abbr) sameCount++
      }
      if (totalAbbr > 1) {
        var spread = 24
        var offset = spread * (sameCount - (totalAbbr - 1) / 2)
        left = Math.max(5, Math.min(95, left + offset))
      }
      /* Manual positioning for 4-3-3 MCs */
      if (role === 'mediocentro' && sameCount === 0 && tactic.formation === '4-3-3') { left = 27; bottom = 38 }
      if (role === 'mediocentro' && sameCount === 1 && tactic.formation === '4-3-3') { left = 73; bottom = 38 }
      if (role === 'mediocentro' && sameCount === 0 && tactic.formation === '4-4-2') { left = 40; bottom = 38 }
      if (role === 'mediocentro' && sameCount === 1 && tactic.formation === '4-4-2') { left = 60; bottom = 38 }
      if (role === 'medio_izq' && tactic.formation === '4-4-2') { left = 18; bottom = 38 }
      if (role === 'medio_der' && tactic.formation === '4-4-2') { left = 82; bottom = 38 }
      if (role === 'mediocentro' && sameCount === 0 && tactic.formation === '4-1-4-1') { left = 36; bottom = 38 }
      if (role === 'mediocentro' && sameCount === 1 && tactic.formation === '4-1-4-1') { left = 64; bottom = 38 }
      if (role === 'medio_izq' && tactic.formation === '4-1-4-1') { left = 16; bottom = 38 }
      if (role === 'medio_der' && tactic.formation === '4-1-4-1') { left = 84; bottom = 38 }
      if (role === 'medio_def') { bottom = 50 }
      if (role === 'medio_ofensivo' && tactic.formation === '4-2-3-1') { bottom = 31 }
      if (role === 'medio_ofensivo' && sameCount === 0 && tactic.formation === '3-4-2-1') { left = 35; bottom = 22 }
      if (role === 'medio_ofensivo' && sameCount === 1 && tactic.formation === '3-4-2-1') { left = 65; bottom = 22 }
      if (role === 'carrilero_izq' && tactic.formation === '3-4-2-1') { left = 12 }
      if (role === 'carrilero_der' && tactic.formation === '3-4-2-1') { left = 88 }
      if (role === 'carrilero_izq' && tactic.formation === '3-4-3') { left = 12 }
      if (role === 'carrilero_der' && tactic.formation === '3-4-3') { left = 88 }
      if (role === 'carrilero_izq' && tactic.formation === '3-5-2') { left = 12 }
      if (role === 'carrilero_der' && tactic.formation === '3-5-2') { left = 88 }
      if (role === 'delantero') { bottom = 12 }
      if (role === 'portero') { bottom = 87 }
      if (role === 'lateral_izq') { left = 17 }
      if (role === 'lateral_der') { left = 83 }
      var pid = slots[i]
      var player = pid ? state.players.find(function(x) { return x.id === pid }) : null

      if (player) {
        var effSkill = calcularMediaEnPosicion(player, role)
        html += '<div class="tp-pitch-player" style="left:' + left + '%;top:' + bottom + '%">' +
          renderPlayerCard(player, 'slot', String(i), (POSITIONS[role] || {}).color, POS_ABBR[role] || role, effSkill) +
        '</div>'
      } else {
        html += '<div class="tp-pitch-player" style="left:' + left + '%;top:' + bottom + '%">' +
          emptyCard('slot', String(i), abbr) +
        '</div>'
      }
    }
    html += '</div></div>'

    /* 3. Subs section */
    html += '<div class="tc-section-label">SUSTITUTOS (' + bench.length + '/' + maxBench + ')</div>' +
      '<div class="tc-subs-grid">'
    for (var i = 0; i < maxBench; i++) {
      var pid = state.benchIds[i]
      var player = pid ? state.players.find(function(p) { return p.id === pid }) : null
      if (player) {
        html += renderPlayerCard(player, 'bench', String(i))
      } else {
        html += emptyCard('bench', String(i), '\u002b')
      }
    }
    html += '</div>'

    /* 4. Reserves */
    html += '<div class="tc-section-label">RESERVAS</div>' +
      '<div class="tc-reserves-scroll">'
    for (var i = 0; i < rest.length; i++) {
      html += renderPlayerCard(rest[i], 'reserve', rest[i].id)
    }
    if (rest.length === 0) {
      html += '<div style="padding:12px;text-align:center;color:var(--text-muted);font-size:12px;width:100%">Todos convocados</div>'
    }
    html += '</div>'

    container.innerHTML = html

    /* Event listeners */
    container.querySelectorAll('.tp-player-card').forEach(function(card) {
      var pressTimer = null
      var isLongPress = false

      card.addEventListener('mousedown', function() {
        isLongPress = false
        pressTimer = setTimeout(function() {
          isLongPress = true
          var pid = getPlayerIdFromSlot(card)
          var player = state.players.find(function(p) { return p.id === pid })
          if (player && !player.injury) openPlayerDetail(player)
        }, 500)
      })
      card.addEventListener('mouseup', function() { clearTimeout(pressTimer) })
      card.addEventListener('mouseleave', function() { clearTimeout(pressTimer) })
      card.addEventListener('touchstart', function() {
        isLongPress = false
        pressTimer = setTimeout(function() {
          isLongPress = true
          var pid = getPlayerIdFromSlot(card)
          var player = state.players.find(function(p) { return p.id === pid })
          if (player && !player.injury) openPlayerDetail(player)
        }, 500)
      })
      card.addEventListener('touchend', function() { clearTimeout(pressTimer) })
      card.addEventListener('touchmove', function() { clearTimeout(pressTimer) })
      card.addEventListener('click', function(e) {
        if (isLongPress) { e.stopPropagation(); return }
        handleSlotClick(card, tactic)
      })
    })
    container.onclick = function(e) {
      if (e.target.closest('.tp-player-card') || e.target.closest('.tp-empty')) return
      state.selectedPlayerId = null
      container.querySelectorAll('.tp-player-card.selected').forEach(function(s) { s.classList.remove('selected') })
    }

    if (complete && hasGK && enoughAvailable) {
      state.matchdaySquad = [].concat(slots).concat(state.benchIds).concat(state.reserveIds)
      state.startingFive = slots
      state.subsBench = [].concat(state.benchIds).concat(state.reserveIds)
      state.convocatoriaValidada = true
    } else {
      state.convocatoriaValidada = false
    }

    if (state.selectedPlayerId) {
      container.querySelectorAll('.tp-player-card').forEach(function(el) {
        var slotIdx = el.dataset.slot
        var benchIdx = el.dataset.bench
        var reservePid = el.dataset.reserve
        var pid = null
        if (slotIdx !== undefined) pid = state.tacticsSlots[parseInt(slotIdx)]
        else if (benchIdx !== undefined) pid = state.benchIds[parseInt(benchIdx)]
        else if (reservePid !== undefined) pid = reservePid
        if (pid && pid === state.selectedPlayerId) el.classList.add('selected')
      })
    }

    document.getElementById('tc-pressure-btn')?.addEventListener('click', showPressureModal)
    document.getElementById('tc-captain-btn')?.addEventListener('click', showCaptainModal)
    document.getElementById('tc-formation-btn')?.addEventListener('click', showFormationModal)
    autoSaveTactics()
  } catch (e) {
    console.warn('[TACTICS] Error:', e)
    container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">Error: ' + (e.message || '') + '</div>'
  }
}function autoAssignSquad() {
  const roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['4-3-3']
  const assigned = []
  const allPlayers = state.players.filter(p => !p.injury)

  /* Once inicial: posici\u00f3n exacta primero, luego mejor ajuste */
  state.tacticsSlots = roles.map(function(role) {
    var candidates = allPlayers.filter(function(p) { return !assigned.includes(p.id) && !p._suspended })
    candidates = candidates.filter(function(p) {
      var pKey = SIGLA_TO_POS[p.position] || p.position
      if (role === 'portero') return pKey === 'portero'
      return pKey !== 'portero'
    })
    var exact = candidates.filter(function(p) { return (SIGLA_TO_POS[p.position] || p.position) === role })
    var pool = exact.length > 0 ? exact : candidates
    var best = pool.sort(function(a, b) {
      var multA = getPositionMultiplier(a.position, role)
      var multB = getPositionMultiplier(b.position, role)
      if (multB !== multA) return multB - multA
      return b.skill - a.skill
    })[0]
    if (best) assigned.push(best.id)
    return best ? best.id : null
  })

  /* Banquillo: por grupos posicionales */
  var maxBench = getEffectiveMaxBench()
  var bench = []
  var benchRoleGroups = {
    portero: ['portero'],
    defensas: ['defensa_central', 'lateral_izq', 'lateral_der', 'carrilero_der', 'carrilero_izq'],
    medios: ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_der', 'medio_izq'],
    delanteros: ['delantero', 'extremo_der', 'extremo_izq'],
  }
  var benchOrder = ['portero', 'defensas', 'medios', 'delanteros']
  var benchCounts = { portero: 2, defensas: 4, medios: 3, delanteros: 3 }

  for (var g = 0; g < benchOrder.length && bench.length < maxBench; g++) {
    var group = benchOrder[g]
    var groupRoles = benchRoleGroups[group]
    var groupPlayers = allPlayers.filter(function(p) {
      return !assigned.includes(p.id) && !bench.includes(p.id) && groupRoles.indexOf(SIGLA_TO_POS[p.position] || p.position) >= 0
    }).sort(function(a, b) { return b.skill - a.skill })
    var needed = benchCounts[group]
    for (var j = 0; j < Math.min(needed, groupPlayers.length) && bench.length < maxBench; j++) {
      bench.push(groupPlayers[j].id)
    }
  }

  /* Rellenar slots vac\u00edos con mejores skills */
  var rest = allPlayers.filter(function(p) { return !assigned.includes(p.id) && !bench.includes(p.id) })
    .sort(function(a, b) { return b.skill - a.skill })
  while (bench.length < maxBench && rest.length > 0) {
    bench.push(rest.shift().id)
  }
  state.benchIds = bench.slice(0, maxBench)
  assigned.push.apply(assigned, state.benchIds)

  var reservePool = allPlayers.filter(function(p) { return !assigned.includes(p.id) })
  state.reserveIds = reservePool.slice(0, MAX_RESERVES).map(function(p) { return p.id })
  if (!state.captainId && state.tacticsSlots[0]) state.captainId = state.tacticsSlots[0]
}

function getPlayerIdFromSlot(el) {
  const slotIdx = el.dataset.slot
  const benchIdx = el.dataset.bench
  const reserveIdx = el.dataset.reserve
  if (slotIdx !== undefined) return state.tacticsSlots[parseInt(slotIdx)]
  if (benchIdx !== undefined) return state.benchIds[parseInt(benchIdx)]
  if (reserveIdx !== undefined) return reserveIdx
  return null
}

function handleSlotClick(el, tactic) {
  var isFilled = !el.classList.contains('tp-empty')
  var slotIdx = el.dataset.slot
  var benchIdx = el.dataset.bench
  var reserveIdx = el.dataset.reserve

  var currentPid = null
  var targetArray = null
  var targetIndex = -1
  if (slotIdx !== undefined) {
    targetIndex = parseInt(slotIdx)
    currentPid = state.tacticsSlots[targetIndex]
    targetArray = 'tacticsSlots'
  } else if (benchIdx !== undefined) {
    targetIndex = parseInt(benchIdx)
    currentPid = state.benchIds[targetIndex]
    targetArray = 'benchIds'
  } else if (reserveIdx !== undefined) {
    currentPid = reserveIdx
    targetIndex = state.reserveIds.indexOf(reserveIdx)
    if (targetIndex < 0) { state.reserveIds.push(reserveIdx); targetIndex = state.reserveIds.length - 1 }
    targetArray = 'reserveIds'
  }

  if (isFilled && currentPid) {
    var p = state.players.find(function(x) { return x.id === currentPid })
    if (p && p.injury) return
  }

  if (!state.selectedPlayerId) {
    if (isFilled && currentPid) {
      state.selectedPlayerId = currentPid
      document.querySelectorAll('.tp-player-card.selected').forEach(function(s) { s.classList.remove('selected') })
      el.classList.add('selected')
    }
    renderTactics(tactic)
    return
  }

  if (state.selectedPlayerId === currentPid) {
    state.selectedPlayerId = null
    document.querySelectorAll('.tp-player-card.selected').forEach(function(s) { s.classList.remove('selected') })
    renderTactics(tactic)
    return
  }

  if (targetArray && targetIndex >= 0) {
    if (currentPid) {
      var arrs = ['tacticsSlots', 'benchIds', 'reserveIds']
      for (var ai = 0; ai < arrs.length; ai++) {
        var a = state[arrs[ai]]
        for (var i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            a[i] = currentPid
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.tp-player-card.selected').forEach(function(s) { s.classList.remove('selected') })
            renderTactics(tactic)
            return
          }
        }
      }
    } else {
      var arrs = ['tacticsSlots', 'benchIds', 'reserveIds']
      for (var ai = 0; ai < arrs.length; ai++) {
        var a = state[arrs[ai]]
        for (var i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            if (targetArray === 'tacticsSlots' || targetArray === 'benchIds' || targetArray === 'reserveIds') {
              a[i] = null
            }
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.tp-player-card.selected').forEach(function(s) { s.classList.remove('selected') })
            renderTactics(tactic)
            return
          }
        }
      }
    }
  }
  state.selectedPlayerId = null
}
var POS_GROUP = {
  portero: 0,
  defensa_central: 1, lateral_der: 1, lateral_izq: 1, carrilero_der: 1, carrilero_izq: 1,
  medio_def: 2, mediocentro: 2, medio_ofensivo: 2, medio_der: 2, medio_izq: 2,
  extremo_der: 3, extremo_izq: 3, delantero: 3,
}
function calcularMediaEnPosicion(jugador, posicionActual) {
  if (!posicionActual) return jugador.energy < 50 ? Math.round(jugador.skill * 0.5) : jugador.skill
  var naturalKey = SIGLA_TO_POS[jugador.position] || jugador.position
  var currentKey = SIGLA_TO_POS[posicionActual] || posicionActual
  var base = jugador.energy < 50 ? Math.round(jugador.skill * 0.5) : jugador.skill

  if (naturalKey === currentKey) {
    /* Posición principal: mainPct sube gradualmente con cada partido */
    var basePct = jugador.mainPct !== undefined ? jugador.mainPct : 99
    if (basePct < 100 && (jugador.positionExperience && jugador.positionExperience[currentKey] > 0)) {
      basePct = Math.min(100, basePct + jugador.positionExperience[currentKey] * 0.25)
      jugador.mainPct = basePct
    }
    var exp = jugador.positionExperience ? (jugador.positionExperience[currentKey] || 0) : 0
    var expPct = Math.min(100, exp * 2)
    var finalPct = Math.min(100, Math.max(basePct, expPct))
    return Math.round(base * finalPct / 100)
  }

  /* Conocimiento del jugador (otherPositions + experiencia) */
  var staticPct = 0
  if (jugador.otherPositions) {
    var alt = jugador.otherPositions.find(function(o) { return (SIGLA_TO_POS[o.pos] || o.pos) === currentKey })
    if (alt) staticPct = alt.pct
  }
  var expMatches = jugador.positionExperience ? (jugador.positionExperience[currentKey] || 0) : 0
  var expPct = Math.min(100, expMatches * 2)
  var knownPct = Math.max(staticPct, expPct, 0)

  /* Penalizaci\u00f3n base por grupos */
  var groupA = POS_GROUP[naturalKey] !== undefined ? POS_GROUP[naturalKey] : 2
  var groupB = POS_GROUP[currentKey] !== undefined ? POS_GROUP[currentKey] : 2
  var dist = Math.abs(groupA - groupB)
  if (naturalKey === 'portero' || currentKey === 'portero') dist = 2
  var basePct = dist === 0 ? 96 : dist === 1 ? 90 : 75

  /* Reducir penalizaci\u00f3n con el conocimiento */
  var pct = basePct + (100 - basePct) * knownPct / 100
  return Math.round(base * pct / 100)
}

function findSustituto(banquillo, posicion, enPistaIds) {
  const similares = { portero: ['portero'], cierre: ['cierre', 'ala'], ala: ['ala', 'cierre'], pivot: ['pivot', 'ala'] }
  const validas = similares[posicion] || [posicion]
  return banquillo
    .filter(p => validas.includes(p.position) && p.energy >= 60 && !enPistaIds.includes(p.id))
    .sort((a, b) => b.energy - a.energy)[0]
}

/* ============ LEAGUE VIEW ============ */
function getLeagueTeams(leagueId) {
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    const league = data.country.leagues.find(l => l.id === leagueId)
    if (league) return league.teams || []
  }
  return []
}

function leagueExists(lid) {
  return getLeagueTeams(lid).length > 0
}

function renderLeague(viewedLeagueId) {
  const tableWrap = document.getElementById('league-table-wrap')
  const resultsWrap = document.getElementById('league-results-wrap')

  resultsWrap.classList.add('hidden')

  try { initAllLeagueData() } catch (e) { console.warn('[LEAGUE] initAllLeagueData error:', e) }

  /* --- Country selector strip --- */
  const activeCountryId = state.leagueViewCountry || state.countryId
  const countryStrip = document.getElementById('country-strip')
  countryStrip.innerHTML = COUNTRIES.map(c => {
    const isActive = c.id === activeCountryId
    return '<div class="country-badge' + (isActive ? ' active' : '') + '" data-cid="' + c.id + '">' +
      '<span class="country-flag">' + c.flag + '</span>' +
      '<span class="country-name">' + c.name + '</span>' +
      '</div>'
  }).join('')
  countryStrip.querySelectorAll('.country-badge').forEach(el => {
    el.onclick = function() {
      const cid = this.dataset.cid
      if (cid === state.leagueViewCountry) return
      if (window.DB[cid]) {
        ensureCountryLeagues(cid)
        state.leagueViewCountry = cid
        renderLeague()
      } else {
        loadCountryData(cid, function() {
          ensureCountryLeagues(cid)
          state.leagueViewCountry = cid
          renderLeague()
        })
      }
    }
  })

  /* --- Get leagues for active country --- */
  ensureCountryLeagues(activeCountryId)
  const countryData = window.DB[activeCountryId]
  const leagues = countryData ? (countryData.country.leagues || []) : []

  /* --- Determine which league to display --- */
  const isOwnCountry = activeCountryId === state.countryId
  let displayLid
  if (viewedLeagueId) {
    displayLid = viewedLeagueId
  } else if (isOwnCountry) {
    displayLid = state.leagueId
  } else if (leagues.length > 0) {
    displayLid = leagues[0].id
  } else {
    displayLid = ''
  }

  /* --- League logos strip (merge grouped leagues like lpl4g, l3sg) --- */
  var groupedFilter = function(l) { return l.id && isGroupedLeague(l.id) }
  var groupedLogos = leagues.filter(groupedFilter)
  var otherLogos = leagues.filter(function(l) { return !l.id || !isGroupedLeague(l.id) })
  var displayLogos = []
  for (var gli = 0; gli < groupedLogos.length; gli++) {
    var gConfig = getGroupedConfig(groupedLogos[gli].id)
    if (gConfig) {
      var gKey = ''
      for (var kk in GROUPED_LEAGUES) { if (groupedLogos[gli].id.startsWith(kk)) { gKey = kk; break } }
      var existingVid = displayLogos.findIndex(function(d) { return d.vid === gConfig.name })
      if (existingVid < 0) {
        var mergedT = []
        var allG = leagues.filter(function(l) { return l.id && isGroupedLeague(l.id) && getGroupedConfig(l.id) === gConfig })
        for (var gm = 0; gm < allG.length; gm++) mergedT = mergedT.concat(allG[gm].teams || [])
        displayLogos.push({ id: gKey, vid: gConfig.name, name: gConfig.name, logo: groupedLogos[gli].logo, _groups: allG })
      }
    }
  }
  displayLogos = otherLogos.concat(displayLogos)
  /* Añadir Copa del Rey para España */
  var cupLogoUrl = 'https://cdn.resfu.com/media/img/league_logos/copa-del-rey.png?size=120x&lossy=1'
  if (activeCountryId === 'es' && state.cup) {
    displayLogos = [{ id: 'copa_del_rey', name: 'Copa del Rey', logo: cupLogoUrl }].concat(displayLogos)
  }
  const logosContainer = document.getElementById('league-logos')
  logosContainer.innerHTML = displayLogos.map(function(l) {
    var virtualId = l.vid ? l.id : null
    var isActive = displayLid === 'copa_del_rey' && l.id === 'copa_del_rey'
    if (!isActive) isActive = (virtualId && displayLid && isGroupedLeague(displayLid) && displayLid.startsWith(l.id)) || l.id === displayLid
    return '<div class="ng-league-item' + (isActive ? ' active' : '') + '" data-lid="' + (virtualId || l.id) + '" title="' + l.name + '">' +
      (l.logo ? '<img class="ng-league-logo" src="' + l.logo + '" alt="' + l.name + '">' : '<span>' + l.name + '</span>') +
      '</div>'
  }).join('')
  logosContainer.querySelectorAll('.ng-league-item').forEach(function(el) {
    var lid = el.dataset.lid
    if (lid === 'copa_del_rey') {
      el.onclick = function() { renderCopaView() }
    } else if (isGroupedLeague(lid)) {
      el.onclick = function() {
        var firstGroup = leagues.find(function(l) { return l.id && isGroupedLeague(l.id) })
        renderLeague(displayLid && isGroupedLeague(displayLid) ? displayLid : (firstGroup ? firstGroup.id : displayLid))
      }
    } else {
      el.onclick = function() { renderLeague(lid) }
    }
  })

  /* --- Group selector for grouped leagues (lpl4g, l3sg) --- */
  var groupSelectorHtml = ''
  var activeGroupConfig = getGroupedConfig(displayLid)
  if (activeGroupConfig) {
    groupSelectorHtml = '<div class="lpl4-group-selector">'
    for (var gsi = 0; gsi < activeGroupConfig.groups.length; gsi++) {
      var isActive = displayLid === activeGroupConfig.groups[gsi]
      groupSelectorHtml += '<button class="lpl4-group-btn' + (isActive ? ' active' : '') + '" data-gid="' + activeGroupConfig.groups[gsi] + '">' + activeGroupConfig.groupNames[gsi] + '</button>'
    }
    groupSelectorHtml += '</div>'
  }

  /* --- Table --- */
  const isOwnLeague = displayLid === state.leagueId && isOwnCountry
  const standings = isOwnLeague
    ? updateLeagueStandings()
    : state.allLeagueData && state.allLeagueData[displayLid]
      ? computeStandings(state.allLeagueData[displayLid].fixtures,
          getLeagueTeams(displayLid).map(t => t.id))
      : getLeagueTeams(displayLid).map(t => ({
          teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0,
          name: t.name, logo: t.logo
        }))
  var tableHtml = groupSelectorHtml + '<table class="league-table"><tr><th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th></tr>'
  standings.forEach((s, i) => {
    const isUser = isOwnLeague && s.teamId === state.teamId
    const totalTeams = standings.length
    var barClass = ''
    if (displayLid === 'l1s') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 4) barClass = 'bar-ucl'
      else if (i === 4) barClass = 'bar-uel'
      else if (i === 5) barClass = 'bar-conference'
      else if (i >= totalTeams - 3) barClass = 'bar-descenso'
    } else if (displayLid === 'lnfs1') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 8) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 2) barClass = 'bar-descenso'
    } else if (displayLid === 'lpl') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 2) barClass = 'bar-ucl'
      else if (i < 3) barClass = 'bar-uel'
      else if (i < 4) barClass = 'bar-conference'
      else if (i >= totalTeams - 3) barClass = 'bar-descenso'
    } else if (displayLid === 'l2s') {
      if (i < 2) barClass = 'bar-promotion'
      else if (i < 6) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 4) barClass = 'bar-descenso'
    } else if (displayLid === 'lpl2') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 2) barClass = 'bar-promotion'
      else if (i < 6) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 3) barClass = 'bar-descenso'
    } else if (displayLid === 'lpl3') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 2) barClass = 'bar-promotion'
      else if (i < 6) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 6 && i < totalTeams - 4) barClass = 'bar-relegation-playoff'
      else if (i >= totalTeams - 4) barClass = 'bar-descenso'
    } else if (displayLid && displayLid.startsWith('l3sg')) {
      if (i === 0) barClass = 'bar-promotion'
      else if (i < 5) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 5) barClass = 'bar-descenso'
    } else if (displayLid && displayLid.startsWith('lpl4g')) {
      if (i === 0) barClass = 'bar-promotion'
      else if (i < 2) barClass = 'bar-promotion-playoff'
      else if (i >= totalTeams - 4) barClass = 'bar-descenso'
    } else if (displayLid === 'l1p') {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 3) barClass = 'bar-ucl'
      else if (i < 4) barClass = 'bar-uel'
      else if (i < 5) barClass = 'bar-conference'
      else if (i >= totalTeams - 2) barClass = 'bar-descenso'
      else if (i >= totalTeams - 3) barClass = 'bar-relegation-playoff'
    } else if (displayLid === 'l2p') {
      if (i < 2) barClass = 'bar-promotion'
      else if (i < 3) barClass = 'bar-promotion-playoff'
      else if (i === totalTeams - 3) barClass = 'bar-relegation-playoff'
      else if (i >= totalTeams - 2) barClass = 'bar-descenso'
    } else if (displayLid === 'lnfs2' || (displayLid && displayLid.startsWith('l2b'))) {
      if (i === 0) barClass = 'bar-champion'
      else if (i < 2) barClass = 'bar-promotion'
      else if (i >= totalTeams - 3) barClass = 'bar-descenso'
    } else {
      /* Generic: top 1 champion, top 50% light green, bottom 3 red */
      var zDesc = Math.max(1, Math.min(3, Math.floor(totalTeams * 0.2)))
      if (i === 0) barClass = 'bar-champion'
      else if (i < Math.ceil(totalTeams * 0.5)) barClass = 'bar-promotion'
      else if (i >= totalTeams - zDesc) barClass = 'bar-descenso'
    }
    const logo = s.logo || getTeamLogo(s.teamId)
    const name = s.name || getTeamName(s.teamId)
    const dg = s.gf - s.ga
    tableHtml += `<tr class="${isUser ? 'league-row-user' : ''}" data-team-id="${s.teamId}" style="${!isUser ? 'cursor:pointer' : ''}">
      <td class="pos-bar ${barClass}"><span class="league-pos ${i < 3 ? 'p' + (i+1) : ''}">${i + 1}</span></td>
      <td>${logo ? `<img class="team-logo" src="${logo}" style="width:18px;height:18px;vertical-align:middle;margin-right:6px">` : ''}${name}</td>
      <td><strong>${s.pts}</strong></td>
      <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
      <td>${s.gf}</td><td>${s.ga}</td><td>${dg}</td>
    </tr>`
  })
  tableHtml += '</table>'

  /* Legend */
  var legendItems = []
  if (displayLid === 'l1s') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-ucl', label: 'Champions League' },
      { cls: 'bar-uel', label: 'Europa League' },
      { cls: 'bar-conference', label: 'Conference League Previa' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'lpl') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-ucl', label: 'Champions League Previa' },
      { cls: 'bar-uel', label: 'Europa League Previa' },
      { cls: 'bar-conference', label: 'Conference League Previa' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'lnfs1') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Campeonato' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'l2s') {
    legendItems = [
      { cls: 'bar-promotion', label: 'Ascenso directo' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Ascenso' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'lpl2') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-promotion', label: 'Ascenso directo' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Ascenso' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'lpl3') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-promotion', label: 'Ascenso directo' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Ascenso' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-relegation-playoff', label: 'Playoff Descenso' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (isGroupedLeague(displayLid)) {
    legendItems = [
      { cls: 'bar-promotion', label: 'Ascenso directo' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Ascenso' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'l1p') {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-ucl', label: 'Champions League' },
      { cls: 'bar-uel', label: 'Europa League Previa' },
      { cls: 'bar-conference', label: 'Conference League Previa' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-relegation-playoff', label: 'Playoff Descenso' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else if (displayLid === 'l2p') {
    legendItems = [
      { cls: 'bar-promotion', label: 'Ascenso directo' },
      { cls: 'bar-promotion-playoff', label: 'Playoff Ascenso' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-relegation-playoff', label: 'Playoff Descenso' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  } else {
    legendItems = [
      { cls: 'bar-champion', label: 'Campeón' },
      { cls: 'bar-promotion', label: 'Promoción' },
      { cls: 'bar-permanencia', label: 'Permanencia' },
      { cls: 'bar-descenso', label: 'Descenso' },
    ]
  }
  if (legendItems.length > 0) {
    tableHtml += '<div class="table-legend">'
    legendItems.forEach(function(item) {
      tableHtml += '<span class="legend-item"><span class="legend-bar ' + item.cls + '"></span>' + item.label + '</span>'
    })
    tableHtml += '</div>'
  }

  tableWrap.innerHTML = tableHtml
  tableWrap.querySelectorAll('tr[data-team-id]').forEach(row => {
    row.onclick = () => showTeamInfo(row.dataset.teamId)
  })
  /* Bind group selector events */
  tableWrap.querySelectorAll('.lpl4-group-btn').forEach(function(btn) {
    btn.onclick = function() {
      renderLeague(btn.dataset.gid)
    }
  })
}

/* ============ MATCH ============ */
const matchData = { homeScore: 0, awayScore: 0, homeFouls: 0, awayFouls: 0, rivalName: '' }





/* ============ TACTICS MODAL ============ */
function abrirTacticasModal() {
  console.log('[TACTICS] modal opening')

  const modal = document.getElementById('tactics-modal')
  const formContainer = document.getElementById('tm-formation')
  const gpSelect = document.getElementById('tm-gameplan')
  const gpDesc = document.getElementById('tm-gameplan-desc')
  const pitch = document.getElementById('tm-pitch')
  const bench = document.getElementById('tm-bench')
  const reserves = document.getElementById('tm-reserves')
  const tactic = state.tactic

  /* Formation buttons */
  formContainer.innerHTML = Object.keys(FORMATIONS).map(k =>
    `<button class="tactics-btn ${tactic.formation === k ? 'active' : ''}" data-formation="${k}">${k}</button>`
  ).join('')
  formContainer.querySelectorAll('.tactics-btn').forEach(btn => {
    btn.onclick = () => {
      tactic.formation = btn.dataset.formation
      abrirTacticasModal()
    }
  })

  /* Game plan */
  gpSelect.innerHTML = Object.entries(GAME_PLANS).map(([k, v]) =>
    `<option value="${k}" ${tactic.gamePlan === k ? 'selected' : ''}>${v.label}</option>`
  ).join('')
  gpSelect.onchange = () => {
    tactic.gamePlan = gpSelect.value
    gpDesc.textContent = (GAME_PLANS[tactic.gamePlan] || {}).desc || ''
  }
  gpDesc.textContent = (GAME_PLANS[tactic.gamePlan] || {}).desc || ''

  /* Pitch grid — same as Club renderTactics() */
  const roles = SLOT_ROLES[tactic.formation] || SLOT_ROLES['4-3-3']
  if (!state.tacticsSlots || state.tacticsSlots.length !== roles.length) {
    state.tacticsSlots = roles.map(() => null)
  }

  const swapId = window._tacticsSwap || null

  let html = `<div class="pitch-grid-11" id="pitch-grid-modal">`

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i]
    const pid = state.tacticsSlots[i] || null
    const player = pid ? state.players.find(p => p.id === pid) : null
    const pos = POSITIONS[role]
    const isSelected = pid && pid === swapId

    if (player) {
      const isRed = player._redThisMatch
      const avatarStyle = `background-image:url(${player.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      html += `<div class="p11-slot-wrap">
        <div class="p11-slot filled ${isSelected ? 'selected' : ''}" data-slot="${i}" style="border-color:${isRed ? '#EF4444' : pos.color};background:${isRed ? '#EF4444' : pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
        </div>
        <span class="p11-slot-role" style="color:${isRed ? '#EF4444' : '#fff'}">${isRed ? '🟥' : pos.label}</span>
        <span class="p11-slot-name">${isRed ? '🟥 Expulsado' : player.name.split(' ').slice(-1)[0]}</span>
        ${isRed ? '' : `<div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>`}
      </div>`
    } else {
      html += `<div class="p11-slot-wrap">
        <div class="p11-slot empty ${swapId ? 'swap-target' : ''}" data-slot="${i}">+</div>
        <span class="p11-slot-role">${pos.label}</span>
      </div>`
    }
  }
  html += '</div>'
  pitch.innerHTML = html

  /* Click on filled slot → select/swap */
  pitch.querySelectorAll('.p11-slot.filled').forEach(el => {
    el.onclick = () => {
      const slotIdx = parseInt(el.dataset.slot)
      const pid = state.tacticsSlots[slotIdx]
      const player = pid ? state.players.find(p => p.id === pid) : null
      if (!player) return
      if (player._redThisMatch) {
        /* Expelled slot: clear it or swap */
        if (swapId) {
          const swapPlayer = state.players.find(p => p.id === swapId)
          if (!swapPlayer) return
          const swapSlot = state.tacticsSlots.indexOf(swapId)
          if (swapSlot >= 0) {
            /* Swap expelled ↔ selected pitch player */
            state.tacticsSlots[swapSlot] = pid
            state.tacticsSlots[slotIdx] = swapId
            swapPlayer.enPista = true
          } else {
            /* Selected is from bench → put in expelled slot */
            state.tacticsSlots[slotIdx] = swapId
            swapPlayer.enPista = true
          }
          window._tacticsSwap = null
        } else {
          /* No swap active → just clear expelled slot so you can fill it */
          state.tacticsSlots[slotIdx] = null
        }
        renderPlayerRatings()
        abrirTacticasModal()
        return
      }
      if (swapId) {
        /* Swap with selected player */
        const swapPlayer = state.players.find(p => p.id === swapId)
        const swapSlot = state.tacticsSlots.indexOf(swapId)
        if (swapSlot >= 0) {
          state.tacticsSlots[swapSlot] = pid
          state.tacticsSlots[slotIdx] = swapId
        } else {
          /* swapId is from bench → put on pitch, current to bench */
          const oldSlot = state.tacticsSlots.indexOf(pid)
          state.tacticsSlots[oldSlot] = swapId
          player.enPista = false
          swapPlayer.enPista = true
        }
        window._tacticsSwap = null
      } else {
        /* Select this player */
        window._tacticsSwap = pid
      }
      renderPlayerRatings()
      abrirTacticasModal()
    }
  })

  /* Click on empty slot → assign player or clear selection */
  pitch.querySelectorAll('.p11-slot.empty').forEach(el => {
    el.onclick = () => {
      const slotIdx = parseInt(el.dataset.slot)
      if (swapId) {
        /* Put selected player in this empty slot */
        const swapPlayer = state.players.find(p => p.id === swapId)
        const swapSlot = state.tacticsSlots.indexOf(swapId)
        if (swapSlot >= 0) {
          state.tacticsSlots[swapSlot] = null
          const oldPlayer = state.players.find(p => p.id === state.tacticsSlots[swapSlot])
        }
        state.tacticsSlots[slotIdx] = swapId
        swapPlayer.enPista = true
        window._tacticsSwap = null
      } else {
        /* Assign best available bench player */
        const role = roles[slotIdx]
        const candidates = state.players.filter(p => !p.enPista && !p.injury && !p._redThisMatch && !state.tacticsSlots.includes(p.id))
        const best = candidates.sort((a, b) => {
          const mA = getPositionMultiplier(a.position, role)
          const mB = getPositionMultiplier(b.position, role)
          return mB !== mA ? mB - mA : b.skill - a.skill
        })[0]
        if (best) {
          state.tacticsSlots[slotIdx] = best.id
          best.enPista = true
        }
      }
      renderPlayerRatings()
      abrirTacticasModal()
    }
  })

  /* Filter available players */
  const available = state.players.filter(p => !p.enPista && !p.injury && !p._redThisMatch && !state.tacticsSlots.includes(p.id))

  /* Hide reserves section */
  document.getElementById('tm-reserves-label').style.display = 'none'
  document.getElementById('tm-reserves').style.display = 'none'

  /* Bench (dynamic limit) */
  const maxBench = getEffectiveMaxBench()
  const benchPlayers = available.slice(0, maxBench)
  document.getElementById('tm-bench-label').textContent = 'BANQUILLO (' + benchPlayers.length + ')'

  if (benchPlayers.length === 0) {
    bench.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text-muted);width:100%">Sin suplentes</div>'
  } else {
    bench.innerHTML = benchPlayers.map(p => {
      const pos = POSITIONS[p.position]
      const isSelected = p.id === swapId
      const avatarStyle = `background-image:url(${p.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      return `<div class="bench-slot-wrap">
        <div class="bench-slot filled ${isSelected ? 'selected' : ''}" data-pid="${p.id}" style="border-color:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
        </div>
        <span class="bench-slot-name">${p.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(p.energy)}">${p.energy}</div><div class="stat-circle" style="background:#9CA3AF">${p.skill}</div></div>
      </div>`
    }).join('')
    bench.querySelectorAll('.bench-slot.filled').forEach(el => {
      el.onclick = () => handleBenchClick(el.dataset.pid, roles)
    })
  }



  function handleBenchClick(pid, slotRoles) {
    if (swapId) {
      /* Swap: bench player ↔ selected player on pitch or on bench */
      const swapPlayer = state.players.find(p => p.id === swapId)
      const clickPlayer = state.players.find(p => p.id === pid)
      if (!swapPlayer || !clickPlayer) return
      const swapSlot = state.tacticsSlots.indexOf(swapId)
      if (swapSlot >= 0) {
        /* Swap is on pitch → swap pitch slot with bench player */
        state.tacticsSlots[swapSlot] = clickPlayer.id
        clickPlayer.enPista = true
        swapPlayer.enPista = false
      } else {
        /* Both are bench/reserve → just swap selection */
        window._tacticsSwap = pid
        renderPlayerRatings()
        abrirTacticasModal()
        return
      }
      window._tacticsSwap = null
    } else {
      /* No swap active → assign to best empty slot */
      const player = state.players.find(p => p.id === pid)
      if (!player) return
      const emptySlots = state.tacticsSlots.map((s, i) => s === null ? i : -1).filter(i => i >= 0)
      const expelledSlotIdx = state.tacticsSlots.findIndex((s, i) => {
        if (!s) return false
        const p = state.players.find(x => x.id === s)
        return p && p._redThisMatch
      })
      if (emptySlots.length > 0) {
        const bestSlot = emptySlots.sort((a, b) => {
          const mA = getPositionMultiplier(player.position, slotRoles[a])
          const mB = getPositionMultiplier(player.position, slotRoles[b])
          return mB !== mA ? mB - mA : 0
        })[0]
        state.tacticsSlots[bestSlot] = player.id
        player.enPista = true
      } else if (expelledSlotIdx >= 0) {
        /* Put player directly into expelled player's slot */
        state.tacticsSlots[expelledSlotIdx] = player.id
        player.enPista = true
      } else {
        /* No empty slots → select this player to swap */
        window._tacticsSwap = pid
      }
    }
    renderPlayerRatings()
    abrirTacticasModal()
  }

  /* Apply button */
  document.getElementById('tm-apply').onclick = () => {
    addFeedEvent({ text: `Cambio táctico`, type: 'sub' })
    window._tacticsSwap = null
    modal.classList.remove('open')
  }

  /* Close button */
  document.getElementById('tm-close').onclick = () => {
    window._tacticsSwap = null
    modal.classList.remove('open')
  }

  modal.classList.add('open')
}

function finishMatch(isHome, fixture, rival) {
  const userScore = isHome ? matchData.homeScore : matchData.awayScore
  const rivalScore = isHome ? matchData.awayScore : matchData.homeScore

  /* Update fixture */
  fixture.homeScore = isHome ? matchData.homeScore : matchData.awayScore
  fixture.awayScore = isHome ? matchData.awayScore : matchData.homeScore
  fixture.played = true

  /* Playoff match handling */
  const isPlayoff = state.playoffs && state.playoffs.fixtures && state.playoffs.fixtures.some(f => f === fixture)
  if (isPlayoff) {
    /* Auto-simulate other playoff fixtures in this round */
    for (const f of state.playoffs.fixtures) {
      if (f === fixture || f.played) continue
      const result = autoSimulateOtherMatch(f.home, f.away)
      f.homeScore = result.homeScore
      f.awayScore = result.awayScore
      f.played = true
    }
    /* Update rewards */
    if (userScore > rivalScore) { reward = 1500; state.stats.wins++ }
    else if (userScore === rivalScore) { reward = 500; state.stats.draws++ }
    else { reward = 0; state.stats.losses++ }
    state.finances.balance += reward
    state.finances.history.push({ reason: `${state.playoffs.round === 'F' ? 'Final' : state.playoffs.round === 'SF' ? 'Semifinal' : 'Cuartos'} playoff vs ${rival.name}`, amount: reward })
    avanzarRondaPlayoff()
    updateLeagueStandings()
    const sh = document.getElementById('score-home'); const sa = document.getElementById('score-away')
    if (sh) sh.textContent = '0'; if (sa) sa.textContent = '0'
    showMatchdayResults(userScore, rivalScore, rival.name)
    autoSave()
    return
  }

  /* Finance */
  const rew = getDivisionMatchReward(state.leagueId)
  let reward
  if (userScore > rivalScore) { reward = rew.win; state.stats.wins++ }
  else if (userScore === rivalScore) { reward = rew.draw; state.stats.draws++ }
  else { reward = rew.loss; state.stats.losses++ }
  state.finances.balance += reward
  state.finances.history.push({ reason: `J${state.currentMatchday}: ${userScore}-${rivalScore} vs ${rival.name}`, amount: reward })

  /* Inbox notification */
  const resultLabel = userScore > rivalScore ? 'Victoria' : userScore === rivalScore ? 'Empate' : 'Derrota'
  addNotification('match', `${resultLabel} ${userScore}-${rivalScore} vs ${rival.name}`, `Jornada ${state.currentMatchday} · ${reward >= 0 ? '+' : ''}${reward} €`)

  /* Post-match recovery: calculate days until next match */
  const nextFixture = getFixtureForUser(state.currentMatchday + 1)
  let recoveryMult = 1.0
  if (nextFixture && nextFixture.date) {
    const curDate = new Date(fixture.date + 'T12:00:00')
    const nxtDate = new Date(nextFixture.date + 'T12:00:00')
    const days = Math.round((nxtDate - curDate) / (1000 * 60 * 60 * 24))
    if (days <= 4) recoveryMult = 0.5
  }
  state.players.forEach(p => {
    p.enPista = false
    p.minutosEnPista = 0
    p.convocado = false
    p.titular = false
    p.energy = Math.min(100, p.energy + Math.round(randInt(15, 30) * recoveryMult))
  })
  state.convocatoriaValidada = false

  /* Match history per player */
  state.players.filter(p => p.minutosEnPista > 0).forEach(p => {
    if (!p.matchHistory) p.matchHistory = []
    var baseRating = 6.0
    var winBonus = (us > them) ? 0.8 : (us === them) ? 0.2 : -0.3
    var yellowPenalty = p._yellowThisMatch ? -0.5 : 0
    var redPenalty = p._redThisMatch ? -2 : 0
    var goalBonus = (p._goalsInMatch || 0) * 0.8
    var assistBonus = (p._assistThisMatch || 0) * 0.4
    var randomFactor = (Math.random() - 0.5) * 1.0
    var csBonus = 0
    if (them === 0 && (p.position === 'POR' || p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq')) csBonus = 0.5
    var rating = Math.min(10, Math.max(1, baseRating + winBonus + yellowPenalty + redPenalty + goalBonus + assistBonus + randomFactor + csBonus))
    p.matchHistory.push({
      matchday: state.currentMatchday,
      rival: rival.name,
      minutes: p.minutosEnPista || 0,
      rating: Math.min(10, Math.max(1, rating)),
      goals: p._goalsInMatch || 0,
      yellow: !!p._yellowThisMatch,
      red: !!p._redThisMatch,
    })
    p.matches = (p.matches || 0) + 1
    p.goals = (p.goals || 0) + (p._goalsInMatch || 0)
    /* Track stats per team */
    if (!p.teamStats) p.teamStats = {}
    var curTeamId = state.teamId
    if (!p.teamStats[curTeamId]) p.teamStats[curTeamId] = { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
    p.teamStats[curTeamId].matches++
    p.teamStats[curTeamId].goals += (p._goalsInMatch || 0)
    if (p._assistThisMatch) p.teamStats[curTeamId].assists++
    if (p._yellowThisMatch) p.teamStats[curTeamId].yellowCards++
    if (p._redThisMatch) p.teamStats[curTeamId].redCards++
    delete p._yellowsInThisMatch; delete p._redThisMatch; delete p._goalsInMatch; delete p._assistThisMatch
  })

  /* Auto-simulate other matches */
  const otherFixtures = state.fixtures.filter(f => f.matchday === state.currentMatchday && f.played === false)
  for (const f of otherFixtures) {
    const result = autoSimulateOtherMatch(f.home, f.away)
    f.homeScore = result.homeScore
    f.awayScore = result.awayScore
    f.played = true
  }

  /* Simulate all other leagues for this matchday */
  simularJornadaEnTodasLasLigas(state.currentMatchday)

  updateLeagueStandings()
  const sh = document.getElementById('score-home'); const sa = document.getElementById('score-away')
  if (sh) sh.textContent = '0'; if (sa) sa.textContent = '0'
  showMatchdayResults(userScore, rivalScore, rival.name)
  autoSave()
}

function resetSeason() {
  procesarRetornoCesiones()
  state.currentMatchday = 1
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }

  /* Reset league standings */
  state.fixtures.forEach(f => { f.played = false; f.homeScore = null; f.awayScore = null })

  /* Reset players */
  state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0; p._suspended = null; p._redType = null; p.yellowCards = 0; p.redCards = 0 })

  /* Reset CPU teams */
  state.leagueTeams.forEach(t => {
    t.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
  })

  normalizarPlantillas()
  rebuildGlobalPlayerPool()

  /* Process forced filial relegation (parent relegated to same division as B team) */
  if (state._filialRelegue) {
    var frId = state._filialRelegue
    var frTeam = state.leagueTeams.find(function(t) { return t.teamId === frId })
    if (frTeam) {
      var frIdx = state.leagueTeams.indexOf(frTeam)
      if (frIdx >= 0) state.leagueTeams.splice(frIdx, 1)
      addNotification('general', '\u2B07 Filial relegado: ' + frTeam.name, 'Relegado autom\u00e1ticamente al descender el primer equipo')
    }
    state._filialRelegue = null
  }

  /* Reset tactics */
  state.tacticsSlots = []
  state.benchIds = []
  state.reserveIds = []
  state.convocatoriaValidada = false
  state.selectedPlayerId = null

  /* Season prize based on division */
  const seasonPrize = Math.round(getDivisionBaseBudget(state.leagueId) * 0.2)
  state.finances.balance += seasonPrize
  state.finances.history.push({ reason: '🏆 Premio temporada', amount: seasonPrize })

  autoSaveTactics()
  actualizarIndicadorTemporada()
  saveGame()
  renderLeague()
}

/* ============ FIN DE TEMPORADA ============ */
function getLeagueFromId(leagueId) {
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    const league = data.country.leagues.find(l => l.id === leagueId)
    if (league) return league
  }
  return null
}

/* ============ ECONOMÍA SEMANAL ============ */
function procesarEconomiaSemanal() {
  /* Gastos operativos semanales (0.5% del presupuesto inicial) */
  if (state.presupuestoInicial > 0) {
    var gastos = Math.round(state.presupuestoInicial * 0.005)
    state.finances.balance -= gastos
    state.finances.history.push({ reason: 'Gastos operativos semanales', amount: -gastos })
  }
  procesarVentasCPU()
  checkTransferWindow()
  if (state.transferWindowOpen) {
    if (Math.random() < 0.4) procesarVentanaTransferencias()
    if (Math.random() < 0.3) procesarIAOfertasAlUsuario()
    gestionarFilialesCPU()
  }
}

function procesarSuspensiones() {
  var bajas = []
  state.players.filter(function(p) { return p._redThisMatch }).forEach(function(p) {
    if (p._redType === 'directGrave') p._suspended = 2 + Math.floor(Math.random() * 2)
    else p._suspended = 1
    var motivo = p._redType === 'doubleYellow' ? 'doble amarilla' : p._redType === 'directGrave' ? 'roja grave' : 'roja leve'
    bajas.push(p.name + ' (' + motivo + ')')
  })
  state.players.filter(function(p) { return (p.yellowCards || 0) >= 5 && !p._suspended }).forEach(function(p) {
    p._suspended = 1
    p.yellowCards = 0
    bajas.push(p.name + ' (5 amarillas)')
  })
  if (bajas.length > 0) addNotification('match', '\ud83d\udfe5 Suspensiones', 'Sancionados: ' + bajas.join(', '))
}

function liberarSuspensiones() {
  state.players.forEach(function(p) {
    if (p._suspended) {
      p._suspended--
      if (p._suspended <= 0) p._suspended = null
    }
  })
}

function procesarVentasCPU() {
  const transferibles = state.players.filter(p => p.transferListed && p.transferPrice > 0)
  for (const p of transferibles) {
    if (Math.random() > 0.15) continue
    state.finances.balance += p.transferPrice
    state.finances.history.push({ reason: `💰 Venta: ${p.name}`, amount: p.transferPrice })
    const idx = state.players.indexOf(p)
    if (idx >= 0) state.players.splice(idx, 1)
    addNotification('transfer', `💰 Vendido: ${p.name}`, `${formatMoney(p.transferPrice)} · Traspasado a un equipo de la liga`)
  }
}

/* ============ TRANSFER WINDOW SYSTEM ============ */
function checkTransferWindow() {
  const md = state.currentMatchday
  const wasOpen = state.transferWindowOpen
  if ((md >= TRANSFER_WINDOW_SUMMER_START && md <= TRANSFER_WINDOW_SUMMER_END) ||
      (md >= TRANSFER_WINDOW_WINTER_START && md <= TRANSFER_WINDOW_WINTER_END)) {
    state.transferWindowOpen = true
  } else {
    state.transferWindowOpen = false
  }
  if (state.transferWindowOpen && !wasOpen) {
    addNotification('general', '📢 Mercado de fichajes abierto', 'Comienza el período de transferencias')
  } else if (!state.transferWindowOpen && wasOpen) {
    addNotification('general', '🔒 Mercado cerrado', 'El período de transferencias ha finalizado')
  }
}

function gestionarFilialesCPU() {
  /* CPU parent teams promote their best B team player (skill >= 75) once per window */
  if (!state.transferWindowOpen) return
  for (var i = 0; i < state.leagueTeams.length; i++) {
    var team = state.leagueTeams[i]
    if (team.teamId === state.teamId) continue
    if (team.players.length >= MAX_SQUAD) continue
    var bTeamId = findBTeamOf(team.teamId)
    if (!bTeamId) continue
    /* Check if the B team is the user's filial squad */
    var isUserFilial = (bTeamId === getFilialId(state.teamId))
    var bSquad = isUserFilial ? state.filialSquad : getRealSquad(bTeamId)
    if (!bSquad || bSquad.length === 0) continue
    /* Check which positions the parent team is short on */
    var posCount = {}
    team.players.forEach(function(p) {
      var key = SIGLA_TO_POS[p.position] || p.position
      posCount[key] = (posCount[key] || 0) + 1
    })
    var candidates = bSquad.filter(function(p) {
      if (isUserFilial && state.boughtPlayerIds.indexOf(p.id) >= 0) return false
      if (!isUserFilial && state.boughtPlayerIds.indexOf(p.id) < 0) return false
      if (p.skill < 75) return false
      if (p.injury) return false
      var posKey = SIGLA_TO_POS[p.position] || p.position
      /* Bonus if parent team has < 2 players in this position */
      return (posCount[posKey] || 0) < 2
    })
    if (candidates.length === 0) {
      /* Fallback: promote any player >= 75 */
      candidates = bSquad.filter(function(p) {
        return p.skill >= 75 && !p.injury && (isUserFilial || state.boughtPlayerIds.indexOf(p.id) < 0)
      })
    }
    if (candidates.length === 0) continue
    candidates.sort(function(a, b) { return b.skill - a.skill })
    var best = candidates[0]
    var newP = { ...best, id: 'cpu-promoted-' + best.id + '-' + Date.now(), value: calcValue(best.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, teamStats: {} }
    team.players.push(newP)
    if (!isUserFilial) state.boughtPlayerIds.push(best.id)
    if (isUserFilial) {
      /* Remove from user's filial squad */
      var fIdx = state.filialSquad.indexOf(best)
      if (fIdx >= 0) state.filialSquad.splice(fIdx, 1)
      addNotification('transfer', '\u2B06 ' + best.name + ' sube al primer equipo', team.name + ' recluta a ' + best.name + ' desde el filial')
      renderSquad(state.players)
    } else {
      addNotification('transfer', '\u2B06 ' + best.name + ' sube al primer equipo CPU', team.name + ' promociona desde el filial')
    }
  }
}

function procesarVentanaTransferencias() {
  if (!state.transferWindowOpen) return
  for (const team of state.leagueTeams) {
    if (team.teamId === state.teamId) continue
    procesarIAFichajes(team)
    procesarIAListarJugadores(team)
  }
  procesarCesionesCPU()
}

function getTeamBudget(team) {
  const base = 500000
  const ratingFactor = (team.rating || 50) / 50
  return Math.round(base * ratingFactor)
}

function procesarIAListarJugadores(team) {
  const players = team.players
  const posCount = {}
  for (const p of players) {
    posCount[p.position] = (posCount[p.position] || 0) + 1
  }
  for (const p of players) {
    if (p.transferListed || p.onLoan) continue
    if (p.skill < 20) {
      p.transferListed = true
      p.transferPrice = Math.round(p.value * 0.5)
      continue
    }
    if (posCount[p.position] > 4 && p.skill < 35 && Math.random() < 0.3) {
      p.transferListed = true
      p.transferPrice = Math.round(p.value * (0.7 + Math.random() * 0.3))
      continue
    }
    if (p.age > 33 && p.skill < 40 && Math.random() < 0.25) {
      p.transferListed = true
      p.transferPrice = Math.round(p.value * 0.6)
    }
    if (p.skill < 20 && Math.random() < 0.5) {
      p.transferListed = true
      p.transferPrice = Math.round(p.value * 0.4)
    }
  }
  const loanCandidates = players.filter(p => !p.onLoan && !p.loanListed && p.age <= 21 && p.skill < 50 && Math.random() < 0.3)
  for (const p of loanCandidates) {
    p.loanListed = true
  }
}

function procesarIAFichajes(team) {
  const budget = getTeamBudget(team)
  const players = team.players
  const posNeeded = []
  const posCount = {}
  for (const p of players) {
    posCount[p.position] = (posCount[p.position] || 0) + 1
  }
  const defs = ['defensa_central', 'lateral_der', 'lateral_izq']
  const mids = ['mediocentro', 'medio_def', 'medio_ofensivo', 'medio_der', 'medio_izq']
  const fwds = ['delantero', 'extremo_der', 'extremo_izq']
  if ((posCount['portero'] || 0) < 2) posNeeded.push('portero')
  for (const pos of defs) {
    if ((posCount[pos] || 0) < 2) { posNeeded.push(pos); break }
  }
  for (const pos of mids) {
    if ((posCount[pos] || 0) < 2) { posNeeded.push('mediocentro'); break }
  }
  for (const pos of fwds) {
    if ((posCount[pos] || 0) < 2) { posNeeded.push('delantero'); break }
  }
  if (players.length < MIN_SQUAD_SIZE && posNeeded.length === 0) {
    posNeeded.push(pickRandom([...defs, ...mids, ...fwds, 'portero']))
  }
  for (const neededPos of posNeeded) {
    const candidates = state.globalPlayers.filter(p => {
      if (p.teamId === state.teamId) return false
      if (p.onLoan && p.loanFrom) return false
      const alreadyInTeam = team.players.some(tp => tp.id === p.id)
      if (alreadyInTeam) return false
      const posKey = SIGLA_TO_POS[p.position] || p.position
      const match = posKey === neededPos || p.position === neededPos
      return match && p.value <= budget * 0.3 && p.skill > 20
    })
    if (candidates.length === 0) continue
    candidates.sort((a, b) => b.skill - a.skill)
    const pick = candidates[0]
    const sourceTeam = state.leagueTeams.find(t => t.teamId === pick.teamId)
    if (!sourceTeam) continue
    const price = Math.round(pick.value * (0.7 + Math.random() * 0.3))
    if (price > budget * 0.3) continue
    const sourcePlayer = sourceTeam.players.find(p => p.id === pick.id)
    if (!sourcePlayer) continue
    const ti = sourceTeam.players.indexOf(sourcePlayer)
    if (ti >= 0) sourceTeam.players.splice(ti, 1)
    const newP = { ...sourcePlayer, id: `${team.teamId}-tr-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`, transferListed: false, transferPrice: 0, loanListed: false, energy: randInt(70, 100), goals: 0, matches: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [] }
    team.players.push(newP)
    rebuildGlobalPlayerPool()
  }
}

function procesarIAOfertasAlUsuario() {
  if (!state.transferWindowOpen) return
  const userPlayers = state.players.filter(p => !p.onLoan)
  for (const team of state.leagueTeams) {
    if (team.players.length >= MAX_SQUAD) continue
    const budget = getTeamBudget(team)
    const targetSkill = (team.rating || 50) + randInt(-5, 10)
    for (const p of userPlayers) {
      if (p.skill < targetSkill - 10) continue
      if (Math.random() > 0.05) continue
      const offer = Math.round(p.value * (0.8 + Math.random() * 0.5))
      if (offer > budget * 0.4) continue
      mostrarOfertaTransferencia(p, team, offer)
      break
    }
  }
}

/* ============ LOAN SYSTEM ============ */
function procesarCesionesCPU() {
  if (!state.transferWindowOpen) return
  for (const team of state.leagueTeams) {
    if (team.players.length < 18) {
      const loanPool = state.globalPlayers.filter(p => p.loanListed && p.skill > 20 && p.teamId !== team.teamId)
      if (loanPool.length === 0) continue
      loanPool.sort((a, b) => b.skill - a.skill)
      const pick = loanPool[0]
    const sourceTeam = getTeamObj(pick.teamId)
      if (!sourceTeam) continue
      const sourcePlayer = sourceTeam.players.find(p => p.id === pick.id)
      if (!sourcePlayer) continue
      const ti = sourceTeam.players.indexOf(sourcePlayer)
      if (ti >= 0) sourceTeam.players.splice(ti, 1)
      const loaned = { ...sourcePlayer, id: `${team.teamId}-loan-${Date.now()}`, onLoan: true, loanFrom: sourceTeam.teamId, loanUntil: '30/06/' + (2026 + state.seasonNumber), loanListed: false, transferListed: false, energy: randInt(70, 100) }
      team.players.push(loaned)
      addNotification('transfer', `🔄 Cesión: ${sourcePlayer.name}`, `${sourcePlayer.name} cedido al ${team.name} desde ${sourceTeam.name}`)
      rebuildGlobalPlayerPool()
    }
  }
}

function procesarRetornoCesiones() {
  for (const team of state.leagueTeams) {
    const loans = team.players.filter(p => p.onLoan && p.loanFrom)
    for (const p of loans) {
      const originTeam = state.leagueTeams.find(t => t.teamId === p.loanFrom)
      if (originTeam) {
        const idx = team.players.indexOf(p)
        if (idx >= 0) team.players.splice(idx, 1)
        const returned = { ...p, id: `${p.loanFrom}-ret-${Date.now()}`, onLoan: false, loanFrom: null, loanUntil: null, energy: randInt(70, 100) }
        originTeam.players.push(returned)
      }
    }
  }
  const userLoans = state.players.filter(p => p.onLoan && p.loanFrom)
  for (const p of userLoans) {
    p.onLoan = false
    p.loanFrom = null
    p.loanUntil = null
  }
  rebuildGlobalPlayerPool()
}

function evaluarOfertaUsuario(player, price) {
  if (price >= Math.round(player.value * 1.15)) return { accepted: true }
  if (price >= Math.round(player.value * 0.75)) {
    const counter = Math.round(player.value * (0.95 + Math.random() * 0.35))
    return { accepted: false, counter: counter }
  }
  return { accepted: false, minimum: Math.round(player.value * 0.9) }
}

function mostrarOfertaTransferencia(player, team, offer) {
  const existing = document.getElementById('transfer-offer-modal')
  if (existing) existing.remove()
  const overlay = document.createElement('div')
  overlay.id = 'transfer-offer-modal'
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999'
  const valueStr = formatMoney(player.value)
  const offerStr = formatMoney(offer)

  function renderInitial() {
    var teamLogoUrl = team.logo || NOPHOTO
    var playerAvatarUrl = player.avatar || NOPHOTO
    var exchangeSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
    var arrowSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
    var moneySvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>'
    var chartSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
    var checkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    var crossSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    var refreshSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
    overlay.innerHTML = `
      <div style="background:var(--bg-surface);border-radius:14px;padding:28px;max-width:420px;width:90%;box-shadow:0 4px 24px rgba(0,0,0,0.15);color:var(--text);font-family:inherit;border:1px solid var(--text-muted)">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:4px">${exchangeSvg} Oferta de fichaje</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px">
          <div style="text-align:center;flex:1">
            <img src="${teamLogoUrl}" alt="" style="width:56px;height:56px;border-radius:50%;object-fit:cover;background:var(--bg-card);border:2px solid var(--text-muted);display:block;margin:0 auto 6px" onerror="this.src='${NOPHOTO}'">
            <div style="font-size:13px;font-weight:600;color:var(--text);line-height:1.2">${team.name}</div>
          </div>
          <div style="color:var(--text-muted)">${arrowSvg}</div>
          <div style="text-align:center;flex:1">
            <img src="${playerAvatarUrl}" alt="" style="width:56px;height:56px;border-radius:50%;object-fit:cover;background:var(--bg-card);border:2px solid var(--text-muted);display:block;margin:0 auto 6px" onerror="this.src='${NOPHOTO}'">
            <div style="font-size:13px;font-weight:600;color:var(--text);line-height:1.2">${player.name}</div>
          </div>
        </div>
        <div style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0">
            <span style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--text-secondary)">${moneySvg} Oferta</span>
            <span style="font-size:18px;font-weight:700;color:#2E7D32">${offerStr}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-top:1px solid var(--text-muted)">
            <span style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--text-secondary)">${chartSvg} Valor de mercado</span>
            <span style="font-size:14px;color:var(--text)">${valueStr}</span>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <div onclick="aceptarOferta('${player.id}','${team.teamId}',${offer})" style="display:flex;align-items:center;justify-content:center;gap:6px;flex:1;padding:14px;background:#2E7D32;border-radius:10px;text-align:center;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background='#388E3C'" onmouseout="this.style.background='#2E7D32'">${checkSvg} Aceptar</div>
          <div onclick="rechazarOferta('${player.id}')" style="display:flex;align-items:center;justify-content:center;gap:6px;flex:1;padding:14px;background:#c62828;border-radius:10px;text-align:center;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background='#d32f2f'" onmouseout="this.style.background='#c62828'">${crossSvg} Rechazar</div>
        </div>
        <div onclick="window.renderContra()" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:14px;background:var(--accent);border-radius:10px;text-align:center;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background='#1E40AF'" onmouseout="this.style.background='var(--accent)'">${refreshSvg} Contraofertar</div>
      </div>`
  }
  window.renderInitial = renderInitial

  function renderContra() {
    overlay.innerHTML = `
      <div style="background:var(--bg-surface);border-radius:14px;padding:28px;max-width:420px;width:90%;box-shadow:0 4px 24px rgba(0,0,0,0.15);color:var(--text);font-family:inherit;border:1px solid var(--text-muted)">
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:4px">Tu contraoferta</div>
          <div style="font-size:13px;color:var(--text-secondary)">Precio que quieres pedir a ${team.name}</div>
        </div>
        <div style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:10px">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">Precio (\u20AC)</div>
          <input id="co-price" type="text" inputmode="numeric" value="${player.value.toLocaleString('es-ES')}" style="width:100%;padding:12px;background:var(--bg-surface);border:1px solid var(--text-muted);border-radius:8px;color:var(--text);font-size:18px;font-weight:700;outline:none;box-sizing:border-box">
          <div style="font-size:13px;color:var(--text-secondary);margin-top:8px">Valor de mercado: ${valueStr}</div>
        </div>
        <div id="co-resultado" style="margin-bottom:10px"></div>
        <div onclick="enviarContraoferta('${player.id}','${team.teamId}')" style="padding:14px;background:var(--accent);border-radius:10px;text-align:center;font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:background 0.2s;margin-bottom:8px" onmouseover="this.style.background='#1E40AF'" onmouseout="this.style.background='var(--accent)'">Enviar contraoferta</div>
        <div onclick="window.renderInitial()" style="padding:10px;background:transparent;border:1px solid var(--text-muted);border-radius:10px;text-align:center;font-size:14px;color:var(--text-secondary);cursor:pointer">Volver</div>
      </div>`
    document.getElementById('co-price').addEventListener('input', function() {
      var n = this.value.replace(/[^\d]/g, '')
      this.value = n ? parseInt(n, 10).toLocaleString('es-ES') : ''
    })
  }
  window.renderContra = renderContra

  window.enviarContraoferta = function(pid, tid) {
    var raw = document.getElementById('co-price').value.replace(/\./g, '')
    var price = parseInt(raw)
    if (!price || price < 1) { document.getElementById('co-resultado').innerHTML = '<div style="padding:10px;background:#c62828;border-radius:8px;font-size:13px;color:#fff;text-align:center">Introduce un precio v\u00e1lido</div>'; return }
    var pl = state.players.find(function(p) { return p.id === pid })
    if (!pl) return
    var teamObj = state.leagueTeams.find(function(t) { return t.teamId === tid })
    if (!teamObj) return
    var budget = getTeamBudget(teamObj)
    if (price > budget * 0.4) { document.getElementById('co-resultado').innerHTML = '<div style="padding:10px;background:#c62828;border-radius:8px;font-size:13px;color:#fff;text-align:center">El club no puede pagar esa cantidad</div>'; return }
    var prob = 0
    if (price >= pl.value * 1.15) prob = 80
    else if (price >= pl.value) prob = 55
    else if (price >= pl.value * 0.8) prob = 30
    else prob = 10
    if (Math.random() * 100 < prob) {
      document.getElementById('co-resultado').innerHTML = '<div style="padding:10px;background:#2E7D32;border-radius:8px;font-size:13px;color:#fff;text-align:center">\u00a1El club acepta tu contraoferta por ' + formatMoney(price) + '!</div>'
      setTimeout(function() { window.aceptarOferta(pid, tid, price) }, 800)
    } else {
      document.getElementById('co-resultado').innerHTML = '<div style="padding:10px;background:#c62828;border-radius:8px;font-size:13px;color:#fff;text-align:center">El club rechaza la contraoferta</div>'
    }
  }

  renderInitial()
  document.body.appendChild(overlay)
}

window.aceptarOferta = function(playerId, teamId, offer) {
  const modal = document.getElementById('transfer-offer-modal')
  if (modal) modal.remove()
  const player = state.players.find(p => p.id === playerId)
  if (!player) return
  const team = state.leagueTeams.find(t => t.teamId === teamId)
  if (!team) return
  if (team.players.length >= MAX_SQUAD) {
    addNotification('transfer', `⚠️ Oferta cancelada: ${player.name}`, `${team.name} tiene la plantilla completa`)
    return
  }
  state.finances.balance += offer
  state.finances.history.push({ reason: `💵 Traspaso: ${player.name} → ${team.name}`, amount: offer })
  const newP = { ...player, id: `${teamId}-tr-${Date.now()}`, transferListed: false, transferPrice: 0, loanListed: false, energy: randInt(70, 100), goals: 0, matches: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [] }
  team.players.push(newP)
  const idx = state.players.indexOf(player)
  if (idx >= 0) state.players.splice(idx, 1)
  addNotification('transfer', `💵 Traspasado: ${player.name}`, `${formatMoney(offer)} · Nuevo destino: ${team.name}`)
  rebuildGlobalPlayerPool()
  renderClub()
  renderMarketContent()
}

window.rechazarOferta = function(playerId) {
  const modal = document.getElementById('transfer-offer-modal')
  if (modal) modal.remove()
  const player = state.players.find(p => p.id === playerId)
  if (player) addNotification('transfer', `❌ Oferta rechazada: ${player.name}`, `Has rechazado la oferta por ${player.name}`)
}

window.contraOfertar = function(playerId, teamId, originalOffer) {
  const modal = document.getElementById('transfer-offer-modal')
  if (modal) modal.remove()
  const player = state.players.find(p => p.id === playerId)
  if (!player) return
  const counterPrice = Math.round(player.value * 1.1)
  const team = state.leagueTeams.find(t => t.teamId === teamId)
  if (!team) return
  const budget = getTeamBudget(team)
  if (counterPrice > budget * 0.4) {
    addNotification('transfer', `📊 Contraoferta rechazada`, `${team.name} no puede pagar ${formatMoney(counterPrice)} por ${player.name}`)
    return
  }
  addNotification('transfer', `📊 Contraoferta enviada`, `${formatMoney(counterPrice)} pedido a ${team.name} por ${player.name}`)
  if (Math.random() < 0.4) {
    addNotification('transfer', `✅ Contraoferta aceptada`, `${team.name} acepta pagar ${formatMoney(counterPrice)} por ${player.name}`)
    window.aceptarOferta(playerId, teamId, counterPrice)
  } else {
    addNotification('transfer', `❌ Contraoferta rechazada`, `${team.name} rechaza la contraoferta por ${player.name}`)
  }
}

function showSeasonProgressionModal(result, msg, skipStandings, nuevosTrofeos, logros) {
  var overlay = document.getElementById('progression-modal')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'progression-modal'
    overlay.className = 'progression-modal-overlay'
    document.body.appendChild(overlay)
  }

  var changes = result.changes || []
  var retirados = result.retirados || []
  nuevosTrofeos = nuevosTrofeos || []
  logros = logros || []

  var html = '<div class="progression-modal-card">'
  html += '<h2>Fin de Temporada</h2>'
  html += '<p class="progression-msg">' + msg.replace(/\n/g, '<br>') + '</p>'

  if (nuevosTrofeos.length > 0) {
    html += '<div class="progression-trophies">'
    html += '<h3>🏆 Trofeos</h3>'
    nuevosTrofeos.forEach(function(t) {
      html += '<p class="prog-trophy">' + t.competition + ' <span class="prog-season">(Temp. ' + t.season + ')</span></p>'
    })
    html += '</div>'
  }

  if (logros.length > 0) {
    html += '<div class="progression-logros">'
    html += '<h4>📊 Logros</h4>'
    logros.forEach(function(l) {
      html += '<p>' + l + '</p>'
    })
    html += '</div>'
  }

  if (changes.length > 0) {
    html += '<h3>Cambios de Valoración</h3>'
    html += '<div class="progression-list">'
    changes.sort(function(a, b) { return Math.abs(b.change) - Math.abs(a.change) })
    changes.forEach(function(c) {
      var arrow = c.change > 0 ? '▲' : '▼'
      var cls = c.change > 0 ? 'change-up' : 'change-down'
      html += '<div class="progression-item ' + cls + '">'
      html += '<span class="prog-name">' + c.name + '</span>'
      html += '<span class="prog-arrow">' + arrow + '</span>'
      html += '<span class="prog-change">' + (c.change > 0 ? '+' : '') + c.change + '</span>'
      html += '<span class="prog-old">' + c.oldSkill + '</span>'
      html += '<span class="prog-arrow">→</span>'
      html += '<span class="prog-new">' + c.newSkill + '</span>'
      html += '</div>'
    })
    html += '</div>'
  }

  if (retirados.length > 0) {
    html += '<div class="progression-retirados">'
    html += '<h4>🚑 Retiradas</h4>'
    retirados.forEach(function(p) {
      html += '<p>' + p.name + ' (' + p.age + ' años) se retira tras ' + (p.matches || 0) + ' partidos esta temporada</p>'
    })
    html += '</div>'
  }

  html += '<button id="btn-next-season" class="btn-primary">COMENZAR SIGUIENTE TEMPORADA</button>'
  html += '</div>'
  overlay.innerHTML = html
  overlay.classList.remove('hidden')

  document.getElementById('btn-next-season').addEventListener('click', function() {
    state.players.forEach(function(p) { p.age = (p.age || 22) + 1 })
    /* Age AI team players too */
    state.leagueTeams.forEach(function(t) { t.players.forEach(function(p) { p.age = (p.age || 22) + 1 }) })

    retirados.forEach(function(p) {
      var idx = state.players.indexOf(p)
      if (idx >= 0) state.players.splice(idx, 1)
    })

    var league = getLeagueFromId(state.leagueId)
    var allTeams = league ? league.teams : []
    state.leagueTeams = allTeams.filter(function(t) { return t.id !== state.teamId }).map(function(t) {
      var existing = state.leagueTeams.find(function(x) { return x.teamId === t.id })
      return {
        teamId: t.id, name: t.name,
        players: existing ? existing.players.map(function(p) { return Object.assign({}, p, { energy: 100, injury: null, goals: 0, matches: 0 }) })
          : (getRealSquad(t.id) || []).map(function(p) { return Object.assign({}, p, { value: calcValue(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, energy: 100, goals: 0, matches: 0 }) }),
        staff: t.staff || existing && existing.staff || [],
      }
    })
    state.fixtures = generateFixtures([state.teamId].concat(state.leagueTeams.map(function(t) { return t.teamId })))
    state.totalMatchdays = Math.max.apply(null, state.fixtures.map(function(f) { return f.matchday }))
    state.currentMatchday = 1
    state.allLeagueData = {}
    initAllLeagueData()
    state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
    state.playoffs = null
    state.seasonNumber++
    state.players.forEach(function(p) { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    overlay.classList.add('hidden')
    renderLeague()
    saveGame()

    if (!skipStandings) {
      addNotification('general', msg, 'Nueva temporada en ' + divName(state.leagueId))
      setTimeout(function() { alert(msg) }, 100)
    }
  })
}

function divName(leagueId) {
  if (leagueId.startsWith('l3c')) return '3a Divisió Catalana'
  if (leagueId.startsWith('l2c')) return '2a Divisió Catalana'
  if (leagueId.startsWith('lc')) return '1a Divisió Catalana'
  if (leagueId.startsWith('lhc')) return 'Divisió d\'Honor Catalana'
  if (leagueId.startsWith('l3g')) return '3ª División Nacional'
  if (leagueId.startsWith('l2b')) return '2ª División B'
  if (leagueId === 'lnfs2') return 'Segunda División'
  if (leagueId === 'lnfs1') return 'Primera División'
  if (leagueId === 'lpl') return 'Liga Polaca'
  if (leagueId === 'lpl2') return 'Segunda Polaca'
  if (leagueId === 'lpl3') return 'Tercera Polaca'
  if (leagueId.startsWith('lpl4g')) return 'Cuarta Polaca'
  if (leagueId.startsWith('l3sg')) return 'Primera RFEF'
  return 'la categoría'
}

function procesarFinTemporada(skipAging, skipStandings) {
  if (!skipAging) var agingResult = envejecerYProgresar()
  let cambioDivision = false
  let pos = 0
  let esPrimera = false, esSegunda = false, esSegundaB = false, esTercera = false, esHonor = false, esPrimeraCat = false, esSegonaCat = false, esTerceraCat = false
  let esPolaca1 = false, esPolaca2 = false, esPolaca3 = false, esPolaca4 = false
  let esPrimeraPortugal = false, esSegundaPortugal = false
  let esPlayoffTercera = false, esPlayoffPolaca2 = false, esPlayoffPolaca3 = false, esPlayoffDescensoLP3 = false, esPlayoffAscensoLP4 = false
  let esPlayoffSegundaSpain = false
  let esPlayoffAscensoPortugal = false, esPlayoffDescensoPortugal = false
  let msg = ''

  if (!skipStandings) {
    const standings = updateLeagueStandings()
    pos = standings.findIndex(s => s.teamId === state.teamId) + 1
    state.oldLeagueId = state.leagueId
    esPrimera = state.leagueId === 'lnfs1'
    esPrimeraSpain = state.leagueId === 'l1s'
    esSegunda = state.leagueId === 'lnfs2'
    esSegundaB = state.leagueId && state.leagueId.startsWith('l2b')
    esTercera = state.leagueId && state.leagueId.startsWith('l3g')
    esHonor = state.leagueId && state.leagueId.startsWith('lhc')
    esPrimeraCat = state.leagueId && state.leagueId.startsWith('lc')
    esSegonaCat = state.leagueId && state.leagueId.startsWith('l2c')
    esTerceraCat = state.leagueId && state.leagueId.startsWith('l3c')
    esPolaca1 = state.leagueId === 'lpl'
    esPolaca2 = state.leagueId === 'lpl2'
    esPolaca3 = state.leagueId === 'lpl3'
    esPolaca4 = state.leagueId && state.leagueId.startsWith('lpl4g')
    var esTerceraRFEF = state.leagueId && state.leagueId.startsWith('l3sg')
    esPrimeraSpain = state.leagueId === 'l1s'
    esPrimeraPortugal = state.leagueId === 'l1p'
    esSegundaPortugal = state.leagueId === 'l2p'
    esSegundaSpain = state.leagueId === 'l2s'

    const esTerceraCatalana = state.leagueId === 'l3g1' || state.leagueId === 'l3g2'
    const totalTeams = standings.length

    if (esPrimeraSpain && pos >= 18) {
      var filialId = findBTeamOf(state.teamId)
      var filialInL2s = filialId && getLeagueTeams('l2s').some(function(t) { return t.id === filialId })
      if (filialInL2s) state._filialRelegue = filialId
      cambioDivision = true
    } else if (esPrimera && pos >= 15) {
      state.leagueId = 'lnfs2'
      cambioDivision = true
    } else if (esSegunda && pos <= 2) {
      state.leagueId = 'lnfs1'
      cambioDivision = true
    } else if (esSegunda && pos >= 15) {
      const gruposB = ['l2b1','l2b2','l2b3','l2b4','l2b5','l2b6']
      state.leagueId = pickRandom(gruposB)
      cambioDivision = true
    } else if (esSegundaB && pos <= 2) {
      state.leagueId = 'lnfs2'
      cambioDivision = true
    } else if (esSegundaB && pos >= 15) {
      const gruposT = getTerceraGroupIds()
      state.leagueId = pickRandom(gruposT)
      cambioDivision = true
    } else if (esTercera && pos === 1) {
      esPlayoffTercera = true
    } else if (esTercera && esTerceraCatalana && pos >= totalTeams - 2) {
      const gruposH = ['lhc1','lhc2','lhc3']
      state.leagueId = pickRandom(gruposH)
      cambioDivision = true
    } else if (esHonor && pos <= 2) {
      state.leagueId = Math.random() < 0.5 ? 'l3g1' : 'l3g2'
      cambioDivision = true
    } else if (esHonor && pos >= totalTeams - 1) {
      const grupos1a = ['lc1','lc2','lc3','lc4','lc5','lc6','lc7']
      state.leagueId = pickRandom(grupos1a)
      cambioDivision = true
    } else if (esPrimeraCat && pos <= 2) {
      state.leagueId = pickRandom(['lhc1','lhc2','lhc3'])
      cambioDivision = true
    } else if (esPrimeraCat && pos >= totalTeams - 1) {
      const grupos2a = ['l2c1','l2c2','l2c3','l2c4','l2c5','l2c6','l2c7','l2c9','l2c11','l2c12','l2c13','l2c14']
      state.leagueId = pickRandom(grupos2a)
      cambioDivision = true
    } else if (esSegonaCat && pos <= 2) {
      state.leagueId = pickRandom(['lc1','lc2','lc3','lc4','lc5','lc6','lc7'])
      cambioDivision = true
    } else if (esSegonaCat && pos >= totalTeams - 1) {
      const grupos3a = ['l3c1','l3c2','l3c3','l3c4','l3c5','l3c6','l3c7','l3c8','l3c9','l3c10',
                        'l3c11','l3c12','l3c13','l3c14','l3c15','l3c16','l3c17','l3c18','l3c19','l3c20']
      state.leagueId = pickRandom(grupos3a)
      cambioDivision = true
    } else if (esTerceraCat && pos <= 2) {
      const grupos2a = ['l2c1','l2c2','l2c3','l2c4','l2c5','l2c6','l2c7','l2c9','l2c11','l2c12','l2c13','l2c14']
      state.leagueId = pickRandom(grupos2a)
      cambioDivision = true
    } else if (esPolaca1 && pos >= 15) {
      var _filialId = findBTeamOf(state.teamId)
      var filialInLpl2 = _filialId && getLeagueTeams('lpl2').some(function(t) { return t.id === _filialId })
      if (filialInLpl2) state._filialRelegue = _filialId
      state.leagueId = 'lpl2'
      cambioDivision = true
    } else if (esPolaca2 && pos <= 2) {
      var _parentId = getBTeamParent(state.teamId)
      if (_parentId && getLeagueTeams('lpl').some(function(t) { return t.id === _parentId })) {
        msg = '\uD83C\uDFF4 El filial no puede ascender. El primer equipo ya est\u00e1 en Liga Polaca.'
      } else {
        state.leagueId = 'lpl'
        cambioDivision = true
      }
    } else if (esPolaca2 && pos >= 3 && pos <= 6) {
      esPlayoffPolaca2 = true
    } else if (esPolaca2 && pos >= 16) {
      state.leagueId = 'lpl3'
      cambioDivision = true
    } else if (esPolaca3 && pos <= 2) {
      state.leagueId = 'lpl2'
      cambioDivision = true
    } else if (esPolaca3 && pos >= 3 && pos <= 6) {
      esPlayoffPolaca3 = true
    } else if (esPolaca3 && pos >= 13 && pos <= 14) {
      esPlayoffDescensoLP3 = true
    } else if (esPolaca3 && pos >= 16) {
      const grupos4 = ['lpl4g1','lpl4g2','lpl4g3','lpl4g4']
      state.leagueId = pickRandom(grupos4)
      cambioDivision = true
    } else if (esPolaca4 && pos === 1) {
      state.leagueId = 'lpl3'
      cambioDivision = true
    } else if (esPolaca4 && pos === 2) {
      esPlayoffAscensoLP4 = true
    } else if (esSegundaSpain && pos <= 2) {
      var _p = getBTeamParent(state.teamId)
      if (_p && getLeagueTeams('l1s').some(function(t) { return t.id === _p })) {
        msg = '\uD83C\uDFF4 El filial no puede ascender a LaLiga. El primer equipo ya est\u00e1 en Primera.'
      } else {
        state.leagueId = 'l1s'
        cambioDivision = true
      }
    } else if (esSegundaSpain && pos >= 3 && pos <= 6) {
      esPlayoffSegundaSpain = true
    } else if (esSegundaSpain && pos >= 19) {
      state.leagueId = 'l2b1'
      cambioDivision = true
    } else if (esPrimeraPortugal && pos >= 17) {
      var _f = findBTeamOf(state.teamId)
      if (_f && getLeagueTeams('l2p').some(function(t) { return t.id === _f })) state._filialRelegue = _f
      state.leagueId = 'l2p'
      cambioDivision = true
    } else if (esPrimeraPortugal && pos === 16) {
      esPlayoffDescensoPortugal = true
    } else if (esSegundaPortugal && pos <= 2) {
      var _p2 = getBTeamParent(state.teamId)
      if (_p2 && getLeagueTeams('l1p').some(function(t) { return t.id === _p2 })) {
        msg = '\uD83C\uDFF4 El filial no puede ascender. El primer equipo ya est\u00e1 en Primeira Liga.'
      } else {
        state.leagueId = 'l1p'
        cambioDivision = true
      }
    } else if (esSegundaPortugal && pos === 3) {
      esPlayoffAscensoPortugal = true
    } else if (esTerceraRFEF && pos <= 2) {
      state.leagueId = 'l2s'
      cambioDivision = true
    } else if (esTerceraRFEF && pos >= 3 && pos <= 6) {
      esPlayoffSegundaSpain = true
    } else if (esTerceraRFEF && pos >= 17) {
      if (leagueExists('l2b1')) {
        state.leagueId = 'l2b1'
        cambioDivision = true
      }
    }

    var noLowerDivision = false
    if (cambioDivision && state.leagueId && !leagueExists(state.leagueId)) {
      cambioDivision = false
      state.leagueId = state.oldLeagueId || state.leagueId
      noLowerDivision = true
    }

    msg = `📊 Temporada finalizada. Posición: ${pos}º`
    if (esPlayoffSegundaSpain) msg += '\n🏆 Accedes a la Fase de Ascenso a LaLiga'
    else if (cambioDivision && esSegundaSpain && pos <= 2) msg += '\n🎉 ¡ASCENSO a LaLiga!'
    else if (cambioDivision && esSegundaSpain) msg += '\n⚠️ DESCENSO a Primera Federación'
    else if (cambioDivision && esPrimera) msg += '\n⚠️ DESCENSO a Segunda División'
    else if (cambioDivision && esSegunda && pos >= 15) msg += '\n⚠️ DESCENSO a 2ª División B'
    else if (cambioDivision && esSegunda) msg += '\n🎉 ¡ASCENSO a Primera División!'
    else if (cambioDivision && esSegundaB && pos <= 2) msg += '\n🎉 ¡ASCENSO a Segunda División!'
    else if (cambioDivision && esSegundaB) msg += '\n⚠️ DESCENSO a 3ª División Nacional'
    else if (esPlayoffTercera) msg += '\n🏆 ¡CAMPEÓN DE GRUPO! Accedes a la Fase de Ascenso'
    else if (cambioDivision && esTercera) msg += '\n⚠️ DESCENSO a Divisió d\'Honor Catalana'
    else if (cambioDivision && esHonor && pos <= 2) msg += '\n🎉 ¡ASCENSO a 3ª División Nacional!'
    else if (cambioDivision && esHonor) msg += '\n⚠️ DESCENSO a 1a Divisió Catalana'
    else if (cambioDivision && esPrimeraCat && pos <= 2) msg += '\n🎉 ¡ASCENSO a Divisió d\'Honor Catalana!'
    else if (cambioDivision && esPrimeraCat) msg += '\n⚠️ DESCENSO a 2a Divisió Catalana'
    else if (cambioDivision && esSegonaCat && pos <= 2) msg += '\n🎉 ¡ASCENSO a 1a Divisió Catalana!'
    else if (cambioDivision && esSegonaCat) msg += '\n⚠️ DESCENSO a 3a Divisió Catalana'
    else if (cambioDivision && esTerceraCat) msg += '\n🎉 ¡ASCENSO a 2a Divisió Catalana!'
    else if (cambioDivision && esPolaca1) {
      msg += '\n⚠️ DESCENSO a Segunda Polaca'
      if (state._filialRelegue) msg += '\n⚠️ Tu filial desciende automáticamente a Tercera Polaca.'
    }
    else if (cambioDivision && esPolaca2 && pos <= 2) msg += '\n🎉 ¡ASCENSO a Liga Polaca!'
    else if (cambioDivision && esPolaca2) msg += '\n⚠️ DESCENSO a Tercera Polaca'
    else if (esPlayoffPolaca2) msg += '\n🏆 Accedes a la Fase de Ascenso a Liga Polaca'
    else if (cambioDivision && esPolaca3 && pos <= 2) msg += '\n🎉 ¡ASCENSO a Segunda Polaca!'
    else if (cambioDivision && esPolaca3) msg += '\n⚠️ DESCENSO a Cuarta Polaca'
    else if (esPlayoffPolaca3) msg += '\n🏆 Accedes a la Fase de Ascenso a Segunda Polaca'
    else if (esPlayoffDescensoLP3) msg += '\n⚠️ Playoff de Descenso — te la juegas por la permanencia'
    else if (cambioDivision && esPolaca4) msg += '\n🎉 ¡ASCENSO a Tercera Polaca!'
    else if (esPlayoffAscensoLP4) msg += '\n🏆 Accedes a la Fase de Ascenso a Tercera Polaca'
    else if (cambioDivision && esPrimeraPortugal) {
      msg += '\n⚠️ DESCENSO a Segunda Liga Portugal'
      if (state._filialRelegue) msg += '\n⚠️ Tu filial desciende automáticamente a la siguiente categoría.'
    }
    else if (esSegundaPortugal && pos <= 2 && !cambioDivision && getBTeamParent(state.teamId) && getLeagueTeams('l1p').some(t => t.id === getBTeamParent(state.teamId))) {
      /* promotion blocked — msg already set */
    } else if (cambioDivision && esSegundaPortugal) msg += '\n🎉 ¡ASCENSO a Liga Portugal Betclic!'
    else if (esPlayoffAscensoPortugal) msg += '\n🏆 Accedes al Playoff de Ascenso a Primeira Liga'
    else if (esPlayoffDescensoPortugal) msg += '\n⚠️ Playoff de Descenso — te la juegas por la permanencia en Primeira Liga'
    else if (esTercera) msg += '\nPermanencia en 3ª División Nacional'
    else if (esSegundaB) msg += '\nPermanencia en 2ª División B'
    else if (esHonor) msg += '\nPermanencia en Divisió d\'Honor Catalana'
    else if (esPrimeraCat) msg += '\nPermanencia en 1a Divisió Catalana'
    else if (esSegonaCat) msg += '\nPermanencia en 2a Divisió Catalana'
    else if (esTerceraCat) msg += '\nPermanencia en 3a Divisió Catalana'
    else if (esPolaca1) msg += '\nPermanencia en Liga Polaca'
    else if (esPolaca2) msg += '\nPermanencia en Segunda Polaca'
    else if (esPolaca3) msg += '\nPermanencia en Tercera Polaca'
    else if (esPolaca4) msg += '\nPermanencia en Cuarta Polaca'
    else if (esPrimeraPortugal) msg += '\nPermanencia en Primeira Liga'
    else if (esSegundaPortugal) msg += '\nPermanencia en Segunda Liga Portugal'
    else if (esPrimeraSpain && pos === 1) msg += '\n🏆 ¡CAMPEÓN DE LA LIGA!'
    else if (esPrimeraSpain && pos <= 4) msg += '\n✅ Clasificado a Champions League'
    else if (esPrimeraSpain && pos === 5) msg += '\n✅ Clasificado a Europa League'
    else if (esPrimeraSpain && pos === 6) msg += '\n✅ Clasificado a Conference League'
    else if (esPrimeraSpain && pos >= 18) {
      msg += '\n⚠️ DESCENSO a Segunda División'
      if (state._filialRelegue) msg += '\n⚠️ Tu filial desciende automáticamente a 1ª Federación.'
    }
    else if (esPrimeraSpain) msg += '\nPermanencia en Primera División'
    else if (esTerceraRFEF && cambioDivision && pos <= 2) msg += '\n🎉 ¡ASCENSO a Segunda División!'
    else if (esTerceraRFEF && cambioDivision) msg += '\n⚠️ DESCENSO a 2ª División B'
    else if (esTerceraRFEF) msg += '\nPermanencia en Primera RFEF'
    else if (noLowerDivision) msg += '\n⚠️ No hay divisiones inferiores. El equipo permanece en la categoría.'
    else msg += '\nPermanencia en la categoría'
  }

  if (esPlayoffTercera) {
    /* Tercera champion — enter playoff for promotion to Segunda B */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Fase de Ascenso a Segunda División B')
    setTimeout(() => { alert(msg); iniciarPlayoffTercera() }, 100)
    return
  }

  if (esPlayoffPolaca2) {
    /* lpl2 positions 3-6 — enter promotion playoff to lpl */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Playoff de Ascenso a Liga Polaca')
    setTimeout(() => { alert(msg); iniciarPlayoffPolaca2() }, 100)
    return
  }

  if (esPlayoffPolaca3) {
    /* lpl3 positions 3-6 — enter promotion playoff to lpl2 */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Playoff de Ascenso a Segunda Polaca')
    setTimeout(() => { alert(msg); iniciarPlayoffPolaca3() }, 100)
    return
  }

  if (esPlayoffDescensoLP3) {
    /* lpl3 positions 13-14 — relegation playoff */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `⚠️ ${msg}`, 'Playoff de Descenso en Tercera Polaca')
    setTimeout(() => { alert(msg); iniciarPlayoffDescensoLP3() }, 100)
    return
  }

  if (esPlayoffAscensoLP4) {
    /* lpl4 position 2 — enter promotion playoff to lpl3 */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Playoff de Ascenso a Tercera Polaca')
    setTimeout(() => { alert(msg); iniciarPlayoffAscensoLP4() }, 100)
    return
  }

  if (esPlayoffAscensoPortugal) {
    /* l2p position 3 — promotion playoff vs l1p position 16 */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Playoff de Ascenso a Primeira Liga')
    setTimeout(() => { alert(msg); iniciarPlayoffAscensoPortugal() }, 100)
    return
  }

  if (esPlayoffDescensoPortugal) {
    /* l1p position 16 — relegation playoff vs l2p position 3 */
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `⚠️ ${msg}`, 'Playoff de Descenso en Primeira Liga')
    setTimeout(() => { alert(msg); iniciarPlayoffDescensoPortugal() }, 100)
    return
  }

  if (esPlayoffSegundaSpain) {
    state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
    document.getElementById('league-results-wrap').classList.add('hidden')
    renderLeague()
    saveGame()
    addNotification('match', `🏆 ${msg}`, 'Playoff de Ascenso a LaLiga')
    setTimeout(() => { alert(msg); iniciarPlayoffSegundaSpain() }, 100)
    return
  }

  /* Normal season end — detect trophies & logros, show progression modal */
  if (!skipStandings) {
    var nuevosTrofeos = []
    var logros = []
    if (pos === 1) {
      var _league = getLeagueFromId(state.leagueId)
      var trofeo = { competition: 'Campeón de ' + (_league ? _league.name : state.leagueId), season: state.seasonNumber }
      state.trophies.push(trofeo)
      nuevosTrofeos.push(trofeo)
      /* Store champion for next season's Supercopa */
      state.leagueChampion = state.teamId
    }
    if (pos === 2) {
      state.leagueRunnerUp = state.teamId
    }
    if (cambioDivision && pos <= 2) {
      logros.push('Ascenso directo de categoría')
    }
    showSeasonProgressionModal(agingResult || { changes: [], retirados: [] }, msg, skipStandings, nuevosTrofeos, logros)
    return
  }

  /* Post-playflow — immediate reset (used for procesarFinTemporada(true, true) after playoffs) */
  const league = getLeagueFromId(state.leagueId)
  const allTeams = league ? league.teams : []
  state.leagueTeams = allTeams.filter(t => t.id !== state.teamId).map(t => {
    const existing = state.leagueTeams.find(x => x.teamId === t.id)
    return {
      teamId: t.id, name: t.name,
      players: existing ? existing.players.map(p => ({ ...p, energy: 100, injury: null, goals: 0, matches: 0 }))
        : (getRealSquad(t.id) || []).map(p => ({ ...p, value: calcValue(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, energy: 100, goals: 0, matches: 0 })),
      staff: t.staff || existing?.staff || [],
    }
  })
  state.fixtures = generateFixtures([state.teamId, ...state.leagueTeams.map(t => t.teamId)])
  state.totalMatchdays = Math.max(...state.fixtures.map(f => f.matchday))
  state.currentMatchday = 1
  state.allLeagueData = {}
  initAllLeagueData()
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.playoffs = null
  state.seasonNumber++
  /* Regenerate cup for new season (Spain only) */
  if (state.countryId === 'es') {
    state.cup = generarCopa()
    state.supercopa = generarSupercopa()
  } else {
    state.cup = null
    state.supercopa = null
  }
  state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
  document.getElementById('league-results-wrap').classList.add('hidden')
  renderLeague()
  saveGame()
}

function getTerceraGroupIds() {
  return ['l3g1','l3g2','l3g3','l3g4','l3g5','l3g6','l3g7','l3g8','l3g9','l3g10',
          'l3g11','l3g12','l3g13','l3g14','l3g15','l3g16','l3g17','l3g18','l3g19',
          'l3g20','l3g21','l3g23','l3g24']
}

function iniciarPlayoffs(teamIds) {
  state.playoffs = {
    round: 'QF',
    fixtures: [
      { round: 'QF', home: teamIds[0], away: teamIds[7], homeScore: null, awayScore: null, played: false },
      { round: 'QF', home: teamIds[3], away: teamIds[4], homeScore: null, awayScore: null, played: false },
      { round: 'QF', home: teamIds[1], away: teamIds[6], homeScore: null, awayScore: null, played: false },
      { round: 'QF', home: teamIds[2], away: teamIds[5], homeScore: null, awayScore: null, played: false },
    ],
  }
  const msg = `🏆 ¡CLASIFICADO al Playoff! Posición: ${teamIds.indexOf(state.teamId) + 1}º\nRonda: Cuartos de final`
  addNotification('match', msg, 'Eliminatorias por el título')
  document.getElementById('league-results-wrap').classList.add('hidden')
  renderLeague()
  saveGame()
  setTimeout(() => alert(msg), 100)
}

function avanzarRondaPlayoff() {
  const pf = state.playoffs
  if (!pf) return
  const allPlayed = pf.fixtures.every(f => f.played)
  if (!allPlayed) return

  const winners = pf.fixtures.map(f => (f.homeScore > f.awayScore ? f.home : f.away))

  if (pf.esPolaca3 && pf.round === 'SF') {
    /* Polish 3rd div: SF done → check promotion, then F */
    const userFixture = pf.fixtures.find(f => f.home === state.teamId || f.away === state.teamId)
    if (userFixture) {
      const userScore = userFixture.home === state.teamId ? userFixture.homeScore : userFixture.awayScore
      const rivalScore = userFixture.home === state.teamId ? userFixture.awayScore : userFixture.homeScore
      pf.promoted = userScore > rivalScore
    }
    pf.round = 'F'
    pf.fixtures = [
      { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
    ]
    if (pf.promoted) {
      addNotification('match', '🎉 ¡ASCENSO a Segunda Polaca!', 'Ganaste la semifinal del Playoff de Ascenso')
      setTimeout(() => alert('🎉 ¡ASCENSO a Segunda Polaca!\n\nGanaste la semifinal y consigues el ascenso de categoría.'), 200)
    }
  } else if (pf.esPolaca2 && pf.round === 'SF') {
    /* Polish 2nd div: SF done → check promotion, then F */
    const userFixture = pf.fixtures.find(f => f.home === state.teamId || f.away === state.teamId)
    if (userFixture) {
      const userScore = userFixture.home === state.teamId ? userFixture.homeScore : userFixture.awayScore
      const rivalScore = userFixture.home === state.teamId ? userFixture.awayScore : userFixture.homeScore
      pf.promoted = userScore > rivalScore
    }
    pf.round = 'F'
    pf.fixtures = [
      { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
    ]
    if (pf.promoted) {
      addNotification('match', '🎉 ¡ASCENSO a Liga Polaca!', 'Ganaste la semifinal del Playoff de Ascenso')
      setTimeout(() => alert('🎉 ¡ASCENSO a Liga Polaca!\n\nGanaste la semifinal y consigues el ascenso de categoría.'), 200)
    }
  } else if (pf.esPlayoffSegundaSpain && pf.round === 'SF') {
    const userFixture = pf.fixtures.find(f => f.home === state.teamId || f.away === state.teamId)
    if (userFixture) {
      const userScore = userFixture.home === state.teamId ? userFixture.homeScore : userFixture.awayScore
      const rivalScore = userFixture.home === state.teamId ? userFixture.awayScore : userFixture.homeScore
      pf.promoted = userScore > rivalScore
    }
    pf.round = 'F'
    pf.fixtures = [
      { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
    ]
    if (pf.promoted) {
      addNotification('match', '🎉 ¡ASCENSO a LaLiga!', 'Ganaste la semifinal del Playoff de Ascenso')
      setTimeout(() => alert('🎉 ¡ASCENSO a LaLiga!\n\nGanaste la semifinal y consigues el ascenso de categoría.'), 200)
    }
  } else if (pf.esTercera && pf.round === 'SF') {
    /* Tercera: SF done → check promotion, then F */
    const userFixture = pf.fixtures.find(f => f.home === state.teamId || f.away === state.teamId)
    if (userFixture) {
      const userScore = userFixture.home === state.teamId ? userFixture.homeScore : userFixture.awayScore
      const rivalScore = userFixture.home === state.teamId ? userFixture.awayScore : userFixture.homeScore
      pf.promoted = userScore > rivalScore
    }
    pf.round = 'F'
    pf.fixtures = [
      { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
    ]
    if (pf.promoted) {
      addNotification('match', '🎉 ¡ASCENSO a 2ª División B!', 'Ganaste la semifinal de la Fase de Ascenso')
      setTimeout(() => alert('🎉 ¡ASCENSO a 2ª División B!\n\nGanaste la semifinal y consigues el ascenso de categoría.'), 200)
    }
  } else if (pf.esAscensoLP4 && pf.round === 'SF') {
    const userFixture = pf.fixtures.find(f => f.home === state.teamId || f.away === state.teamId)
    const userWon = userFixture && (
      (userFixture.home === state.teamId && userFixture.homeScore > userFixture.awayScore) ||
      (userFixture.away === state.teamId && userFixture.awayScore > userFixture.homeScore)
    )
    if (userWon) {
      pf.promoted = true
      pf.round = 'F'
      pf.fixtures = [
        { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
      ]
      addNotification('match', '🎉 ¡A la Final!', 'Ganaste la semifinal del Playoff de Ascenso')
      setTimeout(() => alert('🎉 ¡A la final!\n\nGanaste la semifinal. Ahora te juegas el ascenso en la final.'), 200)
      saveGame()
    } else {
      const msg = '❌ Eliminado en semifinales.\n\nNo lograste el ascenso. Una temporada más en Cuarta Polaca.'
      addNotification('match', '❌ Eliminado', 'No lograste superar la semifinal del Playoff de Ascenso')
      state.playoffs = null
      setTimeout(() => { alert(msg); procesarFinTemporada(true, true) }, 200)
    }
    return
  } else if (pf.esAscensoLP4 && pf.round === 'F') {
    const ganador = winners[0]
    const esGanador = ganador === state.teamId
    state.playoffs = null
    if (esGanador) {
      state.leagueId = 'lpl3'
      setTimeout(() => {
        alert('🎉 ¡ASCENSO a Tercera Polaca!\n\nGanaste el playoff de ascenso desde Cuarta Polaca.')
        procesarFinTemporada(true, true)
      }, 300)
    } else {
      setTimeout(() => {
        alert('❌ Perdiste la final.\n\nNo lograste el ascenso. Una temporada más en Cuarta Polaca.')
        procesarFinTemporada(true, true)
      }, 300)
    }
    return
  } else if (pf.round === 'QF') {
    pf.round = 'SF'
    pf.fixtures = [
      { round: 'SF', home: winners[0], away: winners[3], homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: winners[1], away: winners[2], homeScore: null, awayScore: null, played: false },
    ]
  } else if (pf.round === 'SF' && !pf.esTercera) {
    pf.round = 'F'
    pf.fixtures = [
      { round: 'F', home: winners[0], away: winners[1], homeScore: null, awayScore: null, played: false },
    ]
  } else if (pf.round === 'F') {
    const campeon = winners[0]
    const subcampeon = winners[0] === pf.fixtures[0].home ? pf.fixtures[0].away : pf.fixtures[0].home
    const esCampeon = campeon === state.teamId
    const esTercera = pf.esTercera
    const esPolaca2 = pf.esPolaca2
    const esPolaca3 = pf.esPolaca3
    const esPlayoffSegundaSpain = pf.esPlayoffSegundaSpain
    const promovio = pf.promoted
    const msg = `🏆 ${esCampeon ? '¡CAMPEÓN!' : 'Subcampeón'} — ${esCampeon ? 'Ganaste el título' : 'El campeón es ' + getTeamName(campeon)}`
    addNotification('match', msg, 'Playoff finalizado')
    state.playoffs = null
    if (esPlayoffSegundaSpain) {
      if (promovio) {
        state.leagueId = 'l1s'
        setTimeout(() => {
          alert(`${msg}\n\n${esCampeon ? '¡Ascenso a LaLiga y título!' : 'Ascenso a LaLiga conseguido'}`)
          procesarFinTemporada(true, true)
        }, 300)
      } else {
        setTimeout(() => {
          const divName = state.oldLeagueId && state.oldLeagueId.startsWith('l3sg') ? 'Primera RFEF' : 'Segunda División'
          alert(`${msg}\n\nNo lograste el ascenso. Una temporada más en ${divName}.`)
          procesarFinTemporada(true, true)
        }, 300)
      }
    } else if (esPolaca3) {
      if (promovio) {
        state.leagueId = 'lpl2'
        setTimeout(() => {
          alert(`${msg}\n\n${esCampeon ? '¡Ascenso a Segunda Polaca y título!' : 'Ascenso a Segunda Polaca conseguido'}`)
          procesarFinTemporada(true, true)
        }, 300)
      } else {
        setTimeout(() => {
          alert(`${msg}\n\nNo lograste el ascenso. Una temporada más en Tercera Polaca.`)
          procesarFinTemporada(true, true)
        }, 300)
      }
    } else if (esPolaca2) {
      if (promovio) {
        state.leagueId = 'lpl'
        setTimeout(() => {
          alert(`${msg}\n\n${esCampeon ? '¡Ascenso a Liga Polaca y título!' : 'Ascenso a Liga Polaca conseguido'}`)
          procesarFinTemporada(true, true)
        }, 300)
      } else {
        setTimeout(() => {
          alert(`${msg}\n\nNo lograste el ascenso. Una temporada más en Segunda Polaca.`)
          procesarFinTemporada(true, true)
        }, 300)
      }
    } else if (esTercera) {
      /* Tercera playoff complete */
      if (promovio) {
        const gruposB = ['l2b1','l2b2','l2b3','l2b4','l2b5','l2b6']
        state.leagueId = pickRandom(gruposB)
        setTimeout(() => {
          alert(`${msg}\n\n${esCampeon ? '¡Ascenso y título!' : 'Ascenso conseguido'}`)
          procesarFinTemporada(true, true)
        }, 300)
      } else {
        setTimeout(() => {
          alert(`${msg}\n\nNo lograste el ascenso. Una temporada más en 3ª División.`)
          procesarFinTemporada(true, true)
        }, 300)
      }
    } else if (pf.esDescensoLP3) {
      const ganador = winners[0]
      const perdedor = ganador === pf.fixtures[0].home ? pf.fixtures[0].away : pf.fixtures[0].home
      const salvado = ganador === state.teamId
      const msgD = `⚔️ Playoff Descenso — ${salvado ? '¡PERMANENCIA!' : 'DESCENSO'}`
      addNotification('match', msgD, salvado ? 'Te quedas en Tercera Polaca' : 'Bajas a Cuarta Polaca')
      if (salvado) {
        setTimeout(() => {
          alert('✅ ¡PERMANENCIA!\n\nGanaste el playoff de descenso. Una temporada más en Tercera Polaca.')
          procesarFinTemporada(true, true)
        }, 300)
      } else {
        const grupos4 = ['lpl4g1','lpl4g2','lpl4g3','lpl4g4']
        state.leagueId = pickRandom(grupos4)
        setTimeout(() => {
          alert('❌ DESCENSO a Cuarta Polaca.\n\nPerdiste el playoff de descenso.')
          procesarFinTemporada(true, true)
        }, 300)
      }
    } else if (pf.esPlayoffPortugal) {
      const ganador = winners[0]
      const ganadorUser = ganador === state.teamId
      if (pf.esAscenso) {
        /* User was l2p P3, playing to ascend */
        if (ganadorUser) {
          state.leagueId = 'l1p'
          setTimeout(() => {
            alert('🎉 ¡ASCENSO a Primeira Liga!\n\nGanaste el playoff de ascenso desde Segunda Liga Portugal.')
            procesarFinTemporada(true, true)
          }, 300)
        } else {
          setTimeout(() => {
            alert('❌ No lograste el ascenso.\n\nUna temporada más en Segunda Liga Portugal.')
            procesarFinTemporada(true, true)
          }, 300)
        }
      } else {
        /* User was l1p P16, playing to stay */
        if (ganadorUser) {
          setTimeout(() => {
            alert('✅ ¡PERMANENCIA!\n\nGanaste el playoff de descenso. Una temporada más en Primeira Liga.')
            procesarFinTemporada(true, true)
          }, 300)
        } else {
          state.leagueId = 'l2p'
          setTimeout(() => {
            alert('❌ DESCENSO a Segunda Liga Portugal.\n\nPerdiste el playoff de descenso.')
            procesarFinTemporada(true, true)
          }, 300)
        }
      }
    } else {
      /* LNFS or other championship playoff */
      if (esCampeon) {
        var league = getLeagueFromId(state.leagueId)
        state.trophies.push({ competition: 'Campeón de ' + (league ? league.name : state.leagueId), season: state.seasonNumber })
      }
      setTimeout(() => { alert(msg); procesarFinTemporada() }, 100)
    }
    return
  }
  saveGame()
}

function iniciarPlayoffTercera() {
  const gruposT = getTerceraGroupIds()
  const otherChampions = []
  for (const gid of gruposT) {
    if (gid === state.leagueId) continue
    const league = getLeagueFromId(gid)
    if (!league || !league.teams) continue
    otherChampions.push(pickRandom(league.teams).id)
  }
  otherChampions.sort(() => Math.random() - 0.5)
  const selectedOthers = otherChampions.slice(0, 3)

  state.playoffs = {
    round: 'SF',
    fixtures: [
      { round: 'SF', home: state.teamId, away: selectedOthers[0], homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: selectedOthers[1], away: selectedOthers[2], homeScore: null, awayScore: null, played: false },
    ],
    esTercera: true,
    promoted: false,
  }
  const rivalName = getTeamName(selectedOthers[0])
  addNotification('match', '🏆 Fase de Ascenso — Semifinal', `Te enfrentas a ${rivalName} por el ascenso a 2ª División B`)
  saveGame()
}

function iniciarPlayoffSegundaSpain() {
  const standings = updateLeagueStandings()
  const teamIds = standings.map(s => s.teamId)
  state.playoffs = {
    round: 'SF',
    fixtures: [
      { round: 'SF', home: teamIds[2], away: teamIds[5], homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: teamIds[3], away: teamIds[4], homeScore: null, awayScore: null, played: false },
    ],
    esPlayoffSegundaSpain: true,
    promoted: false,
  }
  const rivalName = getTeamName(teamIds[2] === state.teamId ? teamIds[5] : teamIds[2])
  addNotification('match', '🏆 Playoff Ascenso — Semifinal', `Te enfrentas a ${rivalName} por el ascenso a LaLiga`)
  saveGame()
}

function iniciarPlayoffPolaca2() {
  const standings = updateLeagueStandings()
  const teamIds = standings.map(s => s.teamId)
  /* Positions 3-6 enter the promotion playoff */
  state.playoffs = {
    round: 'SF',
    fixtures: [
      { round: 'SF', home: teamIds[2], away: teamIds[5], homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: teamIds[3], away: teamIds[4], homeScore: null, awayScore: null, played: false },
    ],
    esPolaca2: true,
    promoted: false,
  }
  const rivalName = getTeamName(teamIds[2] === state.teamId ? teamIds[5] : teamIds[2])
  addNotification('match', '🏆 Playoff Ascenso — Semifinal', `Te enfrentas a ${rivalName} por el ascenso a Liga Polaca`)
  saveGame()
}

function iniciarPlayoffPolaca3() {
  const standings = updateLeagueStandings()
  const teamIds = standings.map(s => s.teamId)
  state.playoffs = {
    round: 'SF',
    fixtures: [
      { round: 'SF', home: teamIds[2], away: teamIds[5], homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: teamIds[3], away: teamIds[4], homeScore: null, awayScore: null, played: false },
    ],
    esPolaca3: true,
    promoted: false,
  }
  const rivalName = getTeamName(teamIds[2] === state.teamId ? teamIds[5] : teamIds[2])
  addNotification('match', '🏆 Playoff Ascenso — Semifinal', `Te enfrentas a ${rivalName} por el ascenso a Segunda Polaca`)
  saveGame()
}

function iniciarPlayoffDescensoLP3() {
  const standings = updateLeagueStandings()
  const teamIds = standings.map(s => s.teamId)
  const pos13 = teamIds[12]
  const pos14 = teamIds[13]
  state.playoffs = {
    round: 'F',
    fixtures: [
      { round: 'F', home: pos13, away: pos14, homeScore: null, awayScore: null, played: false },
    ],
    esDescensoLP3: true,
  }
  const rivalName = getTeamName(pos13 === state.teamId ? pos14 : pos13)
  addNotification('match', '⚠️ Playoff Descenso — Final', `Te enfrentas a ${rivalName} por la permanencia en Tercera Polaca`)
  saveGame()
}

function iniciarPlayoffAscensoLP4() {
  const grupos4 = ['lpl4g1','lpl4g2','lpl4g3','lpl4g4']
  var segundos = []

  /* Get user's own 2nd place */
  const userStandings = updateLeagueStandings()
  if (userStandings.length >= 2) {
    const userSegundo = userStandings[1]
    segundos.push({ teamId: userSegundo.teamId, pts: userSegundo.pts, name: getTeamName(userSegundo.teamId) })
  }

  /* Get 2nd place from other groups */
  for (const gid of grupos4) {
    if (gid === state.leagueId) continue
    const data = state.allLeagueData[gid]
    if (!data || !data.fixtures) continue
    const league = getLeagueFromId(gid)
    if (!league || !league.teams) continue
    const teamIds = league.teams.map(t => t.id)
    const standings = computeStandings(data.fixtures, teamIds)
    if (standings.length >= 2) {
      const segundo = standings[1]
      segundos.push({ teamId: segundo.teamId, pts: segundo.pts, name: getTeamName(segundo.teamId) })
    }
  }

  /* Sort by points descending */
  segundos.sort(function(a, b) { return b.pts - a.pts })

  if (segundos.length < 4) {
    /* Fallback — not enough data, skip playoff */
    alert('No hay suficientes datos para el playoff de ascenso.')
    procesarFinTemporada(true, true)
    return
  }

  state.playoffs = {
    round: 'SF',
    fixtures: [
      { round: 'SF', home: segundos[0].teamId, away: segundos[3].teamId, homeScore: null, awayScore: null, played: false },
      { round: 'SF', home: segundos[1].teamId, away: segundos[2].teamId, homeScore: null, awayScore: null, played: false },
    ],
    esAscensoLP4: true,
    promoted: false,
  }
  /* Find user's opponent */
  const userFixture = state.playoffs.fixtures.find(function(f) { return f.home === state.teamId || f.away === state.teamId })
  const oppName = userFixture ? getTeamName(userFixture.home === state.teamId ? userFixture.away : userFixture.home) : '—'
  addNotification('match', '🏆 Playoff Ascenso — Semifinal', `Te enfrentas a ${oppName} por el ascenso a Tercera Polaca`)
  saveGame()
}

function iniciarPlayoffAscensoPortugal() {
  /* l2p position 3 — promotion playoff vs l1p position 16 */
  const l1pTeams = getLeagueTeams('l1p')
  const l1pData = state.allLeagueData['l1p']
  if (!l1pData || !l1pData.fixtures || l1pTeams.length < 16) {
    alert('No hay suficientes datos para el playoff de ascenso a Primeira Liga.')
    procesarFinTemporada(true, true)
    return
  }
  const l1pStandings = computeStandings(l1pData.fixtures, l1pTeams.map(t => t.id))
  const rivalId = l1pStandings[15] ? l1pStandings[15].teamId : l1pTeams[15].id

  state.playoffs = {
    round: 'F',
    fixtures: [
      { round: 'F', home: state.teamId, away: rivalId, homeScore: null, awayScore: null, played: false },
    ],
    esPlayoffPortugal: true,
    esAscenso: true,
  }
  const rivalName = getTeamName(rivalId)
  addNotification('match', '🏆 Playoff Ascenso — Final', `Te enfrentas a ${rivalName} por el ascenso a Primeira Liga`)
  saveGame()
}

function iniciarPlayoffDescensoPortugal() {
  /* l1p position 16 — relegation playoff vs l2p position 3 */
  const l2pTeams = getLeagueTeams('l2p')
  const l2pData = state.allLeagueData['l2p']
  if (!l2pData || !l2pData.fixtures || l2pTeams.length < 3) {
    alert('No hay suficientes datos para el playoff de descenso en Primeira Liga.')
    procesarFinTemporada(true, true)
    return
  }
  const l2pStandings = computeStandings(l2pData.fixtures, l2pTeams.map(t => t.id))
  const rivalId = l2pStandings[2] ? l2pStandings[2].teamId : l2pTeams[2].id

  state.playoffs = {
    round: 'F',
    fixtures: [
      { round: 'F', home: state.teamId, away: rivalId, homeScore: null, awayScore: null, played: false },
    ],
    esPlayoffPortugal: true,
    esAscenso: false,
  }
  const rivalName = getTeamName(rivalId)
  addNotification('match', '⚠️ Playoff Descenso — Final', `Te enfrentas a ${rivalName} por la permanencia en Primeira Liga`)
  saveGame()
}

function getPlayoffRival() {
  if (!state.playoffs) return null
  const f = state.playoffs.fixtures.find(x => (x.home === state.teamId || x.away === state.teamId) && !x.played)
  return f ? (f.home === state.teamId ? f.away : f.home) : null
}

/* ============ QUICK SIMULATION ============ */
function simularPartidoRapido(fixture, rivalId) {
  if (!fixture || !rivalId) { console.warn('[SIM] simularPartidoRapido cancelado - fixture o rivalId inv\u00e1lido', { fixture: !!fixture, rivalId: rivalId }); return }
  const slots = state.tacticsSlots || []
  var startingIds = slots.filter(Boolean)
  startingIds = startingIds.filter(function(pid) {
    var p = state.players.find(function(x) { return x.id === pid })
    return !p || !p._suspended
  })
  if (startingIds.length < 11) {
    alert('\u26a0\ufe0f Hay jugadores suspendidos. Revisa tu alineaci\u00f3n antes de simular.')
    return
  }
  const maxBench = getEffectiveMaxBench()
  if (state.benchIds.length > maxBench) {
    alert('\u26a0\ufe0f Demasiados suplentes. M\u00e1ximo ' + maxBench + ' en el banquillo para esta categor\u00eda.')
    return
  }

  showLoading('Simulando jornada...')

  setTimeout(() => {
    /* 1. Simulate user's match */
    const isHome = fixture.home === state.teamId
    const roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['4-3-3']
    let totalEff = 0
    for (let i = 0; i < roles.length; i++) {
      const pid = startingIds[i]
      const p = state.players.find(x => x.id === pid)
      if (p) totalEff += calcularMediaEnPosicion(p, roles[i])
    }
    const userPower = totalEff / 11

    const rivalTeam = getTeamObj(rivalId)
    let rivalPower = 0
    if (rivalTeam && rivalTeam.players && rivalTeam.players.length > 0) {
      rivalPower = Math.round(getTop11Average(rivalTeam.players) * getTop11EnergyFactor(rivalTeam.players))
    } else {
      const db = getBaseDato(rivalId)
      rivalPower = db ? db.rating : 70
    }

    const homeFactor = isHome ? 1.05 : 1.0
    const awayFactor = isHome ? 0.97 : 1.0
    const userFinal = userPower * (0.8 + Math.random() * 0.4) * homeFactor
    const rivalFinal = rivalPower * (0.8 + Math.random() * 0.4) * awayFactor
    const totalGoals = 2 + Math.floor(Math.random() * 5)
    const probUser = userFinal / (userFinal + rivalFinal)
    let rawUser = Math.round(totalGoals * probUser)
    let rawRival = totalGoals - rawUser
    if (rawUser === 0 && rawRival === 0 && totalGoals >= 2) {
      if (Math.random() < 0.5) { rawUser++ } else { rawRival++ }
    }
    const us = Math.min(10, Math.max(0, rawUser))
    const them = Math.min(10, Math.max(0, rawRival))

    if (isHome) { fixture.homeScore = us; fixture.awayScore = them }
    else { fixture.homeScore = them; fixture.awayScore = us }
    fixture.played = true

    /* Track user match stats */
    state.players.forEach(p => { p.minutosEnPista = 0; p._goalsInMatch = 0; p._assistThisMatch = 0 })
    startingIds.forEach(pid => {
      const p = state.players.find(x => x.id === pid)
      if (p) { p.minutosEnPista = 90; p.matches = (p.matches || 0) + 1 }
    })
    /* Add position experience */
    startingIds.forEach(function(pid, idx) {
      var p = state.players.find(function(x) { return x.id === pid })
      if (!p) return
      var role = roles[idx]
      var posKey = SIGLA_TO_POS[role] || role
      p.positionExperience = p.positionExperience || {}
      p.positionExperience[posKey] = (p.positionExperience[posKey] || 0) + 1
    })
    state.players.forEach(function(p) {
      if (!p.positionExperience) return
      // Si no jug\u00f3 de titular pero tiene experiencia, mantener
      if (!startingIds.includes(p.id) && p.minutosEnPista > 0) {
        var role = roles[state.benchIds.indexOf(p.id)] || p.position
        var posKey = SIGLA_TO_POS[role] || role
        p.positionExperience = p.positionExperience || {}
        p.positionExperience[posKey] = (p.positionExperience[posKey] || 0) + 0.5
      }
    })
    const userGoalscorers = []
    for (let g = 0; g < us; g++) {
      const valid = state.players.filter(p => startingIds.includes(p.id) && p.position !== 'POR' && !p.injury)
      if (valid.length === 0) break
      const scorer = pickWeightedRandom(valid, function(p) { return getGoalWeight(p.position) })
      scorer.goals = (scorer.goals || 0) + 1
      scorer._goalsInMatch = (scorer._goalsInMatch || 0) + 1
      let assistName = null
      if (Math.random() < 0.35) {
        const pool = state.players.filter(p => startingIds.includes(p.id) && p.id !== scorer.id && !p.injury)
        if (pool.length > 0) {
          const a = pool[Math.floor(Math.random() * pool.length)]
          a.assists = (a.assists || 0) + 1
          a._assistThisMatch = (a._assistThisMatch || 0) + 1
          assistName = a.name
        }
      }
      userGoalscorers.push({ scorerName: scorer.name, assistName })
    }

    /* Generate rival goalscorers */
    const rivalGoalscorers = []
    const rivalFieldPlayers = (rivalTeam.players || []).filter(function(p) { return p.position !== 'POR' })
    for (var rg = 0; rg < them; rg++) {
      if (rivalFieldPlayers.length === 0) break
      var rScorer = rivalFieldPlayers[Math.floor(Math.random() * rivalFieldPlayers.length)]
      rivalGoalscorers.push(rScorer.name)
    }

    /* Yellow and red cards for user's players */
    var cardGamePlan = state.tactic.gamePlan || 'extremo'
    state.players.filter(p => startingIds.includes(p.id) && p.position !== 'POR' && !p.injury).forEach(function(p) {
      asignarTarjetasJugador(p, cardGamePlan)
    })
    procesarSuspensiones()

    /* Fatigue for user's players */
    state.players.forEach(p => {
      if (!p.injury && startingIds.includes(p.id)) p.energy = Math.max(10, p.energy - (GAME_PLANS[state.tactic.gamePlan]?.drain || 10))
      p.enPista = false; p.convocado = false; p.titular = false
    })
    /* Recovery for unused players (bench/reserves who didn't play) */
    state.players.forEach(p => {
      if (!p.injury && p.minutosEnPista === 0 && p.energy < 100) {
        p.energy = Math.min(100, p.energy + 25)
      }
    })

    /* Track position experience + mainPct */
    state.players.forEach(function(p) {
      if (p.minutosEnPista > 0) {
        var idx = startingIds.indexOf(p.id)
        if (idx >= 0 && idx < roles.length) {
          var role = roles[idx]
          var naturalKey = SIGLA_TO_POS[p.position] || p.position
          if (!p.positionExperience) p.positionExperience = {}
          if (naturalKey === role) {
            /* Incrementar mainPct cuando juega en su posición natural */
            if (p.mainPct == null) p.mainPct = 99
            if (p.mainPct < 100) {
              p.mainPct = Math.min(100, p.mainPct + 0.25)
            }
          } else {
            p.positionExperience[role] = (p.positionExperience[role] || 0) + 1
            if (!p.otherPositions) p.otherPositions = []
            var existing = p.otherPositions.find(function(o) { return o.pos === role })
            var newPct = Math.min(100, p.positionExperience[role] * 3)
            if (!existing) p.otherPositions.push({ pos: role, pct: newPct })
            else existing.pct = Math.max(existing.pct, newPct)
          }
        }
      }
    })

    /* Simulate up to 5 substitutions for user's team based on score */
    const maxBench = getEffectiveMaxBench()
    const benchPlayers = state.benchIds.map(id => state.players.find(p => p.id === id)).filter(Boolean)
    let userSubs = 0
    const needsOffensive = us < them /* losing → more offensive changes */
    const needsDefensive = us > them /* winning → more defensive */
    for (let s = 0; s < Math.min(5, benchPlayers.length); s++) {
      let subIdx = -1
      if (needsOffensive && s < 3) {
        /* Try to sub in a forward/mid for a defender */
        const forward = benchPlayers.find(p => !p.injury && (p.position === 'delantero' || p.position === 'extremo_izq' || p.position === 'extremo_der' || p.position === 'medio_ofensivo'))
        if (forward) {
          subIdx = benchPlayers.indexOf(forward)
          const tired = startingIds.filter(id => { const pl = state.players.find(x => x.id === id); return pl && !pl.injury && pl.energy < 40 })
          if (tired.length > 0) {
            const out = state.players.find(x => x.id === tired[Math.floor(Math.random() * tired.length)])
            if (out) { out.energy = Math.max(10, out.energy - 3); userSubs++ }
          }
        }
      } else if (needsDefensive && s < 2) {
        const defender = benchPlayers.find(p => !p.injury && (p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq'))
        if (defender) {
          subIdx = benchPlayers.indexOf(defender)
          const tired = startingIds.filter(id => { const pl = state.players.find(x => x.id === id); return pl && !pl.injury && pl.energy < 40 })
          if (tired.length > 0) {
            const out = state.players.find(x => x.id === tired[Math.floor(Math.random() * tired.length)])
            if (out) { out.energy = Math.max(10, out.energy - 3); userSubs++ }
          }
        }
      }
      if (subIdx < 0) {
        /* Generic sub: swap a tired player */
        const tired = startingIds.filter(id => { const pl = state.players.find(x => x.id === id); return pl && !pl.injury && pl.energy < 50 })
        if (tired.length > 0 && s < benchPlayers.length) {
          subIdx = s
          const out = state.players.find(x => x.id === tired[Math.floor(Math.random() * tired.length)])
          if (out) { out.energy = Math.max(10, out.energy - 2); userSubs++ }
        }
      }
    }

    /* 2. Simulate ALL AI matches for this matchday */
    const otherFixtures = state.fixtures.filter(f => f.matchday === state.currentMatchday && !f.played && f.home !== state.teamId && f.away !== state.teamId)
    for (const f of otherFixtures) {
      const r = autoSimulateOtherMatch(f.home, f.away)
      f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
      /* Apply fatigue and substitutions to AI teams */
      for (const tid of [f.home, f.away]) {
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (team && team.players) {
          team.players.forEach(p => { if (!p.injury) p.energy = Math.max(10, (p.energy || 80) - (GAME_PLANS[team.gamePlan]?.drain || 10)) })
          const aiBench = team.players.filter(p => p.position !== 'POR').slice(11, 11 + getEffectiveMaxBench())
          const subsMade = Math.min(5, aiBench.length, Math.floor(Math.random() * 3 + 1))
          for (let s = 0; s < subsMade; s++) {
            const tiredIdx = Math.floor(Math.random() * Math.min(11, team.players.length))
            if (team.players[tiredIdx] && !team.players[tiredIdx].injury) {
              team.players[tiredIdx].energy = Math.max(10, team.players[tiredIdx].energy + 10)
            }
          }
        }
      }
    }

    /* 3. Finance reward for user */
    const rew = getDivisionMatchReward(state.leagueId)
    if (us > them) state.finances.balance += rew.win
    else if (us === them) state.finances.balance += rew.draw
    else state.finances.balance += rew.loss
    state.finances.history.push({
      reason: 'J' + state.currentMatchday + ': ' + us + '-' + them + ' vs ' + getTeamName(rivalId),
      amount: us > them ? rew.win : us === them ? rew.draw : rew.loss
    })

    /* Matchday income (taquilla local + bonus victoria) */
    if (state.presupuestoInicial > 0) {
      var mIngresos = 0
      if (isHome) {
        var taquilla = Math.round(state.presupuestoInicial * 0.004)
        state.finances.balance += taquilla
        state.finances.history.push({ reason: 'Ingresos por d\u00eda de partido (local)', amount: taquilla })
        mIngresos += taquilla
      }
      if (us > them) {
        var bono = Math.round(state.presupuestoInicial * 0.002)
        state.finances.balance += bono
        state.finances.history.push({ reason: 'Prima por victoria', amount: bono })
        mIngresos += bono
      }
    }
    addNotification('match',
      (us > them ? 'Victoria' : us === them ? 'Empate' : 'Derrota') + ' ' + us + '-' + them + ' vs ' + getTeamName(rivalId),
      'Jornada ' + state.currentMatchday + ' \u00b7 ' + (us > them ? '+' : us === them ? '+' : '') + (us > them ? rew.win : us === them ? rew.draw : rew.loss) + ' \u20ac'
    )

    /* Individual match ratings per player */
    try {
      var _rn = getTeamName(rivalId)
      state.players.filter(function(p) { return p.minutosEnPista > 0 }).forEach(function(p) {
        if (!p.matchHistory) p.matchHistory = []
        var _wb = (us > them) ? 0.5 : (us === them) ? 0.2 : 0
        var _yp = p._yellowThisMatch ? -0.5 : 0
        var _rpd = p._redThisMatch ? -2.0 : 0
        var _gb = (p._goalsInMatch || 0) * 1.2
        var _ab = (p._assistThisMatch || 0) * 0.6
        var _clean = (p._yellowThisMatch || p._redThisMatch) ? 0 : 0.2
        var _rf = (Math.random() - 0.5) * 0.6
        var _cs = 0
        if (them === 0 && (p.position === 'POR' || p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq')) _cs = 0.5
        var _rr = Math.min(10, Math.max(1, 6.2 + _wb + _yp + _rpd + _gb + _ab + _clean + _rf + _cs))
        p.matchHistory.push({
          matchday: state.currentMatchday,
          rival: _rn,
          minutes: p.minutosEnPista || 0,
          rating: Math.min(10, Math.max(1, _rr)),
          goals: p._goalsInMatch || 0,
          yellow: !!p._yellowThisMatch,
          red: !!p._redThisMatch,
        })
        if (p.matchHistory.length > 30) p.matchHistory = p.matchHistory.slice(-30)
        if (!p.teamStats) p.teamStats = {}
        if (!p.teamStats[state.teamId]) p.teamStats[state.teamId] = { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        p.teamStats[state.teamId].matches++
        p.teamStats[state.teamId].goals += (p._goalsInMatch || 0)
        if (p._assistThisMatch) p.teamStats[state.teamId].assists++
        if (p._yellowThisMatch) p.teamStats[state.teamId].yellowCards++
        if (p._redThisMatch) p.teamStats[state.teamId].redCards++
      })
    } catch (e) { console.error('[RATING] Error computing match ratings:', e) }

    updateLeagueStandings()

    /* 4. Show jornada summary modal */
    const userMatch = { homeId: isHome ? state.teamId : rivalId, awayId: isHome ? rivalId : state.teamId, homeName: isHome ? state.team : getTeamName(rivalId), awayName: isHome ? getTeamName(rivalId) : state.team, homeScore: isHome ? us : them, awayScore: isHome ? them : us, isUser: true }
    const allResults = [userMatch].concat(otherFixtures.map(f => ({
      homeId: f.home, awayId: f.away, homeName: getTeamName(f.home), awayName: getTeamName(f.away),
      homeScore: f.homeScore, awayScore: f.awayScore, isUser: false
    })))

    showJornadaModal(state.currentMatchday, allResults, userGoalscorers, rivalGoalscorers)
    hideLoading()

    /* Cleanup temp match vars after modal is rendered */
    state.players.forEach(function(p) { delete p._yellowThisMatch; delete p._redThisMatch; delete p._goalsInMatch; delete p._assistThisMatch })
  }, 400)
}

/* ============ CUP MATCH SIMULATION ============ */
function simularPartidoCopa(fixture, rivalId, isSupercopa) {
  if (!fixture || !rivalId) return
  var slots = state.tacticsSlots || []
  var startingIds = slots.filter(Boolean)
  startingIds = startingIds.filter(function(pid) {
    var p = state.players.find(function(x) { return x.id === pid })
    return !p || !p._suspended
  })
  if (startingIds.length < 11) { alert('\u26a0\ufe0f Hay jugadores suspendidos. Revisa tu alineaci\u00f3n.'); return }
  /* En Copa se permiten 12 suplentes y 5 cambios */
  if (state.benchIds.length > 12) { alert('\u26a0\ufe0f M\u00e1ximo 12 suplentes en Copa.'); return }

  showLoading('Simulando partido de Copa...')

  setTimeout(function() {
    var isHome = fixture.home === state.teamId
    var roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['4-3-3']
    var totalEff = 0
    for (var ei = 0; ei < roles.length; ei++) {
      var pid = startingIds[ei]
      var p = state.players.find(function(x) { return x.id === pid })
      if (p) totalEff += calcularMediaEnPosicion(p, roles[ei])
    }
    var userPower = totalEff / 11

    var rivalTeam = getTeamObj(rivalId)
    var rivalPower = 0
    if (rivalTeam && rivalTeam.players && rivalTeam.players.length > 0) {
      rivalPower = Math.round(getTop11Average(rivalTeam.players) * getTop11EnergyFactor(rivalTeam.players))
    } else {
      var db = getBaseDato(rivalId)
      rivalPower = db ? db.rating : 70
    }

    var homeFactor = isHome ? 1.05 : 1.0
    var awayFactor = isHome ? 0.97 : 1.0
    var userFinal = userPower * (0.8 + Math.random() * 0.4) * homeFactor
    var rivalFinal = rivalPower * (0.8 + Math.random() * 0.4) * awayFactor
    var totalG = 2 + Math.floor(Math.random() * 5)
    var probU = userFinal / (userFinal + rivalFinal)
    var rawU = Math.round(totalG * probU)
    var rawR = totalG - rawU
    if (rawU === 0 && rawR === 0 && totalG >= 2) { if (Math.random() < 0.5) rawU++; else rawR++ }
    var us = Math.min(10, Math.max(0, rawU))
    var them = Math.min(10, Math.max(0, rawR))

    /* Pr\u00f3rroga si empate en Copa */
    if (us === them) {
      var extraU = userPower / 11 * (0.6 + Math.random() * 0.3) * homeFactor
      var extraR = rivalPower * (0.6 + Math.random() * 0.3) * awayFactor
      var extraG = 1 + Math.floor(Math.random() * 3)
      var probEx = extraU / (extraU + extraR + 0.001)
      var exU = Math.round(extraG * probEx)
      var exR = extraG - exU
      if (exU > exR) { us += exU; them += exR }
      else if (exR > exU) { us += exR; them += exU }
      else {
        /* Penaltis: 5 rondas + muerte s\u00fabita */
        var uPen = 0, rPen = 0
        for (var pen = 0; pen < 5; pen++) { if (Math.random() < 0.75) uPen++; if (Math.random() < 0.72) rPen++ }
        var sp = 5
        while (uPen === rPen && sp < 20) { if (Math.random() < 0.75) uPen++; if (Math.random() < 0.70) rPen++; sp++ }
        if (uPen > rPen) us++; else them++
      }
      /* Desgaste extra por pr\u00f3rroga */
      state.players.forEach(function(p) { if (p.minutosEnPista > 0) p.energy = Math.max(3, p.energy - 10) })
    }

    fixture.homeScore = isHome ? us : them
    fixture.awayScore = isHome ? them : us
    fixture.played = true

    /* Player stats tracking */
    state.players.forEach(function(p) { p.minutosEnPista = 0; p._goalsInMatch = 0; p._assistThisMatch = 0 })
    startingIds.forEach(function(pid) {
      var p = state.players.find(function(x) { return x.id === pid })
      if (p) { p.minutosEnPista = 90; p.matches = (p.matches || 0) + 1 }
    })
    /* Position experience */
    startingIds.forEach(function(pid, idx) {
      var p = state.players.find(function(x) { return x.id === pid })
      if (!p) return
      var role = roles[idx]
      var posKey = SIGLA_TO_POS[role] || role
      p.positionExperience = p.positionExperience || {}
      p.positionExperience[posKey] = (p.positionExperience[posKey] || 0) + 1
    })
    /* Goalscorers */
    var userGoalscorers = []
    for (var g = 0; g < (isHome ? us : them); g++) {
      var valid = state.players.filter(function(pl) { return startingIds.indexOf(pl.id) >= 0 && pl.position !== 'POR' && !pl.injury })
      if (valid.length === 0) break
      var scorer = pickWeightedRandom(valid, function(pl) { return getGoalWeight(pl.position) })
      scorer.goals = (scorer.goals || 0) + 1
      scorer._goalsInMatch = (scorer._goalsInMatch || 0) + 1
      var assistName = null
      if (Math.random() < 0.35) {
        var pool = state.players.filter(function(pl) { return startingIds.indexOf(pl.id) >= 0 && pl.id !== scorer.id && !pl.injury })
        if (pool.length > 0) {
          var a = pool[Math.floor(Math.random() * pool.length)]
          a.assists = (a.assists || 0) + 1
          a._assistThisMatch = (a._assistThisMatch || 0) + 1
          assistName = a.name
        }
      }
      userGoalscorers.push({ scorerName: scorer.name, assistName: assistName })
    }
    /* Rival goalscorers */
    var rivalGoalscorers = []
    var rivalField = (rivalTeam.players || []).filter(function(pl) { return pl.position !== 'POR' })
    for (var rg = 0; rg < (isHome ? them : us); rg++) {
      if (rivalField.length === 0) break
      rivalGoalscorers.push(rivalField[Math.floor(Math.random() * rivalField.length)].name)
    }
    /* Cards */
    var cardGP = state.tactic.gamePlan || 'extremo'
    state.players.filter(function(pl) { return startingIds.indexOf(pl.id) >= 0 && pl.position !== 'POR' && !pl.injury }).forEach(function(pl) {
      asignarTarjetasJugador(pl, cardGP)
    })
    procesarSuspensiones()
    /* Fatigue */
    state.players.forEach(function(p) {
      if (!p.injury && startingIds.indexOf(p.id) >= 0) p.energy = Math.max(10, p.energy - (GAME_PLANS[state.tactic.gamePlan]?.drain || 10))
      p.enPista = false; p.convocado = false; p.titular = false
    })
    state.players.forEach(function(p) {
      if (!p.injury && p.minutosEnPista === 0 && p.energy < 100) p.energy = Math.min(100, p.energy + 25)
    })
    /* Fatiga extra por partido intersemanal (Copa en mi\u00e9rcoles + Liga en finde) */
    state.players.forEach(function(p) {
      if (startingIds.indexOf(p.id) >= 0) p.energy = Math.max(5, (p.energy || 80) - 15)
    })

    /* Financial reward + taquilla local */
    var rew = getCupReward(0)
    if (us > them) { state.finances.balance += rew; state.stats.wins++ }
    else { state.finances.losses++; state.finances.balance += getCupRewardLoss(0) }
    state.finances.history.push({ reason: (isSupercopa ? 'Supercopa' : 'Copa del Rey') + ': ' + us + '-' + them + ' vs ' + getTeamName(rivalId), amount: us > them ? rew : getCupRewardLoss(0) })
    if (state.presupuestoInicial > 0 && isHome) {
      var taquillaCopa = Math.round(state.presupuestoInicial * 0.004)
      state.finances.balance += taquillaCopa
      state.finances.history.push({ reason: 'Taquilla Copa (local)', amount: taquillaCopa })
    }
    if (state.presupuestoInicial > 0 && us > them) {
      var bonoCopa = Math.round(state.presupuestoInicial * 0.003)
      state.finances.balance += bonoCopa
      state.finances.history.push({ reason: 'Prima victoria Copa', amount: bonoCopa })
    }

    /* Auto-simulate other cup fixtures this round */
    var allRoundFixtures = []
    if (state.cup) allRoundFixtures = state.cup.allFixtures.filter(function(f) { return f.week === fixture.week && !f.played && f.home !== state.teamId && f.away !== state.teamId })
    allRoundFixtures.forEach(function(f) {
      var r = autoSimulateOtherMatch(f.home, f.away)
      f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
    })

    /* Check if user lost → eliminated */
    var userLost = (isHome ? us < them : us > them)
    if (userLost) {
      addNotification('general', '\u274c Eliminado de la ' + (isSupercopa ? 'Supercopa' : 'Copa del Rey'), 'Perdiste ' + us + '-' + them + ' contra ' + getTeamName(rivalId))
      if (isSupercopa) { avanzarSupercopa() } else if (state.cup) { avanzarRondaCopa() }
    } else {
      addNotification('transfer', '\u2705 Avanzas en ' + (isSupercopa ? 'Supercopa' : 'Copa'), 'Ganaste ' + us + '-' + them + ' contra ' + getTeamName(rivalId))
      if (isSupercopa) { avanzarSupercopa() } else if (state.cup) { avanzarRondaCopa() }
      if (isSupercopa && state.supercopa && state.supercopa.final && fixture === state.supercopa.final) {
        state.supercopa.winner = state.teamId
        addNotification('transfer', '\ud83c\udfc6 \u00a1Campe\u00f3n de la Supercopa!', state.team + ' gana la Supercopa de Espa\u00f1a')
      }
    }

    /* Ratings */
    try {
      var rn = getTeamName(rivalId)
      state.players.filter(function(p) { return p.minutosEnPista > 0 }).forEach(function(p) {
        if (!p.matchHistory) p.matchHistory = []
        var wb = (us > them) ? 0.5 : (us === them) ? 0.2 : 0
        var yp = p._yellowThisMatch ? -0.5 : 0
        var rp = p._redThisMatch ? -2.0 : 0
        var gb = (p._goalsInMatch || 0) * 1.2
        var ab = (p._assistThisMatch || 0) * 0.6
        var cl = (p._yellowThisMatch || p._redThisMatch) ? 0 : 0.2
        var rf = (Math.random() - 0.5) * 0.6
        var cs = 0
        if (them === 0 && (p.position === 'POR' || p.position === 'defensa_central' || p.position === 'lateral_der' || p.position === 'lateral_izq')) cs = 0.5
        var rr = Math.min(10, Math.max(1, 6.2 + wb + yp + rp + gb + ab + cl + rf + cs))
        p.matchHistory.push({ matchday: state.currentMatchday, rival: rn, minutes: p.minutosEnPista || 0, rating: Math.min(10, Math.max(1, rr)), goals: p._goalsInMatch || 0, yellow: !!p._yellowThisMatch, red: !!p._redThisMatch })
        if (p.matchHistory.length > 30) p.matchHistory = p.matchHistory.slice(-30)
        if (!p.teamStats) p.teamStats = {}
        if (!p.teamStats[state.teamId]) p.teamStats[state.teamId] = { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        p.teamStats[state.teamId].matches++
        p.teamStats[state.teamId].goals += (p._goalsInMatch || 0)
        if (p._assistThisMatch) p.teamStats[state.teamId].assists++
        if (p._yellowThisMatch) p.teamStats[state.teamId].yellowCards++
        if (p._redThisMatch) p.teamStats[state.teamId].redCards++
      })
    } catch(e) { console.error('[RATING] Error:', e) }

    /* Show modal */
    var userMatch = { homeId: isHome ? state.teamId : rivalId, awayId: isHome ? rivalId : state.teamId, homeName: isHome ? state.team : getTeamName(rivalId), awayName: isHome ? getTeamName(rivalId) : state.team, homeScore: isHome ? us : them, awayScore: isHome ? them : us, isUser: true }
    var allCupResults = [userMatch].concat(allRoundFixtures.map(function(f) {
      return { homeId: f.home, awayId: f.away, homeName: getTeamName(f.home), awayName: getTeamName(f.away), homeScore: f.homeScore, awayScore: f.awayScore, isUser: false }
    }))
    showJornadaModal(state.currentMatchday, allCupResults, userGoalscorers, rivalGoalscorers)
    hideLoading()

    /* Override continue button for cup matches: just re-render, don't advance matchday */
    document.getElementById('mr-btn-continue').onclick = function() {
      document.getElementById('match-result-modal').style.display = 'none'
      document.getElementById('match-result-modal').classList.remove('open')
      autoSave()
      renderTab('home')
    }

    state.players.forEach(function(p) { delete p._yellowThisMatch; delete p._redThisMatch; delete p._goalsInMatch; delete p._assistThisMatch })
  }, 400)
}

/* Auto-simulate all remaining unplayed cup fixtures */
function autoSimularCopaRestante() {
  if (!state.cup) return
  state.cup.allFixtures.forEach(function(f) {
    if (f.played) return
    var r = autoSimulateOtherMatch(f.home, f.away)
    f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
  })
  var lastSched = state.cup.schedule[state.cup.schedule.length - 1]
  var finalF = state.cup.allFixtures.filter(function(f) { return f.week === lastSched.week })
  if (finalF.length > 0 && finalF[0].played) {
    var winner = finalF[0].homeScore > finalF[0].awayScore ? finalF[0].home : finalF[0].away
    state.cupChampion = winner
    state.cupRunnerUp = winner === finalF[0].home ? finalF[0].away : finalF[0].home
  }
}

function obtenerNotaJugador(playerId) {
  var p = state.players.find(function(x) { return x.id === playerId })
  if (!p || !p.matchHistory || p.matchHistory.length === 0) return '-'
  var last = p.matchHistory[p.matchHistory.length - 1]
  return last.rating ? last.rating.toFixed(1) : '-'
}

function showJornadaModal(matchday, allResults, userGoalscorers, rivalGoalscorers) {
  rivalGoalscorers = rivalGoalscorers || []
  const modal = document.getElementById('match-result-modal')
  document.getElementById('mr-matchday').textContent = 'Jornada ' + matchday

  /* Highlight user's match */
  let userMatch = null
  for (const r of allResults) { if (r.isUser) { userMatch = r; break } }
  const hl = userMatch ? (
    '<div class="mr-highlight-team">' +
      '<img class="mr-highlight-logo" src="' + (userMatch.homeId === state.teamId ? state.teamLogo : getTeamLogo(userMatch.homeId)) + '" alt="">' +
      '<span class="mr-highlight-name">' + userMatch.homeName + '</span>' +
    '</div>' +
    '<div class="mr-highlight-score">' +
      '<span class="mr-highlight-score-val">' + userMatch.homeScore + '</span>' +
      '<span class="mr-highlight-score-div">-</span>' +
      '<span class="mr-highlight-score-val">' + userMatch.awayScore + '</span>' +
    '</div>' +
    '<div class="mr-highlight-team">' +
      '<img class="mr-highlight-logo" src="' + (userMatch.awayId === state.teamId ? state.teamLogo : getTeamLogo(userMatch.awayId)) + '" alt="">' +
      '<span class="mr-highlight-name">' + userMatch.awayName + '</span>' +
    '</div>'
  ) : ''
  document.getElementById('mr-highlight').innerHTML = hl

  /* Scorers */
  let scorersHtml = '<div style="display:flex;justify-content:space-between;gap:8px;margin-top:8px">'
  if (userMatch) {
    var leftScorers = []
    var rightScorers = []
    if (userMatch.homeId === state.teamId) {
      leftScorers = userGoalscorers.map(function(g) { return '\u26bd ' + g.scorerName + (g.assistName ? ' (' + g.assistName + ')' : '') })
      rightScorers = rivalGoalscorers.map(function(n) { return '\u26bd ' + n })
    } else {
      leftScorers = rivalGoalscorers.map(function(n) { return '\u26bd ' + n })
      rightScorers = userGoalscorers.map(function(g) { return '\u26bd ' + g.scorerName + (g.assistName ? ' (' + g.assistName + ')' : '') })
    }
    scorersHtml += '<div style="flex:1;text-align:center;font-size:12px;font-weight:600;color:var(--text)">' + leftScorers.join('<br>') + '</div>'
    scorersHtml += '<div style="flex:1;text-align:center;font-size:12px;font-weight:600;color:var(--text)">' + rightScorers.join('<br>') + '</div>'
  }
  scorersHtml += '</div>'
  document.getElementById('mr-scorers').innerHTML = scorersHtml

  /* Lineups */
  var lineupsHtml = ''
  if (userMatch) {
    var isHome = userMatch.homeId === state.teamId
    var rivalId = isHome ? userMatch.awayId : userMatch.homeId
    var rivalTeam = getTeamObj(rivalId)
    var rivalName = isHome ? userMatch.awayName : userMatch.homeName

    /* Build user lineup */
    var userHtml = ''
    userHtml += '<div class="mr-lineup-title">' + state.team + '</div>'
    var slotIds = state.tacticsSlots || []
    var roles = state.tactic && state.tactic.formation ? state.tactic.formation : '4-3-3'
    var slotRoles = SLOT_ROLES[roles] || SLOT_ROLES['4-3-3']

    /* Build assist names set */
    var assistNames = {}
    for (var ag = 0; ag < userGoalscorers.length; ag++) {
      if (userGoalscorers[ag].assistName) assistNames[userGoalscorers[ag].assistName] = true
    }

    for (var si = 0; si < Math.min(slotIds.length, slotRoles.length); si++) {
      var pid = slotIds[si]
      if (!pid) continue
      var pl = state.players.find(function(x) { return x.id === pid })
      if (!pl) continue
      var roleKey = SIGLA_TO_POS[slotRoles[si]] || slotRoles[si]
      var posLabel = POSITIONS[roleKey] ? POSITIONS[roleKey].label : (POS_ABBR[roleKey] || pl.position)
      var posColor = POSITIONS[roleKey] ? POSITIONS[roleKey].color : '#6B7280'
      var nota = obtenerNotaJugador(pid)
      var goles = pl._goalsInMatch || 0
      var asistencias = pl._assistThisMatch || 0
      var goalIcon = goles > 0 ? ' <span class="mr-lineup-goal">\u26bd' + (goles > 1 ? goles : '') + '</span>' : ''
      var assistIcon = asistencias > 0 ? ' <span class="mr-lineup-goal">\ud83d\udc5f' + (asistencias > 1 ? asistencias : '') + '</span>' : ''
      var yellowIcon = pl._yellowThisMatch ? ' <span style="color:#f1c40f">\ud83d\udfe8</span>' : ''
      var redIcon = pl._redThisMatch ? ' <span style="color:#e74c3c">\ud83d\udfe5</span>' : ''
      userHtml += '<div class="mr-lineup-row"><span class="mr-lineup-pos" style="background:' + posColor + ';color:#fff">' + posLabel + '</span><span class="mr-lineup-name">' + pl.name + goalIcon + assistIcon + yellowIcon + redIcon + '</span><span class="mr-lineup-rating">(' + nota + ')</span></div>'
    }

    /* Build rival lineup */
    var rivalHtml = ''
    if (rivalTeam && rivalTeam.players) {
      rivalHtml += '<div class="mr-lineup-title">' + rivalName + '</div>'

      var formacion = rivalTeam.formation || '4-3-3'
      var roles = SLOT_ROLES[formacion] || SLOT_ROLES['4-3-3']
      var asignados = []
      var rivalLineup = []

      for (var ri = 0; ri < roles.length; ri++) {
        var role = roles[ri]
        var candidates = rivalTeam.players.filter(function(p) { return !asignados.includes(p.id) && !p.injury })
        var best = null, bestScore = -1
        for (var ci = 0; ci < candidates.length; ci++) {
          var candidate = candidates[ci]
          var naturalKey = SIGLA_TO_POS[candidate.position] || candidate.position
          var mult = naturalKey === role ? 1.0 : (candidate.otherPositions && candidate.otherPositions.some(function(o) { return o.pos === role })) ? 0.85 : 0.5
          var score = candidate.skill * mult
          if (score > bestScore) { bestScore = score; best = candidate; bestRole = role }
        }
        if (best) {
          asignados.push(best.id)
          rivalLineup.push({ player: best, role: role })
        }
      }

      rivalLineup.sort(function(a, b) {
        return roles.indexOf(a.role) - roles.indexOf(b.role)
      })

      /* Generate simulated assist set for rival */
      var rivalAssistNames = {}
      for (var rg = 0; rg < rivalGoalscorers.length; rg++) {
        if (Math.random() < 0.35) {
          var rivalsNoScorer = rivalLineup.filter(function(p) { return p.player.name !== rivalGoalscorers[rg] })
          if (rivalsNoScorer.length > 0) {
            var assister = rivalsNoScorer[Math.floor(Math.random() * rivalsNoScorer.length)]
            rivalAssistNames[assister.player.name] = true
          }
        }
      }

      /* Generate simulated yellow/red cards for rival */
      var rivalCards = {}
      for (var rc = 0; rc < rivalLineup.length; rc++) {
        if (rivalLineup[rc].player.position === 'POR') continue
        if (Math.random() < 0.03) rivalCards[rivalLineup[rc].player.name] = 'red'
        else if (Math.random() < 0.2) rivalCards[rivalLineup[rc].player.name] = 'yellow'
      }

      var _uScore = userMatch.homeId === state.teamId ? userMatch.homeScore : userMatch.awayScore
      var _rScore = userMatch.homeId === state.teamId ? userMatch.awayScore : userMatch.homeScore
      for (var ri = 0; ri < rivalLineup.length; ri++) {
        var rItem = rivalLineup[ri]
        var rp = rItem.player
        var roleKey = SIGLA_TO_POS[rItem.role] || rItem.role
        var rPosLabel = POSITIONS[roleKey] ? POSITIONS[roleKey].label : (POS_ABBR[roleKey] || rp.position)
        var rPosColor = POSITIONS[roleKey] ? POSITIONS[roleKey].color : '#6B7280'
        var rGoles = rivalGoalscorers.filter(function(n) { return n === rp.name }).length
        var rGoalIcon = rGoles > 0 ? ' <span class="mr-lineup-goal">\u26bd' + (rGoles > 1 ? rGoles : '') + '</span>' : ''
        var rAssistIcon = rivalAssistNames[rp.name] ? ' <span class="mr-lineup-goal">\ud83d\udc5f</span>' : ''
        var rCardIcon = ''
        if (rivalCards[rp.name] === 'red') rCardIcon = ' <span style="color:#e74c3c">\ud83d\udfe5</span>'
        else if (rivalCards[rp.name] === 'yellow') rCardIcon = ' <span style="color:#f1c40f">\ud83d\udfe8</span>'
        var rWinBonus = (_rScore > _uScore) ? 0.5 : (_rScore === _uScore) ? 0.2 : 0
        var rGoalBonus = (rGoles || 0) * 1.2
        var rAssistBonus = rivalAssistNames[rp.name] ? 0.6 : 0
        var rYellowPenalty = rivalCards[rp.name] === 'yellow' ? -0.5 : 0
        var rRedPenalty = rivalCards[rp.name] === 'red' ? -2.0 : 0
        var rClean = (rivalCards[rp.name] === 'yellow' || rivalCards[rp.name] === 'red') ? 0 : 0.2
        var rCsBonus = 0
        if (_uScore === 0 && (rp.position === 'POR' || rp.position === 'defensa_central' || rp.position === 'lateral_der' || rp.position === 'lateral_izq')) rCsBonus = 0.5
        var rRandom = (Math.random() - 0.5) * 0.6
        var rRating = Math.min(10, Math.max(1, 6.2 + rWinBonus + rGoalBonus + rAssistBonus + rClean + rYellowPenalty + rRedPenalty + rCsBonus + rRandom))
        rivalHtml += '<div class="mr-lineup-row"><span class="mr-lineup-pos" style="background:' + rPosColor + ';color:#fff">' + rPosLabel + '</span><span class="mr-lineup-name">' + rp.name + rGoalIcon + rAssistIcon + rCardIcon + '</span><span class="mr-lineup-rating">(' + rRating.toFixed(1) + ')</span></div>'
      }
    }

    /* Append in correct order */
    lineupsHtml += isHome ? (userHtml + rivalHtml) : (rivalHtml + userHtml)
  }
  document.getElementById('mr-lineups').innerHTML = lineupsHtml

  /* All results */
  const otherHtml = []
  for (const r of allResults) {
    if (r.isUser) continue
    const homeLogo = getTeamLogo(r.homeId) || ''
    const awayLogo = getTeamLogo(r.awayId) || ''
    otherHtml.push(
      '<div class="mr-other-match">' +
        '<div class="mr-other-teams">' +
          '<img class="mr-other-logo" src="' + homeLogo + '" alt="">' +
          '<span class="mr-other-name">' + r.homeName + '</span>' +
        '</div>' +
        '<span class="mr-other-score">' + r.homeScore + ' - ' + r.awayScore + '</span>' +
        '<div class="mr-other-teams" style="justify-content:flex-end">' +
          '<span class="mr-other-name">' + r.awayName + '</span>' +
          '<img class="mr-other-logo" src="' + awayLogo + '" alt="">' +
        '</div>' +
      '</div>'
    )
  }
  document.getElementById('mr-all-results').innerHTML = otherHtml.join('')

  modal.style.display = 'flex'
  modal.classList.add('open')

  document.getElementById('mr-btn-continue').onclick = function() {
    modal.style.display = 'none'
    modal.classList.remove('open')

    /* Advance matchday */
    if (state.currentMatchday >= state.totalMatchdays) {
      procesarFinTemporada()
      return
    }
    state.currentMatchday++
    simularJornadaEnTodasLasLigas(state.currentMatchday)
    procesarEconomiaSemanal()
    liberarSuspensiones()
    for (const p of state.players) {
      if (!p.injury) continue
      p.injury.remaining--
      if (p.injury.remaining <= 0) {
        p.energy = p.injury.recoveryEnergy
        p.injury = null
        addNotification('general', '\ud83d\udcaa Recuperado: ' + p.name, 'Vuelve tras superar su lesi\u00f3n')
      }
    }
    const assistCount = state.staff.filter(function(s) { return s.role === 'assistantCoach' }).length
    if (assistCount > 0) {
      state.players.forEach(function(p) { p.energy = Math.min(100, p.energy + assistCount * 10) })
    }
    autoSave()
    renderTab('home')
  }
  }

function showMatchdayResults(userScore, rivalScore, rivalName) {
  const bem = document.getElementById('btn-end-match')
  if (bem) bem.style.display = 'none'

  /* Refresh league table with updated standings before showing results */
  renderLeague()

  /* Go directly to league results view */
  if (!window._simulationMode) {
    const vm = document.getElementById('view-match')
    if (vm) vm.classList.remove('active')
    document.getElementById('view-league').classList.add('active')
    document.getElementById('bottom-nav').style.display = ''
    document.getElementById('app-header').style.display = ''
    document.getElementById('btn-header-menu').style.display = ''
  }

  const fixtures = state.fixtures.filter(f => f.matchday === state.currentMatchday)
  const list = document.getElementById('league-results-list')
  list.innerHTML = fixtures.map(f => {
    const homeName = getTeamName(f.home)
    const awayName = getTeamName(f.away)
    const homeLogo = getTeamLogo(f.home)
    const awayLogo = getTeamLogo(f.away)
    const isUserMatch = f.home === state.teamId || f.away === state.teamId
    return `
      <div class="results-item ${isUserMatch ? 'results-item-user' : ''}">
        <img class="results-logo" src="${homeLogo}" alt="" onerror="this.style.display='none'">
        <span class="results-team">${homeName}</span>
        <span class="results-score">${f.homeScore} - ${f.awayScore}</span>
        <span class="results-team">${awayName}</span>
        <img class="results-logo" src="${awayLogo}" alt="" onerror="this.style.display='none'">
      </div>
    `
  }).join('')

  const standings = updateLeagueStandings()
  const userPos = standings.findIndex(s => s.teamId === state.teamId) + 1
  document.getElementById('league-standings-change').innerHTML = `Tu equipo ocupa el <strong>${userPos}º</strong> puesto`
  document.getElementById('league-results-wrap').classList.remove('hidden')

  document.getElementById('btn-advance-matchday').onclick = () => {
    if (state.playoffs) {
      /* In playoffs: just return to league view */
      document.getElementById('league-results-wrap').classList.add('hidden')
      renderLeague()
      return
    }
    showLoading('Simulando jornada...')
    setTimeout(() => {
      if (state.currentMatchday >= state.totalMatchdays) {
        const standings = updateLeagueStandings()
        const pos = standings.findIndex(s => s.teamId === state.teamId) + 1
        if (state.leagueId === 'lnfs1' && pos <= 8 && !state.playoffs) {
          hideLoading()
          iniciarPlayoffs(standings.slice(0, 8).map(s => s.teamId))
          return
        }
        hideLoading()
        procesarFinTemporada()
        return
      }
      /* Simulate ALL unplayed fixtures for this matchday — both user and AI */
      const allUnplayed = state.fixtures.filter(f => f.matchday === state.currentMatchday && !f.played)
      for (const f of allUnplayed) {
        const isUserMatch = f.home === state.teamId || f.away === state.teamId
        if (isUserMatch) {
          autoSimularPartidoUsuario(f)
        } else {
          const r = autoSimulateOtherMatch(f.home, f.away)
          f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
        }
      }
      state.currentMatchday++
      simularJornadaEnTodasLasLigas(state.currentMatchday)
      procesarEconomiaSemanal()
      liberarSuspensiones()
      for (const p of state.players) {
        if (!p.injury) continue
        p.injury.remaining--
        if (p.injury.remaining <= 0) {
          const name = p.name
          p.energy = p.injury.recoveryEnergy
          p.injury = null
          addNotification('general', `💪 Recuperado: ${name}`, `Vuelve tras superar su lesión`)
        }
      }
      /* Staff bonus: 2º Entrenador → +5 energía/jornada */
      const assistCount = state.staff.filter(s => s.role === 'assistantCoach').length
      if (assistCount > 0) {
        state.players.forEach(p => { p.energy = Math.min(100, p.energy + assistCount * 10) })
      }
      /* AI promotion from filial to first team */
      var parentIdAI = getParentTeamId(state.teamId)
      if (parentIdAI) {
        var parentTeam = state.leagueTeams.find(function(t) { return t.teamId === parentIdAI })
        if (parentTeam && parentTeam.players.length < MAX_SQUAD) {
          /* Count positions the parent team needs */
          var posCount = {}
          parentTeam.players.forEach(function(p) {
            var key = SIGLA_TO_POS[p.position] || p.position
            posCount[key] = (posCount[key] || 0) + 1
          })
          var candidates = state.players.filter(function(p) {
            if (p.injury) return false
            if (p.skill < 65) return false
            var posKey = SIGLA_TO_POS[p.position] || p.position
            /* Higher chance if parent has < 2 in this position */
            return (posCount[posKey] || 0) < 2 || Math.random() < 0.3
          })
          if (candidates.length > 0) {
            var promoted = pickRandom(candidates)
            var idx = state.players.indexOf(promoted)
            if (idx >= 0) {
              state.players.splice(idx, 1)
              addNotification('transfer', '\u2B06 ' + promoted.name + ' sube al primer equipo', parentTeam.name + ' recluta a ' + promoted.name + ' desde el filial')
            }
          }
        }
      }
      document.getElementById('league-results-wrap').classList.add('hidden')
      updateLeagueStandings()
      renderLeague()
      autoSave()
      hideLoading()
    }, 300)
  }
}

function autoSimularPartidoUsuario(fixture) {
  const isHome = fixture.home === state.teamId
  const rivalId = isHome ? fixture.away : fixture.home

  /* Calculate user power from current lineup */
  const slots = state.tacticsSlots || []
  var rawIds = slots.filter(Boolean)
  var startingIds = rawIds.filter(function(pid) {
    var p = state.players.find(function(x) { return x.id === pid })
    return !p || !p._suspended
  })
  if (startingIds.length < 11) {
    /* Fallback: auto-assign */
    autoAssignSquad()
    const newSlots = state.tacticsSlots.filter(Boolean)
    if (newSlots.length < 11) return { homeScore: 0, awayScore: 0, rivalGoals: 0, userGoals: 0 }
  }

  const roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['4-3-3']
  let totalEff = 0
  const ids = state.tacticsSlots.filter(Boolean)
  for (let i = 0; i < Math.min(roles.length, ids.length); i++) {
    const p = state.players.find(x => x.id === ids[i])
    if (p) totalEff += calcularMediaEnPosicion(p, roles[i])
  }
  const userPower = totalEff / 11

  /* Opponent power */
  const rivalTeam = getTeamObj(rivalId)
  let rivalPower = 0
  if (rivalTeam && rivalTeam.players && rivalTeam.players.length > 0) {
    rivalPower = Math.round(getTop11Average(rivalTeam.players) * getTop11EnergyFactor(rivalTeam.players))
  } else {
    const db = getBaseDato(rivalId)
    rivalPower = db ? db.rating : 70
  }

  /* Apply randomness and home advantage */
  const homeFactor = isHome ? 1.05 : 1.0
  const awayFactor = isHome ? 0.97 : 1.0
  const userFinal = userPower * (0.8 + Math.random() * 0.4) * homeFactor
  const rivalFinal = rivalPower * (0.8 + Math.random() * 0.4) * awayFactor

  /* Goal calculation */
  const totalGoals = 2 + Math.floor(Math.random() * 5)
  const probUser = userFinal / (userFinal + rivalFinal)
  let rawUser = Math.round(totalGoals * probUser)
  let rawRival = totalGoals - rawUser
  if (rawUser === 0 && rawRival === 0 && totalGoals >= 2) {
    if (Math.random() < 0.5) { rawUser++ } else { rawRival++ }
  }
  const us = Math.min(10, Math.max(0, rawUser))
  const them = Math.min(10, Math.max(0, rawRival))

  /* Update fixture */
  if (isHome) { fixture.homeScore = us; fixture.awayScore = them }
  else { fixture.homeScore = them; fixture.awayScore = us }
  fixture.played = true

  /* Track matches and assign goals to user's players */
  state.players.forEach(p => {
    p.enPista = false; p.convocado = false; p.titular = false
    p.minutosEnPista = 0
    p._goalsInMatch = 0; p._assistThisMatch = 0
  })
  ids.forEach(pid => {
    const p = state.players.find(x => x.id === pid)
    if (p) {
      p.minutosEnPista = 90; p.enPista = true; p.convocado = true; p.titular = true
      p.matches = (p.matches || 0) + 1
    }
  })
  for (let g = 0; g < us; g++) {
    const valid = state.players.filter(p => ids.includes(p.id) && p.position !== 'POR' && !p.injury)
    if (valid.length === 0) break
    const scorer = pickWeightedRandom(valid, function(p) { return getGoalWeight(p.position) })
    scorer.goals = (scorer.goals || 0) + 1
    scorer._goalsInMatch = (scorer._goalsInMatch || 0) + 1
    if (Math.random() < 0.35) {
      const pool = state.players.filter(p => ids.includes(p.id) && p.id !== scorer.id && !p.injury)
      if (pool.length > 0) {
        const a = pool[Math.floor(Math.random() * pool.length)]
        a.assists = (a.assists || 0) + 1
        a._assistThisMatch = (a._assistThisMatch || 0) + 1
      }
    }
  }

  /* Yellow and red cards */
  var cardGamePlan = state.tactic.gamePlan || 'extremo'
  state.players.filter(p => ids.includes(p.id) && p.position !== 'POR' && !p.injury).forEach(function(p) {
    asignarTarjetasJugador(p, cardGamePlan)
  })

  /* Track position experience */
  state.players.forEach(function(p) {
    if (p.minutosEnPista > 0) {
      var idx = ids.indexOf(p.id)
      if (idx >= 0 && idx < roles.length) {
        var role = roles[idx]
        var naturalKey = SIGLA_TO_POS[p.position] || p.position
        if (naturalKey !== role) {
          if (!p.positionExperience) p.positionExperience = {}
          p.positionExperience[role] = (p.positionExperience[role] || 0) + 1
          if (!p.otherPositions) p.otherPositions = []
          var existing = p.otherPositions.find(function(o) { return o.pos === role })
          var newPct = Math.min(100, p.positionExperience[role] * 3)
          if (!existing) p.otherPositions.push({ pos: role, pct: newPct })
          else existing.pct = Math.max(existing.pct, newPct)
        }
      }
    }
  })

  /* Fatigue */
  state.players.forEach(p => {
    if (!p.injury && ids.includes(p.id)) p.energy = Math.max(10, p.energy - (GAME_PLANS[state.tactic.gamePlan]?.drain || 10))
  })
  /* Recovery for unused players */
  state.players.forEach(p => {
    if (!p.injury && !ids.includes(p.id) && p.energy < 100) {
      p.energy = Math.min(100, p.energy + 25)
    }
  })

  /* Finance */
  const rew = getDivisionMatchReward(state.leagueId)
  if (us > them) state.finances.balance += rew.win
  else if (us === them) state.finances.balance += rew.draw
  else state.finances.balance += rew.loss
  state.finances.history.push({
    reason: `J${fixture.matchday}: ${us}-${them} vs ${getTeamName(rivalId)}`,
    amount: us > them ? rew.win : us === them ? rew.draw : rew.loss
  })

  /* Matchday income */
  if (state.presupuestoInicial > 0) {
    if (isHome) {
      var taquilla = Math.round(state.presupuestoInicial * 0.004)
      state.finances.balance += taquilla
      state.finances.history.push({ reason: 'Ingresos por d\u00eda de partido (local)', amount: taquilla })
    }
    if (us > them) {
      var bono = Math.round(state.presupuestoInicial * 0.002)
      state.finances.balance += bono
      state.finances.history.push({ reason: 'Prima por victoria', amount: bono })
    }
  }

  return { homeScore: fixture.homeScore, awayScore: fixture.awayScore, userGoals: isHome ? us : them, rivalGoals: isHome ? them : us }
}

/* ============ MARKET VIEW ============ */
function updateTeamStatusBar() {
  const players = state.players || []
  const count = players.length
  const max = 11

  const countEl = document.getElementById('player-count')
  if (countEl) {
    countEl.textContent = `${count} / ${max}`
    countEl.classList.toggle('complete', count === max)
  }

  const ratingEl = document.getElementById('team-rating')
  if (ratingEl) {
    if (count === 0) {
      ratingEl.textContent = '\u2014'
    } else {
      const total = players.reduce((sum, p) => sum + (p.skill || 0), 0)
      ratingEl.textContent = Math.round(total / count)
    }
  }

  const btn = document.getElementById('btn-view-squad')
  if (btn) btn.disabled = count === 0
}

function renderMarket() {
  updateTeamStatusBar()
  const header = document.getElementById('market-header')
  if (header) {
    const status = state.transferWindowOpen
      ? '<span style="color:#4CAF50">🔓 Mercado abierto</span>'
      : '<span style="color:#f44336">🔒 Mercado cerrado</span>'
    header.innerHTML = `Mercado de fichajes · ${status}`
  }
  /* Poblar nacionalidades dinámicamente desde globalPlayers */
  var natSelect = document.getElementById('mf-nat')
  if (natSelect && natSelect.options.length <= 1) {
    var nats = {}
    state.globalPlayers.forEach(function(p) {
      var parts = (p.nationality || '').split(' ')
      var name = parts.slice(1).join(' ').trim()
      var flag = parts[0] || ''
      if (name && !nats[name]) nats[name] = flag
    })
    var sorted = Object.keys(nats).sort()
    for (var ni = 0; ni < sorted.length; ni++) {
      var name = sorted[ni]
      var opt = document.createElement('option')
      opt.value = name
      opt.textContent = (nats[name] ? nats[name] + ' ' : '') + name
      natSelect.appendChild(opt)
    }
  }
  /* Bind filter inputs */
  document.querySelectorAll('#market-filters input, #market-filters select').forEach(function(el) {
    el.oninput = function() { renderMarketContent() }
    el.onchange = function() { renderMarketContent() }
  })
  renderMarketContent()
}

function renderMarketContent() {
  const container = document.getElementById('market-content')
  const search = (document.getElementById('market-search').value || '').toLowerCase()
  const posFilter = document.getElementById('mf-pos')?.value || ''
  const natFilter = (document.getElementById('mf-nat')?.value || '').toLowerCase()
  const ageVal = (document.getElementById('mf-age')?.value || '').split('-')
  const ageMin = parseInt(ageVal[0]) || 0
  const ageMax = parseInt(ageVal[1]) || 99
  const skillVal = (document.getElementById('mf-skill')?.value || '').split('-')
  const skillMin = parseInt(skillVal[0]) || 0
  const skillMax = parseInt(skillVal[1]) || 99

  const userPlayerIds = new Set(state.players.map(p => p.id))
    /* Exclude family players from market */
    var familyIds = new Set()
    var fId = getFilialId(state.teamId)
    if (fId && state.filialSquad) state.filialSquad.forEach(function(p) { familyIds.add(p.id) })
    var pId = getBTeamParent(state.teamId)
    if (pId) {
      var parentTeam = state.leagueTeams.find(function(t) { return t.teamId === pId })
      if (parentTeam) parentTeam.players.forEach(function(p) { familyIds.add(p.id) })
    }
    const global = (state.globalPlayers || []).filter(p => !userPlayerIds.has(p.id) && !familyIds.has(p.id))

    let filtered = global
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search))
    if (posFilter) filtered = filtered.filter(p => (POS_ABBR[p.position] || p.position) === posFilter)
    if (natFilter) filtered = filtered.filter(p => (p.nationality || '').toLowerCase().includes(natFilter))
    if (ageMin > 0) filtered = filtered.filter(p => (p.age || 0) >= ageMin)
    if (ageMax < 99) filtered = filtered.filter(p => (p.age || 0) <= ageMax)
    if (skillMin > 0) filtered = filtered.filter(p => p.skill >= skillMin)
    if (skillMax < 99) filtered = filtered.filter(p => p.skill <= skillMax)

    filtered.sort((a, b) => b.skill - a.skill)
    filtered = filtered.slice(0, 50)

    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">No hay jugadores disponibles</div>'
      return
    }

    container.innerHTML = filtered.map(p => {
      const posKey = SIGLA_TO_POS[p.position] || p.position
      const pos = POSITIONS[posKey]
      const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= p.value
      const teamLabel = (p.countryFlag || '') + ' ' + (p.teamName || '')
      const valShort = formatShort(p.value)
      const posColor = pos.color
      return `
        <div class="tp-row market-card" data-player-id="${p.id}" data-team-id="${p.teamId}">
          <span class="tp-cell-pos-badge" style="background:${posColor};color:#fff">${POS_ABBR[posKey] || p.position}</span>
          <div class="tp-cell">
            <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
            <div class="tp-cell-info">
              <span class="tp-cell-name">${p.name}</span>
              <span class="tp-cell-value">${teamLabel}</span>
            </div>
          </div>
          <span class="tp-cell-age">${p.age || '-'}</span>
          <span class="tp-cell-market">${valShort}</span>
          <span class="tp-cell-power" style="${getPowerBadgeStyle(p.skill)}">${p.skill}</span>
          <button class="market-card-btn ${canBuy ? 'buy' : 'disabled'}">${canBuy ? 'COMPRAR' : (state.players.length >= MAX_SQUAD ? 'PLANTILLA LLENA' : 'SIN FONDOS')}</button>
        </div>
      `
    }).join('')

    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const pid = card.dataset.playerId
        const tid = card.dataset.teamId
        const gp = state.globalPlayers.find(p => p.id === pid)
        if (!gp) return
        const team = getTeamObj(gp.teamId)
        openPlayerDetail(gp, team)
      }
      card.querySelector('.market-card-btn.buy')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const pid = card.dataset.playerId
        const gp = state.globalPlayers.find(p => p.id === pid)
        if (!gp) return
        const team = getTeamObj(gp.teamId)
        if (!team) return
        const teamPlayer = team.players.find(p => p.id === pid)
        if (!teamPlayer) return
        if (state.players.length >= MAX_SQUAD || state.finances.balance < teamPlayer.value) return
        buyPlayer(teamPlayer, team, teamPlayer.value)
      })
    })
  }

function buyPlayer(player, team, agreedPrice) {
  if (state.players.length >= MAX_SQUAD) { alert('Plantilla completa (' + MAX_SQUAD + ' jugadores)'); return }
  const delegateCount = state.staff.filter(s => s.role === 'delegate').length
  const discount = Math.max(0, 1 - delegateCount * 0.1)
  const basePrice = agreedPrice || player.value
  const finalValue = Math.round(basePrice * discount)
  if (state.finances.balance < finalValue) { alert('Fondos insuficientes. Necesitas ' + formatMoney(finalValue)); return }
  state.finances.balance -= finalValue
  state.finances.history.push({ reason: `Compra: ${player.name}${discount < 1 ? ' (-' + Math.round((1 - discount) * 100) + '% dto)' : ''}`, amount: -finalValue })
  /* Remove from source team */
  const ti = team.players.findIndex(p => p.id === player.id)
  if (ti >= 0) team.players.splice(ti, 1)
  state.boughtPlayerIds.push(player.id)
  /* Remove from global pool */
  const gi = state.globalPlayers.findIndex(p => p.id === player.id)
  if (gi >= 0) state.globalPlayers.splice(gi, 1)
  const newPlayer = { ...player, id: 'user-' + Date.now(), value: calcValue(player.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, contractUntil: '30/06/' + (2027 + state.seasonNumber), onLoan: false, loanFrom: null, loanUntil: null, teamStats: {} }
  state.players.push(newPlayer)
  addNotification('transfer', `Fichaje completado: ${player.name}`, `${formatMoney(player.value)} · ${player.nationality}`)
  renderMarketContent()
}

function hireStaff(staffMember, team) {
  if (state.staff.some(s => s.role === staffMember.role)) return
  const cost = 2000
  if (state.finances.balance < cost) return
  const roleLabels = { headCoach: 'Entrenador', assistantCoach: '2º Entrenador', delegate: 'Delegado', goalkeeperCoach: 'Entrenador de porteros', fitnessCoach: 'Preparador físico' }
  state.finances.balance -= cost
  state.finances.history.push({ reason: `Contratación: ${staffMember.name} (${roleLabels[staffMember.role] || staffMember.role})`, amount: -cost })
  if (team) {
    const staffTeam = state.leagueTeams.find(t => t.teamId === team.teamId)
    if (staffTeam) {
      const idx = staffTeam.staff.indexOf(staffMember)
      if (idx >= 0) staffTeam.staff.splice(idx, 1)
    }
  }
  state.staff.push({ ...staffMember })
  addNotification('transfer', `Staff contratado: ${staffMember.name}`, `${roleLabels[staffMember.role] || staffMember.role} · ${formatMoney(cost)}`)
  renderMarketContent()
}

/* ============ AGE & PROGRESSION ============ */
function calcularAvgRating(matchHistory) {
  if (!matchHistory || matchHistory.length === 0) return 0
  var sum = 0, count = 0
  for (var i = 0; i < matchHistory.length; i++) {
    if (matchHistory[i].minutes >= 30) {
      sum += matchHistory[i].rating
      count++
    }
  }
  return count > 0 ? sum / count : 0
}

function envejecerYProgresar() {
  var totalM = state.totalMatchdays || 34
  var changes = []
  var retirados = []

  state.players.forEach(function(p) {
    var oldSkill = p.skill
    var playRate = Math.min(1, (p.matches || 0) / totalM)
    var avgRating = calcularAvgRating(p.matchHistory)

    if (p.age <= 29) {
      var gain
      if (avgRating >= 8.0) gain = 6
      else if (avgRating >= 7.0) gain = 4
      else if (avgRating >= 6.5) gain = 3
      else if (avgRating >= 5.5) gain = 2
      else if (avgRating >= 4.5) gain = 1
      else gain = -1

      if (p.age < 23 && playRate >= 0.7) gain += 1
      if (playRate > 0 && playRate < 0.3) gain -= 1

      gain = Math.max(-4, Math.min(5, gain))
      p.skill = Math.min(99, Math.max(1, p.skill + gain))
    } else {
      var baseLoss = p.age >= 35 ? 4 : p.age >= 33 ? 2 : 1
      var change
      if (avgRating >= 8.0) change = 2
      else if (avgRating >= 7.0) change = 1
      else if (avgRating >= 6.0) change = 0
      else if (avgRating >= 5.0) change = -1
      else if (avgRating >= 4.0) change = -2
      else change = -4

      change -= baseLoss - 1
      if (playRate < 0.3 && avgRating > 0) change -= 1
      if (playRate === 0) change -= 1

      var minSkill = p.age >= 35 ? 40 : p.age >= 33 ? 45 : 50
      var finalSkill = Math.max(minSkill, Math.min(99, p.skill + Math.max(-4, Math.min(3, change))))
      change = finalSkill - p.skill
      p.skill = finalSkill
    }

    /* Versatility bonus: jugar en múltiples posiciones ayuda al desarrollo */
    var otherPosCount = 0
    if (p.otherPositions) {
      otherPosCount = p.otherPositions.filter(function(o) { return o.pct >= 15 }).length
    }
    if (otherPosCount >= 4) p.skill = Math.min(99, p.skill + 2)
    else if (otherPosCount >= 2) p.skill = Math.min(99, p.skill + 1)

    var change = Math.round(p.skill - oldSkill)
    if (change !== 0) {
      changes.push({ name: p.name, pos: p.position, oldSkill: oldSkill, newSkill: p.skill, change: change })
    }

    /* Retirement check */
    if (p.age >= 35 && (p.matches || 0) < 5 && Math.random() < 0.5) retirados.push(p)
  })

  /* GK coach bonus */
  var gkCoachCount = state.staff.filter(function(s) { return s.role === 'goalkeeperCoach' }).length
  if (gkCoachCount > 0) {
    state.players.filter(function(p) { return p.position === 'portero' }).forEach(function(p) {
      var baseChance = 0.25 * gkCoachCount
      var matchBonus = Math.min(0.5, (p.matches || 0) * 0.02)
      if (Math.random() < baseChance + matchBonus) {
        var oldS = p.skill
        p.skill = Math.min(99, p.skill + 2)
        changes.push({ name: p.name, pos: p.position, oldSkill: oldS, newSkill: p.skill, change: 2 })
      }
    })
  }

  /* Progress AI teams' players too */
  var iaRetirados = progresarJugadoresIA(totalM)
  retirados.push.apply(retirados, iaRetirados)

  return { changes: changes, retirados: retirados }
}

function progresarJugadoresIA(totalM) {
  var retirados = []
  state.leagueTeams.forEach(function(team) {
    var keep = []
    team.players.forEach(function(p) {
      var playRate = Math.min(1, (p.matches || 0) / totalM)
      var avgRating = calcularAvgRating(p.matchHistory)

      if (p.age <= 29) {
        var gain
        if (avgRating >= 8.0) gain = 5
        else if (avgRating >= 7.0) gain = 3
        else if (avgRating >= 6.0) gain = 2
        else if (avgRating >= 5.0) gain = 1
        else if (avgRating >= 4.0) gain = 0
        else gain = -1

        if (p.age < 23 && playRate >= 0.7) gain += 1
        if (playRate > 0 && playRate < 0.3) gain -= 1

        gain = Math.max(-4, Math.min(5, gain))
        p.skill = Math.min(99, Math.max(1, p.skill + gain))
      } else {
        var baseLoss = p.age >= 35 ? 4 : p.age >= 33 ? 2 : 1
        var change
        if (avgRating >= 8.0) change = 1
        else if (avgRating >= 7.0) change = 0
        else if (avgRating >= 6.0) change = -1
        else if (avgRating >= 5.0) change = -1
        else if (avgRating >= 4.0) change = -2
        else change = -4

        change -= baseLoss - 1
        if (playRate < 0.3 && avgRating > 0) change -= 1
        if (playRate === 0) change -= 1

        var minSkill = p.age >= 35 ? 40 : p.age >= 33 ? 45 : 50
        var finalSkill = Math.max(minSkill, Math.min(99, p.skill + Math.max(-4, Math.min(3, change))))
        p.skill = finalSkill
      }

      /* Versatility bonus for IA players */
      var otherCount = 0
      if (p.otherPositions) {
        otherCount = p.otherPositions.filter(function(o) { return o.pct >= 15 }).length
      }
      if (otherCount >= 4) p.skill = Math.min(99, p.skill + 2)
      else if (otherCount >= 2) p.skill = Math.min(99, p.skill + 1)

      if (p.age >= 35 && (p.matches || 0) < 5 && Math.random() < 0.5) {
        retirados.push({ name: p.name, age: p.age, matches: p.matches || 0, team: team.name })
      } else {
        keep.push(p)
      }
    })
    team.players = keep
  })
  return retirados
}



function renderFinances() {
  document.getElementById('finance-balance').textContent = formatMoney(state.finances.balance)

  /* Income / expense totals */
  const ingresos = state.finances.history.filter(i => i.amount > 0).reduce((s, i) => s + i.amount, 0)
  const gastos = state.finances.history.filter(i => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0)
  const semanal = 0
  document.getElementById('finance-ingresos').textContent = formatMoney(ingresos)
  document.getElementById('finance-gastos').textContent = formatMoney(gastos)
  document.getElementById('finance-semanal').textContent = formatMoney(semanal)

  /* History */
  const container = document.getElementById('finance-history')
  if (!container) return
  if (state.finances.history.length === 0) {
    container.innerHTML = '<div class="finance-item" style="justify-content:center;color:var(--text-muted);background:none;border:none">Sin movimientos aún</div>'
    return
  }
  const items = [...state.finances.history].reverse()
  container.innerHTML = items.map(item => {
    const cls = item.amount >= 0 ? 'positive' : 'negative'
    const sign = item.amount >= 0 ? '+' : ''
    return `<div class="finance-item"><span class="finance-item-reason">${item.reason}</span><span class="finance-item-amount ${cls}">${sign}${formatMoney(item.amount)}</span></div>`
  }).join('')
}

/* ============ NAVIGATION ============ */
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      playSound('click')
      const tab = btn.dataset.tab
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderTab(tab)
    }
  })

  /* Club sub-tabs */
  document.querySelectorAll('#view-club .sub-tab').forEach(btn => {
    btn.onclick = () => {
      state.clubSubTab = btn.dataset.subtab
      document.querySelectorAll('#view-club .sub-tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById('club-squad-content').classList.add('hidden')
      document.getElementById('club-tactics-content').classList.add('hidden')
      document.getElementById('club-inbox-content').classList.add('hidden')
      document.getElementById('club-calendar-content').classList.add('hidden')
      if (state.clubSubTab === 'squad') {
        document.getElementById('club-squad-content').classList.remove('hidden')
        renderSquad(state.players)
      } else if (state.clubSubTab === 'tactics') {
        document.getElementById('club-tactics-content').classList.remove('hidden')
        renderTactics(state.tactic)
      } else if (state.clubSubTab === 'inbox') {
        document.getElementById('club-inbox-content').classList.remove('hidden')
        hideInboxDetail()
        renderInbox()
      } else if (state.clubSubTab === 'calendar') {
        document.getElementById('club-calendar-content').classList.remove('hidden')
        renderCalendar()
      }
    }
  })

  /* Market search */
  document.getElementById('market-search').oninput = () => renderMarketContent()
}

function renderTab(tab) {
  state.currentTab = tab
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  const view = document.getElementById(`view-${tab}`)
  if (view) view.classList.add('active')
  
  switch (tab) {
    case 'club': renderClub(); break
    case 'league': renderLeague(); break
    case 'home': renderHome(); break
    case 'market': renderMarket(); break
    case 'finances': renderFinances(); break
  }
}

/* ============ COPA / SUPERCOPA VIEW ============ */
var COPA_LOGO = 'https://cdn.resfu.com/media/img/league_logos/copa-del-rey.png?size=120x&lossy=1'
var SUPERC_LOGO = 'https://cdn.resfu.com/media/img/league_logos/supercopa_espana.png?size=120x&lossy=1'

function renderCopaView() {
  var tableWrap = document.getElementById('league-table-wrap')
  var resultsWrap = document.getElementById('league-results-wrap')
  resultsWrap.classList.add('hidden')
  var cup = state.cup
  var supercopa = state.supercopa
  var html = '<div style="text-align:right;margin-bottom:8px"><button class="btn-back" onclick="renderLeague()" style="font-size:12px;padding:4px 10px">\u2190 Volver a Liga</button></div><div class="copa-wrap">'

  /* Supercopa section */
  if (supercopa && supercopa.fixtures.length > 0) {
    html += '<div class="copa-section"><div class="copa-header"><img class="copa-logo" src="' + SUPERC_LOGO + '" alt="Supercopa"><span class="copa-title">Supercopa de Espa\u00f1a</span></div>'
    var allSupercopaFixtures = supercopa.fixtures.slice()
    if (supercopa.final) allSupercopaFixtures.push(supercopa.final)
    allSupercopaFixtures.forEach(function(f) {
      var played = f.played
      var homeS = f.homeScore != null ? f.homeScore : '-'
      var awayS = f.awayScore != null ? f.awayScore : '-'
      var cls = played ? '' : ' copa-fixture-pending'
      var elimLabel = f.round === 'SF' ? 'Semifinal' : 'Final'
      var isUser = f.home === state.teamId || f.away === state.teamId
      html += '<div class="copa-fixture' + cls + '">' +
        '<span class="copa-fixture-round">' + elimLabel + '</span>' +
        '<span class="copa-fixture-team' + (f.home === state.teamId ? ' copa-user' : '') + '">' + (isUser ? '\u2b50 ' : '') + getTeamName(f.home) + '</span>' +
        '<span class="copa-fixture-score">' + homeS + ' - ' + awayS + '</span>' +
        '<span class="copa-fixture-team' + (f.away === state.teamId ? ' copa-user' : '') + '">' + (isUser ? '\u2b50 ' : '') + getTeamName(f.away) + '</span>' +
        '</div>'
    })
    if (supercopa.winner) {
      html += '<div class="copa-winner">\ud83c\udfc6 Campe\u00f3n: ' + getTeamName(supercopa.winner) + '</div>'
    }
    html += '</div>'
  }

  /* Copa del Rey section */
  if (cup && cup.allFixtures && cup.allFixtures.length > 0) {
    html += '<div class="copa-section"><div class="copa-header"><img class="copa-logo" src="' + COPA_LOGO + '" alt="Copa del Rey"><span class="copa-title">Copa del Rey</span></div>'
    var userEliminated = cup.eliminated && cup.eliminated.indexOf(state.teamId) >= 0
    if (userEliminated && cup.cupChampion) {
      html += '<div class="copa-eliminated">\u274c Eliminado. Campe\u00f3n: ' + getTeamName(cup.cupChampion) + '</div>'
    }
    /* Show all rounds */
    cup.schedule.forEach(function(s, ri) {
      if (s.isSupercopa) return
      var roundFixtures = cup.allFixtures.filter(function(f) { return f.week === s.week })
      if (roundFixtures.length === 0) return
      var allPlayed = roundFixtures.every(function(f) { return f.played })
      var userInRound = roundFixtures.some(function(f) { return f.home === state.teamId || f.away === state.teamId })
      html += '<div class="copa-round"><div class="copa-round-title">' + s.label + '</div>'
      roundFixtures.forEach(function(f) {
        var played = f.played
        var homeS = f.homeScore != null ? f.homeScore : '-'
        var awayS = f.awayScore != null ? f.awayScore : '-'
        var cls = played ? '' : ' copa-fixture-pending'
        var isUser = f.home === state.teamId || f.away === state.teamId
        html += '<div class="copa-fixture' + cls + '">' +
          '<span class="copa-fixture-team' + (f.home === state.teamId ? ' copa-user' : '') + '">' + (isUser ? '\u2b50 ' : '') + getTeamName(f.home) + '</span>' +
          '<span class="copa-fixture-score">' + homeS + ' - ' + awayS + '</span>' +
          '<span class="copa-fixture-team' + (f.away === state.teamId ? ' copa-user' : '') + '">' + (isUser ? '\u2b50 ' : '') + getTeamName(f.away) + '</span>' +
          '</div>'
      })
      html += '</div>'
    })
    if (!userEliminated && cup.roundIdx < 0) {
      var fF = cup.allFixtures.filter(function(f) { return f.week === cup.schedule[cup.schedule.length - 1].week })
      if (fF.length > 0 && fF[0].played) {
        var w = fF[0].homeScore > fF[0].awayScore ? fF[0].home : fF[0].away
        html += '<div class="copa-winner">\ud83c\udfc6 Campe\u00f3n: ' + getTeamName(w) + '</div>'
      }
    }
    html += '</div>'
  }

  if (!cup && !supercopa) {
    html += '<div class="copa-empty">No hay competiciones de copa activas en este pa\u00eds.</div>'
  }

  html += '</div>'
  tableWrap.innerHTML = html
}

function getDivisionBaseBudget(leagueId) {
  if (!leagueId) return 5000
  if (leagueId === 'l1s') return 100000
  if (leagueId === 'l2s') return 30000
  if (leagueId === 'l1p') return 35000
  if (leagueId === 'l2p') return 15000
  if (leagueId === 'lnfs1') return 50000
  if (leagueId === 'lnfs2') return 30000
  if (leagueId === 'lpl') return 25000
  if (leagueId === 'lpl2') return 12000
  if (leagueId === 'lpl3') return 6000
  if (leagueId.startsWith('lpl4g')) return 3000
  if (leagueId.startsWith('l3sg')) return 5000
  if (leagueId.startsWith('l2b')) return 15000
  if (leagueId.startsWith('l3g')) return 8000
  if (leagueId.startsWith('lhc')) return 5000
  if (leagueId.startsWith('lc')) return 3000
  if (leagueId.startsWith('l2c')) return 1500
  if (leagueId.startsWith('l3c')) return 1000
  return 8000
}

function getCountryBudgetMult(countryId) {
  if (countryId === 'es') return 1.0
  if (countryId === 'pt') return 0.9
  if (countryId === 'pl') return 1.0
  return 0.8
}

function getDivisionMatchReward(leagueId) {
  if (leagueId === 'lnfs1') return { win: 2000, draw: 800, loss: -300 }
  if (leagueId === 'lnfs2') return { win: 1200, draw: 500, loss: -200 }
  if (leagueId === 'lpl') return { win: 1000, draw: 400, loss: -150 }
  if (leagueId === 'lpl2') return { win: 500, draw: 200, loss: -80 }
  if (leagueId === 'lpl3') return { win: 250, draw: 100, loss: -30 }
  if (leagueId.startsWith('lpl4g')) return { win: 100, draw: 40, loss: -10 }
  if (leagueId.startsWith('l3sg')) return { win: 300, draw: 120, loss: -40 }
  if (leagueId.startsWith('l2b')) return { win: 600, draw: 250, loss: -100 }
  if (leagueId.startsWith('l3g')) return { win: 400, draw: 150, loss: -50 }
  if (leagueId.startsWith('lhc')) return { win: 250, draw: 100, loss: -30 }
  if (leagueId.startsWith('lc')) return { win: 150, draw: 60, loss: -20 }
  if (leagueId.startsWith('l2c')) return { win: 100, draw: 40, loss: -10 }
  if (leagueId.startsWith('l3c')) return { win: 75, draw: 30, loss: -5 }
  return { win: 300, draw: 125, loss: -50 }
}

/* ============ GAME INIT ============ */
function newGame(coach) {
  const countryData = window.DB[selectedCountry.id]
  const country = countryData ? countryData.country : null
  /* Resolve league — handle merged grouped leagues (lpl4g, l3sg) */
  var realLeagueId = selectedLeague.id
  if (isGroupedLeague(realLeagueId) && selectedLeague._groups) {
    var realGroup = null
    for (var gi = 0; gi < selectedLeague._groups.length; gi++) {
      if (selectedLeague._groups[gi].teams.some(function(t) { return t.id === selectedTeam.id })) {
        realGroup = selectedLeague._groups[gi]; break
      }
    }
    realLeagueId = realGroup ? realGroup.id : (getGroupedConfig(realLeagueId) ? getGroupedConfig(realLeagueId).groups[0] : realLeagueId)
  }
  const league = country ? country.leagues.find(l => l.id === realLeagueId) : null
  state.coach = coach
  state.team = selectedTeam.name
  state.teamId = selectedTeam.id
  state.teamLogo = selectedTeam.logo || ''
  const noface = 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
  const countryId = selectedCountry.id
  const natLabel = coachNationality ? (coachNationality.flag + ' ' + coachNationality.name) : (countryData ? (countryData.country.flag + ' ' + countryData.country.name) : '\ud83c\uddf5\ud83c\uddf1 Polonia')
  state.staff = [
    { name: coach, nationality: natLabel, role: 'headCoach', avatar: noface, career: [{ team: selectedTeam.name, from: new Date().toLocaleDateString('es-ES'), to: 'Actualidad', matches: 0, won: 0, drawn: 0, lost: 0 }] },
  ]
  state.countryId = selectedCountry.id
  state.leagueId = realLeagueId
  state.gameId = Date.now()
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.tactic = { formation: '4-3-3', gamePlan: 'pesado' }
  state.tacticsSlots = []
  state.benchIds = []
  state.reserveIds = []
  state.convocatoriaValidada = false
  /* Clear old tactics save */
  try { try { localStorage.removeItem(TACTICS_KEY) } catch(e) {}; try { sessionStorage.removeItem(TACTICS_KEY) } catch(e) {} } catch {}
  const startingBudget = selectedTeam.budget || Math.round(getDivisionBaseBudget(state.leagueId) * getCountryBudgetMult(state.countryId) * ((selectedTeam.rating || 50) / 50))
  state.presupuestoInicial = startingBudget
  state.finances = { balance: startingBudget, history: [] }
  state.inbox = []
  state.captainId = null

  /* Assign user squad based on selected team */
  const userSquad = getRealSquad(state.teamId) || generateCpuSquad(state.teamId, state.countryId, selectedTeam.rating)
  const teamCap = selectedTeam.rating || 99
  state.players = userSquad.map(p => ({
    ...p, skill: Math.min(teamCap, p.skill), value: p.value || calcValue(p.skill),
    enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null,
    teamStats: {},
  }))
  state.players.forEach(p => { p.energy = 100 })

  /* Initialize filial squad if the team has one */
  const myFilialId = getFilialId(state.teamId)
  if (myFilialId) {
    state.filialSquad = (getRealSquad(myFilialId) || []).map(p => {
      const bp = getBaseDato(myFilialId)
      const fCap = bp ? bp.rating : 99
      return { ...p, skill: Math.min(fCap, p.skill), id: 'filial-' + p.id, value: calcValue(p.skill), energy: 100, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matches: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, teamStats: {} }
    })
  } else {
    state.filialSquad = []
  }

  /* Generate CPU teams */
  state.leagueTeams = []
  const allTeamIds = [state.teamId]
  for (const t of league.teams) {
    if (t.id === state.teamId) continue
    const base = getRealSquad(t.id)
    const cap = t.rating || 99
    const squad = base
      ? base.map(p => ({ ...p, skill: Math.min(cap, p.skill), value: p.value || calcValue(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null }))
      : generateCpuSquad(t.id, state.countryId, t.rating)
    const defaultStaff = t.staff || generateStaff(t.name, state.countryId)
    state.leagueTeams.push({ teamId: t.id, name: t.name, logo: t.logo || '', formation: t.formation, gamePlan: t.gamePlan, players: squad, staff: defaultStaff, rating: t.rating || 50 })
    allTeamIds.push(t.id)
  }
  console.log('[INIT] leagueTeams:', state.leagueTeams.map(t => t.name + ': ' + t.players.length + ' players').join(', '))

  /* Generate fixtures */
  state.fixtures = generateFixtures(allTeamIds)
  state.totalMatchdays = state.fixtures.filter(f => f.matchday === 1).length > 0
    ? Math.max(...state.fixtures.map(f => f.matchday)) : 0
  state.currentMatchday = 1

  /* Generate fixtures for all leagues */
  state.allLeagueData = {}
  initAllLeagueData()

  /* Generate cup only for Spain */
  if (state.countryId === 'es') {
    state.cup = generarCopa()
    state.supercopa = generarSupercopa()
  }

  /* Build global player pool for market */
  state.globalPlayers = []
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data || !data.country) continue
    const countryFlag = data.country.flag || ''
    for (const l of data.country.leagues || []) {
      for (const t of l.teams || []) {
        const teamObj = getTeamObj(t.id)
        if (!teamObj || !teamObj.players) continue
        for (const p of teamObj.players) {
          if (state.boughtPlayerIds && state.boughtPlayerIds.indexOf(p.id) >= 0) continue
          state.globalPlayers.push({
            ...p,
            teamName: teamObj.name,
            teamId: teamObj.teamId,
            countryFlag: countryFlag,
            leagueId: l.id,
          })
        }
      }
    }
  }

  procesarFichajesIniciales()

  /* Assign dates and schedules */
  const WEEKEND_DAYS = [
    { day: 5, label: 'Viernes 20:00' },
    { day: 6, label: 'Sábado 18:00' },
    { day: 0, label: 'Domingo 12:00' },
  ]
  const MIDWEEK_MD = [7, 14, 21, 28]
  state.fixtures.forEach(f => {
    const d = new Date(2026, 8, 1)
    let offset = (f.matchday - 1) * 8
    if (f.matchday > 15) offset += 21
    if (f.matchday > 23) offset += 14
    d.setDate(d.getDate() + offset)
    if (MIDWEEK_MD.includes(f.matchday)) {
      const diff = (5 - d.getDay() + 7) % 7
      d.setDate(d.getDate() + diff)
      f.horario = 'Viernes 20:00'
    } else {
      const weighted = [WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],...Array(25).fill(WEEKEND_DAYS[1]),...Array(20).fill(WEEKEND_DAYS[2])]
      const slot = pickRandom(weighted)
      const diff = (slot.day - d.getDay() + 7) % 7
      d.setDate(d.getDate() + diff)
      f.horario = slot.label
    }
    f.date = d.toISOString().slice(0, 10)
  })
  /* Validate minimum 8 days between matchdays */
  for (let md = 1; md < state.totalMatchdays; md++) {
    const cur = state.fixtures.filter(f => f.matchday === md && (f.home === state.teamId || f.away === state.teamId))
    const nxt = state.fixtures.filter(f => f.matchday === md + 1 && (f.home === state.teamId || f.away === state.teamId))
    if (cur.length === 0 || nxt.length === 0) continue
    const curDate = new Date(cur[0].date + 'T12:00:00')
    const nxtDate = new Date(nxt[0].date + 'T12:00:00')
    const diff = Math.round((nxtDate - curDate) / (1000 * 60 * 60 * 24))
    if (diff < 8) {
      nxtDate.setDate(nxtDate.getDate() + (8 - diff))
      const nd = nxtDate.getDay()
      if (nd >= 1 && nd <= 4) nxtDate.setDate(nxtDate.getDate() + ((5 - nd + 7) % 7))
      const newDate = nxtDate.toISOString().slice(0, 10)
      state.fixtures.filter(f => f.matchday === md + 1).forEach(f => { f.date = newDate })
    }
  }

  /* Sync horario with actual day after validation */
  const DAY_LABELS = { 5: 'Viernes', 6: 'Sábado', 0: 'Domingo' }
  state.fixtures.filter(f => f.matchday <= state.totalMatchdays).forEach(f => {
    if (!f.horario) return
    const d = new Date(f.date + 'T12:00:00')
    const label = DAY_LABELS[d.getDay()]
    if (label && !f.horario.startsWith(label)) {
      const parts = f.horario.split(' ')
      f.horario = `${label} ${parts.slice(1).join(' ') || '20:00'}`
    }
  })

  autoAssignSquad()

  addNotification('general', `🏆 Bienvenido, ${coach}!`, `${coach} asume el banquillo del ${selectedTeam.name} en la ${league.name}`)
  startGame()
}

function loadGame(id) {
  const saves = getSaves()
  const data = saves.find(s => Number(s.id) === Number(id))
  if (!data) { console.warn('[LOAD] Save not found for id:', id, 'saves:', saves.length); return }
  state.coach = data.coach
  state.team = data.team
  state.teamId = data.teamId
  state.teamLogo = data.teamLogo || ''
  state.countryId = data.countryId
  state.leagueId = data.leagueId
  state.gameId = data.id
  state.stats = data.stats || { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.players = (data.players || []).map(p => ({ ...p, age: p.age || randInt(22, 34) }))
  state.tactic = data.tactic || { formation: '4-3-3', gamePlan: 'pesado' }
  state.finances = data.finances || { balance: 5000, history: [] }
  state.leagueTeams = data.leagueTeams || []
  state.currentMatchday = data.currentMatchday || 1
  state.totalMatchdays = data.totalMatchdays || 0
  state.fixtures = data.fixtures || []
  state.allLeagueData = data.allLeagueData || {}
  initAllLeagueData()
  state.tacticsSlots = data.tacticsSlots || []
  state.captainId = data.captainId || null
  state.benchIds = data.benchIds || []
  state.reserveIds = data.reserveIds || []
  state.staff = data.staff || []
  state.inbox = data.inbox || []
  state.soundEnabled = data.soundEnabled !== false
  state.filialSquad = data.filialSquad || []
  state.globalPlayers = data.globalPlayers || []
  state.trophies = data.trophies || []
  state.seasonNumber = data.seasonNumber || 1
  state.loanPool = data.loanPool || []
  state.boughtPlayerIds = data.boughtPlayerIds || []
  state.presupuestoInicial = data.presupuestoInicial || 0
  state.cup = data.cup || null
  state.supercopa = data.supercopa || null
  state.cupChampion = data.cupChampion || null
  state.cupRunnerUp = data.cupRunnerUp || null
  state.leagueChampion = data.leagueChampion || null
  state.leagueRunnerUp = data.leagueRunnerUp || null
  loadCountryData(state.countryId, function() {
    normalizarPlantillas()
    startGame()
  })
}

function startGame() {
  normalizarPlantillas()
  document.getElementById('menu-screen').classList.add('hidden')
  document.getElementById('menu-newgame').classList.add('hidden')
  document.getElementById('game-screen').classList.remove('hidden')
  loadTactics()
  setupNavigation()
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelector('[data-tab="home"]').classList.add('active')
  renderTab('home')
  updateInboxBadge()
  actualizarIndicadorTemporada()
  checkTransferWindow()
}

/* ============ MENU ============ */
let selectedCountry = null
let selectedLeague = null
let selectedTeam = null

function getBaseTeamName(name) {
  let base = name.trim()
  base = base.replace(/ (?:Juvenil|Cadet|Cadete|Infantil) [A-Z]$/i, '')
  base = base.replace(/ [A-Z]$/, '')
  return base
}

function showMainMenu() {
  document.getElementById('menu-screen').classList.remove('hidden')
  document.getElementById('game-screen').classList.add('hidden')
  document.getElementById('menu-main').classList.remove('hidden')
  document.getElementById('menu-newgame').classList.add('hidden')
  document.getElementById('menu-load').classList.add('hidden')
  selectedCountry = null
  selectedLeague = null
  selectedTeam = null
}

function showNewGameScreen() {
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-load').classList.add('hidden')
  const el = document.getElementById('menu-newgame')
  el.classList.remove('hidden')
  el.style.display = 'flex'

  /* Reset state */
  selectedCountry = null
  selectedLeague = null
  selectedTeam = null

  /* Show country step, hide teams step */
  document.getElementById('ng-step-countries').classList.remove('ng-hidden')
  document.getElementById('ng-step-teams').classList.add('ng-hidden')

  /* Render country grid */
  renderCountryGrid()

  /* Clear inputs */
  document.getElementById('ng-coach-input').value = ''
  updateTeamBadge(null)

  /* Update progress: step 1 active */
  document.querySelectorAll('.ng-step').forEach((s, i) => {
    s.classList.toggle('active', i === 0)
    s.classList.toggle('done', false)
  })
}

function renderCountryGrid() {
  const grid = document.getElementById('ng-country-grid')
  grid.innerHTML = COUNTRIES.map(c => `
    <div class="ng-country-card${selectedCountry && selectedCountry.id === c.id ? ' selected' : ''}" data-cid="${c.id}">
      <div class="ng-country-name">${c.name}</div>
      <div class="ng-country-flag">${c.flag}</div>
      <div class="ng-country-leagues">
        <span>${window.DB[c.id] ? (getVisibleLeagueCount(c.id) + ' ligas') : ''}</span>
      </div>
    </div>
  `).join('')

  grid.querySelectorAll('.ng-country-card').forEach(card => {
    card.onclick = () => {
      selectedCountry = COUNTRIES.find(c => c.id === card.dataset.cid)
      grid.querySelectorAll('.ng-country-card').forEach(c => c.classList.toggle('selected', c.dataset.cid === selectedCountry.id))
    }
  })
}

function showTeamSelectionStep() {
  if (!selectedCountry) return
  const countryId = selectedCountry.id

  const msg = document.getElementById('ng-error-msg')
  if (msg) { msg.classList.add('hidden'); msg.textContent = '' }

  loadCountryData(countryId, function(data) {
    if (!data) {
      if (msg) { msg.textContent = 'No se pudieron cargar los datos de ' + selectedCountry.name + '. Intenta de nuevo.'; msg.classList.remove('hidden') }
      return
    }

    selectedLeague = null
    selectedTeam = null

    const leagues = data.country.leagues || []

    if (leagues.length > 0) {
      var firstGrouped = leagues.find(function(l) { return l.id && isGroupedLeague(l.id) })
      if (firstGrouped) {
        var gCfg = getGroupedConfig(firstGrouped.id)
        var grpAll = leagues.filter(function(l) { return l.id && isGroupedLeague(l.id) })
        var mergedG = []
        for (var gi3 = 0; gi3 < grpAll.length; gi3++) {
          mergedG = mergedG.concat(grpAll[gi3].teams || [])
        }
        selectedLeague = { id: gCfg.groups[0].replace(/[0-9]+$/, ''), name: gCfg.name, logo: grpAll[0].logo, teams: mergedG, _groups: grpAll }
      } else {
        selectedLeague = leagues[0]
      }
    }

    renderLeagueSelector(leagues)
    if (selectedLeague) renderTeamList(selectedLeague)

    document.querySelectorAll('.ng-step').forEach((s, i) => {
      s.classList.toggle('done', i === 0)
      s.classList.toggle('active', i === 1)
    })

    document.getElementById('ng-step-countries').classList.add('ng-hidden')
    document.getElementById('ng-step-teams').classList.remove('ng-hidden')
  })
}

function renderLeagueSelector(leagues) {
  var groupedSets = {}
  for (var gi = 0; gi < leagues.length; gi++) {
    var l = leagues[gi]
    if (l.id && isGroupedLeague(l.id)) {
      var cfg = getGroupedConfig(l.id)
      if (!groupedSets[cfg.name]) groupedSets[cfg.name] = { config: cfg, groups: [] }
      groupedSets[cfg.name].groups.push(l)
    }
  }
  var displayLeagues = []
  var otherLeagues = []
  for (var gii = 0; gii < leagues.length; gii++) {
    var l2 = leagues[gii]
    if (l2.id && isGroupedLeague(l2.id)) {
      var cfg2 = getGroupedConfig(l2.id)
      if (groupedSets[cfg2.name] && groupedSets[cfg2.name]._added) continue
      if (groupedSets[cfg2.name]) {
        var grps = groupedSets[cfg2.name].groups
        var mt = []
        for (var gm = 0; gm < grps.length; gm++) mt = mt.concat(grps[gm].teams || [])
        var mergedId = cfg2.groups[0].replace(/[0-9]+$/, '')
        displayLeagues.push({ id: mergedId, name: cfg2.name, logo: grps[0].logo, teams: mt, _groups: grps })
        groupedSets[cfg2.name]._added = true
      }
    } else {
      otherLeagues.push(l2)
    }
  }
  displayLeagues = otherLeagues.concat(displayLeagues)
  const container = document.getElementById('ng-leagues')
  container.innerHTML = displayLeagues.map(function(l) {
    return '<div class="ng-league-item' + (l.id === (selectedLeague && selectedLeague.id) ? ' active' : '') + '" data-lid="' + l.id + '" title="' + l.name + '">' +
      (l.logo ? '<img class="ng-league-logo" src="' + l.logo + '" alt="' + l.name + '">' : '<span>' + l.name + '</span>') +
      '</div>'
  }).join('')
  const dbData = window.DB[selectedCountry ? selectedCountry.id : state.countryId]
  container.querySelectorAll('.ng-league-item').forEach(function(el) {
    el.onclick = function() {
      var lid = el.dataset.lid
      if (isGroupedLeague(lid)) {
        selectedLeague = displayLeagues.find(function(l) { return l.id === lid })
      } else {
        selectedLeague = (dbData ? dbData.country.leagues : []).find(function(l) { return l.id === lid })
      }
      renderTeamList(selectedLeague)
      container.querySelectorAll('.ng-league-item').forEach(function(x) { return x.classList.toggle('active', x.dataset.lid === lid) })
    }
  })
}

function getDB() {
  const cid = (selectedCountry && selectedCountry.id) || state.countryId
  return window.DB[cid] || null
}

function getRealSquad(teamId) {
  if (!teamId) return null
  for (const cid in window.DB) {
    const sq = window.DB[cid].realSquads
    if (sq && sq[teamId]) return sq[teamId]
  }
  return null
}

function getBaseDato(teamId) {
  if (!teamId) return null
  for (const cid in window.DB) {
    const arr = window.DB[cid].baseDatos
    if (arr) { const f = arr.find(e => e.id === teamId); if (f) return f }
  }
  return null
}

function renderTeamList(league) {
  const list = document.getElementById('ng-teams-list')
  const countEl = document.getElementById('ng-team-count')
  const teams = [...(league.teams || [])].sort((a, b) => {
    const rsA = getRealSquad(a.id), rsB = getRealSquad(b.id)
    const pA = rsA ? getTop11Average(rsA) : (a.rating || 0)
    const pB = rsB ? getTop11Average(rsB) : (b.rating || 0)
    return pB - pA
  })
  countEl.textContent = `Equipo (${teams.length})`

  if (teams.length === 0) {
    list.innerHTML = '<div style="padding:40px 20px;text-align:center;color:var(--text-muted);font-size:13px">No hay equipos disponibles.</div>'
    return
  }

  let html = `<div class="ng-create-row" id="ng-create-team">
    <div class="ng-create-icon">＋</div>
    <span class="ng-create-text">Crear mi propio club</span>
  </div>`

  for (const t of teams) {
    const db = getBaseDato(t.id)
    const rs = getRealSquad(t.id)
    const rating = rs ? getTop11Average(rs) : (db ? db.rating : t.rating || 70)
    const squadCount = rs ? rs.length : 10
    const isSelected = selectedTeam && selectedTeam.id === t.id
    const coachName = (t.staff && t.staff.find(s => s.role === 'headCoach')?.name) || ''
    html += `<div class="ng-team-row${isSelected ? ' selected' : ''}" data-tid="${t.id}">
      <img class="ng-team-logo" src="${t.logo || NOPHOTO}" alt="" loading="lazy" onerror="this.src='${NOPHOTO}'">
      <span class="ng-team-name">${t.name}</span>
      <button class="ng-team-preview" data-pid="${t.id}">Ver</button>
      <span class="ng-team-players">${squadCount}</span>
      <span class="ng-team-rating">${rating}</span>
    </div>`
  }

  list.innerHTML = html

  /* Team row click → select team */
  list.querySelectorAll('.ng-team-row').forEach(row => {
    row.onclick = () => {
      const tid = row.dataset.tid
      selectedTeam = teams.find(t => t.id === tid)
      list.querySelectorAll('.ng-team-row').forEach(r => r.classList.toggle('selected', r.dataset.tid === tid))
      updateTeamBadge(selectedTeam)
    }
  })

  /* Create team → select custom */
  document.getElementById('ng-create-team').onclick = () => {
    selectedTeam = { id: 'custom', name: 'Mi Club', rating: 70, logo: '' }
    updateTeamBadge(selectedTeam)
    list.querySelectorAll('.ng-team-row').forEach(r => r.classList.remove('selected'))
  }

  /* Preview buttons */
  list.querySelectorAll('.ng-team-preview').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation()
      const pid = btn.dataset.pid
      showTeamPreview(pid)
    }
  })
}

function updateTeamBadge(team) {
  const badge = document.getElementById('ng-team-badge')
  if (team) {
    badge.innerHTML = team.logo
      ? `<img src="${team.logo}" alt="${team.name}">`
      : `<span class="ng-badge-placeholder">${team.name}</span>`
  } else {
    badge.innerHTML = '<span class="ng-badge-placeholder">Sin equipo seleccionado...</span>'
  }
}

function showTeamPreview(teamId) {
  console.log('[PREVIEW] teamId:', teamId)
  let team = null
  let foundCountryId = 'poland'
  let foundLeague = null
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const t = l.teams.find(x => x.id === teamId)
      if (t) { team = t; foundCountryId = cid; foundLeague = l; break }
    }
    if (team) break
  }
  if (!team) return

  const db = getBaseDato(teamId)
  const rating = db ? db.rating : 70
  const rawSquad = getRealSquad(teamId) || generateCpuSquad(teamId, foundCountryId, rating)
  const realSquad = rawSquad.map(p => ({ ...p, value: p.value || calcValue(p.skill) }))
  const staff = team.staff || []
  const logo = team.logo || ''
  const coachName = staff.find(s => s.role === 'headCoach')?.name || '—'

  /* Set header title */
  document.getElementById('tp-header-title').textContent = team.name

  /* Stats panel — same as Club view */
  const totalVal = realSquad.reduce((s, p) => s + (p.value || 0), 0)
  const displayPower = getTop11Average(realSquad)
  const reputation = displayPower < 42 ? 1 : displayPower < 58 ? 2 : displayPower < 72 ? 3 : displayPower < 85 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const countryFlag = window.DB[foundCountryId] ? window.DB[foundCountryId].country.flag : ''
  const teamBudget = team.budget || (foundLeague ? Math.round(getDivisionBaseBudget(foundLeague.id) * getCountryBudgetMult(foundCountryId) * ((team.rating || 50) / 50)) : 0)
  document.getElementById('tp-stats').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:0;width:100%">
      <div style="display:flex;gap:1px;padding:8px 10px;background:var(--bg);border-bottom:1px solid var(--border)">
        <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">\u2014</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Reputaci\u00f3n</span><span class="tp-stat-stars">${stars}</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Pa\u00eds</span><span class="tp-stat-flag">${countryFlag}</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
      </div>
      <div style="display:flex;gap:1px;padding:8px 10px;background:var(--bg)">
        <div class="tp-stat"><span class="tp-stat-label">Formaci\u00f3n</span><span class="tp-stat-value">${team.formation || '\u2014'}</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Presi\u00f3n</span><span class="tp-stat-value">${(GAME_PLANS[team.gamePlan] || {}).label || team.gamePlan || '\u2014'}</span></div>
        <div class="tp-stat"><span class="tp-stat-label">Presupuesto</span><span class="tp-stat-value">\u20AC${formatShort(teamBudget)}</span></div>
      </div>
    </div>
  `
  /* Staff section – cards in its own container after tp-stats */
  if (staff.length > 0) {
    var roleLabels = { headCoach: 'Entrenador', assistantCoach: '2\u00ba Entrenador', delegate: 'Delegado', goalkeeperCoach: 'Entrenador de porteros', fitnessCoach: 'Preparador f\u00edsico' }
    var staffHtml = '<div class="tactics-subsection-label" style="margin-top:6px;padding:0 10px">Staff t\u00e9cnico (' + staff.length + ')</div>'
    for (var si = 0; si < staff.length; si++) {
      var s = staff[si]
      var avatar = s.avatar || NOPHOTO
      var avatarStyle = 'background-image:url(' + avatar + ');background-size:cover;background-position:center;background-color:var(--bg-surface)'
      staffHtml += '<div class="staff-card"><div class="staff-card-avatar" style="' + avatarStyle + '"></div><div class="staff-card-info"><div class="staff-card-name">' + s.name + '</div><div class="staff-card-meta">' + s.nationality + '</div></div><span class="staff-card-role" data-role="' + s.role + '">' + (roleLabels[s.role] || s.role) + '</span></div>'
    }
    document.getElementById('tp-staff-container').innerHTML = staffHtml
  } else {
    document.getElementById('tp-staff-container').innerHTML = ''
  }

  /* Squad label */
  document.getElementById('tp-squad-label').textContent = 'PLANTILLA (' + realSquad.length + ')'

  /* Player rows */
  const ordered = [...realSquad].sort((a, b) => {
    const posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    const posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })
  const listHtml = ordered.map(p => {
    const valShort = formatShort(p.value || 0)
    return `<div class="tp-row">
      <span class="tp-cell-pos-badge" style="background:${((POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280')};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''}</span>
        </div>
      </div>
      <span class="tp-cell-age">${p.age || '-'}</span>
      <span class="tp-cell-market">${valShort}</span>
      <span class="tp-cell-power" style="${getPowerBadgeStyle(p.skill)}">${p.skill}</span>
    </div>`
  }).join('')
  document.getElementById('tp-list').innerHTML = listHtml

  /* Row click → player detail modal */
  document.querySelectorAll('#tp-list .tp-row').forEach((row, idx) => {
    row.onclick = () => openPlayerDetail(ordered[idx])
  })

  /* Show fullscreen */
  document.getElementById('tp-fullscreen').classList.remove('hidden')
  selectedTeam = team

  /* Button handlers */
  const closePreview = () => {
    document.getElementById('tp-fullscreen').classList.add('hidden')
    updateTeamBadge(selectedTeam)
    if (selectedLeague) {
      document.querySelectorAll('.ng-team-row').forEach(r => r.classList.toggle('selected', r.dataset.tid === selectedTeam.id))
    }
  }
  document.getElementById('tp-header-back').onclick = closePreview
}

function startNewGame() {
  const coachName = document.getElementById('ng-coach-input').value.trim()
  if (!coachName) {
    document.getElementById('ng-coach-input').focus()
    return
  }
  if (!selectedTeam) return
  const db = window.DB[selectedCountry.id]
  if (!selectedLeague && db) selectedLeague = db.country.leagues[0]

  /* For custom team, create a temp team entry */
  if (selectedTeam.id === 'custom') {
    const tmpId = 'custom-' + Date.now()
    selectedTeam.id = tmpId
    selectedTeam.logo = ''
    selectedTeam.rating = 70
  }

  newGame(coachName)
}

/* ============ COACH NATIONALITY PICKER ============ */
const COACH_NATIONALITIES = [
  { flag: '🇦🇱', name: 'Albania' },
  { flag: '🇩🇪', name: 'Alemania' },
  { flag: '🇦🇴', name: 'Angola' },
  { flag: '🇸🇦', name: 'Arabia Saudí' },
  { flag: '🇩🇿', name: 'Argelia' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇦🇲', name: 'Armenia' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇦🇹', name: 'Austria' },
  { flag: '🇧🇩', name: 'Bangladés' },
  { flag: '🇧🇪', name: 'Bélgica' },
  { flag: '🇧🇯', name: 'Benín' },
  { flag: '🇧🇾', name: 'Bielorrusia' },
  { flag: '🇧🇦', name: 'Bosnia' },
  { flag: '🇧🇷', name: 'Brasil' },
  { flag: '🇧🇬', name: 'Bulgaria' },
  { flag: '🇧🇫', name: 'Burkina Faso' },
  { flag: '🇨🇲', name: 'Camerún' },
  { flag: '🇨🇦', name: 'Canadá' },
  { flag: '🇨🇱', name: 'Chile' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇨🇬', name: 'Congo' },
  { flag: '🇰🇵', name: 'Corea del Norte' },
  { flag: '🇰🇷', name: 'Corea del Sur' },
  { flag: '🇨🇮', name: 'Costa de Marfil' },
  { flag: '🇭🇷', name: 'Croacia' },
  { flag: '🇩🇰', name: 'Dinamarca' },
  { flag: '🇪🇬', name: 'Egipto' },
  { flag: '🇦🇪', name: 'Emiratos Árabes Unidos' },
  { flag: '🇸🇰', name: 'Eslovaquia' },
  { flag: '🇸🇮', name: 'Eslovenia' },
  { flag: '🇪🇸', name: 'España' },
  { flag: '🇺🇸', name: 'Estados Unidos' },
  { flag: '🇪🇪', name: 'Estonia' },
  { flag: '🇪🇹', name: 'Etiopía' },
  { flag: '🇵🇭', name: 'Filipinas' },
  { flag: '🇫🇮', name: 'Finlandia' },
  { flag: '🇫🇷', name: 'Francia' },
  { flag: '🇬🇦', name: 'Gabón' },
  { flag: '🇬🇲', name: 'Gambia' },
  { flag: '🇬🇪', name: 'Georgia' },
  { flag: '🇬🇭', name: 'Ghana' },
  { flag: '🇬🇷', name: 'Grecia' },
  { flag: '🇬🇳', name: 'Guinea' },
  { flag: '🇭🇳', name: 'Honduras' },
  { flag: '🇭🇺', name: 'Hungría' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'Inglaterra' },
  { flag: '🇮🇶', name: 'Irak' },
  { flag: '🇮🇷', name: 'Irán' },
  { flag: '🇮🇪', name: 'Irlanda' },
  { flag: '🇮🇸', name: 'Islandia' },
  { flag: '🇮🇱', name: 'Israel' },
  { flag: '🇮🇹', name: 'Italia' },
  { flag: '🇯🇲', name: 'Jamaica' },
  { flag: '🇯🇵', name: 'Japón' },
  { flag: '🇯🇴', name: 'Jordania' },
  { flag: '🇰🇿', name: 'Kazajistán' },
  { flag: '🇰🇪', name: 'Kenia' },
  { flag: '🇽🇰', name: 'Kosovo' },
  { flag: '🇰🇼', name: 'Kuwait' },
  { flag: '🇱🇻', name: 'Letonia' },
  { flag: '🇱🇧', name: 'Líbano' },
  { flag: '🇱🇷', name: 'Liberia' },
  { flag: '🇱🇾', name: 'Libia' },
  { flag: '🇱🇹', name: 'Lituania' },
  { flag: '🇱🇺', name: 'Luxemburgo' },
  { flag: '🇲🇰', name: 'Macedonia del Norte' },
  { flag: '🇲🇬', name: 'Madagascar' },
  { flag: '🇲🇾', name: 'Malasia' },
  { flag: '🇲🇼', name: 'Malaui' },
  { flag: '🇲🇱', name: 'Malí' },
  { flag: '🇲🇹', name: 'Malta' },
  { flag: '🇲🇦', name: 'Marruecos' },
  { flag: '🇲🇺', name: 'Mauricio' },
  { flag: '🇲🇷', name: 'Mauritania' },
  { flag: '🇲🇽', name: 'México' },
  { flag: '🇲🇩', name: 'Moldavia' },
  { flag: '🇲🇪', name: 'Montenegro' },
  { flag: '🇲🇿', name: 'Mozambique' },
  { flag: '🇲🇲', name: 'Myanmar' },
  { flag: '🇳🇦', name: 'Namibia' },
  { flag: '🇳🇮', name: 'Nicaragua' },
  { flag: '🇳🇪', name: 'Níger' },
  { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇳🇴', name: 'Noruega' },
  { flag: '🇳🇿', name: 'Nueva Zelanda' },
  { flag: '🇴🇲', name: 'Omán' },
  { flag: '🇳🇱', name: 'Países Bajos' },
  { flag: '🇵🇰', name: 'Pakistán' },
  { flag: '🇵🇦', name: 'Panamá' },
  { flag: '🇵🇬', name: 'Papúa Nueva Guinea' },
  { flag: '🇵🇾', name: 'Paraguay' },
  { flag: '🇵🇪', name: 'Perú' },
  { flag: '🇵🇱', name: 'Polonia' },
  { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇵🇷', name: 'Puerto Rico' },
  { flag: '🇶🇦', name: 'Qatar' },
  { flag: '🇨🇩', name: 'R.D. Congo' },
  { flag: '🇨🇿', name: 'República Checa' },
  { flag: '🇷🇼', name: 'Ruanda' },
  { flag: '🇷🇴', name: 'Rumanía' },
  { flag: '🇷🇺', name: 'Rusia' },
  { flag: '🇸🇳', name: 'Senegal' },
  { flag: '🇷🇸', name: 'Serbia' },
  { flag: '🇸🇱', name: 'Sierra Leona' },
  { flag: '🇸🇬', name: 'Singapur' },
  { flag: '🇸🇾', name: 'Siria' },
  { flag: '🇸🇴', name: 'Somalia' },
  { flag: '🇱🇰', name: 'Sri Lanka' },
  { flag: '🇸🇿', name: 'Suazilandia' },
  { flag: '🇸🇩', name: 'Sudán' },
  { flag: '🇸🇸', name: 'Sudán del Sur' },
  { flag: '🇸🇪', name: 'Suecia' },
  { flag: '🇨🇭', name: 'Suiza' },
  { flag: '🇸🇷', name: 'Surinam' },
  { flag: '🇹🇭', name: 'Tailandia' },
  { flag: '🇹🇼', name: 'Taiwán' },
  { flag: '🇹🇿', name: 'Tanzania' },
  { flag: '🇹🇯', name: 'Tayikistán' },
  { flag: '🇹🇱', name: 'Timor Oriental' },
  { flag: '🇹🇬', name: 'Togo' },
  { flag: '🇹🇹', name: 'Trinidad y Tobago' },
  { flag: '🇹🇳', name: 'Túnez' },
  { flag: '🇹🇲', name: 'Turkmenistán' },
  { flag: '🇹🇷', name: 'Turquía' },
  { flag: '🇺🇦', name: 'Ucrania' },
  { flag: '🇺🇬', name: 'Uganda' },
  { flag: '🇺🇾', name: 'Uruguay' },
  { flag: '🇺🇿', name: 'Uzbekistán' },
  { flag: '🇻🇺', name: 'Vanuatu' },
  { flag: '🇻🇪', name: 'Venezuela' },
  { flag: '🇻🇳', name: 'Vietnam' },
  { flag: '🇾🇪', name: 'Yemen' },
  { flag: '🇿🇲', name: 'Zambia' },
  { flag: '🇿🇼', name: 'Zimbabue' },
]

var coachNationality = COACH_NATIONALITIES[0]

function renderNationalities(filter) {
  var list = document.getElementById('nat-picker-list')
  var filtered = filter ? COACH_NATIONALITIES.filter(function(n) {
    return n.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  }) : COACH_NATIONALITIES
  list.innerHTML = filtered.map(function(n) {
    var sel = n.flag === coachNationality.flag ? ' style="background:var(--accent);color:#fff"' : ''
    return '<button class="btn-secondary"' + sel + ' onclick="selectCoachNationality(\'' + n.flag + '\',\'' + n.name.replace(/'/g, "\\'") + '\')">' + n.flag + ' ' + n.name + '</button>'
  }).join('')
}

function showNationalityPicker() {
  var modal = document.getElementById('nat-picker-modal')
  renderNationalities('')
  modal.classList.remove('hidden')
  modal.classList.add('open')
  setTimeout(function() { document.getElementById('nat-search').focus() }, 100)
}

function selectCoachNationality(flag, name) {
  var modal = document.getElementById('nat-picker-modal')
  coachNationality = { flag: flag, name: name }
  document.getElementById('ng-flag').textContent = flag
  document.getElementById('ng-nat-name').textContent = name
  modal.classList.remove('open')
  modal.classList.add('hidden')
}

/* Close nat picker */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('nat-picker-close').onclick = function() {
    var modal = document.getElementById('nat-picker-modal')
    modal.classList.remove('open')
    modal.classList.add('hidden')
  }
  document.getElementById('nat-search').oninput = function() {
    renderNationalities(this.value)
  }
})

/* ============ LOAD MENU ============ */
function showLoadMenu() {
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-newgame').classList.add('hidden')
  document.getElementById('menu-load').classList.remove('hidden')
  /* Si IndexedDB a\u00fan est\u00e1 cargando, reintentar hasta 10 veces (3s total) */
  if (_memorySaves === null) {
    var _retryCount = window._loadRetryCount || 0
    window._loadRetryCount = _retryCount + 1
    if (_retryCount < 10) {
      var loadingEl = document.getElementById('load-content')
      if (loadingEl) loadingEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Cargando partidas...</div>'
      setTimeout(showLoadMenu, 300)
      return
    }
    _memorySaves = []; _storageMode = 'empty'
    window._loadRetryCount = 0
  }
  const slots = window.SaveSystem.getEmptySlots()
  const content = document.getElementById('load-content')
  content.innerHTML = slots.filter(Boolean).map((save, idx) => {
    const m = save.meta || {}
    const mgrName = m.managerName || save.coach || '—'
    const teamName = m.teamName || save.team || '—'
    const logo = m.teamLogo || save.teamLogo || ''
    const leagueName = m.leagueName || ''
    const gameDate = m.gameDate || `Jornada ${save.matchday || 1}`
    const saveDate = m.saveDate || save.date || ''
    const ago = timeAgo(saveDate)
    const initials = getInitials(teamName)
    return `<div class="ls-slot ls-filled" data-id="${save.id}">
      <div class="ls-crest">${logo ? `<img src="${logo}" alt="${teamName}">` : `<div class="ls-crest-fallback">${initials}</div>`}</div>
      <div class="ls-info">
        <div class="ls-team">${teamName}</div>
        <div class="ls-manager">${mgrName}</div>
        <div class="ls-meta">${gameDate}${leagueName ? ` · ${leagueName}` : ''}</div>
      </div>
      <div class="ls-actions">
        <span class="ls-time">${ago}</span>
        <div class="ls-btns">
          <button class="ls-load" data-id="${save.id}">CARGAR</button>
          <button class="ls-delete" data-id="${save.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </div>
    </div>`
  }).join('')
  content.querySelectorAll('.ls-load').forEach(btn => {
    btn.onclick = (e) => { e.stopPropagation(); loadGame(Number(btn.dataset.id)) }
  })
  content.querySelectorAll('.ls-delete').forEach(btn => {
    btn.onclick = (e) => { e.stopPropagation(); window.SaveSystem.deleteGame(Number(btn.dataset.id)) }
  })
}

/* ============ CALENDAR ============ */
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getCalMatchIcon(md) {
  const f = state.fixtures.find(x => x.matchday === md && (x.home === state.teamId || x.away === state.teamId))
  if (!f) return ''
  const rivalId = f.home === state.teamId ? f.away : f.home
  const isHome = f.home === state.teamId
  const logo = getTeamLogo(rivalId)
  const homeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  const awaySvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l-3 5h2v4l-4 3 1 5 4-3v4l2 2 2-2v-4l4 3 1-5-4-3V7h2z"/></svg>'
  return `<span class="cal-day-icon">${logo ? `<img class="cal-day-logo" src="${logo}">` : ''}<span class="cal-day-loc">${isHome ? homeSvg : awaySvg}</span></span>`
}

function getSeasonDate(matchday) {
  const f = state.fixtures.find(x => x.matchday === matchday)
  if (f && f.date) return new Date(f.date + 'T12:00:00')
  const d = new Date(2026, 8, 1)
  d.setDate(d.getDate() + (matchday - 1) * 7)
  return d
}

let calMonthOffset = 0

function showCalendar() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  const view = document.getElementById('view-calendar')
  if (view) view.classList.add('active')
  renderCalendar()
}

function renderCalendar() {
  const container = document.getElementById('club-calendar-content')
  if (!container) return

  const league = getLeagueFromId(state.leagueId)
  if (!league) console.warn('[CAL] League not found:', state.leagueId)
  const leagueName = league?.name || state.leagueId
  const leagueLogo = league?.logo || ''
  const myLogo = state.teamLogo || getTeamLogo(state.teamId) || ''

  /* Build a combined list of events: league fixtures + cup fixtures, sorted by week */
  var events = []

  /* League fixtures */
  state.fixtures
    .filter(function(f) { return (f.home === state.teamId || f.away === state.teamId) && f.matchday <= state.totalMatchdays })
    .forEach(function(f) {
      events.push({ week: f.matchday, type: 'league', fixture: f, compName: leagueName, compLogo: leagueLogo })
    })

  /* Cup fixtures */
  if (state.cup) {
    state.cup.allFixtures.forEach(function(f) {
      if (f.home !== state.teamId && f.away !== state.teamId) return
      events.push({ week: f.week, type: 'cup', fixture: f, compName: 'Copa del Rey', compLogo: COPA_LOGO })
    })
  }
  /* Supercopa fixtures */
  if (state.supercopa) {
    var allSc = state.supercopa.fixtures.slice()
    if (state.supercopa.final) allSc.push(state.supercopa.final)
    allSc.forEach(function(f) {
      if (f.home !== state.teamId && f.away !== state.teamId) return
      events.push({ week: state.supercopa.week, type: 'supercopa', fixture: f, compName: 'Supercopa', compLogo: SUPERC_LOGO })
    })
  }

  events.sort(function(a, b) { return a.week - b.week })

  let html = `<div class="cal-list">
    <div class="cal-list-header">
      <span class="cal-list-hd-semana">SEMANA</span>
      <span class="cal-list-hd-comp">COMPETICI\u00d3N</span>
      <span class="cal-list-hd-equipo">EQUIPO</span>
      <span class="cal-list-hd-result">RESULTADO</span>
    </div>`

  if (events.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-muted)">No hay partidos esta temporada</div>'
  } else {
    html += events.map(function(e) {
      var f = e.fixture
      var isHome = f.home === state.teamId
      var rivalId = isHome ? f.away : f.home
      var rivalLogo = getTeamLogo(rivalId)
      var played = f.played
      var scoreText = played ? (f.homeScore + ' - ' + f.awayScore) : '\u2014'
      var resultClass = 'pending'
      if (played) {
        var us = isHome ? f.homeScore : f.awayScore
        var them = isHome ? f.awayScore : f.homeScore
        if (us > them) resultClass = 'win'
        else if (us < them) resultClass = 'loss'
        else resultClass = 'draw'
      }
      var badge = e.type === 'cup' ? '\ud83c\udfc6 ' : e.type === 'supercopa' ? '\ud83c\udfc6 ' : ''
      var equipoHtml = isHome
        ? '<img class="cal-list-team-logo" src="' + myLogo + '" onerror="this.style.display=\'none\'"><img class="cal-list-team-logo" src="' + rivalLogo + '" onerror="this.style.display=\'none\'">'
        : '<img class="cal-list-team-logo" src="' + rivalLogo + '" onerror="this.style.display=\'none\'"><img class="cal-list-team-logo" src="' + myLogo + '" onerror="this.style.display=\'none\'">'
      var compHtml = e.compLogo
        ? '<img class="cal-list-comp-logo" src="' + e.compLogo + '" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\'"><span style="display:none">' + badge + e.compName + '</span>'
        : '<span>' + badge + e.compName + '</span>'
      return '<div class="cal-list-row' + (e.type !== 'league' ? ' cal-cup-row' : '') + '" data-md="' + f.matchday + '">' +
        '<span class="cal-list-semana">' + e.week + '</span>' +
        '<span class="cal-list-comp">' + compHtml + '</span>' +
        '<span class="cal-list-equipo">' + equipoHtml + '</span>' +
        '<span class="cal-list-result ' + resultClass + '">' + scoreText + '</span>' +
      '</div>'
    }).join('')
  }

  html += '</div><button class="cal-back-btn" id="cal-back" style="margin-top:12px">\u2190 Volver</button>'

  container.innerHTML = html

  /* Click row — go to home tab and highlight upcoming match */
  container.querySelectorAll('.cal-list-row').forEach(row => {
    row.onclick = () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
      document.querySelector('[data-tab="home"]').classList.add('active')
      renderTab('home')
    }
  })

  document.getElementById('cal-back').onclick = () => {
    state.clubSubTab = 'squad'
    renderClub()
  }
}

/* ============ PALMARÉS ============ */
function renderPalmares() {
  var container = document.getElementById('club-palmares-content')
  var trophies = state.trophies || []
  var html = ''

  if (trophies.length === 0) {
    html += '<div style="text-align:center;padding:40px 10px;color:var(--text-muted)">'
    html += '<p style="font-size:32px;margin:0 0 12px">🏆</p>'
    html += '<p>Aún no has ganado ningún trofeo</p>'
    html += '</div>'
  } else {
    html += '<div class="palmares-list" style="padding:10px">'
    for (var i = trophies.length - 1; i >= 0; i--) {
      var t = trophies[i]
      html += '<div class="palmares-item" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      html += '<span style="font-size:22px">🏆</span>'
      html += '<div style="flex:1"><strong>' + t.competition + '</strong><br><span style="font-size:12px;color:var(--text-muted)">Temporada ' + t.season + '</span></div>'
      html += '</div>'
    }
    html += '</div>'
  }

  container.innerHTML = html
}

/* ============ TEAM INFO ============ */
function showTeamInfo(teamId) {
  const team = getTeamObj(teamId)
  if (!team) return
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  document.getElementById('view-team').classList.add('active')
  const standings = updateLeagueStandings()
  const pos = standings.findIndex(s => s.teamId === teamId) + 1
  const logo = getTeamLogo(teamId)
  const posDisplay = pos > 0 ? `${pos}º` : (team.players.length > 0 ? '—' : 'Otra liga')
  const displayPower = getTop11Average(team.players)
  const reputation = displayPower < 42 ? 1 : displayPower < 58 ? 2 : displayPower < 72 ? 3 : displayPower < 85 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const totalVal = team.players.reduce((s, p) => s + (p.value || 0), 0)
  /* Find country flag for this team */
  let teamFlag = ''
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      if (l.teams.find(x => x.id === teamId)) {
        teamFlag = data.country.flag || ''
        break
      }
    }
    if (teamFlag) break
  }
  let html = `
    <div class="view-header">
      <div class="view-header-left">
        ${logo ? `<img class="team-logo" src="${logo}" style="width:32px;height:32px">` : ''}
        <h2>${team.name}</h2>
      </div>
      <button class="btn-back" id="btn-team-back">← Volver</button>
    </div>
    <div class="tp-stats" style="margin-bottom:6px">
      <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">${posDisplay}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Reputación</span><span class="tp-stat-stars">${stars}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">País</span><span class="tp-stat-flag">${teamFlag}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
    </div>
    <div class="tp-stats" style="margin-bottom:12px">
      <div class="tp-stat"><span class="tp-stat-label">Formación</span><span class="tp-stat-value">${team.formation || '\u2014'}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Presión</span><span class="tp-stat-value">${(GAME_PLANS[team.gamePlan] || {}).label || team.gamePlan || '\u2014'}</span></div>
      <div class="tp-stat" style="flex:2"></div>
    </div>`
  /* Staff */
  const roleLabels = { headCoach: 'Entrenador', assistantCoach: '2º Entrenador', delegate: 'Delegado', goalkeeperCoach: 'Entrenador de porteros', fitnessCoach: 'Preparador físico' }
  if (team.staff && team.staff.length > 0) {
    html += `<div class="tactics-subsection-label">Staff t\u00e9cnico (${team.staff.length})</div>`
    team.staff.forEach(s => {
      const avatar = s.avatar || 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
      const avatarStyle = `background-image:url(${avatar});background-size:cover;background-position:center;background-color:var(--bg-surface)`
      html += `<div class="staff-card staff-card-team"><div class="staff-card-avatar" style="${avatarStyle}"></div><div class="staff-card-info"><div class="staff-card-name">${s.name}</div><div class="staff-card-meta">${s.nationality}</div></div><span class="staff-card-role" data-role="${s.role}">${roleLabels[s.role] || s.role}</span></div>`
    })
  }
  /* Player section container (will be filled by tabs) */
  html += '<div id="team-players-section"></div>'
  html += '<button class="btn-secondary" id="btn-team-back-2" style="margin-top:12px">← Volver</button>'
  document.getElementById('team-info-content').innerHTML = html
  document.getElementById('btn-team-back').onclick = goBackFromTeam
  document.getElementById('btn-team-back-2').onclick = goBackFromTeam

  /* Player table with tabs */
  var teamInfoTab = 'info'
  var orderedPlayers = [...team.players].sort(function(a, b) {
    var posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    var posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })

  function renderTeamPlayers() {
    var tab = teamInfoTab
    var html2 = ''
    if (tab === 'info') {
      html2 += '<div class="tactics-subsection-label">PLANTILLA (' + team.players.length + ')</div>'
      html2 += '<div class="sub-tabs" style="display:flex;gap:4px;padding:4px 14px"><button class="sub-tab team-info-tab active" data-tab="info">Info</button><button class="sub-tab team-info-tab" data-tab="performance">Rendimiento</button></div>'
      html2 += '<div class="tp-table-header" style="padding:6px 14px"><span class="tp-th-pos">Pos</span><span class="tp-th-name">Nombre</span><span class="tp-th-age">Edad</span><span class="tp-th-value">Valor</span><span class="tp-th-power">Pod</span></div><div class="tp-list">'
      html2 += orderedPlayers.map(function(p) {
        var posColor = (POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280'
        var valShort = formatShort(p.value || 0)
        return '<div class="tp-row" data-player-id="' + p.id + '"><span class="tp-cell-pos-badge" style="background:' + posColor + ';color:#fff">' + (POS_ABBR[p.position] || p.position) + '</span><div class="tp-cell"><img class="tp-cell-img" src="' + (p.avatar || NOPHOTO) + '" alt="" onerror="this.src=\'' + NOPHOTO + '\'"><div class="tp-cell-info"><span class="tp-cell-name">' + p.name + '</span><span class="tp-cell-value">' + (p.nationality || '') + '</span></div></div><span class="tp-cell-age">' + (p.age || '-') + '</span><span class="tp-cell-market">' + valShort + '</span><span class="tp-cell-power" style="' + getPowerBadgeStyle(p.skill) + '">' + p.skill + '</span></div>'
      }).join('')
      html2 += '</div>'
    } else {
      html2 += '<div class="tactics-subsection-label">PLANTILLA (' + team.players.length + ')</div>'
      html2 += '<div class="sub-tabs" style="display:flex;gap:4px;padding:4px 14px"><button class="sub-tab team-info-tab" data-tab="info">Info</button><button class="sub-tab team-info-tab active" data-tab="performance">Rendimiento</button></div>'
      html2 += '<div class="tp-table-header" style="padding:6px 14px"><span class="tp-th-pos">Pos</span><span class="tp-th-name">Nombre</span><span class="tp-th-pj">PJ</span><span class="tp-th-g">G</span><span class="tp-th-a">A</span><span style="width:30px;text-align:center;font-size:10px;color:var(--text-muted)">🟨</span><span style="width:28px;text-align:center;font-size:10px;color:var(--text-muted)">🟥</span></div><div class="tp-list">'
      html2 += orderedPlayers.map(function(p) {
        var posColor = (POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280'
        return '<div class="tp-row" data-player-id="' + p.id + '"><span class="tp-cell-pos-badge" style="background:' + posColor + ';color:#fff">' + (POS_ABBR[p.position] || p.position) + '</span><div class="tp-cell"><img class="tp-cell-img" src="' + (p.avatar || NOPHOTO) + '" alt="" onerror="this.src=\'' + NOPHOTO + '\'"><div class="tp-cell-info"><span class="tp-cell-name">' + p.name + '</span><span class="tp-cell-value">' + (p.nationality || '') + '</span></div></div><span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">' + (p.matches || 0) + '</span><span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">' + (p.goals || 0) + '</span><span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:var(--text)">' + (p.assists || 0) + '</span><span style="width:30px;text-align:center;font-size:12px;font-weight:600;color:#F59E0B">' + (p.yellowCards || 0) + '</span><span style="width:28px;text-align:center;font-size:12px;font-weight:600;color:#EF4444">' + (p.redCards || 0) + '</span></div>'
      }).join('')
      html2 += '</div>'
    }
    document.getElementById('team-players-section').innerHTML = html2
    document.querySelectorAll('#team-players-section .tp-row').forEach(function(row) {
      row.onclick = function() {
        var pid = row.dataset.playerId
        var player = team.players.find(function(p) { return p.id === pid })
        if (player) openPlayerDetail(player, team)
      }
    })
    document.querySelectorAll('#team-players-section .team-info-tab').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation()
        teamInfoTab = btn.dataset.tab
        renderTeamPlayers()
      }
    })
  }
  renderTeamPlayers()
}
function goBackFromTeam() {
  document.getElementById('view-team').classList.remove('active')
  const prevTab = state.currentTab
  const v = document.getElementById(`view-${prevTab}`)
  if (v) v.classList.add('active')
}

function getTeamLeagueName(teamId) {
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      if (l.teams.some(t => t.id === teamId)) return l.name
    }
  }
  return ''
}

function getClubFamily(teamId) {
  let baseName = ''
  let thisName = ''
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const t = l.teams.find(x => x.id === teamId)
      if (t) { thisName = t.name; baseName = getBaseTeamName(t.name); break }
    }
    if (baseName) break
  }
  if (!baseName) return []
  const family = []
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      for (const t of l.teams) {
        if (t.id === teamId) continue
        if (getBaseTeamName(t.name) === baseName) {
          family.push({ ...t, leagueId: l.id, leagueName: l.name })
        }
      }
    }
  }
  /* Also add FILIAL_MAP relations (e.g. Barça → Barça Atlètic) */
  const filialId = getFilialId(teamId)
  if (filialId && !family.some(f => f.id === filialId)) {
    for (const cid in window.DB) {
      const data = window.DB[cid]
      if (!data) continue
      for (const l of data.country.leagues || []) {
        const t = l.teams.find(x => x.id === filialId)
        if (t) { family.push({ ...t, leagueId: l.id, leagueName: l.name }); break }
      }
      if (family.some(f => f.id === filialId)) break
    }
  }
  /* Also check reverse: if this team IS a filial, find the parent */
  const parentId = getParentTeamId(teamId)
  if (parentId && !family.some(f => f.id === parentId)) {
    for (const cid in window.DB) {
      const data = window.DB[cid]
      if (!data) continue
      for (const l of data.country.leagues || []) {
        const t = l.teams.find(x => x.id === parentId)
        if (t) { family.push({ ...t, leagueId: l.id, leagueName: l.name }); break }
      }
      if (family.some(f => f.id === parentId)) break
    }
  }
  return family
}

/* ============ MENU DROPDOWN ============ */
function showSideMenu() {
  const dd = document.getElementById('header-dropdown')
  const overlay = document.getElementById('dropdown-overlay')
  const logo = document.getElementById('dd-team-logo')
  const name = document.getElementById('dd-team-name')
  if (logo) logo.src = state.teamLogo || ''
  if (name) name.textContent = state.team || 'Footsoccer'
  /* Club family links */
  const familyEl = document.getElementById('dropdown-family')
  const family = getClubFamily(state.teamId)
  if (familyEl) {
    if (family.length > 0) {
      familyEl.style.display = 'block'
      const list = document.getElementById('dropdown-family-list')
      if (list) {
        list.innerHTML = family.map(f => {
          const isFilial = getFilialId(state.teamId) === f.id
          const isParent = getBTeamParent(state.teamId) === f.id
          const badge = isFilial ? 'family-badge--filial' : 'family-badge--parent'
          const badgeText = isFilial ? '\u2B07 FILIAL' : '\u2B06 PRIMER EQUIPO'
          return `<div class="dropdown-item family-link" data-fid="${f.id}">
            <span class="family-dot"></span>
            <div class="family-info">
              <div class="family-top-row">
                <span class="family-item-name">${f.name}</span>
                ${isFilial || isParent ? `<span class="family-badge ${badge}">${badgeText}</span>` : ''}
              </div>
              <span class="family-league-name">${f.leagueName}</span>
            </div>
          </div>`
        }).join('')
        list.querySelectorAll('.family-link').forEach(el => {
          el.onclick = () => { hideSideMenu(); showTeamInfo(el.dataset.fid) }
        })
      } else {
        familyEl.style.display = 'none'
      }
    } else {
      familyEl.style.display = 'none'
    }
  }
  dd.classList.add('open')
  overlay.classList.add('open')
}

function hideSideMenu() {
  document.getElementById('header-dropdown').classList.remove('open')
  document.getElementById('dropdown-overlay').classList.remove('open')
}

/* ============ PRESSURE MODAL ============ */
function showPressureModal() {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.style.cssText = 'align-items:flex-start;padding:0'

  const current = state.tactic.gamePlan
  const plans = ['suave', 'pesado', 'extremo']
  const labels = { suave: 'Suave', pesado: 'Pesado', extremo: 'Extremo' }
  const icons = {
    suave: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4C6 6 3 13 3 17c0 4 7 1 11-2 4-3 6-10 6-10s-7 1-11 4z"/><path d="M11 4C9 7 7 11 7 14c0 2 2 3 4 2"/></svg>',
    pesado: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V6l7-4z"/></svg>',
    extremo: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></svg>',
  }
  const traits = {
    suave: [
      { text: 'Bajo cansancio', type: 'pro' },
      { text: 'Juego m\u00e1s t\u00e1ctico', type: 'pro' },
      { text: 'Poca ofensiva', type: 'con' },
      { text: 'Juego pasivo', type: 'con' },
    ],
    pesado: [
      { text: 'Juego balanceado', type: 'pro' },
      { text: 'Menos errores', type: 'pro' },
      { text: 'Cansancio normal', type: 'con' },
      { text: 'Juego predecible', type: 'con' },
    ],
    extremo: [
      { text: 'Mejor ofensiva', type: 'pro' },
      { text: 'Juego r\u00e1pido', type: 'pro' },
      { text: 'Cansancio extremo', type: 'con' },
      { text: 'Posibles lesiones', type: 'con' },
    ],
  }

  let html = '<div class="modal-content" style="width:100%;border-radius:0 0 16px 16px;padding:20px;display:flex;flex-direction:column;gap:16px;background:var(--bg-card);animation:slideDown 0.3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.15)">' +
    '<h3 style="text-align:center;font-size:16px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:0.5px">Tipo de presi\u00f3n</h3>' +
    '<div style="display:flex;gap:10px">'

  plans.forEach(function(p) {
    const isActive = current === p
    html += '<div class="pressure-card' + (isActive ? ' active' : '') + '" data-plan="' + p + '" style="flex:1;background:#fff;border-radius:12px;padding:12px 8px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;border:2px solid ' + (isActive ? 'var(--accent)' : 'rgba(0,0,0,0.06)') + ';box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:all 0.2s ease">' +
      '<span style="font-size:13px;font-weight:700;color:#1E293B">' + labels[p] + '</span>' +
      '<span style="display:flex;align-items:center;justify-content:center;height:36px">' + icons[p] + '</span>' +
      '<div style="width:100%;display:flex;flex-direction:column;gap:3px">'
    traits[p].forEach(function(t) {
      html += '<span style="font-size:10px;color:' + (t.type === 'pro' ? '#10B981' : '#EF4444') + ';font-weight:600">' + (t.type === 'pro' ? '\u2713' : '\u2717') + ' ' + t.text + '</span>'
    })
    html += '</div></div>'
  })

  html += '</div></div>'
  overlay.innerHTML = html
  document.body.appendChild(overlay)
  requestAnimationFrame(function() { overlay.classList.add('open') })

  overlay.querySelectorAll('.pressure-card').forEach(function(card) {
    card.addEventListener('click', function() {
      overlay.classList.remove('open')
      var plan = card.dataset.plan
      setTimeout(function() {
        document.body.removeChild(overlay)
        state.tactic.gamePlan = plan
        renderTactics(state.tactic)
      }, 250)
    })
  })

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.classList.remove('open')
      setTimeout(function() {
        document.body.removeChild(overlay)
      }, 250)
    }
  })
}

/* ============ CAPTAIN MODAL ============ */
function showCaptainModal() {
  var overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.style.cssText = 'align-items:flex-start;padding:0'

  var slots = state.tacticsSlots
  var players = slots.map(function(id) { return state.players.find(function(p) { return p.id === id }) }).filter(Boolean)
  var currentCaptainId = state.captainId || slots[0]

  var pastelColors = {
    portero: 'rgba(155,89,182,0.12)',
    defensa_central: 'rgba(231,76,60,0.12)',
    lateral_der: 'rgba(231,76,60,0.12)',
    lateral_izq: 'rgba(231,76,60,0.12)',
    carrilero_der: 'rgba(231,76,60,0.12)',
    carrilero_izq: 'rgba(231,76,60,0.12)',
    medio_def: 'rgba(243,156,18,0.12)',
    mediocentro: 'rgba(243,156,18,0.12)',
    medio_ofensivo: 'rgba(243,156,18,0.12)',
    medio_der: 'rgba(243,156,18,0.12)',
    medio_izq: 'rgba(243,156,18,0.12)',
    extremo_der: 'rgba(46,204,113,0.12)',
    extremo_izq: 'rgba(46,204,113,0.12)',
    delantero: 'rgba(46,204,113,0.12)',
  }

  var html = '<div class="modal-content" style="width:100%;border-radius:0 0 16px 16px;padding:20px;background:var(--bg-card);animation:slideDown 0.3s ease">' +
    '<h3 style="text-align:center;font-size:16px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">Capit\u00e1n del equipo</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">'

  players.forEach(function(p) {
    var posKey = SIGLA_TO_POS[p.position] || p.position
    var posAbbr = POS_ABBR[posKey] || p.position
    var bgColor = pastelColors[posKey] || 'rgba(0,0,0,0.03)'
    var isCaptain = p.id === currentCaptainId
    var avatarStyle = 'background-image:url(' + (p.avatar || NOPHOTO) + ');background-size:cover;background-position:center;background-color:var(--bg-card)'

    html += '<div class="cap-card" data-pid="' + p.id + '" style="background:' + bgColor + ';border-radius:10px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;border:2px solid ' + (isCaptain ? '#F59E0B' : 'transparent') + ';position:relative">'
    if (isCaptain) {
      html += '<span style="position:absolute;top:4px;right:4px;background:#F59E0B;color:#fff;font-size:9px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center">C</span>'
    }
    html += '<span style="font-size:10px;font-weight:700;color:#1E293B;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">' + p.name.split(' ').slice(-1)[0] + '</span>' +
      '<div style="width:44px;height:44px;border-radius:50%;' + avatarStyle + '"></div>' +
      '<div style="display:flex;align-items:center;gap:4px">' +
        '<span style="' + getPowerBadgeStyle(p.skill) + ';width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0">' + p.skill + '</span>' +
        '<span style="font-size:8px;font-weight:600;color:#6B7280">' + posAbbr + '</span>' +
      '</div></div>'
  })

  html += '</div></div>'
  overlay.innerHTML = html
  document.body.appendChild(overlay)
  requestAnimationFrame(function() { overlay.classList.add('open') })

  /* Click card → new captain */
  overlay.querySelectorAll('.cap-card').forEach(function(card) {
    card.addEventListener('click', function() {
      overlay.classList.remove('open')
      state.captainId = card.dataset.pid
      setTimeout(function() {
        document.body.removeChild(overlay)
        renderTactics(state.tactic)
      }, 250)
    })
  })

  /* Click outside → close */
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.classList.remove('open')
      setTimeout(function() {
        document.body.removeChild(overlay)
      }, 250)
    }
  })
}

/* ============ FORMATION MODAL ============ */
function renderMiniPitch(roles) {
  var dotColors = {
    gk: '#1E293B',
    def: '#E74C3C',
    mid: '#F39C12',
    fwd: '#8B5CF6',
  }
  var rowPositions = { gk: 85, def: 68, mid: 38, fwd: 15 }
  var rows = { gk: [], def: [], mid: [], fwd: [] }
  for (var r = 0; r < roles.length; r++) {
    var role = roles[r]
    if (role === 'portero') rows.gk.push(role)
    else if (['defensa_central','lateral_der','lateral_izq','carrilero_der','carrilero_izq'].indexOf(role) >= 0) rows.def.push(role)
    else if (['mediocentro','medio_def','medio_ofensivo','medio_der','medio_izq'].indexOf(role) >= 0) rows.mid.push(role)
    else rows.fwd.push(role)
  }
  var pitchHtml = '<div class="fm-pitch">'
  var cats = ['gk', 'def', 'mid', 'fwd']
  for (var c = 0; c < cats.length; c++) {
    var cat = cats[c]
    var players = rows[cat]
    var top = rowPositions[cat]
    for (var p = 0; p < players.length; p++) {
      var left = players.length === 1 ? 50 : (p + 1) / (players.length + 1) * 100
      pitchHtml += '<div class="fm-dot" style="left:' + left.toFixed(0) + '%;top:' + top + '%;background:' + dotColors[cat] + '"></div>'
    }
  }
  pitchHtml += '</div>'
  return pitchHtml
}

function showFormationModal() {
  var overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.style.cssText = 'align-items:flex-start;padding:0'

  var categories = {
    ofensivo: { label: 'Ofensivo', formations: ['3-4-3', '3-5-2'] },
    equilibrado: { label: 'Equilibrado', formations: ['4-3-3', '4-4-2', '4-1-4-1', '4-2-3-1'] },
    defensivo: { label: 'Defensivo', formations: ['3-4-2-1'] },
  }
  var current = state.tactic.formation

  var html = '<div class="modal-content" style="width:100%;border-radius:0 0 16px 16px;padding:20px;background:var(--bg-card);animation:slideDown 0.3s ease;max-height:85vh;overflow-y:auto">' +
    '<h3 style="text-align:center;font-size:16px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px">T\u00e1ctica</h3>'

  var catKeys = ['ofensivo', 'equilibrado', 'defensivo']
  for (var ci = 0; ci < catKeys.length; ci++) {
    var catKey = catKeys[ci]
    var cat = categories[catKey]
    var cols = 'repeat(3,1fr)'
    html += '<div style="margin-bottom:14px">' +
      '<div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;border-bottom:1px solid var(--border);padding-bottom:4px;margin-bottom:8px">' + cat.label + '</div>' +
      '<div style="display:grid;grid-template-columns:' + cols + ';gap:8px">'

    for (var fi = 0; fi < cat.formations.length; fi++) {
      var fKey = cat.formations[fi]
      var fData = FORMATIONS[fKey]
      if (!fData) continue
      var isActive = current === fKey
      html += '<div class="formation-card' + (isActive ? ' active' : '') + '" data-formation="' + fKey + '" style="cursor:pointer;border-radius:10px;padding:8px;background:#fff;border:2px solid ' + (isActive ? 'var(--accent)' : 'rgba(0,0,0,0.06)') + ';box-shadow:' + (isActive ? '0 4px 16px rgba(38,99,235,0.2)' : '0 1px 4px rgba(0,0,0,0.06)') + ';transition:all 0.2s ease">' +
        '<div style="text-align:center;font-size:11px;font-weight:700;color:#1E293B;margin-bottom:4px">' + fData.label + '</div>' +
        renderMiniPitch(fData.roles) +
      '</div>'
    }

    html += '</div></div>'
  }

  html += '</div>'
  overlay.innerHTML = html
  document.body.appendChild(overlay)
  requestAnimationFrame(function() { overlay.classList.add('open') })

  overlay.querySelectorAll('.formation-card').forEach(function(card) {
    card.addEventListener('click', function() {
      overlay.classList.remove('open')
      var formation = card.dataset.formation
      setTimeout(function() {
        document.body.removeChild(overlay)
        state.tactic.formation = formation
        autoAssignSquad()
        renderTactics(state.tactic)
      }, 250)
    })
  })

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.classList.remove('open')
      setTimeout(function() {
        document.body.removeChild(overlay)
      }, 250)
    }
  })
}

/* ============ INBOX ============ */
function addNotification(type, title, body) {
  if (!state.inbox) state.inbox = []
  state.inbox.unshift({
    id: Date.now() + Math.random(),
    type: type || 'general',
    title: title || '',
    body: body || '',
    matchday: state.currentMatchday || 0,
    read: false,
    createdAt: new Date().toISOString(),
  })
  updateInboxBadge()
}

function actualizarIndicadorTemporada() {
  var el = document.getElementById('season-display')
  if (el) el.textContent = 'T' + (state.seasonNumber || 1)
}

function updateInboxBadge() {
  const badge = document.getElementById('inbox-badge')
  if (!badge) return
  const unread = state.inbox ? state.inbox.filter(n => !n.read).length : 0
  badge.textContent = unread
  badge.style.display = unread > 0 ? 'flex' : 'none'
}

function renderInbox() {
  const container = document.getElementById('club-inbox-content')
  if (!container) return
  const senderLabels = {
    match: { label: 'Resultado', icon: '\u26BD' },
    injury: { label: 'Servicio M\u00e9dico', icon: '\uD83D\uDC79' },
    transfer: { label: 'Mercado', icon: '\uD83D\uDCB0' },
    general: { label: 'Notificaci\u00f3n', icon: '\uD83D\uDCCC' },
  }
  if (!state.inbox || state.inbox.length === 0) {
    container.innerHTML = '<div class="inbox-empty">\uD83D\uDCED No hay notificaciones</div>'
    return
  }
  var unreadCount = state.inbox.filter(function(n) { return !n.read }).length
  var headerHtml = '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border)">' +
    '<span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px">Notificaciones</span>' +
    (unreadCount > 0 ? '<span style="background:#EF4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">' + unreadCount + ' no le\u00eddas</span>' : '') +
  '</div>'
  let html = headerHtml + '<div class="inbox-list" id="inbox-list">'
  html += state.inbox.map(n => {
    const t = senderLabels[n.type] || senderLabels.general
    const date = new Date(n.createdAt)
    const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    const timeStr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    return '<div class="inbox-item' + (n.read ? '' : ' unread') + '" data-inbox-id="' + n.id + '">' +
      '<div class="inbox-avatar ' + n.type + '">' + t.icon + '</div>' +
      '<div class="inbox-body">' +
        '<div class="inbox-row1"><span class="inbox-sender">' + t.label + '</span><span class="inbox-date">' + dateStr + ' ' + timeStr + '</span></div>' +
        '<div class="inbox-subject">' + n.title + '</div>' +
        (n.body ? '<div class="inbox-preview">' + n.body + '</div>' : '') +
      '</div></div>'
  }).join('')
  html += '</div><div class="inbox-detail" id="inbox-detail" style="display:none"><div class="inbox-detail-header"><button class="inbox-detail-back" id="inbox-detail-back">\u2190 Volver</button></div><div class="inbox-detail-body" id="inbox-detail-body"></div></div>'
  container.innerHTML = html
  container.querySelectorAll('.inbox-item').forEach(function(el) {
    el.onclick = function() {
      const id = parseFloat(el.dataset.inboxId)
      const n = state.inbox.find(function(x) { return x.id === id })
      if (!n) return
      n.read = true
      updateInboxBadge()
      showInboxDetail(n)
    }
  })
  document.getElementById('inbox-detail-back') && (document.getElementById('inbox-detail-back').onclick = hideInboxDetail)
}

function showInboxDetail(n) {
  const list = document.getElementById('inbox-list')
  const detail = document.getElementById('inbox-detail')
  if (!list || !detail) return
  list.style.display = 'none'
  detail.style.display = 'flex'
  const senderLabels = {
    match: { label: 'Resultado', icon: '\u26BD' },
    injury: { label: 'Servicio M\u00e9dico', icon: '\uD83D\uDC79' },
    transfer: { label: 'Mercado', icon: '\uD83D\uDCB0' },
    general: { label: 'Notificaci\u00f3n', icon: '\uD83D\uDCCC' },
  }
  const t = senderLabels[n.type] || senderLabels.general
  const date = new Date(n.createdAt)
  const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
  const estado = n.read ? '\u2705 Le\u00eddo' : '\uD83D\uDCEB No le\u00eddo'
  document.getElementById('inbox-detail-body').innerHTML = '' +
    '<div class="inbox-detail-type"><div class="inbox-detail-type-icon ' + n.type + '">' + t.icon + '</div><span class="inbox-detail-type-label">' + t.label + '</span></div>' +
    '<div class="inbox-detail-title">' + n.title + '</div>' +
    '<div class="inbox-detail-meta">Jornada ' + n.matchday + ' \u00b7 ' + dateStr + ' \u00b7 ' + timeStr + ' \u00b7 ' + estado + '</div>' +
    '<div class="inbox-detail-text">' + (n.body || 'Sin contenido adicional') + '</div>'
}

function hideInboxDetail() {
  const list = document.getElementById('inbox-list')
  const detail = document.getElementById('inbox-detail')
  if (list) list.style.display = ''
  if (detail) detail.style.display = 'none'
}

/* ============ SIDE MENU EVENTS ============ */
try {
  const menuBtn = document.getElementById('btn-header-menu')
  if (menuBtn) {
    menuBtn.onclick = (e) => {
      e.stopPropagation()
      const dd = document.getElementById('header-dropdown')
      if (dd && dd.classList.contains('open')) {
        hideSideMenu()
      } else {
        showSideMenu()
      }
    }
  }

  const overlay = document.getElementById('dropdown-overlay')
  if (overlay) overlay.onclick = hideSideMenu

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.onclick = () => {
      hideSideMenu()
      const action = item.dataset.action
      if (action === 'quit') {
        saveGame()
        showMainMenu()
        initMenuParticles()
      } else if (action === 'save') {
        saveGame()
        addNotification('general', '\uD83D\uDCBE Partida guardada', 'Progreso guardado correctamente')
        updateInboxBadge()
      } else if (action === 'history') {
        alert('📊 Historial — Próximamente')
      } else if (action === 'settings') {
        showSettingsModal()
      }
    }
  })
} catch(e) { console.warn('[MENU] Error:', e) }

/* ============ SOUNDS ============ */
let audioCtx = null

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
}

function playBeep(freq, duration, type, volume) {
  try {
    ensureAudio()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain); gain.connect(audioCtx.destination)
    osc.type = type || 'sine'
    osc.frequency.value = freq || 440
    gain.gain.value = volume || 0.08
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.15))
    osc.start(); osc.stop(audioCtx.currentTime + (duration || 0.15))
  } catch (e) { /* silencio */ }
}

function playSound(name) {
  if (state.soundEnabled === false) return
  switch (name) {
    case 'click': playBeep(800, 0.05, 'sine', 0.04); break
    case 'whistle': playBeep(600, 0.3, 'square', 0.05); break
    case 'goal': playBeep(523, 0.1, 'square', 0.06); setTimeout(() => { playBeep(659, 0.1, 'square', 0.06); setTimeout(() => playBeep(784, 0.2, 'square', 0.06), 100) }, 100); break
    case 'card': playBeep(300, 0.15, 'sawtooth', 0.03); break
    case 'error': playBeep(200, 0.2, 'square', 0.04); break
  }
}

/* ============ SETTINGS ============ */
function showSettingsModal() {
  const modal = document.getElementById('settings-modal')
  if (!modal) return
  const toggle = document.getElementById('settings-sound-toggle')
  if (toggle) toggle.checked = state.soundEnabled !== false
  modal.classList.add('open')
}

/* ============ PARTICLES ============ */
function initMenuParticles() {
  const canvas = document.getElementById('menu-particles')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h, particles = []
  const COUNT = 30

  function resize() {
    const parent = canvas.parentElement
    w = canvas.width = parent.offsetWidth
    h = canvas.height = parent.offsetHeight
  }

  function createParticles() {
    particles = []
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.1,
      })
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(96, 165, 250, ${p.a})`
      ctx.fill()
      p.x += p.dx
      p.y += p.dy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0
    }
    requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()
  window.addEventListener('resize', () => { resize(); createParticles() })
}

/* ============ LOADING ============ */
function showLoading(text) {
  const overlay = document.getElementById('loading-overlay')
  if (!overlay) return
  document.querySelector('.loading-text').textContent = text || 'Cargando...'
  overlay.style.display = 'flex'
  overlay.style.opacity = '0'
  requestAnimationFrame(() => { overlay.style.opacity = '1' })
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay')
  if (!overlay) return
  overlay.style.opacity = '0'
  setTimeout(() => { overlay.style.display = 'none' }, 250)
}

/* ============ OFFER EVALUATION ============ */
function evaluarOferta(player, offeredPrice) {
  const value = player.value
  const need = randInt(80, 120)
  if (offeredPrice >= Math.round(value * need / 100 * 1.15)) {
    return { type: 'accepted', price: offeredPrice, msg: '\u00a1El club acepta la oferta!' }
  }
  if (offeredPrice >= Math.round(value * 0.75)) {
    const counter = Math.round(value * randInt(95, 130) / 100)
    return { type: 'counter', price: counter, msg: `El club pide ${formatMoney(counter)}` }
  }
  const minPrice = Math.round(value * 0.9)
  return { type: 'rejected', minPrice: minPrice, msg: `El club rechaza la oferta (pide al menos ${formatMoney(minPrice)})` }
}

function evaluarCesion(player) {
  if (Math.random() < 0.4) return { type: 'accepted', msg: 'El club acepta la cesi\u00f3n' }
  return { type: 'rejected', msg: 'El club rechaza la cesi\u00f3n' }
}

/* ============ PLAYER DETAIL ============ */
function openPlayerDetail(player, teamObj) {
  if (!player) return

  const posKey = SIGLA_TO_POS[player.position] || player.position

  document.getElementById('pd-name').textContent = player.name
  const ratingEl = document.getElementById('pd-rating')
  ratingEl.textContent = player.skill
  ratingEl.style.cssText = getPowerBadgeStyle(player.skill)

  const photo = document.getElementById('pd-photo')
  if (player.avatar) {
    photo.innerHTML = `<img src="${player.avatar}" onerror="this.src='${NOPHOTO}'">`
  } else {
    photo.innerHTML = `<div class="pd-photo-placeholder">${getInitials(player.name)}</div>`
  }

  const team = teamObj || (player.teamId ? getTeamObj(player.teamId) : null) || { name: state.team, logo: state.teamLogo, teamId: state.teamId }
  var teamLogo = getTeamLogo(team.teamId) || (team.logo) || (player.teamId ? getTeamLogo(player.teamId) : '') || NOPHOTO
  document.getElementById('pd-team-logo').src = teamLogo
  document.getElementById('pd-team').textContent = team.name || '\u2014'
  const posLabel = POSITIONS[posKey] ? POSITIONS[posKey].label : player.position
  document.getElementById('pd-position').textContent = posLabel + ' (' + (POS_ABBR[posKey] || player.position) + ')'
  document.getElementById('pd-flag').textContent = (player.nationality || '').split(' ')[0] || ''
  const natName = (player.nationality || '').replace(/^[^\s]+\s/, '') || '\u2014'
  document.getElementById('pd-nationality').textContent = natName
  document.getElementById('pd-foot').textContent = player.foot === 'IZQ' ? 'Izq' : 'Der'
  document.getElementById('pd-height').textContent = player.height ? (player.height / 100).toFixed(2) + 'm' : '\u2014'
  document.getElementById('pd-age').textContent = player.age || '\u2014'
  document.getElementById('pd-value').textContent = '\u20AC ' + formatShort(player.value || calcValue(player.skill))

  /* Adaptability: main position 99%, other positions from data */
  const mainAbbr = POS_ABBR[posKey] || player.position
  const otherPositions = player.otherPositions || []
  const PITCH_POS = {
    POR: [85, 50],
    LI:  [68, 15], DFC: [68, 50], LD:  [68, 85],
    CAI: [52, 15], MCD: [52, 50], CAD: [52, 85],
    MI:  [38, 20], MC:  [38, 50], MD:  [38, 80],
    EI:  [20, 15], DC:  [15, 50], ED:  [20, 85],
    MCO: [30, 50],
    portero: [85, 50], lateral_izq: [68, 15], defensa_central: [68, 50], lateral_der: [68, 85],
    carrilero_izq: [52, 15], medio_def: [52, 50], carrilero_der: [52, 85],
    medio_izq: [38, 20], mediocentro: [38, 50], medio_der: [38, 80],
    extremo_izq: [20, 15], delantero: [15, 50], extremo_der: [20, 85],
    medio_ofensivo: [30, 50],
    cierre: [68, 50], ala: [38, 50], pivot: [15, 50],
  }
  const MAIN_PCT = player.mainPct !== undefined ? player.mainPct : 99
  const mainExp = player.positionExperience ? (player.positionExperience[posKey] || 0) : 0
  const mainEffectivePct = Math.min(100, Math.max(MAIN_PCT, mainExp * 0.5))
  const mainColor = (POSITIONS[posKey] || {}).color || '#2663EB'
  const mainMastered = mainEffectivePct >= 100
  const mainOpacity = mainMastered ? 1.0 : (0.35 + 0.65 * mainEffectivePct / 100)
  let adaptHtml = `<div class="pd-pos-label">Posici\u00f3n principal</div>
    <div class="pd-pos-row main" style="color:${mainColor};opacity:${mainOpacity.toFixed(2)};font-weight:${mainMastered ? '600' : '400'}">
      <span>${posLabel} (${mainAbbr})${mainExp > 0 ? ' <span style="font-size:9px;color:var(--text-muted);font-weight:400">' + mainExp + ' pj</span>' : ''}</span>
      <span>${mainEffectivePct}%</span>
    </div>`
  if (otherPositions.length > 0) {
    adaptHtml += `<div class="pd-pos-label">Otras posiciones</div>`
    for (const alt of otherPositions) {
      const altPos = alt.pos || alt
      const altKey = SIGLA_TO_POS[altPos] || altPos
      const altPct = alt.pct !== undefined ? alt.pct : 1
      const exp = player.positionExperience ? (player.positionExperience[altKey] || 0) : 0
      const expPct = Math.min(100, exp * 0.5)
      const effectivePct = Math.min(100, Math.max(altPct, expPct))
      const altLabel = POSITIONS[altKey] ? POSITIONS[altKey].label : altPos
      const altAbbr = POS_ABBR[altKey] || altPos
      const altColor = (POSITIONS[altKey] || {}).color || '#2663EB'
      const isMastered = effectivePct >= 100
      const opacity = isMastered ? 1.0 : (0.35 + 0.65 * effectivePct / 100)
      const fontWeight = isMastered ? '600' : '400'
      adaptHtml += `<div class="pd-pos-row" style="color:${altColor};opacity:${opacity.toFixed(2)};font-weight:${fontWeight}">
        <span>${altLabel} (${altAbbr})${exp > 0 ? ' <span style="font-size:9px;color:var(--text-muted);font-weight:400">' + exp + ' pj</span>' : ''}</span>
        <span>${effectivePct}%</span>
      </div>`
    }
  }
  document.getElementById('pd-adapt-list').innerHTML = adaptHtml

  /* Pitch badges */
  const pitch = document.getElementById('pd-pitch')
  let pitchHtml = ''
  const mainCoords = PITCH_POS[player.position] || [50, 50]
  pitchHtml += `<span class="pd-pitch-badge main" style="background:${mainColor};top:${mainCoords[0]}%;left:${mainCoords[1]}%">${mainAbbr}</span>`
  for (const alt of otherPositions) {
    const altPos = alt.pos || alt
    const altKey = SIGLA_TO_POS[altPos] || altPos
    const altPct = alt.pct !== undefined ? alt.pct : 1
    const altExp = player.positionExperience ? (player.positionExperience[altKey] || 0) : 0
    const altEffectivePct = Math.min(100, Math.max(altPct, altExp * 0.5))
    const altCoords = PITCH_POS[altPos] || [50, 50]
    const altAbbr = POS_ABBR[altKey] || altPos
    const altBadgeColor = (POSITIONS[altKey] || {}).color || '#2663EB'
    const altBadgeOpacity = altEffectivePct >= 100 ? 1.0 : (0.35 + 0.65 * altEffectivePct / 100)
    pitchHtml += `<span class="pd-pitch-badge alt" style="background:${altBadgeColor};opacity:${altBadgeOpacity.toFixed(2)};top:${altCoords[0]}%;left:${altCoords[1]}%">${altAbbr}</span>`
  }
  pitch.innerHTML = pitchHtml

  /* === RENDIMIENTO TAB === */
  const rendStats = document.getElementById('pd-rend-stats')
  const pos = POSITIONS[posKey]
  const energyColor = player.energy >= 70 ? '#10B981' : (player.energy >= 40 ? '#F59E0B' : '#EF4444')
  var avgRating = 0
  var ratedMatches = (player.matchHistory || []).filter(function(m) { return m.rating })
  if (ratedMatches.length > 0) {
    avgRating = ratedMatches.reduce(function(sum, m) { return sum + m.rating }, 0) / ratedMatches.length
  }
  var statsHtml = '<div class="modal-stats-row" style="padding:8px 0;gap:4px"><div class="modal-stat" style="flex:1;padding:8px"><span class="modal-stat-label">ENE</span><span class="modal-stat-value" style="font-size:20px;color:' + energyColor + '">' + (player.energy || 0) + '%</span><div class="modal-stat-bar"><div class="modal-stat-fill" style="width:' + (player.energy || 0) + '%;background:' + energyColor + '"></div></div></div></div>'
  /* Per-team stats */
  var teamStatsObj = player.teamStats || {}
  var teamIds = Object.keys(teamStatsObj)
  if (teamIds.length > 0) {
    for (var ti = 0; ti < teamIds.length; ti++) {
      var tid = teamIds[ti]
      var ts = teamStatsObj[tid]
      var tName = getTeamName(tid) || 'Equipo'
      statsHtml += '<div class="pd-team-stats"><div class="pd-team-stats-name">' + tName + '</div><div class="modal-season-stats" style="padding:0 0 6px">' +
        '<div class="modal-sstat"><span class="modal-sstat-icon">📊</span><span class="modal-sstat-val">' + (ts.matches || 0) + '</span><span class="modal-sstat-lbl">PJ</span></div>' +
        '<div class="modal-sstat"><span class="modal-sstat-icon">⚽</span><span class="modal-sstat-val">' + (ts.goals || 0) + '</span><span class="modal-sstat-lbl">Goles</span></div>' +
        '<div class="modal-sstat"><span class="modal-sstat-icon">👟</span><span class="modal-sstat-val">' + (ts.assists || 0) + '</span><span class="modal-sstat-lbl">Asist.</span></div>' +
        '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#F59E0B">🟨</span><span class="modal-sstat-val">' + (ts.yellowCards || 0) + '</span><span class="modal-sstat-lbl">Amar.</span></div>' +
        '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#EF4444">🟥</span><span class="modal-sstat-val">' + (ts.redCards || 0) + '</span><span class="modal-sstat-lbl">Roja</span></div>' +
        '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#F59E0B">⭐</span><span class="modal-sstat-val">' + (avgRating ? avgRating.toFixed(1) : '-') + '</span><span class="modal-sstat-lbl">Media</span></div>' +
        '</div></div>'
    }
  } else {
    statsHtml += '<div class="modal-season-stats" style="padding:0 0 6px">' +
      '<div class="modal-sstat"><span class="modal-sstat-icon">📊</span><span class="modal-sstat-val">' + (player.matches || 0) + '</span><span class="modal-sstat-lbl">PJ</span></div>' +
      '<div class="modal-sstat"><span class="modal-sstat-icon">⚽</span><span class="modal-sstat-val">' + (player.goals || 0) + '</span><span class="modal-sstat-lbl">Goles</span></div>' +
      '<div class="modal-sstat"><span class="modal-sstat-icon">👟</span><span class="modal-sstat-val">' + (player.assists || 0) + '</span><span class="modal-sstat-lbl">Asist.</span></div>' +
      '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#F59E0B">🟨</span><span class="modal-sstat-val">' + (player.yellowCards || 0) + '</span><span class="modal-sstat-lbl">Amar.</span></div>' +
      '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#EF4444">🟥</span><span class="modal-sstat-val">' + (player.redCards || 0) + '</span><span class="modal-sstat-lbl">Roja</span></div>' +
      '<div class="modal-sstat"><span class="modal-sstat-icon" style="color:#F59E0B">⭐</span><span class="modal-sstat-val">' + (avgRating ? avgRating.toFixed(1) : '-') + '</span><span class="modal-sstat-lbl">Media</span></div>' +
      '</div>'
  }
  rendStats.innerHTML = statsHtml
  document.getElementById('pd-rend-history').innerHTML = ''

  /* === MERCADO TAB === */
  const actions = document.getElementById('pd-market-actions')
  actions.innerHTML = ''
  const formatPriceInput = (el) => {
    if (el) el.addEventListener('input', function() {
      const n = this.value.replace(/[^\d]/g, '')
      this.value = n ? parseInt(n, 10).toLocaleString('es-ES') : ''
    })
  }
  const isOwn = state.players.some(p => p.id === player.id)
  const isFilialPlayer = isPlayerFromMyFilial(player)
  const isParentPlayer = isPlayerFromMyParent(player)
  if (isOwn) {
    if (player.transferListed) {
      actions.innerHTML += `
        <div class="market-input-group">
          <span class="market-input-label">Precio de venta actual</span>
          <div style="text-align:center;font-weight:700;font-size:16px;color:var(--text)">${formatMoney(player.transferPrice)}</div>
        </div>
        <button class="btn-secondary" id="pd-retirar-lt">RETIRAR DE TRANSFERIBLES</button>`
    } else {
      actions.innerHTML += `
        <div class="market-input-group" style="margin-bottom:10px">
          <label class="market-input-label">Precio para lista de transferibles</label>
          <input class="market-price-input" id="pd-lt-price" type="text" inputmode="numeric" value="${player.value.toLocaleString('es-ES')}" min="1">
        </div>
        <button class="btn-primary" id="pd-listar-lt" style="background:#EF4444">LISTA TRANSFERIBLES</button>`
    }
    if (player.loanListed) {
      actions.innerHTML += `<button class="btn-secondary" id="pd-retirar-lc" style="margin-top:4px">RETIRAR CEDIBLES</button>`
    } else {
      actions.innerHTML += `<button class="btn-primary" id="pd-listar-lc" style="background:var(--accent);margin-top:4px">LISTA CEDIBLES</button>`
    }
    /* Filial button */
    var filialId = getFilialId(state.teamId)
    if (filialId) {
      actions.innerHTML += `<button class="btn-secondary" id="pd-bajar-filial" style="background:#555;color:#fff;margin-top:8px">⬇ BAJAR AL FILIAL</button>`
    }
    /* Bind events */
    formatPriceInput(document.getElementById('pd-lt-price'))
    document.getElementById('pd-retirar-lt')?.addEventListener('click', () => { player.transferListed = false; player.transferPrice = 0; document.getElementById('player-detail-modal').classList.remove('open'); renderMarketContent(); renderSquad(state.players) })
    document.getElementById('pd-listar-lt')?.addEventListener('click', () => {
      const price = parseInt(document.getElementById('pd-lt-price').value.replace(/\./g, ''))
      if (!price || price < 1) return
      player.transferListed = true; player.transferPrice = price; document.getElementById('player-detail-modal').classList.remove('open'); renderMarketContent(); renderSquad(state.players)
    })
    document.getElementById('pd-retirar-lc')?.addEventListener('click', () => { player.loanListed = false; document.getElementById('player-detail-modal').classList.remove('open'); renderSquad(state.players) })
    document.getElementById('pd-listar-lc')?.addEventListener('click', () => { player.loanListed = true; document.getElementById('player-detail-modal').classList.remove('open'); renderSquad(state.players) })
    document.getElementById('pd-bajar-filial')?.addEventListener('click', () => {
      if (state.filialSquad.length >= MAX_SQUAD) return
      const idx = state.players.indexOf(player)
      if (idx < 0) return
      var demotedPlayer = { ...player, id: 'filial-down-' + Date.now(), energy: 100, goals: 0, assists: 0, matches: 0, teamStats: player.teamStats || {} }
      state.players.splice(idx, 1)
      state.filialSquad.push(demotedPlayer)
      addNotification('transfer', '\u2B07 ' + player.name + ' baja al filial', 'Traspasado a ' + getTeamName(filialId))
      document.getElementById('player-detail-modal').classList.remove('open')
      renderSquad(state.players)
    })
  } else if (isFilialPlayer) {
    var filialTeamName = getTeamName(getFilialId(state.teamId))
    actions.innerHTML = '<div style="text-align:center;padding:10px;background:rgba(16,185,129,0.08);border-radius:8px;font-size:13px;color:#10B981;margin-bottom:10px">Jugador del filial de ' + filialTeamName + '</div>' +
      '<button class="btn-primary" id="pd-subir-filial" style="background:#10B981">\u2B06 SUBIR AL PRIMER EQUIPO</button>'
    document.getElementById('pd-subir-filial')?.addEventListener('click', function() {
      if (state.players.length >= MAX_SQUAD) { alert('Plantilla completa (' + MAX_SQUAD + ' jugadores)'); return }
      var idx = state.filialSquad.indexOf(player)
      if (idx < 0) return
      state.filialSquad.splice(idx, 1)
      state.players.push({ ...player, id: 'promoted-' + Date.now(), value: calcValue(player.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, contractUntil: '30/06/' + (2027 + state.seasonNumber), onLoan: false, loanFrom: null, loanUntil: null, teamStats: player.teamStats || {} })
      addNotification('transfer', '\u2B06 ' + player.name + ' sube al primer equipo', 'Promocionado desde ' + filialTeamName)
      document.getElementById('player-detail-modal').classList.remove('open')
      renderSquad(state.players)
    })
  } else if (isParentPlayer) {
    actions.innerHTML = '<div style="text-align:center;padding:10px;background:rgba(0,0,0,0.04);border-radius:8px;font-size:13px;color:var(--text-muted)">Jugador del primer equipo — No disponible</div>'
  } else {
    /* CPU player — negotiation system */
    let acceptedPrice = 0
    const renderMercadoCPU = (screen) => {
      const valueStr = formatMoney(player.value)
      let h = `<div style="text-align:center;font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:8px">Valor de mercado: ${valueStr}</div>`
      if (screen === 'initial') {
        h += `<div class="market-input-group" style="margin-bottom:8px">
          <label class="market-input-label">Tu oferta</label>
          <input class="market-price-input" id="pd-offer-price" type="text" inputmode="numeric" value="${player.value.toLocaleString('es-ES')}">
        </div>
        <button class="btn-primary" id="pd-enviar-oferta" style="background:#10B981">ENVIAR OFERTA</button>
        <button class="btn-primary" id="pd-pedir-cedido" style="margin-top:6px">PEDIR CEDIDO</button>
        <div id="pd-oferta-resultado" style="margin-top:8px"></div>`
      } else if (screen === 'accepted') {
        h += `<div style="text-align:center;padding:10px;background:rgba(16,185,129,0.1);border-radius:8px;font-size:14px;font-weight:700;color:#10B981;margin-bottom:8px">\u00a1Oferta aceptada! Precio final: ${formatMoney(acceptedPrice)}</div>
          <button class="btn-primary" id="pd-comprar-tras-oferta" style="background:#10B981">COMPRAR (${formatMoney(acceptedPrice)})</button>`
      }
      actions.innerHTML = h
      if (screen === 'initial') {
        formatPriceInput(document.getElementById('pd-offer-price'))
        document.getElementById('pd-enviar-oferta')?.addEventListener('click', () => {
          if (state.boughtPlayerIds.indexOf(player.id) >= 0) { alert('Este jugador ya ha sido fichado'); document.getElementById('player-detail-modal').classList.remove('open'); return }
          const offer = parseInt(document.getElementById('pd-offer-price').value.replace(/\./g, ''))
          if (!offer || offer < 1) return
          const result = evaluarOferta(player, offer)
          if (result.type === 'accepted') {
            if (state.finances.balance < result.price) { alert('No tienes fondos suficientes'); return }
            var gi = state.globalPlayers.findIndex(function(p) { return p.id === player.id })
            if (gi >= 0) state.globalPlayers.splice(gi, 1)
            var team = getTeamObj(player.teamId)
            if (team) {
              var ti = team.players.findIndex(function(p) { return p.id === player.id })
              if (ti >= 0) team.players.splice(ti, 1)
            }
            var newP = { ...player, id: 'user-' + Date.now(), value: calcValue(player.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, contractUntil: '30/06/' + (2027 + state.seasonNumber), onLoan: false, loanFrom: null, loanUntil: null }
            state.players.push(newP)
            state.boughtPlayerIds.push(player.id)
            state.finances.balance -= result.price
            state.finances.history.push({ reason: 'Compra: ' + player.name, amount: -result.price })
            addNotification('transfer', 'Fichaje completado: ' + player.name, formatMoney(result.price) + ' \u00b7 ' + player.nationality)
            document.getElementById('player-detail-modal').classList.remove('open')
            renderMarketContent()
            return
          } else if (result.type === 'counter') {
            const resEl = document.getElementById('pd-oferta-resultado')
            resEl.innerHTML = `<div style="text-align:center;padding:8px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:13px;font-weight:600;color:#F59E0B">${result.msg}</div>
              <button class="btn-primary" id="pd-aceptar-contra" style="background:#10B981;margin-top:6px">ACEPTAR CONTRAOFERTA (${formatMoney(result.price)})</button>
              <button class="btn-secondary" id="pd-rechazar-contra" style="background:#EF4444;color:#fff;border-color:#EF4444;margin-top:4px">RECHAZAR</button>`
            document.getElementById('pd-aceptar-contra')?.addEventListener('click', () => {
              if (state.boughtPlayerIds.indexOf(player.id) >= 0) { alert('Este jugador ya ha sido fichado'); document.getElementById('player-detail-modal').classList.remove('open'); return }
              if (state.players.length >= MAX_SQUAD) { alert('Plantilla completa (' + MAX_SQUAD + ' jugadores)'); return }
              if (state.finances.balance < result.price) { alert('Fondos insuficientes. Necesitas ' + formatMoney(result.price)); return }
              /* Remove from global pool */
              var gi = state.globalPlayers.findIndex(function(p) { return p.id === player.id })
              if (gi >= 0) state.globalPlayers.splice(gi, 1)
              /* Remove from source team if found */
              var team = getTeamObj(player.teamId)
              if (team) {
                var ti = team.players.findIndex(function(p) { return p.id === player.id })
                if (ti >= 0) team.players.splice(ti, 1)
              }
              /* Add to user's team */
              var newP = { ...player, id: 'user-' + Date.now(), value: calcValue(player.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, contractUntil: '30/06/' + (2027 + state.seasonNumber), onLoan: false, loanFrom: null, loanUntil: null }
              state.players.push(newP)
              state.boughtPlayerIds.push(player.id)
              state.finances.balance -= result.price
              state.finances.history.push({ reason: 'Compra: ' + player.name, amount: -result.price })
              addNotification('transfer', 'Fichaje completado: ' + player.name, formatMoney(result.price) + ' \u00b7 ' + player.nationality)
              document.getElementById('player-detail-modal').classList.remove('open')
              renderMarketContent()
            })
            document.getElementById('pd-rechazar-contra')?.addEventListener('click', () => renderMercadoCPU('initial'))
          } else {
            const resEl = document.getElementById('pd-oferta-resultado')
            resEl.innerHTML = `<div style="text-align:center;padding:8px;background:rgba(239,68,68,0.1);border-radius:8px;font-size:13px;font-weight:600;color:#EF4444">${result.msg}</div>
              <button class="btn-secondary" id="pd-volver-intentar" style="margin-top:6px">VOLVER A INTENTAR</button>`
            document.getElementById('pd-volver-intentar')?.addEventListener('click', () => renderMercadoCPU('initial'))
          }
        })
        document.getElementById('pd-pedir-cedido')?.addEventListener('click', () => {
          const result = evaluarCesion(player)
          if (result.type === 'accepted') {
            if (state.players.length >= MAX_SQUAD) { alert('Plantilla completa'); return }
            const newPlayer = { ...player, id: `loan-${Date.now()}`, energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: true, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']) }
            state.players.push(newPlayer)
            addNotification('transfer', `\uD83D\uDCC4 Cesion: ${player.name}`, `Acordada con ${team.name || ''}`)
            document.getElementById('player-detail-modal').classList.remove('open')
            renderSquad(state.players)
          } else {
            const resEl = document.getElementById('pd-oferta-resultado')
            resEl.innerHTML = `<div style="text-align:center;padding:8px;background:rgba(239,68,68,0.1);border-radius:8px;font-size:13px;font-weight:600;color:#EF4444">${result.msg}</div>`
          }
        })
      } else if (screen === 'accepted') {
        document.getElementById('pd-comprar-tras-oferta')?.addEventListener('click', () => {
          if (state.finances.balance < acceptedPrice) { alert(`No tienes fondos suficientes. Necesitas ${formatMoney(acceptedPrice)}`); return }
          const team = getTeamObj(player.teamId)
          if (!team) return
          const teamPlayer = team.players.find(p => p.id === player.id)
          if (teamPlayer) buyPlayer(teamPlayer, team, acceptedPrice)
          document.getElementById('player-detail-modal').classList.remove('open')
        })
      }
    }
    renderMercadoCPU('initial')
  }

  /* Tab switching */
  const showTab = (tab) => {
    document.querySelectorAll('.pd-tab').forEach(b => b.classList.toggle('active', b.dataset.pdTab === tab))
    document.querySelectorAll('.pd-tab-content').forEach(c => c.classList.add('hidden'))
    const content = document.getElementById('pd-' + tab + '-content')
    if (content) content.classList.remove('hidden')
  }
  document.querySelectorAll('.pd-tab').forEach(btn => {
    btn.onclick = () => showTab(btn.dataset.pdTab)
  })
  /* Default: info tab */
  showTab('info')

  document.getElementById('player-detail-modal').classList.add('open')
}

/* ============ INIT ============ */
try {
  const el = id => document.getElementById(id)
  el('btn-new-game') && (el('btn-new-game').onclick = showNewGameScreen)
  el('btn-load-game') && (el('btn-load-game').onclick = showLoadMenu)
  el('btn-load-back') && (el('btn-load-back').onclick = showMainMenu)
  el('btn-ng-back') && (el('btn-ng-back').onclick = () => {
    const teams = el('ng-step-teams')
    if (teams && teams.classList.contains('ng-hidden') === false) {
      const countries = el('ng-step-countries')
      teams.classList.add('ng-hidden')
      countries.classList.remove('ng-hidden')
      document.querySelectorAll('.ng-step').forEach((s, i) => {
        s.classList.toggle('done', false)
        s.classList.toggle('active', i === 0)
      })
    } else {
      showMainMenu()
    }
  })
  el('btn-ng-back-action') && (el('btn-ng-back-action').onclick = () => { const b = el('btn-ng-back'); if (b) b.click() })
  el('btn-ng-continue') && (el('btn-ng-continue').onclick = () => {
    const teams = el('ng-step-teams')
    if (teams && teams.classList.contains('ng-hidden') === false) {
      const coachInput = el('ng-coach-input')
      if (!coachInput || !coachInput.value.trim()) {
        if (coachInput) { coachInput.focus(); coachInput.style.borderColor = '#EF4444' }
        return
      }
      coachInput.style.borderColor = ''
      startNewGame()
    } else if (selectedCountry) {
      showTeamSelectionStep()
    }
  })
  const coachInput = el('ng-coach-input')
  if (coachInput) coachInput.oninput = function() { this.style.borderColor = '' }
  el('btn-tactica') && (el('btn-tactica').onclick = abrirTacticasModal)
  el('settings-close-btn') && (el('settings-close-btn').onclick = () => { const m = el('settings-modal'); if (m) m.classList.remove('open') })
  el('settings-modal') && (el('settings-modal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open') })
  el('settings-sound-toggle') && (el('settings-sound-toggle').onchange = (e) => {
    state.soundEnabled = e.target.checked
    if (state.soundEnabled) playSound('click')
  })
  el('pd-close') && (el('pd-close').onclick = () => { const m = el('player-detail-modal'); if (m) m.classList.remove('open') })
  el('player-detail-modal') && (el('player-detail-modal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open') })
} catch(e) { console.warn('[INIT] Error:', e) }

initSaves().then(showMainMenu)
