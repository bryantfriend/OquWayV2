import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createNavigationResults } from "./navigationChallengeEngine.js?v=1.1.192-timed-sequence";

export function renderNavigationResults(config, state, escapeHtml) {
  var results = createNavigationResults(config, state);
  var stats = results.stats;
  return '<div class="navigation-results">' + renderActivityResults(results.summary)
    + '<div class="navigation-results-grid">'
    + metric("Score", stats.score + " / " + stats.targetScore, escapeHtml)
    + metric("Collected", stats.collected, escapeHtml)
    + metric("Destroyed", stats.destroyed, escapeHtml)
    + metric("Crash", stats.crashed ? "Yes" : "No", escapeHtml)
    + metric("Reason", stats.completionReason, escapeHtml)
    + metric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div></div>';
}

function metric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
