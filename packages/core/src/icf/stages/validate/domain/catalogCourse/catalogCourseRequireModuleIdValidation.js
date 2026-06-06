import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.79-user-command-center";
import { requireEnumValidation } from "../../validators.js?v=1.1.79-user-command-center";
import { requireUUIDValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
