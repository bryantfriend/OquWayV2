export function renderSequencePadGrid(config, state, escapeHtml) {
  var columns = config.gridSize === 4 ? 2 : config.gridSize === 16 ? 4 : 3;
  var html = '<div class="sequence-pad-grid" style="--sequence-grid-columns:' + columns + '">';
  var index = 0;
  var disabled = state.phase !== "input" ? " disabled" : "";

  while (index < config.pads.length) {
    html += renderPad(config.pads[index], state, disabled, escapeHtml);
    index = index + 1;
  }

  html += '</div>';

  return html;
}

function renderPad(pad, state, disabled, escapeHtml) {
  var activeClass = state.activePadId === pad.id ? " is-active" : "";
  var label = escapeHtml(pad.label);
  var icon = escapeHtml(pad.icon);

  return '<button type="button" class="sequence-pad' + activeClass + '" data-sequence-pad data-sequence-pad-id="' + escapeHtml(pad.id) + '" aria-label="Sequence pad ' + label + '"' + disabled + '>'
    + '<span>' + icon + '</span>'
    + '<strong>' + label + '</strong>'
    + '</button>';
}
