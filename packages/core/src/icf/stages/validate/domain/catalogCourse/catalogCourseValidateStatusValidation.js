import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireEnumValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireUUIDValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
