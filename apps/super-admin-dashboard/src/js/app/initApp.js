import { appState, updateAppState } from "./appState.js?v=1.1.54-multi-role-assistant";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.54-multi-role-assistant";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.54-multi-role-assistant";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.54-multi-role-assistant";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.54-multi-role-assistant";

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

  await import("./legacyDashboard.js?v=1.1.54-multi-role-assistant");
  updateAppState({ legacyDashboardLoaded: true });
}


