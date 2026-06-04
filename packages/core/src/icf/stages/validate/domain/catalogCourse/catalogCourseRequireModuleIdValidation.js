import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireEnumValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireUUIDValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
