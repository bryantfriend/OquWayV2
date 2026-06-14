import { createLeaderboardRows } from "./competitiveCollectorEngine.js?v=1.1.192-timed-sequence";

export function renderCollectorLeaderboard(config, state, escapeHtml) {
  var rows = createLeaderboardRows(config, state);
  var html = "";

  if (!config.settings.showLeaderboard) {
    return "";
  }

  html += '<section class="collector-panel collector-leaderboard" aria-label="Leaderboard">';
  html += '<div class="collector-panel-header"><strong>Leaderboard</strong><span>Live rivals</span></div>';
  rows.forEach(function (row, index) {
    html += '<div class="collector-leader-row' + (row.current ? " is-current" : "") + '">';
    html += '<span>' + (index + 1) + '</span>';
    html += '<strong>' + escapeHtml(row.name) + '</strong>';
    html += '<b>' + escapeHtml(String(row.score)) + '</b>';
    html += '</div>';
  });
  html += '</section>';

  return html;
}
