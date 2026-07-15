window.DB = window.DB || {}
window.DB.portugal = {
  country: {
    id: 'portugal', name: 'Portugal', flag: '\ud83c\uddf5\ud83c\uddf9',
    leagues: [
      { id: 'l1p', name: 'Liga Portugal Betclic', logo: 'https://cdn.resfu.com/media/img/league_logos/liga-portugal.png?size=120x&lossy=1',
        teams: [
          { id: 'pt1', name: 'Benfica', rating: 84, formation: '4-3-3', gamePlan: 'extremo', logo: 'https://cdn.resfu.com/img_data/equipos/466.png?size=120x&lossy=1' },
          { id: 'pt2', name: 'Porto', rating: 83, formation: '4-3-3', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/1095.png?size=120x&lossy=1' },
          { id: 'pt3', name: 'Sporting CP', rating: 82, formation: '3-4-3', gamePlan: 'extremo', logo: 'https://cdn.resfu.com/img_data/equipos/4098.png?size=120x&lossy=1' },
          { id: 'pt4', name: 'Sporting Braga', rating: 78, formation: '4-2-3-1', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/2386.png?size=120x&lossy=1' },
          { id: 'pt5', name: 'Vit\u00f3ria Guimar\u00e3es', rating: 74, formation: '4-3-3', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/2730.png?size=120x&lossy=1' },
          { id: 'pt6', name: 'Famalic\u00e3o', rating: 72, formation: '4-2-3-1', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/7017.png?size=120x&lossy=1' },
          { id: 'pt7', name: 'Estoril', rating: 71, formation: '4-3-3', gamePlan: 'extremo', logo: 'https://cdn.resfu.com/img_data/equipos/1007.png?size=120x&lossy=1' },
          { id: 'pt8', name: 'Casa Pia AC', rating: 70, formation: '3-4-3', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/7098.png?size=120x&lossy=1' },
          { id: 'pt9', name: 'Rio Ave', rating: 70, formation: '4-2-3-1', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/2163.png?size=120x&lossy=1' },
          { id: 'pt10', name: 'Arouca', rating: 69, formation: '4-3-3', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/4641.png?size=120x&lossy=1' },
          { id: 'pt11', name: 'Gil Vicente', rating: 69, formation: '4-2-3-1', gamePlan: 'extremo', logo: 'https://cdn.resfu.com/img_data/equipos/1223.png?size=120x&lossy=1' },
          { id: 'pt12', name: 'Moreirense', rating: 68, formation: '4-4-2', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/1737.png?size=120x&lossy=1' },
          { id: 'pt13', name: 'Nacional', rating: 67, formation: '4-3-3', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/1766.png?size=120x&lossy=1' },
          { id: 'pt14', name: 'Estrela da Amadora', rating: 66, formation: '4-2-3-1', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/138438.png?size=120x&lossy=1' },
          { id: 'pt15', name: 'CD Santa Clara', rating: 66, formation: '4-3-3', gamePlan: 'extremo', logo: 'https://cdn.resfu.com/img_data/equipos/11311.png?size=120x&lossy=1' },
          { id: 'pt16', name: 'Mar\u00edtimo', rating: 65, formation: '4-4-2', gamePlan: 'pesado', logo: 'https://cdn.resfu.com/img_data/equipos/1653.png?size=120x&lossy=1' },
          { id: 'pt17', name: 'FC Alverca', rating: 64, formation: '4-2-3-1', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/200.png?size=120x&lossy=1' },
          { id: 'pt18', name: 'Acad\u00e9mico Viseu', rating: 63, formation: '4-3-3', gamePlan: 'suave', logo: 'https://cdn.resfu.com/img_data/equipos/7076.png?size=120x&lossy=1' },
        ]
      }
    ]
  },
  realSquads: {},
  baseDatos: [
    { id: 'pt1', nombre: 'Benfica',                division_id: 5, rating: 84 },
    { id: 'pt2', nombre: 'Porto',                   division_id: 5, rating: 83 },
    { id: 'pt3', nombre: 'Sporting CP',             division_id: 5, rating: 82 },
    { id: 'pt4', nombre: 'Sporting Braga',          division_id: 5, rating: 78 },
    { id: 'pt5', nombre: 'Vitória Guimarães',       division_id: 5, rating: 74 },
    { id: 'pt6', nombre: 'Famalicão',               division_id: 5, rating: 72 },
    { id: 'pt7', nombre: 'Estoril',                 division_id: 5, rating: 71 },
    { id: 'pt8', nombre: 'Casa Pia AC',             division_id: 5, rating: 70 },
    { id: 'pt9', nombre: 'Rio Ave',                 division_id: 5, rating: 70 },
    { id: 'pt10', nombre: 'Arouca',                 division_id: 5, rating: 69 },
    { id: 'pt11', nombre: 'Gil Vicente',            division_id: 5, rating: 69 },
    { id: 'pt12', nombre: 'Moreirense',             division_id: 5, rating: 68 },
    { id: 'pt13', nombre: 'Nacional',               division_id: 5, rating: 67 },
    { id: 'pt14', nombre: 'Estrela da Amadora',     division_id: 5, rating: 66 },
    { id: 'pt15', nombre: 'CD Santa Clara',         division_id: 5, rating: 66 },
    { id: 'pt16', nombre: 'Marítimo',               division_id: 5, rating: 65 },
    { id: 'pt17', nombre: 'FC Alverca',             division_id: 5, rating: 64 },
    { id: 'pt18', nombre: 'Académico Viseu',        division_id: 5, rating: 63 },
  ],
}
