export function renderCareStatusBar(config, state, escapeHtml) {
  return '<section class="care-status" aria-label="' + escapeHtml(config.statusMeterName) + '">'
    + '<div><span>' + escapeHtml(config.statusMeterName) + '</span><strong>' + escapeHtml(String(Math.round(state.status))) + '%</strong></div>'
    + '<div class="care-status-track"><span style="width:' + Math.round(state.status) + '%"></span></div>'
    + '</section>';
}
