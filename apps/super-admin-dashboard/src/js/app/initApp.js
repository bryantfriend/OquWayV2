import { appState, updateAppState } from "./appState.js?v=1.1.49-admin-users-fix";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.49-admin-users-fix";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.49-admin-users-fix";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.49-admin-users-fix";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.49-admin-users-fix";

export async function initApp() {
  registerIntentDefinitions([
    registerUsersIntents,
    registerDashboardIntents,
    registerClassesIntents
  ]);

  window.oquwayAdminApp = {
    state: appState,
    runIntent: runAdminIntent
  };

  await import("./legacyDashboard.js?v=1.1.49-admin-users-fix");
  updateAppState({ legacyDashboardLoaded: true });
}


