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
  '4-3-3': { label: '4-3-3', roles: ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_der', 'mediocentro', 'medio_izq', 'extremo_der', 'delantero', 'extremo_izq'], multiplier: 1.0 },
  '4-4-2': { label: '4-4-2', roles: ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_der', 'mediocentro', 'mediocentro', 'medio_izq', 'delantero', 'delantero'], multiplier: 0.95 },
  '4-2-3-1': { label: '4-2-3-1', roles: ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_def', 'medio_def', 'extremo_der', 'medio_ofensivo', 'extremo_izq', 'delantero'], multiplier: 1.05 },
  '3-5-2': { label: '3-5-2', roles: ['portero', 'defensa_central', 'defensa_central', 'defensa_central', 'carrilero_der', 'medio_der', 'mediocentro', 'medio_ofensivo', 'medio_izq', 'delantero', 'delantero'], multiplier: 0.9 },
  '5-3-2': { label: '5-3-2', roles: ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_der', 'mediocentro', 'medio_izq', 'delantero', 'delantero'], multiplier: 0.85 },
  '4-1-4-1': { label: '4-1-4-1', roles: ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_def', 'extremo_der', 'mediocentro', 'medio_ofensivo', 'extremo_izq', 'delantero'], multiplier: 0.95 },
}

const POS_ABBR = { portero: 'POR', cierre: 'DFC', ala: 'MC', pivot: 'DC', lateral_der: 'LD', lateral_izq: 'LI', carrilero_der: 'CAD', carrilero_izq: 'CAI', defensa_central: 'DFC', medio_def: 'MCD', mediocentro: 'MC', medio_ofensivo: 'MCO', medio_der: 'MD', medio_izq: 'MI', extremo_der: 'ED', extremo_izq: 'EI', delantero: 'DC' }

const SIGLA_TO_POS = Object.fromEntries(Object.entries(POS_ABBR).map(([k, v]) => [v, k]))

const GAME_PLANS = {
  defensivo:  { label: 'Park the Bus',       desc: 'Equipo replegado, defiende cerca del área. Ahorra energía pero cede el control del partido.', attack: 0.6, defense: 1.4, drain: 1, events: 0.65 },
  tikitaka:   { label: 'Tiki-Taka',           desc: 'Posesión y pases cortos. Control del partido, desgaste moderado.', attack: 1.1, defense: 0.9, drain: 4, events: 1.15 },
  contragolpe:{ label: 'Contragolpe',         desc: 'Salidas rápidas en transición. Ideal con extremos veloces. Poco desgaste.', attack: 1.3, defense: 1.0, drain: 2, events: 0.75 },
  presionAlta:{ label: 'Presión Alta',        desc: 'Presión en campo rival para recuperar rápido. Mucho desgaste físico.', attack: 1.4, defense: 1.2, drain: 5, events: 1.20 },
  juegoDirecto:{ label: 'Juego Directo',      desc: 'Balones largos al delantero. Ataques verticales y rápidos.', attack: 1.2, defense: 0.7, drain: 3, events: 0.90 },
}

const MAX_SQUAD = 28
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
}

function getFilialId(teamId) { return FILIAL_MAP[teamId] || null }
function getParentTeamId(filialId) { return Object.keys(FILIAL_MAP).find(k => FILIAL_MAP[k] === filialId) || null }

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

function calcWage(skill) {
  return skill * 50 + 500
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
        wage: calcWage(skill),
        avatar: NOPHOTO,
        enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']),
      })
    }
  }
  return players
}

const COUNTRIES = [
  { id: 'poland', name: 'Polonia', flag: '🇵🇱' },
  { id: 'spain', name: 'España', flag: '🇪🇸' },
  { id: 'portugal', name: 'Portugal', flag: '🇵🇹' },
  { id: 'italy', name: 'Italia', flag: '🇮🇹' },
  { id: 'brazil', name: 'Brasil', flag: '🇧🇷' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷' },
]

window.DB = window.DB || {}

function loadCountryData(countryId, callback) {
  if (window.DB[countryId]) { callback(window.DB[countryId]); return }
  const script = document.createElement('script')
  script.src = `js/data/${countryId}.js`
  script.onload = () => callback(window.DB[countryId])
  script.onerror = () => { console.error('Failed to load data for', countryId); callback(null) }
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

class MatchEngine {
  constructor(homePlayers, tactic, awaySkill, homeName, awayName, isHome) {
    this.awaySkill = awaySkill
    this.homeScore = 0
    this.awayScore = 0
    this.gameSeconds = 0
    this.half = 1
    this.finished = false
    this.paused = false
    this.events = []
    this._interval = null
    this._goalPauseTimer = null
    this.onEvent = null
    this.onClockUpdate = null
    this.onHalfTime = null
    this.onFinish = null
    this.tacticMult = calcTacticMultiplier(tactic.formation, tactic.gamePlan)
    this.gamePlan = GAME_PLANS[tactic.gamePlan] || GAME_PLANS.juegoCuatro
    this.homeName = homeName || 'Tu Equipo'
    this.awayName = awayName || 'Rival'
    this.homeFactor = isHome !== false ? 1.05 : 1.0
  }

  iniciarCronometro() {
    if (this._interval) return
    this.paused = false
    this._tickReel()
    this._interval = setInterval(() => this._tickReel(), 1000)
  }

  _tickReel() {
    if (this.finished) return
    for (let s = 0; s < 15; s++) {
      if (this.paused || this.finished) break
      this._tickSecond()
    }
    this._updateClock()
  }

  _tickSecond() {
    this.gameSeconds++
    const MAX_SEC = 2700

    if (this.half === 1 && this.gameSeconds >= MAX_SEC) {
      this.gameSeconds = MAX_SEC
      this._halfTime()
      return
    }
    if (this.half === 2 && this.gameSeconds >= MAX_SEC) {
      this.gameSeconds = MAX_SEC
      this._finish()
      return
    }

    /* Desgaste escalado a segundos */
    const enPista = state.players.filter(p => p.enPista)
    enPista.forEach(p => aplicarDesgaste(p, this.gamePlan.drain / 60))

    /* Lesión escalada */
    if (Math.random() < 0.025 / 60) {
      const candidatos = enPista.filter(p => !p.injury)
      if (candidatos.length > 0) {
        const lesionado = pickRandom(candidatos)
        const inj = pickRandom(INJURIES)
        lesionado.injury = { type: inj.type, description: inj.description, duration: inj.duration, remaining: inj.duration, recoveryEnergy: inj.recoveryEnergy }
        lesionado.energy = 0
        lesionado.enPista = false
        if (this.onEvent) this.onEvent({ text: `🚑 Lesión: ${lesionado.name} — ${inj.description}`, type: 'injury' })
      }
    }

    /* Cambios automáticos */
    const cambios = gestionarCambios()
    for (const c of cambios) {
      if (this.onEvent) this.onEvent({ text: `🔄 Sale: ${c.sale.name} (ENE:${c.sale.energy}) → Entra: ${c.entra.name} (ENE:${c.entra.energy})`, type: 'sub' })
    }

    /* Tarjetas escaladas a segundo */
    for (const p of enPista) {
      if (Math.random() < 0.008 / 60 && !p._yellowThisMatch) {
        p.yellowCards = (p.yellowCards || 0) + 1
        p._yellowThisMatch = true
        if (this.onEvent) this.onEvent({ text: `🟨 Amarilla: ${p.name}`, type: 'sub' })
        if (Math.random() < 0.2) {
          p.redCards = (p.redCards || 0) + 1
          p._redThisMatch = true
          p.enPista = false
          if (this.onEvent) this.onEvent({ text: `🟥 Roja: ${p.name} — Expulsado`, type: 'injury' })
        }
      }
    }

    /* Evento del juego */
    const event = this._simulateSecond()
    if (event) {
      this.events.push(event)
      if (event.type === 'homeGoal') {
        this.homeScore++
        const g = pickRandom(enPista)
        if (g) { g._goalsInMatch = (g._goalsInMatch || 0) + 1; g.goals = (g.goals || 0) + 1 }
        /* Asistencia */
        if (Math.random() < 0.35) {
          const ass = pickRandom(enPista.filter(x => x.id !== g?.id))
          if (ass) { ass.assists = (ass.assists || 0) + 1; if (this.onEvent) this.onEvent({ text: `🅰️ Asistencia: ${ass.name}`, type: 'sub' }) }
        }
        /* Pausa por gol 2 segundos reales */
        this.paused = true
        if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
        this._goalPauseTimer = setTimeout(() => { this.paused = false }, 2000)
      } else if (event.type === 'awayGoal') { this.awayScore++ }
      if (this.onEvent) this.onEvent(event)
    }
  }

  _simulateSecond() {
    const enPista = state.players.filter(p => p.enPista)
    if (enPista.length === 0) return null
    const homeSkill = enPista.reduce((s, p) => s + getHabilidadEfectiva(p), 0) / enPista.length * this.tacticMult
    const homeEnergyAVG = enPista.reduce((s, p) => s + p.energy, 0) / enPista.length / 100

    const homeChance = homeSkill * (0.5 + homeEnergyAVG * 0.3) * this.gamePlan.attack * this.homeFactor
    const awayChance = this.awaySkill * 0.5 * this.gamePlan.defense
    const totalChance = homeChance + awayChance

    /* Probabilidad de evento escalada a segundo: 42%/60 ≈ 0.7% por segundo */
    if (Math.random() > (0.42 / 60) * this.gamePlan.events) return null
    const roll = Math.random() * totalChance
    const isHomeAttack = roll < homeChance
    const teamName = isHomeAttack ? this.homeName : this.awayName
    const teamSkill = isHomeAttack ? homeSkill : this.awaySkill
    const goalProb = (teamSkill / 100) * 0.35
    if (Math.random() < goalProb) {
      const t = pickRandom(EVENTS_POOL.goal)
      return { text: t.text(teamName), type: isHomeAttack ? 'homeGoal' : 'awayGoal', team: teamName }
    }
    if (Math.random() < 0.55) {
      const t = pickRandom(EVENTS_POOL.save)
      return { text: t.text(teamName), type: 'save', team: teamName }
    }
    const t = pickRandom(EVENTS_POOL.miss)
    return { text: t.text(teamName), type: 'miss', team: teamName }
  }

  _updateClock() {
    if (!this.onClockUpdate) return
    const sec = this.gameSeconds
    const mm = String(Math.floor(sec / 60)).padStart(2, '0')
    const ss = String(sec % 60).padStart(2, '0')
    this.onClockUpdate(`${this.half}T ${mm}:${ss}`)
  }

  _halfTime() {
    this.paused = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this.onHalfTime) this.onHalfTime()
  }

  iniciarSegundaParte() {
    if (this.half !== 1) return
    this.half = 2
    this.gameSeconds = 0
    this.paused = false
    this.iniciarCronometro()
  }

  _finish() {
    this.finished = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
    if (this.onFinish) this.onFinish()
  }

  stop() {
    this.finished = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
  }
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
  tactic: { formation: '4-3-3', gamePlan: 'tikitaka' },
  finances: { balance: 5000, history: [] },
  leagueTeams: [],
  currentMatchday: 1,
  totalMatchdays: 0,
  fixtures: [],
  allLeagueData: {},
  currentTab: 'club',
  clubSubTab: 'squad',
  marketTab: 'buy',
  staff: [],
  tacticsSlots: [],
  benchIds: [],
  reserveIds: [],
  selectedPlayerId: null,
  inbox: [],
  soundEnabled: true,
  filialSquad: [],
}

/* ============ HELPERS ============ */
function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

function formatMoney(amount) {
  const fmt = Math.abs(amount).toLocaleString('es-ES', { useGrouping: true })
  return amount >= 0 ? `${fmt} €` : `-${fmt} €`
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
function storageSafe(method, key, value) {
  try {
    if (method === 'get') {
      const v = localStorage.getItem(key)
      if (v !== null) return v
    } else {
      localStorage.setItem(key, value)
      return true
    }
  } catch(e) { /* localStorage not available */ }
  try {
    if (method === 'get') {
      const v = sessionStorage.getItem(key)
      return v
    } else {
      sessionStorage.setItem(key, value)
      return true
    }
  } catch(e) { return null }
}

function getTop11Average(players) {
  if (!players || players.length === 0) return 0
  const top = [...players].sort((a, b) => (b.skill || 0) - (a.skill || 0)).slice(0, 11)
  return Math.round(top.reduce((s, p) => s + (p.skill || 0), 0) / top.length)
}

const MAX_SLOTS = 4

function getSaves() {
  try {
    const raw = storageSafe('get', STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function setSaves(saves) { storageSafe('set', STORAGE_KEY, JSON.stringify(saves)) }

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
        const { enPista, minutosEnPista, convocado, titular, _yellowsInThisMatch, _redThisMatch, _goalsInMatch, ...rest } = p
        return rest
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
          teamId: t.teamId, name: t.name, players: (t.players || []).map(cleanup), staff: t.staff
        })),
        currentMatchday: state.currentMatchday, totalMatchdays: state.totalMatchdays, fixtures: state.fixtures,
        tacticsSlots: state.tacticsSlots,
        benchIds: state.benchIds,
        reserveIds: state.reserveIds,
        staff: state.staff,
        inbox: state.inbox,
        soundEnabled: state.soundEnabled,
        filialSquad: (state.filialSquad || []).map(cleanup),
      }
      if (idx >= 0) saves[idx] = data; else saves.unshift(data)
      setSaves(saves)
      autoSaveTactics()
      console.log('[SAVE] OK - slot:', saves.indexOf(data), 'gameId:', gameId)
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
  const data = { formation: state.tactic.formation, gamePlan: state.tactic.gamePlan, tacticsSlots: state.tacticsSlots, benchIds: state.benchIds, reserveIds: state.reserveIds }
  try {
    const raw = storageSafe('get', TACTICS_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[state.gameId] = data
    storageSafe('set', TACTICS_KEY, JSON.stringify(all))
  } catch {}
}

function loadTactics() {
  if (!state.gameId) return
  try {
    const raw = storageSafe('get', TACTICS_KEY)
    const all = raw ? JSON.parse(raw) : {}
    const data = all[state.gameId]
    if (data) {
      state.tactic.formation = data.formation || state.tactic.formation
      state.tactic.gamePlan = data.gamePlan || state.tactic.gamePlan
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
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const t = l.teams.find(x => x.id === id)
      if (t && t.logo) return t.logo
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
  const t = getBaseDato(id)
  return t?.defaultFormation || '4-3-3'
}

function getTeamObj(id) {
  if (id === state.teamId) return { name: state.team, players: state.players, teamId: state.teamId, staff: state.staff }
  const filialId = getFilialId(state.teamId)
  if (filialId && id === filialId && state.filialSquad) {
    return { name: getTeamName(id), players: state.filialSquad, teamId: id }
  }
  let t = state.leagueTeams.find(x => x.teamId === id)
  if (t) return t
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const team = l.teams.find(x => x.id === id)
      if (team) {
        if (getRealSquad(team.id)) {
          return { name: team.name, players: getRealSquad(team.id).map(p => ({ ...p })), teamId: team.id, staff: team.staff }
        }
        /* Generate CPU squad on-the-fly for teams without real squads */
        const rating = team.rating || getBaseDato(id)?.rating || 70
        return { name: team.name, players: generateCpuSquad(id, state.countryId, rating), teamId: id, staff: team.staff || generateStaff(team.name, state.countryId) }
      }
    }
  }
  return null
}

function autoSimulateOtherMatch(homeId, awayId) {
  const home = getTeamObj(homeId)
  const away = getTeamObj(awayId)
  if (!home || !away) return { homeScore: 0, awayScore: 0 }
  const homeSkill = avgSkill(home.players) * randInt(80, 120) / 100 * 1.05
  const awaySkill = avgSkill(away.players) * randInt(80, 120) / 100
  let homeScore = 0, awayScore = 0
  for (let m = 0; m < 40; m++) {
    if (Math.random() > 0.35) continue
    const prob = (Math.random() < 0.5 ? homeSkill : awaySkill) / 100 * 0.3
    if (Math.random() < prob) {
      if (Math.random() < 0.5) homeScore++; else awayScore++
    }
  }
  return { homeScore, awayScore }
}

function simularPartidoPorRating(homeId, awayId) {
  const homeR = getTeamRating(homeId)
  const awayR = getTeamRating(awayId)
  if (!homeR || !awayR) return { homeScore: 0, awayScore: 0 }
  const homeStrength = homeR * (0.8 + Math.random() * 0.4)
  const awayStrength = awayR * (0.8 + Math.random() * 0.4)
  const total = homeStrength + awayStrength
  const goalPool = 3 + Math.round(Math.random() * 4)
  const homeScore = Math.min(12, Math.round((homeStrength / total) * goalPool))
  const awayScore = Math.min(12, Math.round((awayStrength / total) * goalPool))
  return { homeScore, awayScore }
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
    const dayFixtures = data.fixtures.filter(f => f.matchday === matchday && !f.played)
    for (const f of dayFixtures) {
      const r = simularPartidoPorRating(f.home, f.away)
      f.homeScore = r.homeScore; f.awayScore = r.awayScore; f.played = true
    }
    data.currentMatchday = matchday
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
      <span class="tp-th-name">Nombre</span>
      <span class="tp-th-pos">Pos</span>
      <span class="tp-th-age">Edad</span>
      <span class="tp-th-value">Valor</span>
      <span class="tp-th-power">Pod</span>
    </div>
    <div class="tp-list">`
  html += ordered.map(p => {
    const posColor = ((POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280')
    const valShort = formatShort(p.value || calcValue(p.skill))
    return `<div class="tp-row" data-player-id="${p.id}">
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''} ${p.transferListed ? '<span class="player-badge badge-lt" style="font-size:8px">TR</span>' : ''}${p.loanListed ? '<span class="player-badge badge-lc" style="font-size:8px">CED</span>' : ''}</span>
        </div>
      </div>
      <span class="tp-cell-pos-badge" style="background:${posColor};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <span class="tp-cell-age">${p.age || '-'}</span>
      <span class="tp-cell-market">${valShort}</span>
      <span class="tp-cell-power">${p.skill}</span>
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
      <span class="tp-cell-market" style="width:28px;text-align:center">PJ</span>
      <span class="tp-cell-market" style="width:38px;text-align:center">⚽</span>
      <span class="tp-cell-market" style="width:38px;text-align:center">👟</span>
      <span class="tp-cell-market" style="width:30px;text-align:center">🟨</span>
      <span class="tp-cell-market" style="width:28px;text-align:center">🟥</span>
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
  '4-3-3': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_izq', label: 'MI' }, { role: 'extremo_der', label: 'ED' }, { role: 'delantero', label: 'DC' }, { role: 'extremo_izq', label: 'EI' }],
  '4-4-2': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_izq', label: 'MI' }, { role: 'delantero', label: 'DC' }, { role: 'delantero', label: 'DC' }],
  '4-2-3-1': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_def', label: 'MCD' }, { role: 'medio_def', label: 'MCD' }, { role: 'extremo_der', label: 'ED' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'extremo_izq', label: 'EI' }, { role: 'delantero', label: 'DC' }],
  '3-5-2': [{ role: 'portero', label: 'POR' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'carrilero_der', label: 'CAD' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'medio_izq', label: 'MI' }, { role: 'delantero', label: 'DC' }, { role: 'delantero', label: 'DC' }],
  '5-3-2': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_der', label: 'MD' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_izq', label: 'MI' }, { role: 'delantero', label: 'DC' }, { role: 'delantero', label: 'DC' }],
  '4-1-4-1': [{ role: 'portero', label: 'POR' }, { role: 'lateral_der', label: 'LD' }, { role: 'defensa_central', label: 'DFC' }, { role: 'defensa_central', label: 'DFC' }, { role: 'lateral_izq', label: 'LI' }, { role: 'medio_def', label: 'MCD' }, { role: 'extremo_der', label: 'ED' }, { role: 'mediocentro', label: 'MC' }, { role: 'medio_ofensivo', label: 'MCO' }, { role: 'extremo_izq', label: 'EI' }, { role: 'delantero', label: 'DC' }],
}

