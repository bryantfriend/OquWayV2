import { appState, updateAppState } from "./appState.js?v=1.1.46-admin-motion";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.46-admin-motion";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.46-admin-motion";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.46-admin-motion";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.46-admin-motion";

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

  await import("./legacyDashboard.js?v=1.1.46-admin-motion");
  updateAppState({ legacyDashboardLoaded: true });
}


