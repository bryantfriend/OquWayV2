import { requireStringValidation } from "../../validators.js";
import { requireNonEmptyArrayValidation } from "../../validators.js";
import { requireEnumValidation } from "../../validators.js";
import { requireUUIDValidation } from "../../validators.js";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
