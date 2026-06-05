import { escapeHtml } from "../shared/html.js";

export function createErrorState(title, message, options) {
  var safeOptions = options || {};
  var className = safeOptions.className || "oqu-error-state";
  var titleTag = safeOptions.titleTag || "strong";
  var messageTag = safeOptions.messageTag || "span";
  var beforeHtml = safeOptions.beforeHtml || "";

  return '<div class="' + escapeHtml(className) + '" role="alert">'
    + beforeHtml
    + "<" + titleTag + ">" + escapeHtml(title || "Something went wrong.") + "</" + titleTag + ">"
    + (message ? "<" + messageTag + ">" + escapeHtml(message) + "</" + messageTag + ">" : "")
    + '</div>';
}
