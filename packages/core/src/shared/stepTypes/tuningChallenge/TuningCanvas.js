import { buildWavePoints } from "./waveDrawingUtils.js?v=1.1.192-timed-sequence";

export function renderTuningCanvas(config, state, escapeHtml) {
  var targetPoints = buildWavePoints(config.targetValues, { width: 600, height: 190 });
  var userPoints = buildWavePoints(state.userValues, { width: 600, height: 190 });
  var notice = config.targetType === "wave" ? "" : '<div class="tuning-variation-note">' + escapeHtml(config.targetType) + ' variation uses the wave tuner foundation in this pass.</div>';

  return '<section class="tuning-canvas-panel" aria-label="Tuning visual">'
    + notice
    + '<svg class="tuning-wave" viewBox="0 0 600 190" role="img" aria-label="Target and current tuning patterns">'
    + (config.settings.showGrid ? renderGrid() : "")
    + '<polyline class="tuning-target-wave" points="' + escapeHtml(targetPoints) + '"></polyline>'
    + '<polyline class="tuning-user-wave" points="' + escapeHtml(userPoints) + '"></polyline>'
    + '</svg>'
    + '<div class="tuning-wave-legend"><span><b class="target"></b>Target</span><span><b class="current"></b>Your pattern</span></div>'
    + '</section>';
}

function renderGrid() {
  var html = "";
  var x = 0;
  var y = 0;

  while (x <= 600) {
    html += '<line class="tuning-grid-line" x1="' + x + '" y1="0" x2="' + x + '" y2="190"></line>';
    x = x + 100;
  }

  while (y <= 190) {
    html += '<line class="tuning-grid-line" x1="0" y1="' + y + '" x2="600" y2="' + y + '"></line>';
    y = y + 38;
  }

  return html;
}
