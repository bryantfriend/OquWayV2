import { requireStringValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireEnumValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";
import { requireUUIDValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
