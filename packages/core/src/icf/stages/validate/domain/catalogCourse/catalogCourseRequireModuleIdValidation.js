import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireEnumValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireUUIDValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
