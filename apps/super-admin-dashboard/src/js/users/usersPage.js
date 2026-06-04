import { updateAppState } from "../app/appState.js?v=1.1.46-admin-motion";
import { runAdminIntent } from "../icf/intentRegistry.js?v=1.1.46-admin-motion";
import { renderUsersRoleCards, renderUsersTableRows } from "./usersRenderer.js?v=1.1.46-admin-motion";

export async function loadUsersPage(context) {
  var result = await runAdminIntent("LoadUsersIntent", {}, context || {});
  var users = result && result.emitted && result.emitted.data ? result.emitted.data : [];

  updateAppState({ cachedUsers: users });
  return users;
}

export function renderUsersPage(users, selectedRoleFilter) {
  var safeUsers = users || [];
  var filteredUsers = filterUsersByRole(safeUsers, selectedRoleFilter || "");

  return renderUsersRoleCards(safeUsers, selectedRoleFilter || "")
    + '<div class="sa-user-table">' + renderUsersTableRows(filteredUsers) + '</div>';
}

function filterUsersByRole(users, selectedRoleFilter) {
  var roleFilter = String(selectedRoleFilter || "");

  if (!roleFilter) {
    return users;
  }

  return users.filter(function (user) {
    return userMatchesRoleFilter(user, roleFilter);
  });
}

function userMatchesRoleFilter(user, roleFilter) {
  var roles = normalizeUserRoles(user);

  if (roleFilter === "admin") {
    return roles.indexOf("schoolAdmin") !== -1
      || roles.indexOf("regionalAdmin") !== -1
      || roles.indexOf("ministryUser") !== -1
      || roles.indexOf("platformAdmin") !== -1;
  }

  return roles.indexOf(roleFilter) !== -1;
}

function normalizeUserRoles(user) {
  var roles = Array.isArray(user && user.roles) ? user.roles.slice() : [];

  if (user && user.role && roles.indexOf(user.role) === -1) {
    roles.push(user.role);
  }

  if (user && user.ROLE_TEACHER === true && roles.indexOf("teacher") === -1) roles.push("teacher");
  if (user && user.ROLE_SCHOOL_ADMIN === true && roles.indexOf("schoolAdmin") === -1) roles.push("schoolAdmin");
  if (user && user.ROLE_PLATFORM_ADMIN === true && roles.indexOf("platformAdmin") === -1) roles.push("platformAdmin");
  if (user && user.ROLE_SUPER_ADMIN === true && roles.indexOf("superAdmin") === -1) roles.push("superAdmin");

  return roles;
}
