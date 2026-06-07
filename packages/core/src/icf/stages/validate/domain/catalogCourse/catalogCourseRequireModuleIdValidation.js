import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireEnumValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireUUIDValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
