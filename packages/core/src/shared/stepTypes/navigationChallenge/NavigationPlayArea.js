export function renderNavigationPlayArea(config, state, escapeHtml) {
  var html = '<section class="navigation-play-area" aria-label="Navigation play area">';
  html += '<div class="navigation-avatar navigation-avatar-' + escapeHtml(config.avatarType) + '" style="left:' + state.avatar.x + '%;top:' + state.avatar.y + '%"><span>' + escapeHtml(readAvatarLabel(config.avatarType)) + '</span></div>';
  state.entities.forEach(function (entity) {
    html += '<div class="navigation-entity is-' + escapeHtml(entity.kind) + '" style="left:' + entity.x + '%;top:' + entity.y + '%"><span>' + escapeHtml(entity.kind === "collectible" ? "ITEM" : "OBS") + '</span><strong>' + escapeHtml(entity.label) + '</strong></div>';
  });
  html += '</section>';
  return html;
}

function readAvatarLabel(type) {
  if (type === "spaceship") { return "SHIP"; }
  if (type === "data-packet") { return "DATA"; }
  if (type === "cell") { return "CELL"; }
  if (type === "number-bot") { return "BOT"; }
  return "GO";
}
