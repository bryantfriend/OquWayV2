// Deprecated Phase 1 shim: admin intent definitions live in packages/icf/admin/intents.
import { createDashboardIntentRegistrar } from "../../../../../../packages/icf/admin/intents/dashboardIntents.js";

export var registerDashboardIntents = createDashboardIntentRegistrar();
