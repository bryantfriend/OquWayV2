import { appState, updateAppState } from "./appState.js?v=1.1.41-teacher-auth-mirror";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.41-teacher-auth-mirror";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.41-teacher-auth-mirror";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.41-teacher-auth-mirror";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.41-teacher-auth-mirror";

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

  await import("./legacyDashboard.js?v=1.1.41-teacher-auth-mirror");
  updateAppState({ legacyDashboardLoaded: true });
}


