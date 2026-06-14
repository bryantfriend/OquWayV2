export function renderDefenseThreat(object, escapeHtml) {
  var classes = "defense-object defense-threat";

  if (object.isBoss) {
    classes += " is-boss";
  }

  return '<button type="button" class="' + classes + '" data-defense-object="' + escapeHtml(object.objectId) + '" data-defense-kind="threat" style="left:' + object.x + '%;top:' + object.y + '%" aria-label="Defeat ' + escapeHtml(object.label) + '">'
    + '<span class="defense-object-icon">' + escapeHtml(object.icon) + '</span>'
    + '<strong>' + escapeHtml(object.label) + '</strong>'
    + '<em>' + escapeHtml(String(object.points)) + ' pts</em>'
    + renderThreatHits(object, escapeHtml)
    + '</button>';
}

function renderThreatHits(object, escapeHtml) {
  if (!object.isBoss || object.hp <= 1) {
    return "";
  }

  return '<span class="defense-hit-count">' + escapeHtml(String(object.hp)) + ' hits</span>';
}