function renderHome() {
  const container = document.getElementById('home-content')
  if (!container) return
  const standings = updateLeagueStandings()
  const userPos = standings.findIndex(s => s.teamId === state.teamId) + 1
  const isPlayoffs = state.playoffs && state.playoffs.fixtures && state.playoffs.fixtures.length > 0
  const fixture = isPlayoffs
    ? state.playoffs.fixtures.find(f => !f.played && (f.home === state.teamId || f.away === state.teamId))
    : state.fixtures.find(f => f.played === false && (f.home === state.teamId || f.away === state.teamId))
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
  const roundNames = { QF: 'Cuartos de final', SF: 'Semifinal', F: 'Final' }
  container.innerHTML = `
    <div class="home-card">
      <div class="home-avatar-wrap">${state.teamLogo ? `<img class="home-logo" src="${state.teamLogo}" alt="">` : ''}</div>
      <div class="home-team-name">${state.team}</div>
      <div class="home-stats">
        <div class="home-stat"><span class="home-stat-icon">🏆</span><span>${userPos}º de ${standings.length}</span></div>
        <div class="home-stat"><span class="home-stat-icon">💰</span><span>${formatMoney(state.finances.balance)}</span></div>
        <div class="home-stat"><span class="home-stat-icon">👥</span><span>${state.players.length}/${MAX_SQUAD}</span></div>
        <div class="home-stat"><span class="home-stat-icon">📊</span><span>${state.stats.wins}V ${state.stats.draws}E ${state.stats.losses}D</span></div>
      </div>
      <div class="home-form-row">
        ${last5.length > 0 ? last5.map(r => `<span class="home-form-dot forma-${r === 'V' ? 'v' : r === 'E' ? 'e' : 'd'}"></span>`).join('') : '<span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span><span class="home-form-dot"></span>'}
      </div>
      <div class="home-injury-text">🚑 Bajas para hoy: ${injured.length > 0 ? injured.map(p => p.name).join(', ') : 'Ninguna'}</div>
    </div>
    ${fixture ? `
    <div class="home-card home-match">
      <div class="home-section-title">Próximo encuentro</div>
      <div class="home-match-teams">
        <div class="home-team-side">
          <img class="home-team-logo" src="${state.teamLogo || ''}" alt="">
          <div class="home-team-label">${state.team}</div>
          <div class="home-team-pos">${userPos}º · ${getTeamFormation(state.teamId)}</div>
        </div>
        <div class="home-vs">VS</div>
        <div class="home-team-side" style="cursor:pointer" onclick="showTeamInfo('${rivalId}')">
          <img class="home-team-logo" src="${rivalLogo}" alt="">
          <div class="home-team-label">${rivalName}</div>
          <div class="home-team-pos">${rivalPos}º · ${getTeamFormation(rivalId)}</div>
        </div>
      </div>
      ${isPlayoffs
        ? `<div class="home-matchday-label">${roundNames[state.playoffs.round] || 'Eliminatoria'}</div>`
        : `<div class="home-matchday-label">Jornada ${nextMatchday} de ${state.totalMatchdays} · ${fixture.horario || ''}</div>`
      }
      <div class="home-match-location">${isHome ? '🏠 Local' : '✈️ Visitante'}</div>
      <button class="btn-primary" id="btn-home-play">▶ IR AL PARTIDO</button>
    </div>` : '<div class="home-card home-match"><div class="home-section-title">🏆 Temporada completada</div></div>'}
  `
  const playBtn = document.getElementById('btn-home-play')
  if (playBtn) playBtn.onclick = () => startMatchFromLeague(rivalId, fixture)
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
  const reputation = displayPower <= 20 ? 1 : displayPower <= 40 ? 2 : displayPower <= 60 ? 3 : displayPower <= 80 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const countryFlag = window.DB[state.countryId]?.country.flag || ''
  const totalVal = state.players.reduce((s, p) => s + (p.value || 0), 0)
  document.getElementById('club-team-info').innerHTML = `
    <div class="tp-stats" style="margin-bottom:12px">
      <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">\u2014</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Reputación</span><span class="tp-stat-stars">${stars}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">País</span><span class="tp-stat-flag">${countryFlag}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
    </div>`

  document.getElementById('club-squad-content').classList.add('hidden')
  document.getElementById('club-tactics-content').classList.add('hidden')
  document.querySelectorAll('#view-club .sub-tab').forEach(b => b.classList.toggle('active', b.dataset.subtab === state.clubSubTab))
  if (state.clubSubTab === 'squad') {
    document.getElementById('club-squad-content').classList.remove('hidden')
    renderSquad(state.players)
  } else {
    document.getElementById('club-tactics-content').classList.remove('hidden')
    renderTactics(state.tactic)
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
  '5-3-2': FORMATIONS['5-3-2'].roles,
  '4-1-4-1': FORMATIONS['4-1-4-1'].roles,
}

function getPositionMultiplier(naturalPosition, assignedRole) {
  const row = POS_MULTIPLIER[naturalPosition]
  return row ? row[assignedRole] || 0.3 : 1
}

function renderTactics(tactic) {
  const container = document.getElementById('club-tactics-content')
  if (!container) return

  /* Init slots if needed */
  const roles = SLOT_ROLES[tactic.formation]
  if (!state.tacticsSlots || state.tacticsSlots.length !== roles.length) {
    state.tacticsSlots = roles.map(() => null)
  } else {
    /* On formation change, preserve players whose role still exists */
    const oldRoles = SLOT_ROLES[tactic.formation] || roles
    if (oldRoles.length !== roles.length) {
      state.tacticsSlots = roles.map(r => {
        const idx = oldRoles.indexOf(r)
        return idx >= 0 ? state.tacticsSlots[idx] : null
      })
    }
  }

  const slots = state.tacticsSlots
  const assignedIds = slots.filter(Boolean)
  const assigned = assignedIds.map(id => state.players.find(p => p.id === id)).filter(Boolean)
  const available = state.players.filter(p => !assignedIds.includes(p.id))

  state.benchIds = state.benchIds.filter(id => state.players.find(p => p.id === id))
  if (state.benchIds.length > MAX_BENCH) state.benchIds = state.benchIds.slice(0, MAX_BENCH)
  const bench = state.benchIds.map(id => state.players.find(p => p.id === id)).filter(Boolean)
  const rest = available.filter(p => !state.benchIds.includes(p.id))

  const complete = slots.every(Boolean)
  const hasGK = slots.some(id => {
    if (!id) return false
    const p = state.players.find(x => x.id === id)
    return p && p.position === 'portero'
  })
  const enoughAvailable = available.length >= 11

  /* Build HTML */
  let html = `<div class="tactics-section">
    <label class="tactics-label">Formación</label>
    <div class="tactics-options" id="formation-options">
      ${Object.keys(FORMATIONS).map(fk =>
        `<button class="tactics-btn ${tactic.formation === fk ? 'active' : ''}" data-formation="${fk}">${fk}</button>`
      ).join('')}
    </div>
  </div>
  <div class="tactics-section">
    <label class="tactics-label">Modelo</label>
    <select id="gameplan-select" class="tactics-select">
      ${Object.entries(GAME_PLANS).map(([key, gp]) =>
        `<option value="${key}" ${tactic.gamePlan === key ? 'selected' : ''}>${gp.label}</option>`
      ).join('')}
    </select>
    <div class="gameplan-desc" id="gameplan-desc">${GAME_PLANS[tactic.gamePlan].desc}</div>
  </div>`

  /* Vertical pitch: simple row-based layout for 11 slots */
  html += `<div class="pitch-grid-11">`
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i]
    const pid = slots[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    const pos = POSITIONS[role]
    if (player) {
      const mult = getPositionMultiplier(player.position, role)
      const penalty = mult < 1 ? '⚠️' : ''
      const unavailable = player.injury ? ' unavailable' : ''
      const avatarStyle = `background-image:url(${player.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      html += `<div class="p11-slot-wrap">
        <div class="p11-slot filled${unavailable}" data-slot="${i}" style="border-color:${pos.color};background:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
        </div>
        <span class="p11-slot-role" style="color:#fff">${pos.label}${penalty}</span>
        <span class="p11-slot-name">${player.injury ? '🩹 ' : ''}${player.name.split(' ').slice(-1)[0]}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
      </div>`
    } else {
      html += `<div class="p11-slot-wrap">
        <div class="p11-slot empty" data-slot="${i}">+</div>
        <span class="p11-slot-role">${pos.label}</span>
      </div>`
    }
  }
  html += `</div>`

  /* Bench grid (9 circles: 5 + 4) */
  html += `<div class="tactics-subsection-label">BANQUILLO (${bench.length}/${MAX_BENCH})</div>
    <div class="bench-grid">`
  for (let i = 0; i < MAX_BENCH; i++) {
    const pid = state.benchIds[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    if (player) {
      const pos = POSITIONS[player.position]
      const unavailable = player.injury ? ' unavailable' : ''
      const avatarStyle = `background-image:url(${player.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot filled${unavailable}" data-bench="${i}" style="border-color:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
          ${player.injury ? '<span class="unavailable-badge">🚑</span>' : ''}
        </div>
        <span class="bench-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
        ${player.injury ? '<div class="injury-mini">🟡 ' + player.injury.remaining + 'j</div>' : ''}
      </div>`
    } else {
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot empty" data-bench="${i}">+</div>
        <span class="bench-slot-name">—</span>
      </div>`
    }
  }
  html += `</div>`

  /* Reserve slots (2) */
  html += `<div class="tactics-subsection-label">RESERVAS</div>
    <div class="bench-grid">`
  for (let i = 0; i < MAX_RESERVES; i++) {
    const pid = state.reserveIds[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    if (player) {
      const pos = POSITIONS[player.position]
      const unavailable = player.injury ? ' unavailable' : ''
      const avatarStyle = `background-image:url(${player.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot filled${unavailable}" data-reserve="${i}" style="border-color:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
          ${player.injury ? '<span class="unavailable-badge">🚑</span>' : ''}
        </div>
        <span class="bench-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
        ${player.injury ? '<div class="injury-mini">🟡 ' + player.injury.remaining + 'j</div>' : ''}
      </div>`
    } else {
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot empty" data-reserve="${i}">+</div>
        <span class="bench-slot-name">—</span>
      </div>`
    }
  }
  html += `</div>`

  container.innerHTML = html

  /* Event listeners */
  document.querySelectorAll('#formation-options .tactics-btn').forEach(btn => {
    btn.onclick = () => { tactic.formation = btn.dataset.formation; renderTactics(tactic) }
  })
  document.getElementById('gameplan-select').onchange = (e) => {
    tactic.gamePlan = e.target.value
    const descEl = document.getElementById('gameplan-desc')
    if (descEl) descEl.textContent = GAME_PLANS[tactic.gamePlan].desc
    renderTactics(tactic)
  }
  document.querySelectorAll('.p11-slot, .bench-slot').forEach(el => {
    el.onclick = () => handleSlotClick(el, tactic)
  })
  /* Clear selection on click outside */
  document.getElementById('club-tactics-content').onclick = (e) => {
    if (e.target.closest('.p11-slot') || e.target.closest('.bench-slot')) return
    state.selectedPlayerId = null
    document.querySelectorAll('.p11-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
  }
  /* Auto-validate whenever formation is complete */
  if (complete && hasGK && enoughAvailable) {
    state.matchdaySquad = [...slots, ...state.benchIds, ...state.reserveIds]
    state.startingFive = slots
    state.subsBench = [...state.benchIds, ...state.reserveIds]
    state.convocatoriaValidada = true
  } else {
    state.convocatoriaValidada = false
  }

  /* Re-apply selected class after re-render */
  if (state.selectedPlayerId) {
    document.querySelectorAll('.p11-slot, .bench-slot').forEach(el => {
      const sid = getPlayerIdFromSlot(el)
      if (sid === state.selectedPlayerId) el.classList.add('selected')
    })
  }

  autoSaveTactics()
}

function autoAssignSquad() {
  const roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['4-3-3']
  const assigned = []
  const available = state.players.filter(p => !p.injury)

  state.tacticsSlots = roles.map(role => {
    const candidates = available.filter(p => !assigned.includes(p.id))
    const best = candidates.sort((a, b) => {
      const multA = getPositionMultiplier(a.position, role)
      const multB = getPositionMultiplier(b.position, role)
      if (multB !== multA) return multB - multA
      return b.skill - a.skill
    })[0]
    if (best) assigned.push(best.id)
    return best ? best.id : null
  })

  const benchPool = available.filter(p => !assigned.includes(p.id))
  state.benchIds = benchPool.slice(0, MAX_BENCH).map(p => p.id)
  assigned.push(...state.benchIds)

  const reservePool = available.filter(p => !assigned.includes(p.id))
  state.reserveIds = reservePool.slice(0, MAX_RESERVES).map(p => p.id)
}

function getPlayerIdFromSlot(el) {
  const slotIdx = el.dataset.slot
  const benchIdx = el.dataset.bench
  const reserveIdx = el.dataset.reserve
  if (slotIdx !== undefined) return state.tacticsSlots[parseInt(slotIdx)]
  if (benchIdx !== undefined) return state.benchIds[parseInt(benchIdx)]
  if (reserveIdx !== undefined) return state.reserveIds[parseInt(reserveIdx)]
  return null
}

function handleSlotClick(el, tactic) {
  const filled = el.classList.contains('filled')
  const pid = el.dataset.playerId
  const slotIdx = el.dataset.slot
  const benchIdx = el.dataset.bench
  const reserveIdx = el.dataset.reserve

  /* Block click if player is injured */
  if (filled && pid) {
    const p = state.players.find(x => x.id === pid)
    if (p && p.injury) return
  }

  /* Determine the container type and current player ID */
  let currentPid = null
  let targetArray = null
  let targetIndex = -1
  if (slotIdx !== undefined) {
    targetIndex = parseInt(slotIdx)
    currentPid = state.tacticsSlots[targetIndex]
    targetArray = 'tacticsSlots'
  } else if (benchIdx !== undefined) {
    targetIndex = parseInt(benchIdx)
    currentPid = state.benchIds[targetIndex]
    targetArray = 'benchIds'
  } else if (reserveIdx !== undefined) {
    targetIndex = parseInt(reserveIdx)
    currentPid = state.reserveIds[targetIndex]
    targetArray = 'reserveIds'
  }

  /* No player selected yet */
  if (!state.selectedPlayerId) {
    if (filled && currentPid) {
      state.selectedPlayerId = currentPid
      document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
      el.classList.add('selected')
    }
    renderTactics(tactic)
    return
  }

  /* Same player clicked → deselect */
  if (state.selectedPlayerId === currentPid) {
    state.selectedPlayerId = null
    document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
    renderTactics(tactic)
    return
  }

  /* Different player or empty slot → place selected player here */
  if (targetArray && targetIndex >= 0) {
    if (currentPid) {
      /* Swap: find where selected player is and swap places */
      for (let arr of ['tacticsSlots', 'benchIds', 'reserveIds']) {
        const a = state[arr]
        for (let i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            a[i] = currentPid
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
            renderTactics(tactic)
            return
          }
        }
      }
    } else {
      /* Empty slot: place selected player here */
      for (let arr of ['tacticsSlots', 'benchIds', 'reserveIds']) {
        const a = state[arr]
        for (let i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            if (targetArray === 'tacticsSlots' || targetArray === 'benchIds' || targetArray === 'reserveIds') {
              a[i] = null
            }
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
            renderTactics(tactic)
            return
          }
        }
      }
    }
  }

  state.selectedPlayerId = null
  document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
  renderTactics(tactic)
}

/* ============ FATIGA & SUSTITUCIONES ============ */
function getHabilidadEfectiva(player, assignedRole) {
  const mult = assignedRole ? getPositionMultiplier(player.position, assignedRole) : 1
  let base = player.energy < 50 ? Math.round(player.skill * 0.5) : player.skill
  return Math.round(base * mult)
}

function aplicarDesgaste(player, drainMult) {
  const gamePlan = GAME_PLANS[state.tactic.gamePlan] || GAME_PLANS.juegoCuatro
  let interval = Math.max(1, Math.round(45 / (drainMult || gamePlan.drain)))
  if (player.position === 'portero') interval *= 6
  if (interval > 0 && tiempoSegundos % interval === 0) {
    player.energy = Math.max(0, player.energy - 1)
  }
  player.minutosEnPista = (player.minutosEnPista || 0) + 1
}

function findSustituto(banquillo, posicion, enPistaIds) {
  const similares = { portero: ['portero'], cierre: ['cierre', 'ala'], ala: ['ala', 'cierre'], pivot: ['pivot', 'ala'] }
  const validas = similares[posicion] || [posicion]
  return banquillo
    .filter(p => validas.includes(p.position) && p.energy >= 60 && !enPistaIds.includes(p.id))
    .sort((a, b) => b.energy - a.energy)[0]
}

function gestionarCambios() {
  const enPista = state.players.filter(p => p.enPista)
  const banquillo = state.players.filter(p => p.convocado && !p.enPista)
  const enPistaIds = enPista.map(p => p.id)
  let cambios = []

  for (const jugador of enPista) {
    if (jugador.energy >= 60) continue
    const sustituto = findSustituto(banquillo, jugador.position, enPistaIds)
    if (!sustituto) continue
    jugador.enPista = false
    sustituto.enPista = true
    enPistaIds[enPistaIds.indexOf(jugador.id)] = sustituto.id
    cambios.push({ sale: jugador, entra: sustituto })
    if (sustituto.energy < 60) break
  }
  return cambios
}

function simularLesion() {
  const fitCoachCount = state.staff.filter(s => s.role === 'fitnessCoach').length
  const injuryProb = 0.003 * Math.max(0.4, 1 - fitCoachCount * 0.10)
  for (const p of state.players) {
    if (!p.enPista) continue
    if (p.injury) continue
    if (Math.random() > injuryProb) continue
    const inj = pickRandom(INJURIES)
    p.injury = { type: inj.type, description: inj.description, duration: inj.duration, remaining: inj.duration, recoveryEnergy: inj.recoveryEnergy }
    p.energy = Math.max(30, p.energy - 20)
    addNotification('injury', `🩹 Lesión: ${p.name}`, `${inj.description} (${inj.duration} jornada${inj.duration > 1 ? 's' : ''})`)
    return p
  }
  return null
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

function renderLeague() {
  const selector = document.getElementById('league-selector')
  const tableWrap = document.getElementById('league-table-wrap')
  const resultsWrap = document.getElementById('league-results-wrap')

  resultsWrap.classList.add('hidden')

  /* Save selected league before rebuilding dropdown */
  const selectedLeagueId = selector.value || state.leagueId

  /* Dropdown */
  let opts = ''
  const allLeagues = []
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      allLeagues.push({ ...l, country: data.country })
    }
  }
  for (const l of allLeagues) {
    const isOwn = l.id === state.leagueId
    opts += `<option value="${l.id}" data-country="${l.country.id}" ${isOwn ? 'selected' : ''}>${l.country.flag} ${l.name}</option>`
  }
  selector.innerHTML = opts
  selector.value = selectedLeagueId

  /* Table */
  const isOwnLeague = selectedLeagueId === state.leagueId
  const standings = isOwnLeague
    ? updateLeagueStandings()
    : state.allLeagueData && state.allLeagueData[selectedLeagueId]
      ? computeStandings(state.allLeagueData[selectedLeagueId].fixtures,
          getLeagueTeams(selectedLeagueId).map(t => t.id))
      : getLeagueTeams(selectedLeagueId).map(t => ({
          teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0,
          name: t.name, logo: t.logo
        }))
  let tableHtml = `<table class="league-table"><tr><th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th></tr>`
  standings.forEach((s, i) => {
    const isUser = isOwnLeague && s.teamId === state.teamId
    const totalTeams = standings.length
    const zonaPlayoff = Math.ceil(totalTeams * 0.5)
    const zonaDescenso = Math.max(1, Math.min(3, Math.floor(totalTeams * 0.2)))
    const zonaClass = i < zonaPlayoff ? 'zona-playoff' : i < totalTeams - zonaDescenso ? 'zona-permanencia' : 'zona-descenso'
    const logo = s.logo || getTeamLogo(s.teamId)
    const name = s.name || getTeamName(s.teamId)
    const dg = s.gf - s.ga
    tableHtml += `<tr class="${isUser ? 'league-row-user ' : ''}${zonaClass}" data-team-id="${s.teamId}" style="${!isUser ? 'cursor:pointer' : ''}">
      <td><span class="league-pos ${i < 3 ? 'p' + (i+1) : ''}">${i + 1}</span></td>
      <td>${logo ? `<img class="team-logo" src="${logo}" style="width:18px;height:18px;vertical-align:middle;margin-right:6px">` : ''}${name}</td>
      <td><strong>${s.pts}</strong></td>
      <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
      <td>${s.gf}</td><td>${s.ga}</td><td>${dg}</td>
    </tr>`
  })
  tableHtml += '</table>'
  tableWrap.innerHTML = tableHtml
  tableWrap.querySelectorAll('tr[data-team-id]').forEach(row => {
    row.onclick = () => showTeamInfo(row.dataset.teamId)
  })

}

/* ============ MATCH ============ */
let engine = null
let tiempoSegundos = 0
let intervaloCrono = null
let parteActual = 1
let faltasLocal = 0
let faltasVisitante = 0
let matchPaused = false
const matchData = { homeScore: 0, awayScore: 0, homeFouls: 0, awayFouls: 0, rivalName: '' }
let matchStats = { homeShots: 0, awayShots: 0, homeYellow: 0, awayYellow: 0, homeRed: 0, awayRed: 0, homeEvents: 0, awayEvents: 0 }
let posesion = 50
let tickExpulsionLocal = 0, tickExpulsionVisitante = 0

function irAlPartido() {
  window._partidoIniciado = false
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  document.getElementById('view-match').classList.add('active')
  document.getElementById('bottom-nav').style.display = 'none'
  document.getElementById('app-header').style.display = 'none'
  document.getElementById('btn-header-menu').style.display = 'none'
  tiempoSegundos = 0
  parteActual = 1
  faltasLocal = 0
  faltasVisitante = 0
  tickExpulsionLocal = 0; tickExpulsionVisitante = 0
  if (intervaloCrono) { clearInterval(intervaloCrono); intervaloCrono = null }
  document.getElementById('cronometro').innerText = '00:00'
  document.getElementById('log-partido').innerHTML = ''
  document.getElementById('match-players').innerHTML = ''
  document.getElementById('btn-start-match').style.display = 'block'
  document.getElementById('btn-end-match').style.display = 'none'
  document.getElementById('score-home').textContent = '0'
  document.getElementById('score-away').textContent = '0'
  document.getElementById('fouls-home').textContent = '0'
  document.getElementById('fouls-away').textContent = '0'
  const expInfo = document.getElementById('expulsados-info')
  if (expInfo) expInfo.textContent = ''
}

function empezarPartido() {
  const btn = document.getElementById('btn-start-match')
  btn.disabled = true
  btn.innerText = 'JUGANDO...'
  playSound('whistle')
  /* Reset energy only at true match start, not when resuming from tactics */
  if (!window._partidoIniciado) {
    state.players.forEach(p => { if (!p.injury) p.energy = 100 })
    window._partidoIniciado = true
  }

  if (intervaloCrono) clearInterval(intervaloCrono)
  intervaloCrono = setInterval(() => {
    tiempoSegundos += 1
    let mm = Math.floor(tiempoSegundos / 60)
    let ss = tiempoSegundos % 60
    document.getElementById('cronometro').innerText = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0')

    /* Desgaste */
    state.players.filter(p => p.enPista).forEach(p => aplicarDesgaste(p))
    /* Recuperación en banquillo: +1 cada 50 ticks */
    if (tiempoSegundos % 50 === 0) {
      state.players.filter(p => p.convocado && !p.enPista).forEach(p => {
        p.energy = Math.min(100, p.energy + 1)
      })
    }
    /* Actualizar UI de stamina cada 10 ticks */
    if (tiempoSegundos % 10 === 0) renderPlayerRatings()

    /* Tarjetas */
    for (const p of state.players.filter(x => x.enPista)) {
      if (Math.random() < 0.008 / 60) {
        p._yellowsInThisMatch = (p._yellowsInThisMatch || 0) + 1
        p.yellowCards = (p.yellowCards || 0) + 1
        faltasLocal++
        document.getElementById('fouls-home').textContent = faltasLocal
          matchStats.homeYellow++; matchStats.homeEvents++
          playSound('card')
          if (p._yellowsInThisMatch >= 2) {
          p.redCards = (p.redCards || 0) + 1
          p._redThisMatch = true
          p.enPista = false
          matchStats.homeRed++
          addFeedEvent({ text: `🟨🟨 Doble amarilla: ${p.name} — Expulsado`, type: 'red-card' })
        } else {
          addFeedEvent({ text: `🟨 Amarilla: ${p.name}`, type: 'yellow-card' })
          if (Math.random() < 0.2) {
            p.redCards = (p.redCards || 0) + 1
            p._redThisMatch = true
            p.enPista = false
            matchStats.homeRed++
            addFeedEvent({ text: `🟥 Roja directa: ${p.name} — Expulsado`, type: 'red-card' })
          }
        }
      }
    }

    /* Tarjetas del equipo rival */
    if (Math.random() < 0.006 / 60) {
      faltasVisitante++
      document.getElementById('fouls-away').textContent = faltasVisitante
      matchStats.awayYellow++; matchStats.awayEvents++
      addFeedEvent({ text: `🟨 Amarilla: ${matchData.rivalName}`, type: 'yellow-card' })
    }

    /* Faltas */
    if (Math.random() < 0.02 / 60) {
      const isHomeFault = Math.random() < 0.5
      if (isHomeFault) {
        faltasLocal++
        document.getElementById('fouls-home').textContent = faltasLocal
        matchStats.homeEvents++
        const culprit = pickRandom(state.players.filter(p => p.enPista))
        addFeedEvent({ text: `Falta: ${culprit ? culprit.name : state.team}`, type: 'sub' })
      } else {
        faltasVisitante++
        document.getElementById('fouls-away').textContent = faltasVisitante
        matchStats.awayEvents++
        addFeedEvent({ text: `Falta de ${matchData.rivalName}`, type: 'sub' })
      }
    }

    /* Lesiones — solo cada 100 ticks (~4s de partido) */
    if (tiempoSegundos % 100 === 0) simularLesion()

    /* Evento de juego */
    simularEventoPartido()

    /* Posesión dinámica — random walk */
    const enPista = state.players.filter(p => p.enPista)
    if (enPista.length > 0) {
      const homeSkill = enPista.reduce((s, p) => s + getHabilidadEfectiva(p), 0) / enPista.length
      posesion += (Math.random() - 0.5) * 3
      posesion += (50 - posesion) * 0.0005
      posesion += (homeSkill - 70) * 0.005
      posesion = Math.max(10, Math.min(90, posesion))
    }

    actualizarStats()

    if ((parteActual === 1 && tiempoSegundos >= 2700) || (parteActual === 2 && tiempoSegundos >= 5400)) {
      clearInterval(intervaloCrono)
      intervaloCrono = null
      if (parteActual === 1) {
        faltasLocal = 0
        faltasVisitante = 0
        document.getElementById('fouls-home').textContent = '0'
        document.getElementById('fouls-away').textContent = '0'
        addFeedEvent({ text: '— DESCANSO —', type: 'break' })
        state.players.forEach(p => { if (!p.injury) p.energy = Math.min(100, p.energy + 15) })
        renderPlayerRatings()
        parteActual = 2
        btn.innerText = '▶ EMPEZAR 2ª PARTE'
        btn.disabled = false
      } else {
        addFeedEvent({ text: '— FINAL DEL PARTIDO —', type: 'break' })
        playSound('whistle')
        btn.style.display = 'none'
        document.getElementById('btn-end-match').style.display = 'block'
      }
    }
  }, 20)
}

function simularEventoPartido() {
  const enPista = state.players.filter(p => p.enPista)
  if (enPista.length === 0) return
  const homeSkill = enPista.reduce((s, p) => s + getHabilidadEfectiva(p), 0) / enPista.length
  const homeEnergyAVG = enPista.reduce((s, p) => s + p.energy, 0) / enPista.length / 100
  const gamePlan = GAME_PLANS[state.tactic.gamePlan] || GAME_PLANS.juegoCuatro
  if (Math.random() > (0.42 / 60) * gamePlan.events) return
  const homeChance = homeSkill * (0.5 + homeEnergyAVG * 0.3) * gamePlan.attack
  const awayChance = 70 * 0.5 * gamePlan.defense
  const isHomeAttack = Math.random() * (homeChance + awayChance) < homeChance
  const teamName = isHomeAttack ? state.team : matchData.rivalName
  const teamSkill = isHomeAttack ? homeSkill : 70
  if (isHomeAttack) matchStats.homeShots++; else matchStats.awayShots++
  if (Math.random() < (teamSkill / 100) * 0.35) {
    if (isHomeAttack) matchData.homeScore++; else matchData.awayScore++
    document.getElementById('score-home').textContent = matchData.homeScore
    document.getElementById('score-away').textContent = matchData.awayScore
    animarGol(isHomeAttack ? 'home' : 'away')
    playSound('goal')
    if (isHomeAttack) {
      const g = pickRandom(enPista); if (g) { g._goalsInMatch = (g._goalsInMatch || 0) + 1; g.goals = (g.goals || 0) + 1 }
      let goalText = `⚽ ${g ? g.name + ' (' + state.team + ')' : state.team}`
      if (Math.random() < 0.35) {
        const ass = pickRandom(enPista.filter(x => x.id !== g?.id))
        if (ass) { ass.assists = (ass.assists || 0) + 1; goalText += ` 🅰️ ${ass.name}` }
      }
      addFeedEvent({ text: goalText, type: 'homeGoal' })
    } else {
      addFeedEvent({ text: `⚽ ${matchData.rivalName}`, type: 'awayGoal' })
    }
  }
}

function startMatchFromLeague(rivalId, fixture) {
  showLoading('Preparando el partido...')
  const rival = getTeamObj(rivalId)
  if (!rival) return
  const tactic = state.tactic

  /* Set starting eleven */
  let eleven = state.startingFive.length > 0 ? state.startingFive : state.tacticsSlots.filter(Boolean)
  eleven = eleven.filter(id => state.players.find(p => p.id === id))
  if (eleven.length === 0) {
    const roles = ['portero', 'lateral_der', 'defensa_central', 'defensa_central', 'lateral_izq', 'medio_der', 'mediocentro', 'medio_izq', 'extremo_der', 'delantero', 'extremo_izq']
    const assigned = []
    eleven = roles.map(role => {
      const candidates = state.players.filter(p => !p.injury && !assigned.includes(p.id))
      const best = candidates.sort((a, b) => {
        const multA = getPositionMultiplier(a.position, role)
        const multB = getPositionMultiplier(b.position, role)
        return multB !== multA ? multB - multA : b.skill - a.skill
      })[0]
      if (best) assigned.push(best.id)
      return best ? best.id : null
    }).filter(Boolean)
  }
  state.players.forEach(p => { p.enPista = false; p.convocado = false })
  eleven.forEach(id => { const p = state.players.find(x => x.id === id); if (p) { p.enPista = true; p.convocado = true } })
  state.benchIds.forEach(id => { const p = state.players.find(x => x.id === id); if (p) p.convocado = true })

  /* Match data */
  matchData.homeScore = 0; matchData.awayScore = 0; matchData.homeFouls = 0; matchData.awayFouls = 0
  matchData.rivalName = rival.name
  engine = { homeScore: 0, awayScore: 0 }

  /* Stats tracking */
  matchStats = { homeShots: 0, awayShots: 0, homeYellow: 0, awayYellow: 0, homeRed: 0, awayRed: 0, homeEvents: 0, awayEvents: 0 }
  posesion = 50
  document.getElementById('match-stats').style.display = 'block'
  actualizarStats()

  /* Scoreboard */
  document.getElementById('match-home-name').textContent = state.team
  document.getElementById('match-away-name').textContent = rival.name
  document.getElementById('match-home-logo').src = state.teamLogo || ''
  document.getElementById('match-away-logo').src = getTeamLogo(rivalId) || ''
  document.getElementById('score-home').textContent = '0'
  document.getElementById('score-away').textContent = '0'

  /* Show match view */
  irAlPartido()

  const isHome = fixture.home === state.teamId

  /* Botón Finalizar */
  document.getElementById('btn-end-match').onclick = () => {
    if (intervaloCrono) { clearInterval(intervaloCrono); intervaloCrono = null }
    finishMatch(isHome, fixture, rival)
  }

  renderPlayerRatings()
  hideLoading()
}

function addFeedEvent(event) {
  const feed = document.getElementById('log-partido')
  const el = document.createElement('div')
  if (event.type === 'break') {
    el.className = 'feed-event minute'
    el.textContent = event.text
  } else {
    const sec = tiempoSegundos || 0
    const mm = String(Math.floor(sec / 60)).padStart(2, '0')
    const ss = String(sec % 60).padStart(2, '0')
    const time = `${parteActual > 0 ? parteActual + 'T' : '1T'} ${mm}:${ss}`
    let extra = ''
    if (event.type === 'homeGoal' || event.type === 'awayGoal') extra = ' goal'
    else if (event.type === 'sub') extra = ' sub'
    else if (event.type === 'injury') extra = ' injury'
    else if (event.type === 'yellow-card') extra = ' yellow-card'
    else if (event.type === 'red-card') extra = ' red-card'
    else if (event.type === 'penalty') extra = ' penalty'
    el.className = `feed-event${extra}`
    const cleanText = event.text.replace(/[⚽🟨🟥🚨🅰️🩹]/g, '').trim()
    el.innerHTML = `<strong>${time}</strong> ${cleanText}`
  }
  feed.appendChild(el)
  feed.scrollTop = feed.scrollHeight
}

function animarGol(equipo) {
  const el = equipo === 'home' ? document.getElementById('score-home') : document.getElementById('score-away')
  const board = document.querySelector('.scoreboard')
  if (el) {
    el.classList.remove('goal-anim')
    void el.offsetWidth
    el.classList.add('goal-anim')
  }
  if (board) {
    board.classList.remove('goal-shake')
    void board.offsetWidth
    board.classList.add('goal-shake')
  }
}

function actualizarStats() {
  const posH = Math.round(posesion)
  document.getElementById('stats-pos-local').textContent = posH + '%'
  document.getElementById('stats-pos-visit').textContent = (100 - posH) + '%'
  document.getElementById('stats-fill-pos').style.width = posH + '%'
  document.getElementById('stats-tir-local').textContent = matchStats.homeShots
  document.getElementById('stats-tir-visit').textContent = matchStats.awayShots
  document.getElementById('stats-amar-local').textContent = matchStats.homeYellow
  document.getElementById('stats-roja-local').textContent = matchStats.homeRed
  document.getElementById('stats-amar-visit').textContent = matchStats.awayYellow
  document.getElementById('stats-roja-visit').textContent = matchStats.awayRed
}

function renderPlayerRatings() {
  const container = document.getElementById('match-players')
  if (!container) return
  const enPista = state.players.filter(p => p.enPista)
  const posOrder = { portero: 0, cierre: 1, ala: 2, pivot: 3 }
  enPista.sort((a, b) => (posOrder[a.position] ?? 99) - (posOrder[b.position] ?? 99))
  container.innerHTML = enPista.map(p => {
    const pos = POSITIONS[p.position]
    const avatarStyle = `background-image:url(${p.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
    let cardBadge = ''
    if (p._redThisMatch) cardBadge = '<span class="card-indicator card-red"></span>'
    else if (p._yellowsInThisMatch) cardBadge = '<span class="card-indicator card-yellow"></span>'
    const fatigueClass = p.energy < 40 ? ' match-player-fatigued' : ''
    return `<div class="match-player-item${fatigueClass}">
      <div class="match-player-avatar" style="${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
      <span class="match-player-name">${p.name}${cardBadge}</span>
      <span class="match-player-ene" style="color:${getEneColor(p.energy)}">${p.energy}</span>
      <div class="stamina-bar"><div class="stamina-fill" style="width:${p.energy}%;background:${getEneColor(p.energy)}"></div></div>
      <span class="match-player-rating">${getHabilidadEfectiva(p)}</span>
    </div>`
  }).join('')
}

/* ============ TACTICS MODAL ============ */
function abrirTacticasModal() {
  console.log('[TACTICS] modal opening')
  /* Pause match timer */
  if (intervaloCrono) {
    clearInterval(intervaloCrono)
    intervaloCrono = null
  }

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
    gpDesc.textContent = GAME_PLANS[tactic.gamePlan].desc
  }
  gpDesc.textContent = GAME_PLANS[tactic.gamePlan].desc

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

  /* Bench (9 max) */
  const benchPlayers = available.slice(0, MAX_BENCH)
  document.getElementById('tm-bench-label').textContent = `BANQUILLO (${benchPlayers.length})`

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
    resumeMatchTimer()
  }

  /* Close button */
  document.getElementById('tm-close').onclick = () => {
    window._tacticsSwap = null
    modal.classList.remove('open')
    resumeMatchTimer()
  }

  modal.classList.add('open')
}

function resumeMatchTimer() {
  if (intervaloCrono) return
  /* Don't auto-resume at halftime (parteActual=2, time at 20:00) */
  if (parteActual === 2 && tiempoSegundos >= 2700) return
  empezarPartido()
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
    document.getElementById('score-home').textContent = '0'
    document.getElementById('score-away').textContent = '0'
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
    const rating = Math.round(5 + (p._yellowThisMatch ? -0.5 : 0) + (p._redThisMatch ? -2 : 0) + ((p.goals || 0) > 0 ? 2 : 0) + ((p.assists || 0) > 0 ? 1 : 0) + Math.random() * 2)
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

  updateLeagueStandings()
  document.getElementById('score-home').textContent = '0'
  document.getElementById('score-away').textContent = '0'
  showMatchdayResults(userScore, rivalScore, rival.name)
  autoSave()
}

function resetSeason() {
  state.currentMatchday = 1
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }

  /* Reset league standings */
  state.fixtures.forEach(f => { f.played = false; f.homeScore = null; f.awayScore = null })

  /* Reset players */
  state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })

  /* Reset CPU teams */
  state.leagueTeams.forEach(t => {
    t.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
  })

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
  /* Salarios de jugadores */
  const wageTotal = state.players.reduce((s, p) => s + (p.wage || calcWage(p.skill || 70)), 0)
  const budget = getDivisionBaseBudget(state.leagueId)
  const staffMult = Math.max(0.3, budget / 50000)
  const staffTotal = Math.round((state.staff ? state.staff.length : 1) * 400 * staffMult)
  const total = wageTotal + staffTotal
  state.finances.balance -= total
  state.finances.history.push({ reason: `📋 Salarios semanales (${state.players.length} jugs + staff)`, amount: -total })

  /* Ventas CPU */
  procesarVentasCPU()
}

