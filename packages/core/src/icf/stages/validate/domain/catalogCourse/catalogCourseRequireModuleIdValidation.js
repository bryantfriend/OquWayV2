import { requireStringValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireEnumValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireUUIDValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
