import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.226-learning-activity-files";

export function renderTemplate(activityContext) {
  var container = activityContext && activityContext.container ? activityContext.container : null;
  var content = activityContext && activityContext.content ? activityContext.content : getSortingDefaultContent();

  if (!container) {
    return;
  }

  container.innerHTML = '<style>' + buildSortingStandardCss() + '</style>'
    + '<article class="oqu-template-preview-shell">'
    + '<div class="oqu-template-preview-kicker">Sorting</div>'
    + '<h2>' + escapeHtml(content.title || content.heading || content.word || content.phrase || content.missionTitle || "Sorting") + '</h2>'
    + '<pre>' + escapeHtml(JSON.stringify(content, null, 2)) + '</pre>'
    + '</article>';
}

export function destroyTemplate() {
  return null;
}

export function getTemplateDefaultContent() {
  return Object.assign({ templateId: "sorting-standard" }, getSortingDefaultContent());
}

export function getTemplatePreviewContent() {
  return Object.assign({ templateId: "sorting-standard" }, getSortingDefaultContent());
}

function buildSortingStandardCss() {
  return ""
    + ".oqu-template-preview-shell{border:1px solid #dbeafe;border-radius:10px;background:#fff;padding:18px;color:#0f172a;display:grid;gap:10px}"
    + ".oqu-template-preview-kicker{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;color:#2563eb}"
    + ".oqu-template-preview-shell h2{margin:0;font-size:22px;font-weight:950}"
    + ".oqu-template-preview-shell pre{margin:0;white-space:pre-wrap;font-size:12px;line-height:1.5;background:#f8fafc;border-radius:8px;padding:12px;color:#334155}";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