function procesarVentasCPU() {
  const transferibles = state.players.filter(p => p.transferListed && p.transferPrice > 0)
  for (const p of transferibles) {
    if (Math.random() > 0.15) continue
    /* CPU compra al jugador */
    state.finances.balance += p.transferPrice
    state.finances.history.push({ reason: `💰 Venta: ${p.name}`, amount: p.transferPrice })
    const idx = state.players.indexOf(p)
    if (idx >= 0) state.players.splice(idx, 1)
    addNotification('transfer', `💰 Vendido: ${p.name}`, `${formatMoney(p.transferPrice)} · Traspasado a un equipo de la liga`)
  }
}

function procesarFinTemporada(skipAging, skipStandings) {
  if (!skipAging) envejecerYProgresar()
  let cambioDivision = false
  let pos = 0
  let esPrimera = false, esSegunda = false, esSegundaB = false, esTercera = false, esHonor = false, esPrimeraCat = false, esSegonaCat = false, esTerceraCat = false
  let esPlayoffTercera = false
  let msg = ''

  if (!skipStandings) {
    const standings = updateLeagueStandings()
    pos = standings.findIndex(s => s.teamId === state.teamId) + 1
    esPrimera = state.leagueId === 'lnfs1'
    esSegunda = state.leagueId === 'lnfs2'
    esSegundaB = state.leagueId && state.leagueId.startsWith('l2b')
    esTercera = state.leagueId && state.leagueId.startsWith('l3g')
    esHonor = state.leagueId && state.leagueId.startsWith('lhc')
    esPrimeraCat = state.leagueId && state.leagueId.startsWith('lc')
    esSegonaCat = state.leagueId && state.leagueId.startsWith('l2c')
    esTerceraCat = state.leagueId && state.leagueId.startsWith('l3c')

    const esTerceraCatalana = state.leagueId === 'l3g1' || state.leagueId === 'l3g2'
    const totalTeams = standings.length

    if (esPrimera && pos >= 15) {
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
    }

    msg = `📊 Temporada finalizada. Posición: ${pos}º`
    if (cambioDivision && esPrimera) msg += '\n⚠️ DESCENSO a Segunda División'
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
    else if (esTercera) msg += '\nPermanencia en 3ª División Nacional'
    else if (esSegundaB) msg += '\nPermanencia en 2ª División B'
    else if (esHonor) msg += '\nPermanencia en Divisió d\'Honor Catalana'
    else if (esPrimeraCat) msg += '\nPermanencia en 1a Divisió Catalana'
    else if (esSegonaCat) msg += '\nPermanencia en 2a Divisió Catalana'
    else if (esTerceraCat) msg += '\nPermanencia en 3a Divisió Catalana'
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

  /* Normal season setup or post-playoff setup */
  const league = getLeagueFromId(state.leagueId)
  const allTeams = league ? league.teams : []
  state.leagueTeams = allTeams.filter(t => t.id !== state.teamId).map(t => {
    const existing = state.leagueTeams.find(x => x.teamId === t.id)
    return {
      teamId: t.id, name: t.name,
      players: existing ? existing.players.map(p => ({ ...p, energy: 100, injury: null, goals: 0, matches: 0 }))
        : (getRealSquad(t.id) || []).map(p => ({ ...p, value: calcValue(p.skill), wage: calcWage(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, energy: 100, goals: 0, matches: 0 })),
      staff: t.staff || existing?.staff || [],
    }
  })
  state.fixtures = generateFixtures([state.teamId, ...state.leagueTeams.map(t => t.teamId)])
  state.totalMatchdays = Math.max(...state.fixtures.map(f => f.matchday))
  state.currentMatchday = 1
  /* Regenerate fixtures for all leagues for the new season */
  state.allLeagueData = {}
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const teamIds = l.teams.map(t => t.id)
      if (teamIds.length < 2) continue
      const fx = generateFixtures(teamIds)
      state.allLeagueData[l.id] = {
        fixtures: fx,
        currentMatchday: 0,
        totalMatchdays: Math.max(...fx.map(f => f.matchday))
      }
    }
  }
  simularJornadaEnTodasLasLigas(1)
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.playoffs = null
  state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
  document.getElementById('league-results-wrap').classList.add('hidden')
  renderLeague()
  saveGame()

  if (!skipStandings) {
    addNotification('general', msg, `Nueva temporada en ${state.leagueId.startsWith('l3c') ? '3a Divisió Catalana' : state.leagueId.startsWith('l2c') ? '2a Divisió Catalana' : state.leagueId.startsWith('lc') ? '1a Divisió Catalana' : state.leagueId.startsWith('lhc') ? 'Divisió d\'Honor Catalana' : state.leagueId.startsWith('l3g') ? '3ª División Nacional' : state.leagueId.startsWith('l2b') ? '2ª División B' : state.leagueId === 'lnfs2' ? 'Segunda División' : state.leagueId === 'lnfs1' ? 'Primera División' : state.leagueId === 'lpl' ? 'Liga Polaca' : state.leagueId === 'lpl2' ? 'Segunda Polaca' : 'la categoría'}`)
    setTimeout(() => alert(msg), 100)
  } else {
    const divName = state.leagueId.startsWith('l3c') ? '3a Divisió Catalana' : state.leagueId.startsWith('l2c') ? '2a Divisió Catalana' : state.leagueId.startsWith('lc') ? '1a Divisió Catalana' : state.leagueId.startsWith('lhc') ? 'Divisió d\'Honor Catalana' : state.leagueId.startsWith('l3g') ? '3ª División Nacional' : state.leagueId.startsWith('l2b') ? '2ª División B' : state.leagueId === 'lnfs2' ? 'Segunda División' : state.leagueId === 'lnfs1' ? 'Primera División' : state.leagueId === 'lpl' ? 'Liga Polaca' : state.leagueId === 'lpl2' ? 'Segunda Polaca' : 'la categoría'
    addNotification('general', `📋 Nueva temporada en ${divName}`, `Comienza una nueva campaña en ${divName}`)
  }
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

  if (pf.esTercera && pf.round === 'SF') {
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
    const promovio = pf.promoted
    const msg = `🏆 ${esCampeon ? '¡CAMPEÓN!' : 'Subcampeón'} — ${esCampeon ? 'Ganaste el título' : 'El campeón es ' + getTeamName(campeon)}`
    addNotification('match', msg, 'Playoff finalizado')
    state.playoffs = null
    if (esTercera) {
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
    } else {
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

function getPlayoffRival() {
  if (!state.playoffs) return null
  const f = state.playoffs.fixtures.find(x => (x.home === state.teamId || x.away === state.teamId) && !x.played)
  return f ? (f.home === state.teamId ? f.away : f.home) : null
}

/* ============ MATCHDAY RESULTS ============ */
function showMatchdayResults(userScore, rivalScore, rivalName) {
  document.getElementById('btn-end-match').style.display = 'none'

  /* Refresh league table with updated standings before showing results */
  renderLeague()

  /* Go directly to league results view */
  document.getElementById('view-match').classList.remove('active')
  document.getElementById('view-league').classList.add('active')
  document.getElementById('bottom-nav').style.display = ''
  document.getElementById('app-header').style.display = ''
  document.getElementById('btn-header-menu').style.display = ''

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
      state.currentMatchday++
      simularJornadaEnTodasLasLigas(state.currentMatchday)
      procesarEconomiaSemanal()
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
      const parentIdAI = getParentTeamId(state.teamId)
      if (parentIdAI && Math.random() < 0.15) {
        const candidates = state.players.filter(p => p.skill >= 65 && !p.injury)
        if (candidates.length > 0) {
          const promoted = pickRandom(candidates)
          const idx = state.players.indexOf(promoted)
          if (idx >= 0) {
            state.players.splice(idx, 1)
            addNotification('general', `⬆ ${promoted.name} sube al primer equipo`, `El primer equipo recluta a ${promoted.name} desde el filial`)
          }
        }
      }
      document.getElementById('league-results-wrap').classList.add('hidden')
      renderLeague()
      hideLoading()
    }, 300)
  }
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
  const tab = state.marketTab
  document.querySelectorAll('#view-market .sub-tab').forEach(b => b.classList.toggle('active', b.dataset.marketTab === tab))
  updateTeamStatusBar()
  renderMarketContent()
}

