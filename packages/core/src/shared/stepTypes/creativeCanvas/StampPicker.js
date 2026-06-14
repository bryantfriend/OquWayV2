export function renderStampPicker(config, escapeHtml) {
  var html = "";

  if (!config.settings.allowStamps || config.requiredTools.indexOf("stamp") === -1) {
    return "";
  }

  html += '<section class="creative-canvas-stamps" aria-label="Stamp picker">';
  html += '<div class="creative-canvas-panel-title">Stamp Pack</div>';
  html += '<div class="creative-canvas-stamp-grid">';
  config.stamps.forEach(function (stamp, index) {
    html += '<button type="button" class="creative-canvas-stamp' + (index === 0 ? " is-active" : "") + '" data-canvas-stamp="' + escapeHtml(stamp.id) + '" data-canvas-glyph="' + escapeHtml(stamp.glyph) + '">';
    html += '<strong>' + escapeHtml(stamp.glyph) + '</strong><span>' + escapeHtml(stamp.label) + '</span>';
    html += '</button>';
  });
  html += '</div>';
  html += '</section>';

  return html;
}
