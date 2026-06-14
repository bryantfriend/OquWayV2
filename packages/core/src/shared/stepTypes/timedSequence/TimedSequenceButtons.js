export function renderTimedSequenceButtons(config, state, escapeHtml) {
  var html = '<div class="timed-sequence-buttons">';
  var index = 0;
  var disabled = state.phase !== "playing" || state.glitchActive ? " disabled" : "";

  while (index < config.sequenceItems.length) {
    html += renderButton(config.sequenceItems[index], disabled, escapeHtml);
    index = index + 1;
  }

  html += '</div>';
  return html;
}

function renderButton(item, disabled, escapeHtml) {
  var colorClass = " timed-color-" + escapeHtml(item.colorClass);

  return '<button type="button" class="timed-sequence-button' + colorClass + '" data-timed-sequence-item data-timed-sequence-item-id="' + escapeHtml(item.id) + '" aria-label="Choose ' + escapeHtml(item.label) + '"' + disabled + '>'
    + '<span></span>'
    + '<strong>' + escapeHtml(item.label) + '</strong>'
    + '</button>';
}
