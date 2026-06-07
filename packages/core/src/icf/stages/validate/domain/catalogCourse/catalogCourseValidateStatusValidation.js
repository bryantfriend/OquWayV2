import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireEnumValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireUUIDValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
