import { updateAppState } from "../app/appState.js?v=1.1.81-class-command-center";
import { runAdminIntent } from "../../../../../packages/icf/admin/index.js?v=1.1.81-class-command-center";
import { renderUsersRoleCards, renderUsersTableRows } from "./usersRenderer.js?v=1.1.81-class-command-center";
import { collectUserRoles } from "../../../../../packages/domain/users/index.js?v=1.1.81-class-command-center";

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
  var roles = collectUserRoles(user);

  if (roleFilter === "admin") {
    return roles.indexOf("schoolAdmin") !== -1
      || roles.indexOf("regionalAdmin") !== -1
      || roles.indexOf("ministryUser") !== -1
      || roles.indexOf("platformAdmin") !== -1;
  }

  return roles.indexOf(roleFilter) !== -1;
}
