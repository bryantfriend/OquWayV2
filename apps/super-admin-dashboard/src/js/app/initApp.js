import { appState, updateAppState } from "./appState.js?v=1.1.38-user-edit-modal";
import { registerIntentDefinitions, runAdminIntent } from "../icf/intentRegistry.js?v=1.1.38-user-edit-modal";
import { registerUsersIntents } from "../icf/intents/usersIntents.js?v=1.1.38-user-edit-modal";
import { registerDashboardIntents } from "../icf/intents/dashboardIntents.js?v=1.1.38-user-edit-modal";
import { registerClassesIntents } from "../icf/intents/classesIntents.js?v=1.1.38-user-edit-modal";

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

  await import("./legacyDashboard.js?v=1.1.38-user-edit-modal");
  updateAppState({ legacyDashboardLoaded: true });
}
