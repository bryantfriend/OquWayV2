export function renderSyncMeter(config, state, escapeHtml) {
  var holdPercent = config.holdSeconds > 0 ? Math.round((state.holdProgress / config.holdSeconds) * 100) : 0;

  return '<section class="tuning-meter" aria-label="Sync meter">'
    + '<div class="tuning-meter-header"><span>Sync</span><strong>' + escapeHtml(String(Math.round(state.sync))) + '%</strong></div>'
    + '<div class="tuning-meter-track"><span style="width:' + Math.round(state.sync) + '%"></span></div>'
    + '<div class="tuning-hold-track"><span style="width:' + holdPercent + '%"></span></div>'
    + '<small>Target ' + escapeHtml(String(config.syncThreshold)) + '% for ' + escapeHtml(String(config.holdSeconds)) + 's</small>'
    + '</section>';
}
