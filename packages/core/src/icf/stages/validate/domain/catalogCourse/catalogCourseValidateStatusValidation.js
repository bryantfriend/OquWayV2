import { requireStringValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireEnumValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";
import { requireUUIDValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
