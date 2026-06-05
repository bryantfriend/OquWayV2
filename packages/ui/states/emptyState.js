import { escapeHtml } from "../shared/html.js";

export function createEmptyState(title, message, options) {
  var safeOptions = options || {};
  var className = safeOptions.className || "oqu-empty-state";
  var titleTag = safeOptions.titleTag || "h2";
  var messageTag = safeOptions.messageTag || "p";
  var beforeHtml = safeOptions.beforeHtml || "";
  var afterHtml = safeOptions.afterHtml || "";
  var contentClass = safeOptions.contentClassName ? ' class="' + escapeHtml(safeOptions.contentClassName) + '"' : "";

  return '<div class="' + escapeHtml(className) + '">'
    + beforeHtml
    + '<div' + contentClass + '>'
    + "<" + titleTag + ">" + escapeHtml(title || "Nothing here yet.") + "</" + titleTag + ">"
    + "<" + messageTag + ">" + escapeHtml(message || "") + "</" + messageTag + ">"
    + '</div>'
    + afterHtml
    + '</div>';
}
