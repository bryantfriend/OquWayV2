export function renderDefensePowerUp(object, escapeHtml) {
  return '<button type="button" class="defense-object defense-power-up" data-defense-object="' + escapeHtml(object.objectId) + '" data-defense-kind="power-up" style="left:' + object.x + '%;top:' + object.y + '%" aria-label="Collect ' + escapeHtml(object.label) + '">'
    + '<span class="defense-object-icon">' + escapeHtml(object.icon) + '</span>'
    + '<strong>' + escapeHtml(object.label) + '</strong>'
    + '<em>+' + escapeHtml(String(object.healAmount)) + ' HP</em>'
    + '</button>';
}
