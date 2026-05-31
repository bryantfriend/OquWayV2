import { updateAppState } from "../app/appState.js";
import { runAdminIntent } from "../icf/intentRegistry.js";
import { renderUsersRoleCards, renderUsersTableRows } from "./usersRenderer.js";

export async function loadUsersPage(context) {
  var result = await runAdminIntent("LoadUsersIntent", {}, context || {});
  var users = result && result.emitted && result.emitted.data ? result.emitted.data : [];

  updateAppState({ cachedUsers: users });
  return users;
}

export function renderUsersPage(users, selectedRoleFilter) {
  return renderUsersRoleCards(users || [], selectedRoleFilter || "")
    + '<div class="sa-user-table">' + renderUsersTableRows(users || []) + '</div>';
}
