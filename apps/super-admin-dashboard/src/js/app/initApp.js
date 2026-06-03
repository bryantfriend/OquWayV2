import { appState, updateAppState } from "./appState.js?v=1.1.37-teacher-login-auth";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.37-teacher-login-auth";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.37-teacher-login-auth";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.37-teacher-login-auth";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.37-teacher-login-auth";

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

  await import("./legacyDashboard.js?v=1.1.37-teacher-login-auth");
  updateAppState({ legacyDashboardLoaded: true });
}
