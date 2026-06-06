import { runAdminIntent } from "../../../../../packages/icf/admin/index.js?v=1.1.108-student-class-alias-merge";

export function bindUsersEvents(rootElement, handlers) {
  rootElement.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");

    if (!target) {
      return;
    }

    routeUsersAction(target.dataset.action, target.dataset.id || "", handlers || {});
  });
}

export async function routeUsersAction(action, id, handlers) {
  if (action === "filter-users-role") {
    if (typeof handlers.onFilterRole === "function") {
      handlers.onFilterRole(id);
    }
    console.info("[users-filter-card]", {
      selectedRole: id || "",
      visibleUserCount: handlers && typeof handlers.readFilteredUserCount === "function" ? handlers.readFilteredUserCount(id || "") : 0,
      totalUserCount: handlers && typeof handlers.readTotalUserCount === "function" ? handlers.readTotalUserCount() : 0
    });
    return runAdminIntent("FilterUsersIntent", { role: id });
  }

  if (action === "reset-fruit-user") {
    return runAdminIntent("ResetFruitPasswordIntent", { userId: id }, handlers.context);
  }

  if (action === "disable-user") {
    return runAdminIntent("DisableUserIntent", { userId: id }, handlers.context);
  }

  if (action === "delete-user") {
    return runAdminIntent("DeleteUserIntent", { userId: id }, handlers.context);
  }

  return null;
}
