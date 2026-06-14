import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createTuningChallengeResults } from "./tuningChallengeEngine.js?v=1.1.192-timed-sequence";

export function renderTuningResults(config, state, escapeHtml) {
  var results = createTuningChallengeResults(config, state);
  var stats = results.stats;

  return '<div class="tuning-results">'
    + renderActivityResults(results.summary)
    + '<div class="tuning-results-grid">'
    + renderMetric("Best Sync", stats.bestSync + "%", escapeHtml)
    + renderMetric("Final Sync", stats.finalSync + "%", escapeHtml)
    + renderMetric("Score", stats.score, escapeHtml)
    + renderMetric("Mode", stats.targetType, escapeHtml)
    + renderMetric("Reason", stats.completionReason, escapeHtml)
    + renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div>'
    + '</div>';
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
