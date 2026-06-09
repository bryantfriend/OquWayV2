import { appState, updateAppState } from "./appState.js?v=1.1.143-assignment-course-picker-scroll";
import { registerIntentDefinitions, runAdminIntent } from "../../../../../packages/icf/admin/index.js?v=1.1.143-assignment-course-picker-scroll";
import { createClassesIntentRegistrar, createDashboardIntentRegistrar, createUsersIntentRegistrar } from "../../../../../packages/icf/admin/intents/index.js?v=1.1.143-assignment-course-picker-scroll";
import { createUser, deleteUser, disableUser, getUser, getUsers, sendPasswordReset, updateUser } from "../users/usersService.js?v=1.1.143-assignment-course-picker-scroll";
import { resetFruitPassword } from "../users/fruitPasswordService.js?v=1.1.143-assignment-course-picker-scroll";

export async function initApp() {
  registerIntentDefinitions([
    createUsersIntentRegistrar({
      createUser: createUser,
      deleteUser: deleteUser,
      disableUser: disableUser,
      getUser: getUser,
      getUsers: getUsers,
      resetFruitPassword: resetFruitPassword,
      sendPasswordReset: sendPasswordReset,
      updateUser: updateUser
    }),
    createDashboardIntentRegistrar(),
    createClassesIntentRegistrar()
  ]);

  window.oquwayAdminApp = {
    state: appState,
    runIntent: runAdminIntent
  };

  await import("./legacyDashboard.js?v=1.1.143-assignment-course-picker-scroll");
  updateAppState({ legacyDashboardLoaded: true });
}

