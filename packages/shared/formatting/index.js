export function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.seconds === "number") {
    return value.seconds * 1000;
  }

  if (typeof value._seconds === "number") {
    return value._seconds * 1000;
  }

  if (typeof value === "string") {
    var parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function formatDateTime(value) {
  var millis = normalizeTimestamp(value);

  if (!millis) {
    return "Not loaded yet";
  }

  return new Date(millis).toLocaleString();
}
