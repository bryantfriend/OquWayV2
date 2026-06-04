export function buildInlineLoading(label, note) {
  return '<div class="oqu-inline-loading" aria-busy="true">'
    + '<span class="oqu-loading-stack" aria-hidden="true"><i></i><i></i><i></i></span>'
    + '<strong>' + escapeHtml(label || "Loading...") + '</strong>'
    + '<span>' + escapeHtml(note || "") + '</span>'
    + '</div>';
}

export function buildSavingLabel(label, isSaving) {
  if (!isSaving) {
    return escapeHtml(label || "Save");
  }

  return '<span class="oqu-saving-spinner" aria-hidden="true"></span>' + escapeHtml(label || "Saving...");
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, function (char) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char];
  });
}
