import { appState, updateAppState } from "./appState.js?v=1.1.43-users-filter-cards";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.43-users-filter-cards";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.43-users-filter-cards";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.43-users-filter-cards";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.43-users-filter-cards";

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

  await import("./legacyDashboard.js?v=1.1.43-users-filter-cards");
  updateAppState({ legacyDashboardLoaded: true });
}


