import { createAttributeString, escapeHtml } from "../shared/html.js";

export function createActionButton(config) {
  var safeConfig = config || {};
  var className = safeConfig.className || "oqu-action-button";
  var label = safeConfig.label || "Action";
  var icon = safeConfig.icon || "";
  var attrs = Object.assign({}, safeConfig.attributes || {});

  attrs.type = attrs.type || "button";
  attrs.class = className;

  if (safeConfig.disabled) {
    attrs.disabled = "disabled";
  }

  return "<button" + createAttributeString(attrs) + ">"
    + icon
    + escapeHtml(label)
    + "</button>";
}
