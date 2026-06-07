import { roleFilterCards } from "../../../../../packages/shared/constants/admin.js?v=1.1.119-student-dashboard-debug-safe";
import { escapeHtml, formatDateTime } from "../../../../../packages/shared/formatting/index.js?v=1.1.119-student-dashboard-debug-safe";
import { collectUserRoles } from "../../../../../packages/domain/users/index.js?v=1.1.119-student-dashboard-debug-safe";
import { createStatusBadge } from "../../../../../packages/ui/index.js?v=1.1.119-student-dashboard-debug-safe";

export function renderUsersRoleCards(users, selectedRoleFilter) {
  var html = '<section class="sa-role-card-grid" aria-label="Role filters">';
  var index = 0;

  while (index < roleFilterCards.length) {
    html += renderRoleCard(roleFilterCards[index], users, selectedRoleFilter || "");
    index = index + 1;
  }

  html += '</section>';
  return html;
}

export function renderRoleCard(card, users, selectedRoleFilter) {
  var count = countUsersForCard(users, card);
  var isActive = selectedRoleFilter === card.key;

  return '<button type="button" class="sa-role-card sa-role-card-' + escapeHtml(card.tone) + (isActive ? " is-active" : "") + '" data-action="filter-users-role" data-id="' + escapeHtml(card.key) + '">'
    + '<span class="sa-role-card-top"><span class="sa-role-badge-icon">' + escapeHtml(card.icon) + '</span><i>' + escapeHtml(card.icon) + '</i></span>'
    + '<span class="sa-role-card-copy"><strong>' + count + '</strong><span>' + escapeHtml(card.label) + '</span></span>'
    + '<span class="sa-role-art"><img class="sa-role-artwork-img" src="' + escapeHtml(card.artwork) + '" alt=""></span>'
    + '</button>';
}

export function renderUsersTableRows(users) {
  var html = "";
  var index = 0;

  while (index < users.length) {
    html += '<article class="sa-user-card"><div class="sa-user-summary">'
      + '<div class="sa-user-profile-cell"><div class="sa-avatar sa-avatar-fallback">' + escapeHtml(readInitials(users[index].displayName || users[index].email || users[index].id)) + '</div><div class="sa-user-main"><h3>' + escapeHtml(users[index].displayName || users[index].email || users[index].id) + '</h3><p>' + escapeHtml(users[index].email || "No email") + '</p></div></div>'
      + '<div class="sa-role-badges">' + escapeHtml((users[index].roles || []).join(", ")) + '</div>'
      + '<div class="sa-user-meta"><span>' + escapeHtml((users[index].locationIds || []).join(", ") || "No location scope") + '</span></div>'
      + '<div class="sa-user-meta"><span>' + escapeHtml((users[index].classIds || []).join(", ") || users[index].classId || "No classes") + '</span></div>'
      + '<div>' + createStatusBadge(users[index].status || "active", { className: "sa-status", statusClassPrefix: "sa-status-" }) + '</div>'
      + '<div class="sa-user-meta"><span>' + escapeHtml(formatDateTime(users[index].lastActiveAt || users[index].updatedAt)) + '</span></div>'
      + '<div class="sa-row-actions"></div>'
      + '</div></article>';
    index = index + 1;
  }

  return html;
}

function countUsersForCard(users, card) {
  var count = 0;
  var index = 0;

  if (!card.key) {
    return users.length;
  }

  while (index < users.length) {
    if (card.roles.some(function (role) { return collectUserRoles(users[index]).indexOf(role) !== -1; })) {
      count = count + 1;
    }

    index = index + 1;
  }

  return count;
}

function readInitials(value) {
  return String(value || "U").trim().split(/\s+/).slice(0, 2).map(function (part) {
    return part.charAt(0).toUpperCase();
  }).join("") || "U";
}
