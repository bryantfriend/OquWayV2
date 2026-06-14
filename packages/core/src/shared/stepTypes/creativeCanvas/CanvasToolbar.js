import { readToolLabel } from "./creativeCanvasTools.js?v=1.1.192-timed-sequence";

export function renderCanvasToolbar(config, escapeHtml) {
  var html = "";

  html += '<section class="creative-canvas-toolbar" aria-label="Canvas tools">';
  html += '<div class="creative-canvas-panel-title">Tools</div>';
  html += '<div class="creative-canvas-tool-grid">';
  config.requiredTools.forEach(function (toolId, index) {
    html += '<button type="button" class="creative-canvas-tool' + (index === 0 ? " is-active" : "") + '" data-canvas-tool="' + escapeHtml(toolId) + '">';
    html += escapeHtml(readToolLabel(toolId));
    html += '</button>';
  });
  html += '</div>';
  if (config.settings.allowUndo) {
    html += '<div class="creative-canvas-history">';
    html += '<button type="button" data-canvas-action="undo">Undo</button>';
    html += '<button type="button" data-canvas-action="redo">Redo</button>';
    html += '</div>';
  }
  if (config.settings.allowClear) {
    html += '<button type="button" class="creative-canvas-clear" data-canvas-action="clear">Clear Canvas</button>';
  }
  if (config.requiredTools.indexOf("label") !== -1) {
    html += '<label class="creative-canvas-label-field">Label Text<input type="text" data-canvas-label-text value="Label"></label>';
  }
  html += '</section>';

  return html;
}
