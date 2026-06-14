import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createCareSimulatorResults } from "./careSimulatorEngine.js?v=1.1.192-timed-sequence";

export function renderCareResults(config, state, escapeHtml) {
  var results = createCareSimulatorResults(config, state);
  var stats = results.stats;
  return '<div class="care-results">' + renderActivityResults(results.summary)
    + '<div class="care-results-grid">'
    + metric(config.statusMeterName, stats.status + "%", escapeHtml)
    + metric("Helpful", stats.correctResources, escapeHtml)
    + metric("Needs Retry", stats.wrongResources, escapeHtml)
    + metric("Resources", stats.consumed, escapeHtml)
    + metric("Mood", stats.mood, escapeHtml)
    + metric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div></div>';
}

function metric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
