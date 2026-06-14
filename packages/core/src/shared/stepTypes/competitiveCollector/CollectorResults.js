import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createCompetitiveCollectorResults } from "./competitiveCollectorEngine.js?v=1.1.192-timed-sequence";

export function renderCollectorResults(config, state, escapeHtml) {
  var results = createCompetitiveCollectorResults(config, state);
  var stats = results.stats;
  var html = "";

  html += '<div class="collector-results">';
  html += renderActivityResults(results.summary);
  html += '<div class="collector-results-grid">';
  html += renderMetric("Final Score", stats.score + " " + stats.resourceName, escapeHtml);
  html += renderMetric("Target", stats.targetScore, escapeHtml);
  html += renderMetric("Clicks", stats.totalClicks, escapeHtml);
  html += renderMetric("Correct", stats.correctClicks, escapeHtml);
  html += renderMetric("Misses", stats.wrongClicks, escapeHtml);
  html += renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml);
  html += '</div>';
  html += '</div>';

  return html;
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
