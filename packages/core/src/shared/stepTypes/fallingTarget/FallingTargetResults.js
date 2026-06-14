import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createFallingTargetResults } from "./fallingTargetEngine.js?v=1.1.192-timed-sequence";

export function renderFallingTargetResults(config, state, escapeHtml) {
  var results = createFallingTargetResults(config, state);
  var stats = results.stats;

  return '<div class="falling-results">'
    + renderActivityResults(results.summary)
    + '<div class="falling-results-grid">'
    + renderMetric("Score", stats.score + " / " + stats.targetScore, escapeHtml)
    + renderMetric("Lives", stats.lives + " / " + stats.startingLives, escapeHtml)
    + renderMetric("Cleared", stats.destroyedTargets, escapeHtml)
    + renderMetric("Missed", stats.missedTargets, escapeHtml)
    + renderMetric("Power-Ups", stats.powerUpsUsed, escapeHtml)
    + renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div></div>';
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
