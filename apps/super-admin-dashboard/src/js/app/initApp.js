import { appState, updateAppState } from "./appState.js?v=1.1.44-classes-filter";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.44-classes-filter";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.44-classes-filter";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.44-classes-filter";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.44-classes-filter";

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

  await import("./legacyDashboard.js?v=1.1.44-classes-filter");
  updateAppState({ legacyDashboardLoaded: true });
}


