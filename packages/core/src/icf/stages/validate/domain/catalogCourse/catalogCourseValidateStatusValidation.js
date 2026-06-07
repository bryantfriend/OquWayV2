import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.113-student-rules-read";
import { requireEnumValidation } from "../../validators.js?v=1.1.113-student-rules-read";
import { requireUUIDValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
