export function renderFallingPlayArea(config, state, escapeHtml) {
  var html = '<section class="falling-play-area" data-falling-stage aria-label="Falling target play area">';

  state.activeTargets.forEach(function (target) {
    html += renderFallingTarget(target, escapeHtml);
  });

  html += '<div class="falling-danger-zone">' + escapeHtml(config.dangerZoneName) + '</div>';
  html += '</section>';

  return html;
}

function renderFallingTarget(target, escapeHtml) {
  var className = target.type === "powerup" ? "falling-target is-powerup" : "falling-target";

  return '<button type="button" class="' + className + '" data-falling-target="' + escapeHtml(target.objectId) + '" style="left:' + target.x + '%;top:' + target.y + '%">'
    + '<span>' + escapeHtml(target.icon) + '</span><strong>' + escapeHtml(target.label) + '</strong>'
    + '</button>';
}
