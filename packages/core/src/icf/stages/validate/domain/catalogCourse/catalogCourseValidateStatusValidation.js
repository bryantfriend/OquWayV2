import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireEnumValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireUUIDValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
