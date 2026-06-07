import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireEnumValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";
import { requireUUIDValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
