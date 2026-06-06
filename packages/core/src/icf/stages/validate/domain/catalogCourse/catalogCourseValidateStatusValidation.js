import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireEnumValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireUUIDValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
