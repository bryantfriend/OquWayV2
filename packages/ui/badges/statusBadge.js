import { escapeAttribute, escapeHtml } from "../shared/html.js";

export function createStatusBadge(status, options) {
  var safeOptions = options || {};
  var safeStatus = normalizeStatus(status);
  var label = safeOptions.label || formatStatusLabel(safeStatus);
  var className = safeOptions.className || "oqu-status-badge";
  var statusClassPrefix = safeOptions.statusClassPrefix === undefined ? "oqu-status-" : safeOptions.statusClassPrefix;
  var tagName = safeOptions.tagName || "span";
  var statusClass = statusClassPrefix ? " " + statusClassPrefix + escapeAttribute(safeStatus) : " " + escapeAttribute(safeStatus);

  return "<" + tagName + ' class="' + escapeHtml(className + statusClass) + '" data-status="' + escapeHtml(safeStatus) + '">'
    + escapeHtml(label)
    + "</" + tagName + ">";
}

export function formatStatusLabel(status) {
  var labels = {
    notStarted: "Not Started",
    inProgress: "In Progress",
    pendingReview: "Pending Review",
    needsWork: "Needs Work",
    incomplete: "Incomplete",
    complete: "Complete",
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    pending: "Pending"
  };
  var safeStatus = normalizeStatus(status);

  return labels[safeStatus] || titleCaseStatus(safeStatus);
}

export function normalizeStatus(status) {
  var safeStatus = String(status || "notStarted").trim();

  if (safeStatus === "not-started") return "notStarted";
  if (safeStatus === "in-progress") return "inProgress";
  if (safeStatus === "pending-review") return "pendingReview";
  if (safeStatus === "needs-work") return "needsWork";

  return safeStatus || "notStarted";
}

function titleCaseStatus(status) {
  return String(status || "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, function (char) {
    return char.toUpperCase();
  });
}
