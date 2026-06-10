import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireEnumValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireUUIDValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
