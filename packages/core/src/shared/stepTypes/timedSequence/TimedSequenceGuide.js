import { readTimedSequenceItem } from "./timedSequenceValidationUtils.js?v=1.1.192-timed-sequence";

export function renderTimedSequenceGuide(config, state, escapeHtml) {
  var html = '<div class="timed-sequence-guide" aria-label="Required sequence">';
  var index = 0;

  while (index < state.sequence.length) {
    html += renderGuideItem(config, state, index, escapeHtml);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function renderGuideItem(config, state, index, escapeHtml) {
  var item = readTimedSequenceItem(config.sequenceItems, state.sequence[index]);
  var completeClass = index < state.playerIndex ? " is-complete" : "";
  var currentClass = index === state.playerIndex && state.phase === "playing" ? " is-current" : "";
  var label = item ? item.label : "Step " + (index + 1);

  return '<div class="timed-guide-item' + completeClass + currentClass + '">'
    + '<span>' + escapeHtml(String(index + 1)) + '</span>'
    + '<strong>' + escapeHtml(label) + '</strong>'
    + '</div>';
}
