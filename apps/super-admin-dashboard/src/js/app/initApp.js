import { appState, updateAppState } from "./appState.js?v=1.1.45-repair-callable";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.45-repair-callable";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.45-repair-callable";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.45-repair-callable";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.45-repair-callable";

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

  await import("./legacyDashboard.js?v=1.1.45-repair-callable");
  updateAppState({ legacyDashboardLoaded: true });
}


