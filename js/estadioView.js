/* ============================================================
   ZONA DEL CLUB — Pantalla dedicada del Estadio
   Nombre, capacidad, asistencia estimada e ingresos con
   selector de precio en TIEMPO REAL (oninput) y grid de las
   8 zonas del estadio (preview modal para ampliar).
   ============================================================ */

function renderEstadioScreen() {
  var zc = getZonaClub()
  if (!zc) return ''

  var precio = getPrecioEntrada()
  var cap = getCapacidadEstadio()
  var nombre = zc.estadio.nombre || 'Estadio Municipal'

  var html = ''
  html += zcScreenHead('Estadio', nombre)
  html += zcObraBannerHtml(zc)

  html += '<div class="zc-panel">' +
    '<div class="zc-row zc-row-strong"><span class="zc-row-label">Nombre</span><span class="zc-row-value">' + nombre + '</span></div>' +
    '<div class="zc-row"><span class="zc-row-label">Capacidad total</span><span class="zc-row-value">' + cap.toLocaleString('es-ES') + '</span></div>' +
    '<div class="zc-row"><span class="zc-row-label">Asistencia media estimada</span><span class="zc-row-value" id="zc-asistencia-val">' + getAsistenciaPartido().toLocaleString('es-ES') + ' (' + Math.round(getFactorOcupacion() * 100) + '%)</span></div>' +
    '<div class="zc-row zc-row-strong"><span class="zc-row-label">Ingresos por partido de local</span><span class="zc-income-val" id="zc-ingresos-val">' + formatMoney(getIngresosEstimadosPartido()) + '</span></div>' +
    '<div class="zc-slider-row">' +
      '<span class="zc-muted">Precio de entrada</span>' +
      '<input class="zc-slider" id="zc-precio-slider" type="range" min="' + getPrecioMinClub() + '" max="' + getPrecioMaxClub() + '" step="1" value="' + precio + '" oninput="actualizarPrecioEntrada(this.value)">' +
      '<span class="zc-slider-val" id="zc-precio-val">' + precio + ' \u20ac</span>' +
    '</div>' +
  '</div>'

  html += '<div class="tactics-subsection-label">Zonas del estadio</div>'
  html += '<div class="zc-zones-grid">'
  ZC_ZONAS_BASE.forEach(function(z) {
    var t = ZC_TIPO_ZONA[z.tipo]
    var nivel = zc.estadio.zonas[z.id] || 0
    var maxed = nivel >= ZC_MAX_ZONA_LEVEL
    var capZ = getCapacidadZona(z.id)
    html += '<div class="zc-zone-tile' + (maxed ? ' maxed' : '') + '">' +
      '<div class="zc-zone-name">' + z.nombre + '</div>' +
      '<div class="zc-zone-nivel">Nivel ' + nivel + '</div>' +
      '<div class="zc-zone-seats">' + capZ.toLocaleString('es-ES') + ' asientos</div>' +
      (maxed
        ? '<div class="zc-zone-max">Nivel m\u00e1ximo</div>'
        : '<span class="zc-btn zc-btn-on zc-zone-btn" onclick="renderZonaPreviewModal(\'' + z.id + '\')">Mejorar</span>') +
    '</div>'
  })
  html += '</div>'

  return html
}

/* Actualiza en directo (oninput) precio, asistencia e ingresos sin re-render */
function actualizarPrecioEntrada(valor) {
  var zc = getZonaClub()
  if (!zc) return
  var p = parseInt(valor, 10)
  if (isNaN(p)) p = getPrecioPerfecto()
  p = Math.max(getPrecioMinClub(), Math.min(getPrecioMaxClub(), p))
  zc.estadio.precioEntrada = p

  var precioEl = document.getElementById('zc-precio-val')
  if (precioEl) precioEl.textContent = p + ' \u20ac'

  var asisEl = document.getElementById('zc-asistencia-val')
  if (asisEl) {
    asisEl.textContent = getAsistenciaPartido(p).toLocaleString('es-ES') + ' (' + Math.round(getFactorOcupacion(p) * 100) + '%)'
  }

  var ingEl = document.getElementById('zc-ingresos-val')
  if (ingEl) ingEl.textContent = formatMoney(getIngresosEstimadosPartido(p))
}