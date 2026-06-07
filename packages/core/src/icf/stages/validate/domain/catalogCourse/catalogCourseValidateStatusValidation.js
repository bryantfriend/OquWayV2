import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireEnumValidation } from "../../validators.js?v=1.1.116-student-token-ready";
import { requireUUIDValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
