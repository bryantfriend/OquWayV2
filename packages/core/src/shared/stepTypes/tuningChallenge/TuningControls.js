export function renderTuningControls(config, state, escapeHtml) {
  var html = '<section class="tuning-controls" aria-label="Tuning controls">';

  config.controls.forEach(function (control) {
    html += '<label class="tuning-control">';
    html += '<span><strong>' + escapeHtml(control.label) + '</strong><em>' + escapeHtml(String(state.userValues[control.id])) + '</em></span>';
    html += '<input type="range" min="' + escapeHtml(String(control.min)) + '" max="' + escapeHtml(String(control.max)) + '" step="' + escapeHtml(String(control.step)) + '" value="' + escapeHtml(String(state.userValues[control.id])) + '" data-tuning-control="' + escapeHtml(control.id) + '">';
    html += '</label>';
  });

  html += '</section>';

  return html;
}
