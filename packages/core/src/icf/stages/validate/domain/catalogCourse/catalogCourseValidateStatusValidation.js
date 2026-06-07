import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireEnumValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireUUIDValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
