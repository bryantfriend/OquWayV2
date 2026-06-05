import { appState, updateAppState } from "./appState.js?v=1.1.61-assignment-ownership-read";
import { registerIntentDefinitions, runAdminIntent } from "../../../../../packages/icf/admin/index.js?v=1.1.61-assignment-ownership-read";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.61-assignment-ownership-read";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.61-assignment-ownership-read";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.61-assignment-ownership-read";

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

  await import("./legacyDashboard.js?v=1.1.61-assignment-ownership-read");
  updateAppState({ legacyDashboardLoaded: true });
}


