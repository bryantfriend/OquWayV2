export function escapeHtml(value) {
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

export function escapeAttribute(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function createAttributeString(attributes) {
  var html = "";
  var keys = attributes && typeof attributes === "object" ? Object.keys(attributes) : [];
  var index = 0;

  while (index < keys.length) {
    if (attributes[keys[index]] !== null && attributes[keys[index]] !== undefined && attributes[keys[index]] !== false) {
      html += " " + keys[index] + '="' + escapeHtml(attributes[keys[index]]) + '"';
    }
    index = index + 1;
  }

  return html;
}
