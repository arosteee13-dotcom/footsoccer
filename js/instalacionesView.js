/* ============================================================
   ZONA DEL CLUB — Pantallas dedicadas de instalaciones
   (Entrenamiento y Cantera). Muestra nivel, beneficios del
   siguiente nivel y el botón [ Mejorar Nivel ] con coste y
   duración. Regla de 1 obra a la vez a nivel de club.
   ============================================================ */

function renderInstalacionesScreen(clave) {
  var zc = getZonaClub()
  var cfg = ZC_INSTALACIONES_CONFIG[clave]
  if (!zc || !cfg) return ''

  var nivel = zc[clave] || 1
  var coste = getCosteMejoraInstalacion(clave)
  var semanas = getSemanasMejoraInstalacion(clave)
  var nivelNuevo = Math.min(ZC_MAX_LEVEL, nivel + 1)
  var nivelMax = nivel >= ZC_MAX_LEVEL

  var beneficioActual = ''
  var beneficioSiguiente = ''
  if (clave === 'entrenamiento') {
    beneficioActual = 'Jugadores \u2264 23 a\u00f1os reciben hasta +' + getBonusEntrenamiento(nivel) + ' en su progresi\u00f3n de fin de temporada.'
    beneficioSiguiente = 'Subir\u00e1 a +' + getBonusEntrenamiento(nivelNuevo) + ' puntos de progresi\u00f3n.'
  } else {
    beneficioActual = 'Los canteranos del Sub-18 se generan con +' + getBonusCantera(nivel) + ' puntos de media y potencial.'
    beneficioSiguiente = 'Subir\u00e1 a +' + getBonusCantera(nivelNuevo) + ' puntos en la generaci\u00f3n del Sub-18.'
  }

  var html = ''
  html += zcScreenHead(cfg.nombre, cfg.efecto)
  html += zcObraBannerHtml(zc)

  html += '<div class="zc-panel">' +
    '<div class="zc-panel-nivel">' +
      '<div class="zc-inst-level">Nivel ' + nivel + '/' + ZC_MAX_LEVEL + '</div>' +
    '</div>' +
    '<div class="zc-panel-fila"><span>Beneficio actual</span><b>' + beneficioActual + '</b></div>' +
    (nivelMax
      ? '<div class="zc-panel-fila"><span>Beneficio m\u00e1ximo alcanzado</span><b>\u2713</b></div>'
      : '<div class="zc-panel-fila zc-panel-fila-add"><span>Pr\u00f3ximo nivel (' + nivelNuevo + '/' + ZC_MAX_LEVEL + ')</span><b>' + beneficioSiguiente + '</b></div>') +
  '</div>'

  /* Botón de mejora */
  var btn
  if (nivelMax) {
    btn = '<span class="zc-btn zc-btn-off zc-btn-block">Nivel m\u00e1ximo</span>'
  } else if (zc.obraEnCurso) {
    btn = '<span class="zc-btn zc-btn-off zc-btn-block" title="' + getMensajeObraEnCurso() + '">Mejorar Nivel</span>' +
      '<div class="zc-preview-lock">' + getMensajeObraEnCurso() + '</div>'
  } else if (!state.finances || state.finances.balance < coste) {
    btn = '<span class="zc-btn zc-btn-off zc-btn-block">Mejorar Nivel</span>' +
      '<div class="zc-preview-lock">Presupuesto insuficiente: te faltan ' + formatMoney(coste - (state.finances ? state.finances.balance : 0)) + '</div>'
  } else {
    btn = '<span class="zc-btn zc-btn-on zc-btn-block" onclick="iniciarObra(\'instalacion\',\'' + clave + '\')">Mejorar Nivel \u00b7 ' + formatMoney(coste) + ' \u00b7 ' + semanas + ' sem</span>'
  }

  html += '<div class="zc-mejorar-box">' +
    '<div class="zc-mejorar-title">Mejora al siguiente nivel</div>' +
    (nivelMax
      ? '<div class="zc-mejorar-coste">Ya tienes las instalaciones al m\u00e1ximo nivel.</div>'
      : '<div class="zc-mejorar-coste"><b>' + formatMoney(coste) + '</b> \u00b7 ' + semanas + ' semana' + (semanas === 1 ? '' : 's') + ' de obras</div>') +
    btn +
  '</div>'

  return html
}