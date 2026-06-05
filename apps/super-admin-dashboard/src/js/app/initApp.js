import { appState, updateAppState } from "./appState.js?v=1.1.59-teacher-login-errors";
import { registerIntentDefinitions, runAdminIntent } from "../../../../../packages/icf/admin/index.js?v=1.1.58-shared-phase1";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.58-shared-phase1";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.58-shared-phase1";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.58-shared-phase1";

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

  await import("./legacyDashboard.js?v=1.1.59-teacher-login-errors");
  updateAppState({ legacyDashboardLoaded: true });
}


