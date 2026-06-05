import { escapeHtml } from "../shared/html.js";

export function createDashboardCard(config) {
  var safeConfig = config || {};
  var className = safeConfig.className || "oqu-dashboard-card";
  var badge = safeConfig.badge || "";
  var subtitle = safeConfig.subtitle ? '<p>' + escapeHtml(safeConfig.subtitle) + '</p>' : "";
  var meta = Array.isArray(safeConfig.meta) ? createMeta(safeConfig.meta) : safeConfig.meta || "";
  var actions = Array.isArray(safeConfig.actions) ? safeConfig.actions.join("") : safeConfig.actions || "";
  var body = safeConfig.body || "";

  return '<article class="' + escapeHtml(className) + '">'
    + '<div class="oqu-dashboard-card-head"><div><strong>' + escapeHtml(safeConfig.title || "Untitled") + '</strong>' + subtitle + '</div>' + badge + '</div>'
    + body
    + meta
    + actions
    + '</article>';
}

function createMeta(meta) {
  var html = '<div class="oqu-dashboard-card-meta">';
  var index = 0;

  while (index < meta.length) {
    html += '<span>' + escapeHtml(meta[index]) + '</span>';
    index = index + 1;
  }

  return html + '</div>';
}
