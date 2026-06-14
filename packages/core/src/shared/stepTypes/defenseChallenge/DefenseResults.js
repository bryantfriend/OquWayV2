import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createDefenseChallengeResults } from "./defenseChallengeEngine.js?v=1.1.192-timed-sequence";

export function renderDefenseResults(config, state, escapeHtml) {
  var results = createDefenseChallengeResults(config, state);
  var stats = results.stats;
  var html = "";

  html += '<div class="defense-results">';
  html += renderActivityResults(results.summary);
  html += '<div class="defense-results-grid">';
  html += renderMetric("Final Score", stats.score + " / " + stats.targetScore, escapeHtml);
  html += renderMetric("HP Left", stats.hp + " / " + stats.targetHp, escapeHtml);
  html += renderMetric("Threats", stats.defeatedThreats, escapeHtml);
  html += renderMetric("Bosses", stats.defeatedBosses, escapeHtml);
  html += renderMetric("Missed", stats.missedThreats + stats.missedClicks, escapeHtml);
  html += renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml);
  html += '</div>';
  html += '</div>';

  return html;
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
