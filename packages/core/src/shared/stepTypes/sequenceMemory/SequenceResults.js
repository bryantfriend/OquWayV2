import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createSequenceMemoryResults } from "./sequenceMemoryEngine.js?v=1.1.192-timed-sequence";

export function renderSequenceResults(config, state, escapeHtml) {
  var results = createSequenceMemoryResults(config, state);
  var stats = results.stats;

  return '<div class="sequence-results">'
    + renderActivityResults(results.summary)
    + '<div class="sequence-results-grid">'
    + renderMetric("Score", stats.score, escapeHtml)
    + renderMetric("Levels", stats.completedLevels + " / " + stats.totalLevels, escapeHtml)
    + renderMetric("Mistakes", stats.mistakes, escapeHtml)
    + renderMetric("Longest", stats.longestSequence, escapeHtml)
    + renderMetric("Target", stats.maximumSequenceLength, escapeHtml)
    + renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div>'
    + '</div>';
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
