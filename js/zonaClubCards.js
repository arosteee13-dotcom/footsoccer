/* ============================================================
   ZONA DEL CLUB — Tarjetas resumen (pestaña General)
   Grid de 3 tarjetas clicables que abren las pantallas
   dedicadas de Entrenamiento, Cantera y Estadio.
   ============================================================ */

function renderZonaClubCards() {
  var zc = getZonaClub()
  if (!zc) return ''

  var html = '<div class="zc-cards">'

  html += zcCardMini(
    ZC_INSTALACIONES_CONFIG.entrenamiento.icono,
    'Instalaciones de Entrenamiento',
    ZC_INSTALACIONES_CONFIG.entrenamiento.descCorta,
    'Nivel ' + (zc.entrenamiento || 1) + '/' + ZC_MAX_LEVEL,
    'openZonaClubView(\'entrenamiento\')'
  )

  html += zcCardMini(
    ZC_INSTALACIONES_CONFIG.cantera.icono,
    'Instalaciones de Cantera',
    ZC_INSTALACIONES_CONFIG.cantera.descCorta,
    'Nivel ' + (zc.cantera || 1) + '/' + ZC_MAX_LEVEL,
    'openZonaClubView(\'cantera\')'
  )

  var cap = getCapacidadEstadio()
  var nombreEst = zc.estadio.nombre || 'Estadio Municipal'
  var metaEst = 'Capacidad ' + cap.toLocaleString('es-ES')
  html += zcCardMini(
    ZC_ICONO_ESTADIO,
    nombreEst,
    'Asistencia media seg\u00fan el precio de la entrada.',
    metaEst,
    'openZonaClubView(\'estadio\')'
  )

  html += '</div>'
  return html
}

function zcCardMini(icono, titulo, descripcion, meta, handlersJson) {
  return '<div class="zc-card-mini" onclick="' + handlersJson + '">' +
    '<div class="zc-card-mini-icon">' + icono + '</div>' +
    '<div class="zc-card-mini-title">' + titulo + '</div>' +
    '<div class="zc-card-mini-desc">' + descripcion + '</div>' +
    '<div class="zc-card-mini-meta">' + meta + '</div>' +
    '<span class="zc-btn zc-btn-ghost zc-card-mini-btn">Ver m\u00e1s</span>' +
  '</div>'
}