import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createScenarioSimulatorResults } from "./scenarioSimulatorEngine.js?v=1.1.192-timed-sequence";

export function renderScenarioResults(config, state, escapeHtml) {
  var results = createScenarioSimulatorResults(config, state);
  var stats = results.stats;

  return '<div class="scenario-simulator-results">'
    + renderActivityResults(results.summary)
    + '<div class="scenario-simulator-results-grid">'
    + renderMetric("Score", stats.score, escapeHtml)
    + renderMetric("Correct", stats.correctDecisions + " / " + stats.totalScenarios, escapeHtml)
    + renderMetric("Incorrect", stats.incorrectDecisions, escapeHtml)
    + renderMetric("Expired", stats.expiredDecisions, escapeHtml)
    + renderMetric("Accuracy", stats.accuracy + "%", escapeHtml)
    + renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div>'
    + '</div>';
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