function renderMarketContent() {
  const container = document.getElementById('market-content')
  const search = (document.getElementById('market-search').value || '').toLowerCase()

  const allCpuPlayers = []
  for (const t of state.leagueTeams) {
    for (const p of t.players) {
      allCpuPlayers.push({ ...p, teamName: t.name, teamId: t.teamId })
    }
  }

  if (state.marketTab === 'buy') {
    const available = allCpuPlayers.filter(p => !p.transferListed).sort((a, b) => b.value - a.value)
    const filtered = search ? available.filter(p => p.name.toLowerCase().includes(search)) : available.slice(0, 20)

    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">No hay jugadores disponibles</div>'
      return
    }

    container.innerHTML = filtered.map(p => {
      const pos = POSITIONS[p.position]
      const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= p.value
      const avatarStyle = `background-image:url(${p.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      return `
        <div class="market-card" data-player-id="${p.id}" data-team-id="${p.teamId}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${p.name}</div>
            <div class="market-card-detail">${pos.label} · ${p.teamName} · HAB ${p.skill}</div>
          </div>
          <div class="market-card-right">
            <div class="market-card-value">${formatMoney(p.value)}</div>
            <button class="market-card-btn ${canBuy ? 'buy' : 'disabled'}">${canBuy ? 'COMPRAR' : (state.players.length >= MAX_SQUAD ? 'PLANTILLA LLENA' : 'SIN FONDOS')}</button>
          </div>
        </div>
      `
    }).join('')

    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const pid = card.dataset.playerId
        const tid = card.dataset.teamId
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (team) {
          const player = team.players.find(p => p.id === pid)
          if (player) openPlayerModal({ ...player, teamName: team.name }, 'cpu')
        }
      }
      card.querySelector('.market-card-btn.buy')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const pid = card.dataset.playerId
        const tid = card.dataset.teamId
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (!team) return
        const player = team.players.find(p => p.id === pid)
        if (!player || state.players.length >= MAX_SQUAD || state.finances.balance < player.value) return
        buyPlayer(player, team)
      })
    })
  } else if (state.marketTab === 'sell') {
    const listed = state.players.filter(p => p.transferListed)
    if (listed.length === 0) {
      container.innerHTML = '<div class="market-empty">No tienes jugadores en venta.<br>Ve a Club > Plantilla y abre un jugador para listarlo.</div>'
      return
    }
    const filtered = search ? listed.filter(p => p.name.toLowerCase().includes(search)) : listed
    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">Ningún jugador coincide con la búsqueda</div>'
      return
    }
    container.innerHTML = filtered.map(p => {
      const pos = POSITIONS[p.position]
      const avatarStyle = `background-image:url(${p.avatar || NOPHOTO});background-size:cover;background-position:center;background-color:var(--bg-card)`
      return `
        <div class="market-card" data-player-id="${p.id}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${p.name}</div>
            <div class="market-card-detail">${pos.label} · Precio: ${formatMoney(p.transferPrice)}</div>
          </div>
          <div class="market-card-right">
            <button class="market-card-btn sell">RETIRAR</button>
          </div>
        </div>
      `
    }).join('')
    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const pid = card.dataset.playerId
        const player = state.players.find(p => p.id === pid)
      if (player) openPlayerDetail(player)
      }
      card.querySelector('.market-card-btn.sell')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const pid = card.dataset.playerId
        const player = state.players.find(p => p.id === pid)
        if (!player) return
        player.transferListed = false
        player.transferPrice = 0
        renderMarketContent()
      })
    })
  } else if (state.marketTab === 'staff') {
    const allStaff = []
    for (const t of state.leagueTeams) {
      for (const s of (t.staff || [])) {
        allStaff.push({ ...s, teamName: t.name, teamId: t.teamId })
      }
    }
    /* Add unemployed staff available for hire */
    const roles = ['headCoach', 'assistantCoach', 'delegate', 'goalkeeperCoach', 'fitnessCoach']
    const countryIds = Object.keys(NATIONALITIES)
    for (let i = 0; i < 12; i++) {
      const cid = pickRandom(countryIds)
      const role = pickRandom(roles)
      const m = generateStaffMember('— Sin equipo —', cid, role)
      allStaff.push({ ...m, teamName: '— Sin equipo —', teamId: null })
    }
    const roleLabels = { headCoach: 'Entrenador', assistantCoach: '2º Entrenador', delegate: 'Delegado', goalkeeperCoach: 'Entrenador de porteros', fitnessCoach: 'Preparador físico' }
    const visibleStaff = allStaff.filter(s => !(s.role === 'headCoach' && s.teamId !== null))
    const filtered = search ? visibleStaff.filter(s => s.name.toLowerCase().includes(search)) : visibleStaff
    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">No hay personal técnico disponible</div>'
      return
    }
    container.innerHTML = filtered.map(s => {
      const avatarStyle = s.avatar ? `background-image:url(${s.avatar});background-size:cover;background-position:center;background-color:var(--bg-surface)` : `background:var(--bg-surface)`
      const alreadyHas = state.staff.some(x => x.role === s.role)
      const canHire = state.finances.balance >= 2000 && !alreadyHas
      return `
        <div class="market-card" data-staff-name="${s.name}" data-team-id="${s.teamId}">
          <div class="staff-card-avatar" style="width:36px;height:36px;${avatarStyle}">${s.avatar ? '' : getInitials(s.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${s.name}</div>
            <div class="market-card-detail">${roleLabels[s.role] || s.role} · ${s.teamName}</div>
          </div>
          <div class="market-card-right">
            <div class="market-card-value">2.000 €</div>
            <button class="market-card-btn ${canHire ? 'hire' : 'disabled'}">${canHire ? 'CONTRATAR' : (alreadyHas ? 'YA TIENES UNO' : 'SIN FONDOS')}</button>
          </div>
        </div>
      `
    }).join('')
    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const name = card.dataset.staffName
        const tid = card.dataset.teamId
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (team) {
          const staff = team.staff.find(s => s.name === name)

        }
      }
      card.querySelector('.market-card-btn.hire')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const name = card.dataset.staffName
        const tid = card.dataset.teamId
        const team = tid ? state.leagueTeams.find(t => t.teamId === tid) : null
        const staffMember = team ? team.staff.find(s => s.name === name) : allStaff.find(s => s.name === name && s.teamId === null)
        if (!staffMember) return
        hireStaff(staffMember, team)
      })
    })
  }
}

function buyPlayer(player, team) {
  if (state.players.length >= MAX_SQUAD) return
  const delegateCount = state.staff.filter(s => s.role === 'delegate').length
  const discount = Math.max(0, 1 - delegateCount * 0.1)
  const finalValue = Math.round(player.value * discount)
  if (state.finances.balance < finalValue) return
  state.finances.balance -= finalValue
  state.finances.history.push({ reason: `Compra: ${player.name}${discount < 1 ? ' (-' + Math.round((1 - discount) * 100) + '% dto)' : ''}`, amount: -finalValue })
  const idx = team.players.indexOf(player)
  if (idx >= 0) team.players.splice(idx, 1)
  const newPlayer = { ...player, id: `user-${Date.now()}`, value: calcValue(player.skill), wage: calcWage(player.skill), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']) }
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

/* ============ PLAYER MODAL ============ */
function openPlayerModal(player, mode) {
  const pos = POSITIONS[player.position]
  const avatarEl = document.getElementById('modal-avatar')
  avatarEl.textContent = player.avatar ? '' : getInitials(player.name)
  avatarEl.style.background = player.avatar ? `url(${player.avatar}) center/cover, url(${NOPHOTO}) center/cover, ${pos.color}` : pos.color
  /* Avatar glow with position color */
  const wrap = document.getElementById('modal-avatar-wrap')
  wrap.style.setProperty('--glow-color', pos.color)
  wrap.style.setProperty('--glow-color-op', pos.color.replace(')', ', 0.3)').replace('var(--color-', '--color-'))
  /* Handle var() colors for glow */
  if (pos.color.startsWith('var')) {
    wrap.style.borderColor = 'transparent'
  }
  document.getElementById('modal-name').textContent = player.name
  document.getElementById('modal-nationality').textContent = `${player.nationality || '🇪🇸 España'}`
  document.getElementById('modal-meta').textContent = `${player.age || '-'} años · ${player.foot || 'DER'}`
  const posBadge = document.getElementById('modal-position')
  posBadge.textContent = pos.label
  posBadge.style.background = pos.color
  document.getElementById('modal-skill').textContent = player.skill
  document.getElementById('modal-skill-fill').style.width = player.skill + '%'
  document.getElementById('modal-energy').textContent = player.energy
  document.getElementById('modal-energy-fill').style.width = player.energy + '%'
  document.getElementById('modal-value').textContent = formatMoney(player.value)
  document.getElementById('modal-wage').textContent = formatMoney(player.wage || calcWage(player.skill))
  document.getElementById('modal-pj').textContent = player.matches || 0
  document.getElementById('modal-g').textContent = player.goals || 0
  document.getElementById('modal-a').textContent = player.assists || 0
  document.getElementById('modal-ta').textContent = player.yellowCards || 0
  document.getElementById('modal-tr').textContent = player.redCards || 0
  document.getElementById('modal-mvp').textContent = player.mvp || 0

  /* Injury */
  const injuryEl = document.getElementById('modal-injury')
  if (player.injury) {
    injuryEl.style.display = 'block'
    injuryEl.innerHTML = `🩹 Lesión: ${player.injury.description} (${player.injury.remaining} jornada${player.injury.remaining > 1 ? 's' : ''} restante${player.injury.remaining > 1 ? 's' : ''})`
  } else {
    injuryEl.style.display = 'none'
  }

  /* Match history */
  const historyEl = document.getElementById('modal-history')
  if (historyEl) {
    const hist = (player.matchHistory || []).slice(-8).reverse()
    historyEl.innerHTML = hist.length === 0
      ? '<div class="hist-empty">Sin partidos jugados</div>'
      : hist.map(m => {
          const acts = []
          if (m.goals > 0) acts.push(`⚽${m.goals}`)
          if (m.yellow) acts.push('🟨')
          if (m.red) acts.push('🟥')
          let rClass = 'rating-mid'
          if (m.rating >= 8) rClass = 'rating-high'
          else if (m.rating <= 4) rClass = 'rating-low'
          return `<div class="hist-item">
            <span class="hist-matchday">J${m.matchday}</span>
            <span class="hist-rival">vs ${m.rival}</span>
            <span class="hist-minutes">${m.minutes}'</span>
            <span class="hist-rating ${rClass}">${'★'.repeat(Math.max(1, Math.round(m.rating / 2)))} ${m.rating}</span>
            <span class="hist-actions">${acts.join(' ') || ''}</span>
          </div>`
        }).join('')
  }

  const actions = document.getElementById('modal-market-actions')
  actions.innerHTML = ''

  if (mode === 'own') {
    /* LT button */
    if (player.transferListed) {
      actions.innerHTML += `
        <div class="market-input-group">
          <span class="market-input-label">Precio de venta actual</span>
          <div style="text-align:center;font-weight:700;font-size:16px;color:var(--text)">${formatMoney(player.transferPrice)}</div>
        </div>
        <button class="btn-secondary" id="modal-retirar-lt">RETIRAR DE TRANSFERIBLES</button>
      `
    } else {
      actions.innerHTML += `
        <div class="market-input-group">
          <label class="market-input-label">Precio para lista de transferibles</label>
          <input class="market-price-input" id="modal-lt-price" type="number" value="${player.value}" min="1">
        </div>
        <button class="btn-primary" id="modal-listar-lt" style="background:#EF4444">LISTA TRANSFERIBLES</button>
      `
    }
    /* LC button */
    if (player.loanListed) {
      actions.innerHTML += `<button class="btn-secondary" id="modal-retirar-lc">RETIRAR CEDIBLES</button>`
    } else {
      actions.innerHTML += `<button class="btn-primary" id="modal-listar-lc" style="background:var(--accent)">LISTA CEDIBLES</button>`
    }

    /* LT events */
    const retirarLT = document.getElementById('modal-retirar-lt')
    if (retirarLT) retirarLT.onclick = () => { player.transferListed = false; player.transferPrice = 0; closeModal(); renderMarketContent(); renderSquad(state.players) }
    const listarLT = document.getElementById('modal-listar-lt')
    if (listarLT) listarLT.onclick = () => {
      const price = parseInt(document.getElementById('modal-lt-price').value)
      if (!price || price < 1) return
      player.transferListed = true; player.transferPrice = price; closeModal(); renderMarketContent(); renderSquad(state.players)
    }
    /* LC events */
    const retirarLC = document.getElementById('modal-retirar-lc')
    if (retirarLC) retirarLC.onclick = () => { player.loanListed = false; closeModal(); renderSquad(state.players) }
    const listarLC = document.getElementById('modal-listar-lc')
    if (listarLC) listarLC.onclick = () => { player.loanListed = true; closeModal(); renderSquad(state.players) }

    /* Filial buttons */
    const filialId = getFilialId(state.teamId)
    if (filialId) {
      actions.innerHTML += `<button class="btn-secondary" id="modal-bajar-filial" style="margin-top:4px">⬇ BAJAR AL FILIAL</button>`
    }

    /* Filial events */
    const btnBajar = document.getElementById('modal-bajar-filial')
    if (btnBajar) btnBajar.onclick = () => {
      if (state.filialSquad.length >= MAX_SQUAD) return
      const idx = state.players.indexOf(player)
      if (idx < 0) return
      state.players.splice(idx, 1)
      state.filialSquad.push({ ...player, id: `filial-down-${Date.now()}`, energy: 100, goals: 0, matches: 0 })
      const filialName = getTeamName(filialId)
      addNotification('transfer', `⬇ ${player.name} baja al filial`, `Traspasado a ${filialName}`)
      closeModal()
      renderSquad(state.players)
    }

  } else if (mode === 'cpu') {
    const playerFilialParent = player._teamId ? getParentTeamId(player._teamId) : null
    const isFilialPlayer = playerFilialParent === state.teamId

    if (isFilialPlayer && state.players.length < MAX_SQUAD) {
      actions.innerHTML = `<button class="btn-primary" id="modal-subir-filial-cpu" style="background:#10B981">⬆ SUBIR AL PRIMER EQUIPO</button>`
      document.getElementById('modal-subir-filial-cpu').onclick = () => {
      const idx = state.filialSquad.findIndex(p => p.id === player.id)
      if (idx >= 0) state.filialSquad.splice(idx, 1)
      state.players.push({ ...player, id: `promo-${Date.now()}`, value: calcValue(player.skill || 70), wage: calcWage(player.skill || 70), energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null })
        addNotification('transfer', `⬆ ${player.name} sube al primer equipo`, `Promocionado desde el filial`)
        closeModal()
        renderSquad(state.players)
      }
    } else {
      const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= player.value
      actions.innerHTML = `<button class="btn-primary ${canBuy ? '' : 'disabled'}" id="modal-comprar" ${!canBuy ? 'disabled' : ''}>${canBuy ? `COMPRAR · ${formatMoney(player.value)}` : (state.players.length >= MAX_SQUAD ? 'PLANTILLA LLENA' : 'SIN FONDOS')}</button>`
      if (canBuy) {
        document.getElementById('modal-comprar').onclick = () => {
          const team = state.leagueTeams.find(t => t.teamId === player.teamId || t.players?.includes(player))
          if (team) { buyPlayer(player, team); closeModal() }
        }
      }
    }
  }

  document.getElementById('player-modal').classList.add('open')
}

function closeModal() {
  document.getElementById('player-modal').classList.remove('open')

}

/* ============ AGE & PROGRESSION ============ */
function envejecerYProgresar() {
  const retirados = []
  state.players.forEach(p => {
    p.age = (p.age || 22) + 1
    const matches = p.matches || 0
    const jugoMucho = matches >= 10
    const jugoPoco = matches < 5

    if (p.age <= 29) {
      p.skill = Math.min(99, p.skill + (jugoMucho ? 2 : jugoPoco ? 0.5 : 1))
    } else if (p.age >= 35) {
      p.skill = Math.max(40, p.skill - (jugoMucho ? 2 : 3))
      if (jugoPoco && Math.random() < 0.5) retirados.push(p)
    } else if (p.age >= 33) {
      p.skill = Math.max(45, p.skill - (jugoMucho ? 1 : 2))
    } else {
      p.skill = Math.max(50, p.skill - (jugoMucho ? 0 : 1))
    }
  })
  /* Goalkeeper coach: chance to permanently improve keepers based on matches played */
  const gkCoachCount = state.staff.filter(s => s.role === 'goalkeeperCoach').length
  if (gkCoachCount > 0) {
    state.players.filter(p => p.position === 'portero').forEach(p => {
      const baseChance = 0.25 * gkCoachCount
      const matchBonus = Math.min(0.5, (p.matches || 0) * 0.02)
      if (Math.random() < baseChance + matchBonus) {
        p.skill = Math.min(99, p.skill + 2)
        addNotification('general', `📈 ${p.name} mejora`, `+2 valoración gracias al Entrenador de Porteros (${p.skill})`)
      }
    })
  }
  retirados.forEach(p => {
    const idx = state.players.indexOf(p)
    if (idx >= 0) state.players.splice(idx, 1)
    addNotification('general', `🚑 Retirada: ${p.name}`, `${p.age} años · Se retira tras ${p.matches} partidos esta temporada`)
  })
}



function renderFinances() {
  document.getElementById('finance-balance').textContent = formatMoney(state.finances.balance)

  /* Income / expense totals */
  const ingresos = state.finances.history.filter(i => i.amount > 0).reduce((s, i) => s + i.amount, 0)
  const gastos = state.finances.history.filter(i => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0)
  const wageTotal = state.players.reduce((s, p) => s + (p.wage || calcWage(p.skill || 70)), 0)
  const budget = getDivisionBaseBudget(state.leagueId)
  const staffMult = Math.max(0.3, budget / 50000)
  const semanal = -(wageTotal + Math.round((state.staff ? state.staff.length : 1) * 400 * staffMult))
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
      if (state.clubSubTab === 'squad') {
        document.getElementById('club-squad-content').classList.remove('hidden')
        renderSquad(state.players)
      } else {
        document.getElementById('club-tactics-content').classList.remove('hidden')
        renderTactics(state.tactic)
      }
    }
  })

  /* Market sub-tabs */
  document.querySelectorAll('#view-market .sub-tab').forEach(btn => {
    btn.onclick = () => {
      state.marketTab = btn.dataset.marketTab
      document.querySelectorAll('#view-market .sub-tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderMarketContent()
    }
  })

  /* Market search */
  document.getElementById('market-search').oninput = () => renderMarketContent()

  /* League selector */
  document.getElementById('league-selector').onchange = (e) => {
    renderLeague()
  }

  /* Modal close */
  document.getElementById('modal-close').onclick = closeModal
  document.getElementById('player-modal').onclick = (e) => { if (e.target === e.currentTarget) closeModal() }
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

function getDivisionBaseBudget(leagueId) {
  if (!leagueId) return 5000
  if (leagueId === 'lnfs1') return 50000
  if (leagueId === 'lnfs2') return 30000
  if (leagueId === 'lpl') return 25000
  if (leagueId === 'lpl2') return 12000
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
  return 0.8
}

function getDivisionMatchReward(leagueId) {
  if (leagueId === 'lnfs1') return { win: 2000, draw: 800, loss: -300 }
  if (leagueId === 'lnfs2') return { win: 1200, draw: 500, loss: -200 }
  if (leagueId === 'lpl') return { win: 1000, draw: 400, loss: -150 }
  if (leagueId === 'lpl2') return { win: 500, draw: 200, loss: -80 }
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
  const league = country ? country.leagues.find(l => l.id === selectedLeague.id) : null
  state.coach = coach
  state.team = selectedTeam.name
  state.teamId = selectedTeam.id
  state.teamLogo = selectedTeam.logo || ''
  const noface = 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
  const countryId = selectedCountry.id
  const natLabel = countryData ? (countryData.country.flag + ' ' + countryData.country.name) : '🇵🇱 Polonia'
  state.staff = [
    { name: coach, nationality: natLabel, role: 'headCoach', avatar: noface, career: [{ team: selectedTeam.name, from: new Date().toLocaleDateString('es-ES'), to: 'Actualidad', matches: 0, won: 0, drawn: 0, lost: 0 }] },
  ]
  state.countryId = selectedCountry.id
  state.leagueId = selectedLeague.id
  state.gameId = Date.now()
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.tactic = { formation: '4-3-3', gamePlan: 'tikitaka' }
  state.tacticsSlots = []
  state.benchIds = []
  state.reserveIds = []
  state.convocatoriaValidada = false
  /* Clear old tactics save */
  try { const raw = storageSafe('get', TACTICS_KEY); const all = raw ? JSON.parse(raw) : {}; delete all[state.gameId]; storageSafe('set', TACTICS_KEY, JSON.stringify(all)) } catch {}
  const baseBudget = getDivisionBaseBudget(state.leagueId)
  const countryMult = getCountryBudgetMult(state.countryId)
  const ratingMult = (selectedTeam.rating || 50) / 50
  const startingBudget = Math.round(baseBudget * countryMult * ratingMult)
  state.finances = { balance: startingBudget, history: [] }
  state.inbox = []

  /* Assign user squad based on selected team */
  const userSquad = getRealSquad(state.teamId) || generateCpuSquad(state.teamId, state.countryId, selectedTeam.rating)
  const teamCap = selectedTeam.rating || 99
  state.players = userSquad.map(p => ({
    ...p, skill: Math.min(teamCap, p.skill), value: p.value || calcValue(p.skill), wage: p.wage || calcWage(p.skill),
    enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null,
  }))
  state.players.forEach(p => { p.energy = 100 })

  /* Initialize filial squad if the team has one */
  const myFilialId = getFilialId(state.teamId)
  if (myFilialId) {
    state.filialSquad = (getRealSquad(myFilialId) || []).map(p => {
      const bp = getBaseDato(myFilialId)
      const fCap = bp ? bp.rating : 99
      return { ...p, skill: Math.min(fCap, p.skill), id: `filial-${p.id}`, value: calcValue(p.skill), wage: calcWage(p.skill), energy: 100, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matches: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false }
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
      ? base.map(p => ({ ...p, skill: Math.min(cap, p.skill), value: p.value || calcValue(p.skill), wage: p.wage || calcWage(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null }))
      : generateCpuSquad(t.id, state.countryId, t.rating)
    const defaultStaff = t.staff || generateStaff(t.name, state.countryId)
    state.leagueTeams.push({ teamId: t.id, name: t.name, players: squad, staff: defaultStaff })
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
  for (const cid in window.DB) {
    const data = window.DB[cid]
    if (!data) continue
    for (const l of data.country.leagues || []) {
      const teamIds = l.teams.map(t => t.id)
      if (teamIds.length < 2) continue
      const fx = generateFixtures(teamIds)
      state.allLeagueData[l.id] = {
        fixtures: fx,
        currentMatchday: 0,
        totalMatchdays: Math.max(...fx.map(f => f.matchday))
      }
    }
  }
  /* Simulate matchday 1 for all leagues so tables show results from the start */
  simularJornadaEnTodasLasLigas(1)

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
  state.tactic = data.tactic || { formation: '4-3-3', gamePlan: 'tikitaka' }
  state.finances = data.finances || { balance: 5000, history: [] }
  state.leagueTeams = data.leagueTeams || []
  state.currentMatchday = data.currentMatchday || 1
  state.totalMatchdays = data.totalMatchdays || 0
  state.fixtures = data.fixtures || []
  state.tacticsSlots = data.tacticsSlots || []
  state.benchIds = data.benchIds || []
  state.reserveIds = data.reserveIds || []
  state.staff = data.staff || []
  state.inbox = data.inbox || []
  state.soundEnabled = data.soundEnabled !== false
  state.filialSquad = data.filialSquad || []
  startGame()
}

function startGame() {
  document.getElementById('menu-screen').classList.add('hidden')
  document.getElementById('menu-newgame').classList.add('hidden')
  document.getElementById('game-screen').classList.remove('hidden')
  loadTactics()
  setupNavigation()
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelector('[data-tab="home"]').classList.add('active')
  renderTab('home')
  updateInboxBadge()
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
  document.getElementById('ng-step-countries').classList.remove('hidden')
  document.getElementById('ng-step-teams').classList.add('hidden')

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
        <span>${window.DB[c.id] ? (window.DB[c.id].country.leagues.length + ' ligas') : ''}</span>
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

  loadCountryData(countryId, function(data) {
    if (!data) return

    document.getElementById('ng-step-countries').classList.add('hidden')
    document.getElementById('ng-step-teams').classList.remove('hidden')

    selectedLeague = null
    selectedTeam = null

    const leagues = data.country.leagues || []
    renderLeagueSelector(leagues)

    if (leagues.length > 0) {
      selectedLeague = leagues[0]
      renderTeamList(selectedLeague)
    }

    document.querySelectorAll('.ng-step').forEach((s, i) => {
      s.classList.toggle('done', i === 0)
      s.classList.toggle('active', i === 1)
    })
  })
}

function renderLeagueSelector(leagues) {
  const container = document.getElementById('ng-leagues')
  container.innerHTML = leagues.map(l => `
    <div class="ng-league-item${l.id === (selectedLeague && selectedLeague.id) ? ' active' : ''}" data-lid="${l.id}">
      ${l.logo ? `<img src="${l.logo}" alt="">` : ''}
      <span>${l.name}</span>
    </div>
  `).join('')
  const dbData = window.DB[selectedCountry ? selectedCountry.id : state.countryId]
  container.querySelectorAll('.ng-league-item').forEach(el => {
    el.onclick = () => {
      const lid = el.dataset.lid
      selectedLeague = (dbData ? dbData.country.leagues : []).find(l => l.id === lid)
      renderTeamList(selectedLeague)
      container.querySelectorAll('.ng-league-item').forEach(x => x.classList.toggle('active', x.dataset.lid === lid))
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
  const realSquad = rawSquad.map(p => ({ ...p, skill: Math.min(rating || 99, p.skill), value: p.value || calcValue(p.skill), wage: p.wage || calcWage(p.skill) }))
  const staff = team.staff || []
  const logo = team.logo || ''
  const coachName = staff.find(s => s.role === 'headCoach')?.name || '—'

  /* Set header title */
  document.getElementById('tp-header-title').textContent = team.name

  /* Stats panel — same as Club view */
  const totalVal = realSquad.reduce((s, p) => s + (p.value || 0), 0)
  const displayPower = getTop11Average(realSquad)
  const reputation = displayPower <= 20 ? 1 : displayPower <= 40 ? 2 : displayPower <= 60 ? 3 : displayPower <= 80 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const countryFlag = window.DB[foundCountryId] ? window.DB[foundCountryId].country.flag : ''
  document.getElementById('tp-stats').innerHTML = `
    <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">\u2014</span></div>
    <div class="tp-stat"><span class="tp-stat-label">Reputación</span><span class="tp-stat-stars">${stars}</span></div>
    <div class="tp-stat"><span class="tp-stat-label">País</span><span class="tp-stat-flag">${countryFlag}</span></div>
    <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
    <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
  `

  /* Player rows */
  const ordered = [...realSquad].sort((a, b) => {
    const posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    const posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })
  const listHtml = ordered.map(p => {
    const valShort = formatShort(p.value || 0)
    return `<div class="tp-row">
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''}</span>
        </div>
      </div>
      <span class="tp-cell-pos-badge" style="background:${((POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280')};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <span class="tp-cell-age">${p.age || '-'}</span>
      <span class="tp-cell-market">${valShort}</span>
      <span class="tp-cell-power">${p.skill}</span>
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
  document.getElementById('tp-footer-back').onclick = closePreview
  document.getElementById('tp-footer-choose').onclick = closePreview
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

/* ============ LOAD MENU ============ */
function showLoadMenu() {
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-newgame').classList.add('hidden')
  document.getElementById('menu-load').classList.remove('hidden')
  const slots = window.SaveSystem.getEmptySlots()
  const content = document.getElementById('load-content')
  content.innerHTML = slots.map((save, idx) => {
    if (!save) {
      return `<div class="ls-slot ls-empty">
        <div class="ls-empty-icon">📂</div>
        <div class="ls-empty-text">Slot disponible</div>
        <button class="btn-primary ls-empty-btn" data-slot="${idx}">NUEVA PARTIDA</button>
      </div>`
    }
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
  content.querySelectorAll('.ls-empty-btn').forEach(btn => {
    btn.onclick = () => { document.getElementById('menu-load').classList.add('hidden'); showNewGameScreen() }
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
  calMonthOffset = 0
  renderCalendar()
}

function renderCalendar() {
  const container = document.getElementById('calendar-content')
  if (!container) return

  /* Current month from offset */
  const baseDate = new Date(2026, 8 + calMonthOffset, 1)
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const monthName = MONTHS_ES[month]
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  /* Build grid */
  let gridHtml = `<div class="cal-header">
    <button class="cal-nav-btn" id="cal-prev">◀</button>
    <span class="cal-month-title">${monthName} ${year}</span>
    <button class="cal-nav-btn" id="cal-next">▶</button>
  </div>
  <div class="cal-grid">`

  DAYS_ES.forEach(d => { gridHtml += `<div class="cal-day-header">${d}</div>` })

  for (let i = 0; i < startOffset; i++) {
    gridHtml += `<div class="cal-day empty"></div>`
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const found = state.fixtures.find(f => {
      if (f.matchday > state.totalMatchdays) return false
      const fd = getSeasonDate(f.matchday)
      return fd.getDate() === day && fd.getMonth() === month && fd.getFullYear() === year
    })
    const matchday = found ? found.matchday : 0
    const hasMatch = matchday >= 1 && matchday <= state.totalMatchdays
    gridHtml += `<div class="cal-day${hasMatch ? ' match-day' : ''}"${hasMatch ? ` data-md="${matchday}"` : ''}>
      <span class="cal-day-num">${day}</span>
      ${hasMatch ? getCalMatchIcon(matchday) : ''}
    </div>`
  }
  gridHtml += `</div>`

  /* Matches this month */
  const monthFixtures = state.fixtures.filter(f => {
    if (f.matchday > state.totalMatchdays) return false
    const fd = getSeasonDate(f.matchday)
    return fd.getMonth() === month && fd.getFullYear() === year
  })

  if (monthFixtures.length > 0) {
    gridHtml += `<div class="cal-match-list">`
    monthFixtures.sort((a, b) => a.matchday - b.matchday).forEach(f => {
      const isUser = f.home === state.teamId || f.away === state.teamId
      if (!isUser) return
      const rivalId = f.home === state.teamId ? f.away : f.home
      const rivalName = getTeamName(rivalId)
      const rivalLogo = getTeamLogo(rivalId)
      const isHome = f.home === state.teamId
      const fd = getSeasonDate(f.matchday)
      const result = f.played ? `${f.homeScore} - ${f.awayScore}` : '—'
      let resultClass = ''
      if (f.played) {
        const userScore = isHome ? f.homeScore : f.awayScore
        const rivalScore = isHome ? f.awayScore : f.homeScore
        if (userScore > rivalScore) resultClass = ' cal-win'
        else if (userScore < rivalScore) resultClass = ' cal-loss'
        else resultClass = ' cal-draw'
      }
      gridHtml += `<div class="cal-match-item">
        <img class="cal-match-logo" src="${rivalLogo || ''}" alt="">
        <div class="cal-match-info">
          <div class="cal-match-rival">J${f.matchday} · ${rivalName}</div>
          <div class="cal-match-meta">${String(fd.getDate()).padStart(2,'0')}/${String(fd.getMonth()+1).padStart(2,'0')} · ${f.horario || ''} ${isHome ? '🏠' : '✈️'}</div>
        </div>
        <div class="cal-match-result${f.played ? ' played' : ''}${resultClass}">${result}</div>
      </div>`
    })
    gridHtml += `</div>`
  } else {
    gridHtml += '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px">Sin partidos este mes</div>'
  }

  gridHtml += `<button class="cal-back-btn" id="cal-back">← Volver</button>`

  container.innerHTML = gridHtml

  /* Events */
  document.getElementById('cal-prev').onclick = () => { calMonthOffset--; renderCalendar() }
  document.getElementById('cal-next').onclick = () => { calMonthOffset++; renderCalendar() }
  document.getElementById('cal-back').onclick = () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
    document.querySelector('[data-tab="home"]').classList.add('active')
    renderTab('home')
  }
  document.querySelectorAll('.cal-day.match-day').forEach(el => {
    el.onclick = () => { document.getElementById('cal-back').click(); /* placeholder */ }
  })
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
  const reputation = displayPower <= 20 ? 1 : displayPower <= 40 ? 2 : displayPower <= 60 ? 3 : displayPower <= 80 ? 4 : 5
  const stars = Array.from({ length: 5 }, (_, i) => `<span class="star${i < reputation ? ' filled' : ''}">★</span>`).join('')
  const totalVal = team.players.reduce((s, p) => s + (p.value || 0), 0)
  let html = `
    <div class="view-header">
      <div class="view-header-left">
        ${logo ? `<img class="team-logo" src="${logo}" style="width:32px;height:32px">` : ''}
        <h2>${team.name}</h2>
      </div>
      <button class="btn-back" id="btn-team-back">← Volver</button>
    </div>
    <div class="tp-stats" style="margin-bottom:12px">
      <div class="tp-stat"><span class="tp-stat-label">Ranking</span><span class="tp-stat-value">${posDisplay}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Reputación</span><span class="tp-stat-stars">${stars}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">País</span><span class="tp-stat-flag">${logo ? '🇵🇱' : ''}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Poder</span><span class="tp-stat-value">${displayPower}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">Valor</span><span class="tp-stat-value">\u20AC${formatShort(totalVal)}</span></div>
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
  /* Player table */
  html += `<div class="tactics-subsection-label">PLANTILLA (${team.players.length})</div>
    <div class="tp-table-header" style="padding:6px 14px">
      <span class="tp-th-name">Nombre</span>
      <span class="tp-th-pos">Pos</span>
      <span class="tp-th-age">Edad</span>
      <span class="tp-th-value">Valor</span>
      <span class="tp-th-power">Pod</span>
    </div>
    <div class="tp-list" style="border:1px solid var(--border);border-radius:8px;overflow:hidden">`
  const orderedPlayers = [...team.players].sort((a, b) => {
    const posA = POS_ORDER.indexOf(SIGLA_TO_POS[a.position] || a.position)
    const posB = POS_ORDER.indexOf(SIGLA_TO_POS[b.position] || b.position)
    return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB) || a.number - b.number
  })
  orderedPlayers.forEach(p => {
    const posColor = (POSITIONS[p.position] || POSITIONS[SIGLA_TO_POS[p.position]])?.color || '#6B7280'
    const valShort = formatShort(p.value || 0)
    html += `<div class="tp-row" data-player-id="${p.id}">
      <div class="tp-cell">
        <img class="tp-cell-img" src="${p.avatar || NOPHOTO}" alt="" onerror="this.src='${NOPHOTO}'">
        <div class="tp-cell-info">
          <span class="tp-cell-name">${p.name}</span>
          <span class="tp-cell-value">${p.nationality || ''}</span>
        </div>
      </div>
      <span class="tp-cell-pos-badge" style="background:${posColor};color:#fff">${POS_ABBR[p.position] || p.position}</span>
      <span class="tp-cell-age">${p.age || '-'}</span>
      <span class="tp-cell-market">${valShort}</span>
      <span class="tp-cell-power">${p.skill}</span>
    </div>`
  })
  html += '</div><button class="btn-secondary" id="btn-team-back-2" style="margin-top:12px">← Volver</button>'
  document.getElementById('team-info-content').innerHTML = html
  document.getElementById('btn-team-back').onclick = goBackFromTeam
  document.getElementById('btn-team-back-2').onclick = goBackFromTeam
  document.querySelectorAll('#team-info-content .tp-row').forEach(row => {
    row.onclick = () => {
      const pid = row.dataset.playerId
      const player = team.players.find(p => p.id === pid)
      if (player) openPlayerDetail(player)
    }
  })
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
          return `<div class="dropdown-item family-link" data-fid="${f.id}">
            <span class="family-dot"></span>
            <span class="family-item-name">${f.name}</span>
            ${isFilial ? '<span class="family-badge">Filial</span>' : ''}
            <span class="family-league-name">${f.leagueName}</span>
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

function updateInboxBadge() {
  const badge = document.getElementById('inbox-badge')
  if (!badge) return
  const unread = state.inbox ? state.inbox.filter(n => !n.read).length : 0
  badge.textContent = unread
  badge.style.display = unread > 0 ? 'flex' : 'none'
}

function renderInbox() {
  const list = document.getElementById('inbox-list')
  if (!list) return
  if (!state.inbox || state.inbox.length === 0) {
    list.innerHTML = '<div class="inbox-empty">📭 No hay notificaciones</div>'
    return
  }
  const senderLabels = {
    match: { label: 'Resultado', icon: '⚽' },
    injury: { label: 'Servicio Médico', icon: '🩹' },
    transfer: { label: 'Mercado', icon: '💰' },
    general: { label: 'Notificación', icon: '📌' },
  }
  list.innerHTML = state.inbox.map(n => {
    const t = senderLabels[n.type] || senderLabels.general
    const date = new Date(n.createdAt)
    const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    const timeStr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    return `<div class="inbox-item${n.read ? '' : ' unread'}" data-inbox-id="${n.id}">
      <div class="inbox-avatar ${n.type}">${t.icon}</div>
      <div class="inbox-body">
        <div class="inbox-row1">
          <span class="inbox-sender">${t.label}</span>
          <span class="inbox-date">${dateStr} ${timeStr}</span>
        </div>
        <div class="inbox-subject">${n.title}</div>
        ${n.body ? '<div class="inbox-preview">' + n.body + '</div>' : ''}
      </div>
    </div>`
  }).join('')
  list.querySelectorAll('.inbox-item').forEach(el => {
    el.onclick = () => {
      const id = parseFloat(el.dataset.inboxId)
      const n = state.inbox.find(x => x.id === id)
      if (!n) return
      n.read = true
      updateInboxBadge()
      showInboxDetail(n)
    }
  })
}

function showInboxDetail(n) {
  document.getElementById('inbox-list').style.display = 'none'
  const detail = document.getElementById('inbox-detail')
  detail.style.display = 'flex'
  const senderLabels = {
    match: { label: 'Resultado', icon: '⚽' },
    injury: { label: 'Servicio Médico', icon: '🩹' },
    transfer: { label: 'Mercado', icon: '💰' },
    general: { label: 'Notificación', icon: '📌' },
  }
  const t = senderLabels[n.type] || senderLabels.general
  const date = new Date(n.createdAt)
  const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
  const estado = n.read ? '✅ Leído' : '📬 No leído'
  document.getElementById('inbox-detail-body').innerHTML = `
    <div class="inbox-detail-type">
      <div class="inbox-detail-type-icon ${n.type}">${t.icon}</div>
      <span class="inbox-detail-type-label">${t.label}</span>
    </div>
    <div class="inbox-detail-title">${n.title}</div>
    <div class="inbox-detail-meta">Jornada ${n.matchday} · ${dateStr} · ${timeStr} · ${estado}</div>
    <div class="inbox-detail-text">${n.body || 'Sin contenido adicional'}</div>
  `
}

function hideInboxDetail() {
  document.getElementById('inbox-detail').style.display = 'none'
  document.getElementById('inbox-list').style.display = ''
  renderInbox()
}

function showInboxModal() {
  const modal = document.getElementById('inbox-modal')
  if (!modal) return
  hideInboxDetail()
  renderInbox()
  const countEl = document.getElementById('inbox-count')
  if (countEl) countEl.textContent = state.inbox ? state.inbox.length : 0
  modal.classList.add('open')
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
      } else if (action === 'inbox') {
        showInboxModal()
      } else if (action === 'calendar') {
        showCalendar()
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

/* ============ PLAYER DETAIL ============ */
function openPlayerDetail(player) {
  if (!player) return

  document.getElementById('pd-name').textContent = player.name
  document.getElementById('pd-rating').textContent = player.skill

  const photo = document.getElementById('pd-photo')
  if (player.avatar) {
    photo.innerHTML = `<img src="${player.avatar}" onerror="this.src='${NOPHOTO}'">`
  } else {
    photo.innerHTML = `<div class="pd-photo-placeholder">${getInitials(player.name)}</div>`
  }

  const team = selectedTeam || { name: state.team, logo: state.teamLogo }
  document.getElementById('pd-team-logo').src = team.logo || NOPHOTO
  document.getElementById('pd-team').textContent = team.name || '\u2014'
  const posLabel = POSITIONS[player.position] ? POSITIONS[player.position].label : player.position
  document.getElementById('pd-position').textContent = posLabel + ' (' + (POS_ABBR[player.position] || player.position) + ')'
  document.getElementById('pd-flag').textContent = (player.nationality || '').split(' ')[0] || ''
  const natName = (player.nationality || '').replace(/^[^\s]+\s/, '') || '\u2014'
  document.getElementById('pd-nationality').textContent = natName
  document.getElementById('pd-foot').textContent = player.foot === 'IZQ' ? 'Izq' : 'Der'
  document.getElementById('pd-height').textContent = player.height ? (player.height / 100).toFixed(2) + 'm' : '\u2014'
  document.getElementById('pd-age').textContent = player.age || '\u2014'
  document.getElementById('pd-value').textContent = '\u20AC ' + formatShort(player.value || calcValue(player.skill))

  /* Adaptability: main position 99%, other positions from data */
  const mainAbbr = POS_ABBR[player.position] || player.position
  const otherPositions = player.otherPositions || []
  const PITCH_POS = {
    /* Línea 1 — Portero */
    POR: [85, 50],

    /* Línea 2 — Defensas */
    LI:  [68, 15],
    DFC: [68, 50],
    LD:  [68, 85],

    /* Línea 3 — Carrileros + Medio defensivo */
    CAI: [52, 15],
    MCD: [52, 50],
    CAD: [52, 85],

    /* Línea 4 — Medios */
    MI:  [38, 20],
    MC:  [38, 50],
    MD:  [38, 80],

    /* Línea 5 — Extremos + Delantero */
    EI:  [20, 15],
    DC:  [15, 50],
    ED:  [20, 85],

    MCO: [30, 50],

    /* Retrocompatibilidad */
    portero: [85, 50],
    lateral_izq: [68, 15], defensa_central: [68, 50], lateral_der: [68, 85],
    carrilero_izq: [52, 15], medio_def: [52, 50], carrilero_der: [52, 85],
    medio_izq: [38, 20], mediocentro: [38, 50], medio_der: [38, 80],
    extremo_izq: [20, 15], delantero: [15, 50], extremo_der: [20, 85],
    medio_ofensivo: [30, 50],
    cierre: [68, 50], ala: [38, 50], pivot: [15, 50],
  }
  const MAIN_PCT = player.mainPct !== undefined ? player.mainPct : 99
  let adaptHtml = `<div class="pd-pos-label">Posici\u00f3n principal</div>
    <div class="pd-pos-row main">
      <span>${posLabel} (${mainAbbr})</span>
      <span>${MAIN_PCT}%</span>
    </div>`
  if (otherPositions.length > 0) {
    adaptHtml += `<div class="pd-pos-label">Otras posiciones</div>`
    for (const alt of otherPositions) {
      const altPos = alt.pos || alt
      const altPct = alt.pct !== undefined ? alt.pct : 1
      const altLabel = POSITIONS[altPos] ? POSITIONS[altPos].label : altPos
      const altAbbr = POS_ABBR[altPos] || altPos
      adaptHtml += `<div class="pd-pos-row">
        <span>${altLabel} (${altAbbr})</span>
        <span>${altPct}%</span>
      </div>`
    }
  }
  document.getElementById('pd-adapt-list').innerHTML = adaptHtml

  /* Pitch badges */
  const pitch = document.getElementById('pd-pitch')
  let pitchHtml = ''
  const mainCoords = PITCH_POS[player.position] || [50, 50]
  pitchHtml += `<span class="pd-pitch-badge main" style="top:${mainCoords[0]}%;left:${mainCoords[1]}%">${mainAbbr}</span>`
  for (const alt of otherPositions) {
    const altPos = alt.pos || alt
    const altCoords = PITCH_POS[altPos] || [50, 50]
    const altAbbr = POS_ABBR[altPos] || altPos
    pitchHtml += `<span class="pd-pitch-badge alt" style="top:${altCoords[0]}%;left:${altCoords[1]}%">${altAbbr}</span>`
  }
  pitch.innerHTML = pitchHtml

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
    if (teams && teams.classList.contains('hidden') === false) {
      teams.classList.add('hidden')
      const countries = el('ng-step-countries')
      if (countries) countries.classList.remove('hidden')
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
    const coachInput = el('ng-coach-input')
    if (!coachInput || !coachInput.value.trim()) {
      if (coachInput) { coachInput.focus(); coachInput.style.borderColor = '#EF4444' }
      return
    }
    coachInput.style.borderColor = ''
    const teams = el('ng-step-teams')
    if (teams && teams.classList.contains('hidden') === false) {
      startNewGame()
    } else if (selectedCountry) {
      showTeamSelectionStep()
    }
  })
  const coachInput = el('ng-coach-input')
  if (coachInput) coachInput.oninput = function() { this.style.borderColor = '' }
  el('btn-tactica') && (el('btn-tactica').onclick = abrirTacticasModal)
  el('inbox-close-btn') && (el('inbox-close-btn').onclick = () => { hideInboxDetail(); const m = el('inbox-modal'); if (m) m.classList.remove('open') })
  el('inbox-detail-back') && (el('inbox-detail-back').onclick = hideInboxDetail)
  el('inbox-modal') && (el('inbox-modal').onclick = (e) => { if (e.target === e.currentTarget) { hideInboxDetail(); e.currentTarget.classList.remove('open') } })
  el('settings-close-btn') && (el('settings-close-btn').onclick = () => { const m = el('settings-modal'); if (m) m.classList.remove('open') })
  el('settings-modal') && (el('settings-modal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open') })
  el('settings-sound-toggle') && (el('settings-sound-toggle').onchange = (e) => {
    state.soundEnabled = e.target.checked
    if (state.soundEnabled) playSound('click')
  })
  el('pd-close') && (el('pd-close').onclick = () => { const m = el('player-detail-modal'); if (m) m.classList.remove('open') })
  el('player-detail-modal') && (el('player-detail-modal').onclick = (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open') })
} catch(e) { console.warn('[INIT] Error:', e) }

showMainMenu()
