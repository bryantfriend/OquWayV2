import { renderActivityResults } from "../gamificationService.js?v=1.1.192-timed-sequence";
import { createTimedSequenceResults } from "./timedSequenceEngine.js?v=1.1.192-timed-sequence";

export function renderTimedSequenceResults(config, state, escapeHtml) {
  var results = createTimedSequenceResults(config, state);
  var stats = results.stats;

  return '<div class="timed-sequence-results">'
    + renderActivityResults(results.summary)
    + '<div class="timed-sequence-results-grid">'
    + renderMetric("Score", stats.score, escapeHtml)
    + renderMetric("Levels", stats.levelsCompleted + " / " + stats.requiredLevels, escapeHtml)
    + renderMetric("Mistakes", stats.mistakes, escapeHtml)
    + renderMetric("Glitches", stats.glitchesDismissed, escapeHtml)
    + renderMetric("Accuracy", stats.accuracy + "%", escapeHtml)
    + renderMetric("Time", stats.completionTimeSeconds + "s", escapeHtml)
    + '</div>'
    + '</div>';
}

function renderMetric(label, value, escapeHtml) {
  return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(String(value)) + '</strong></div>';
}
