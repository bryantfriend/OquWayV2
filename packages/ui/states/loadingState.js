import { escapeHtml } from "../shared/html.js";

export function createLoadingState(message, options) {
  var safeOptions = options || {};
  var className = safeOptions.className || "oqu-loading-state";
  var titleTag = safeOptions.titleTag || "strong";
  var beforeHtml = safeOptions.beforeHtml || '<span class="oqu-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  var note = safeOptions.note ? '<span>' + escapeHtml(safeOptions.note) + '</span>' : "";

  return '<div class="' + escapeHtml(className) + '" aria-busy="true" role="status">'
    + beforeHtml
    + "<" + titleTag + ">" + escapeHtml(message || "Loading...") + "</" + titleTag + ">"
    + note
    + '</div>';
}
