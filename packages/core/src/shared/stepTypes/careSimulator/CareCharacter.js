export function renderCareCharacter(config, state, escapeHtml) {
  return '<div class="care-character mood-' + escapeHtml(state.mood) + '">'
    + '<span>' + escapeHtml(readFace(state.mood)) + '</span>'
    + '<strong>' + escapeHtml(config.characterName) + '</strong>'
    + '<em>' + escapeHtml(state.mood) + '</em>'
    + '</div>';
}

function readFace(mood) {
  if (mood === "inactive") { return "REST"; }
  if (mood === "critical") { return "HELP"; }
  if (mood === "worried") { return "OK"; }
  return "HAPPY";
}
