import { appState, updateAppState } from "./appState.js?v=1.1.48-admin-callable-sdk";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.48-admin-callable-sdk";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.48-admin-callable-sdk";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.48-admin-callable-sdk";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.48-admin-callable-sdk";

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

  await import("./legacyDashboard.js?v=1.1.48-admin-callable-sdk");
  updateAppState({ legacyDashboardLoaded: true });
}


