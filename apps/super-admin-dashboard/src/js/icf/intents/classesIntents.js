// Deprecated Phase 1 shim: admin intent definitions live in packages/icf/admin/intents.
import { createClassesIntentRegistrar } from "../../../../../../packages/icf/admin/intents/classesIntents.js";

export var registerClassesIntents = createClassesIntentRegistrar();
