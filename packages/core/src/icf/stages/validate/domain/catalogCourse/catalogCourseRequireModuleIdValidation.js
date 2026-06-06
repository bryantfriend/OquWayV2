import { requireStringValidation } from "../../validators.js?v=1.1.81-class-command-center";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.81-class-command-center";
import { requireEnumValidation } from "../../validators.js?v=1.1.81-class-command-center";
import { requireUUIDValidation } from "../../validators.js?v=1.1.81-class-command-center";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
