export function renderCanvasPalette(escapeHtml) {
  var colors = ["#0f172a", "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#ffffff"];
  var html = "";

  html += '<section class="creative-canvas-palette" aria-label="Color palette">';
  html += '<div class="creative-canvas-panel-title">Color</div>';
  html += '<div class="creative-canvas-colors">';
  colors.forEach(function (color, index) {
    html += '<button type="button" class="creative-canvas-color' + (index === 0 ? " is-active" : "") + '" data-canvas-color="' + escapeHtml(color) + '" style="background:' + escapeHtml(color) + '"></button>';
  });
  html += '</div>';
  html += '<label class="creative-canvas-size">Brush Size <input type="range" min="2" max="36" value="8" data-canvas-size></label>';
  html += '</section>';

  return html;
}
