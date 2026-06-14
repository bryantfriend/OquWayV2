export function renderLivesDisplay(state, escapeHtml) {
  return '<div class="falling-lives" aria-label="Lives remaining"><span>Lives</span><strong>' + escapeHtml(String(state.lives)) + '</strong></div>';
}
