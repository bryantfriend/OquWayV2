import { appState, updateAppState } from "./appState.js?v=1.1.40-teacher-profile-admin-fix";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.40-teacher-profile-admin-fix";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.40-teacher-profile-admin-fix";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.40-teacher-profile-admin-fix";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.40-teacher-profile-admin-fix";

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

  await import("./legacyDashboard.js?v=1.1.40-teacher-profile-admin-fix");
  updateAppState({ legacyDashboardLoaded: true });
}

