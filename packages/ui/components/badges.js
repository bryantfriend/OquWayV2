import { createStatusBadge } from "../badges/index.js";

export function buildStatusBadge(status) {
  return createStatusBadge(status);
}

export function buildRoleBadge(role) {
  var safeRole = String(role || "user");
  return '<span class="oqu-role-badge oqu-role-' + escapeAttribute(safeRole) + '">' + escapeHtml(formatRole(safeRole)) + '</span>';
}

function formatStatus(status) {
  return status.slice(0, 1).toUpperCase() + status.slice(1);
}

function formatRole(role) {
  if (role === "superAdmin") return "Super Admin";
  if (role === "platformAdmin") return "Platform Admin";
  if (role === "schoolAdmin") return "School Admin";
  return role.slice(0, 1).toUpperCase() + role.slice(1);
}

function escapeAttribute(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-");
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
