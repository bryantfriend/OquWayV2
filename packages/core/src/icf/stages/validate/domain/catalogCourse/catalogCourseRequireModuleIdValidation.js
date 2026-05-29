import { requireStringValidation } from "../../validators.js";
import { requireNonEmptyArrayValidation } from "../../validators.js";
import { requireEnumValidation } from "../../validators.js";
import { requireUUIDValidation } from "../../validators.js";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
