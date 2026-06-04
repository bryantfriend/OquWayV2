import { appState, updateAppState } from "./appState.js?v=1.1.51-teacher-dedupe";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.51-teacher-dedupe";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.51-teacher-dedupe";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.51-teacher-dedupe";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.51-teacher-dedupe";

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

  await import("./legacyDashboard.js?v=1.1.51-teacher-dedupe");
  updateAppState({ legacyDashboardLoaded: true });
}


