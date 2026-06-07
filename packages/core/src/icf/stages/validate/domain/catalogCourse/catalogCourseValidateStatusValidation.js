import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireEnumValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireUUIDValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
