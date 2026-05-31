import { appState, updateAppState } from "./appState.js";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js";
import { registerUsersIntents } from "../icf/intents/usersIntents.js";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js";
import { registerClassesIntents } from "../icf/intents/classesIntents.js";

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

  await import("./legacyDashboard.js");
  updateAppState({ legacyDashboardLoaded: true });
}
